import { db } from "@/drizzle/database";
import { inngest } from "../client";
import { eq } from "drizzle-orm";
import { UserResumeTable } from "@/drizzle/schema";

import { updateUserResume } from "@/features/users/db/userResumes";
import { extractTextFromBuffer } from "./pdfText";

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

    const aiSummaryText = await extractTextFromBuffer(userResume.resumeFileUrl);
    //aiSummaryText = cleanResumeText(aiSummaryText);

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
            content: aiSummaryText,
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
