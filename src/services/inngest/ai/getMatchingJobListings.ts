import {
  experienceLevel,
  jobListingType,
  locationRequirements,
  wageIntervals,
} from "@/drizzle/schema";
import { z } from "zod";
import { getLastOutputMessage } from "./getLastOutputMessage";
import { deepseek } from "inngest";
import { createAgent } from "@inngest/agent-kit";

const listingSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  wage: z.number().nullable(),
  wageInterval: z.enum(wageIntervals).nullable(),
  stateAbbreviation: z.string().nullable(),
  city: z.string().nullable(),
  experienceLevel: z.enum(experienceLevel),
  type: z.enum(jobListingType),
  locationRequirement: z.enum(locationRequirements),
});

export async function getMatchingJobListings(
  prompt: string,
  jobListings: z.infer<typeof listingSchema>[],
  { maxNumberOfJobs }: { maxNumberOfJobs?: number } = {}
) {
  const NO_JOBS = "NO_JOBS";

  const agent = createAgent({
    name: "Job Matching Agent",
    description: "Agent for matching users with job listings",
    system: `You are an expert at matching people with jobs based on their specific experience, and requirements. The provided user prompt will be a description that can include information about themselves as well what they are looking for in a job. 
    ${
      maxNumberOfJobs
        ? `Return up to ${maxNumberOfJobs} matching job IDs as a comma-separated list.`
        : `Return all matching job IDs as a comma-separated list.`
    } 
    - Return **ONLY** the comma-separated job IDs (e.g., id1,id2,id3) or ${NO_JOBS}.
    - Do **not** include explanations, reasoning, or additional text.
    - Ignore formatting like markdown or JSON.

    Here is the JSON array of available job listings: ${JSON.stringify(
      jobListings.map((listing) =>
        listingSchema
          .transform((listing) => ({
            ...listing,
            wage: listing.wage ?? undefined,
            wageInterval: listing.wageInterval ?? undefined,
            city: listing.city ?? undefined,
            stateAbbreviation: listing.stateAbbreviation ?? undefined,
            locationRequirement: listing.locationRequirement ?? undefined,
          }))
          .parse(listing)
      )
    )}`,
    // @ts-ignore
    model: deepseek({
      model: "deepseek-reasoner",
      apiKey: process.env.DEEPSEEK_API,
    }),
  });

  const result = await agent.run(prompt);
  console.log(result);
  const lastMessage = getLastOutputMessage(result);

  if (lastMessage == null || lastMessage === NO_JOBS) return [];

  return lastMessage
    .split(",")
    .map((jobId) => jobId.trim())
    .filter(Boolean);
}
