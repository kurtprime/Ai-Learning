import { db } from "@/drizzle/database";
import { inngest } from "../client";
import { eq } from "drizzle-orm";
import { UserResumeTable } from "@/drizzle/schema";
import fetch from "node-fetch";
import pdfParse from "pdf-parse";
import { updateUserResume } from "@/features/users/db/userResumes";

export const createAiSummaryOfUploadedResume = inngest.createFunction(
  {
    id: "create-ai-summary-of-uploaded-resume",
    name: "Create AI Summary Of Uploaded Resume",
  },
  {
    event: "app/resume.uploaded",
  },
  async ({ step, event }) => {
    const { id: userId } = event.user;

    const userResume = await step.run("get-user-resume", async () => {
      return await db.query.UserResumeTable.findFirst({
        where: eq(UserResumeTable.userId, userId),
        columns: {
          resumeFileUrl: true,
        },
      });
    });

    if (userResume == null) return;

    const result = await step.ai.infer("create-ai-summary", {
      model: step.ai.models.deepseek({
        model: "deepseek-reasoner",
        defaultParameters: {
          max_completion_tokens: 4056,
        },
        apiKey: process.env.DEEPSEEK_API,
      }),
      body: {
        messages: [
          {
            role: "system",
            content:
              "Summarize the following resume and extract all key skills, experience, and qualifications. The summary should include all the information that a hiring manager would need to know about the candidate in order to determine if they are a good fit for a job. This summary should be formatted as markdown. Do not return any other text. If the file does not look like a resume return the text 'N/A'.",
          },
          {
            role: "user",
            content: await step.run("process-resume", async () => {
              try {
                // 1. Fetch PDF
                const response = await fetch(userResume.resumeFileUrl);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);

                // 2. Get buffer
                const arrayBuffer = await response.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                // 3. Parse PDF
                const text = await extractTextFromPDF(buffer);

                // 4. Clean and return
                return cleanResumeText(text);
              } catch (error: any) {
                // Log error but continue
                await step.sendEvent("resume-process-failed", {
                  name: "app/resume.process.failed",
                  data: { userId, error: error.message },
                });
                return "Resume processing failed";
              }
            }),
          },
        ],
      },
    });

    await step.run("save-ai-summary", async () => {
      const message = result.choices[0].message.content;

      if (!message) return null;

      await updateUserResume(userId, {
        aiSummary: message,
      });
    });
  }
);

const cleanResumeText = (text: string): string => {
  return text
    .replace(/\s+/g, " ")
    .replace(/[^\x00-\x7F]/g, "")
    .substring(0, 15000);
};

const extractTextFromPDF = async (buffer: Buffer): Promise<string> => {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    throw new Error(
      `PDF parsing failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
