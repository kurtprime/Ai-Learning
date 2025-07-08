import {
  experienceLevel,
  jobListingType,
  locationRequirements,
  wageIntervals,
} from "@/drizzle/schema";
import { createAgent } from "@inngest/agent-kit";
import { deepseek } from "inngest";
import { z } from "zod";
import { getLastOutputMessage } from "./getLastOutputMessage";

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
  { maxNumberOfJobs }: { maxNumberOfJobs?: number }
) {
  const NO_JOBS = "NO_JOBS";

  const agent = createAgent({
    name: "Job Matching Agent",
    description: "Agent for matching users with job listings",
    system: `You are an expert at matching people with jobs based on their specific experience, and requirements. The provided user prompt will be a description that can include information about themselves as well what they are looking for in a job. ${
      maxNumberOfJobs
        ? `You are to return up to ${maxNumberOfJobs} jobs.`
        : `Return all jobs that match their requirements.`
    } Return the jobs as a comma separated list of jobIds. If you cannot find any jobs that match the user prompt, return the text "${NO_JOBS}". Here is the JSON array of available job listings: ${JSON.stringify(
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
    model: deepseek({
      model: "deepseek-reasoner",
      apiKey: process.env.DEEPSEEK_API,
    }),
  });

  const result = await agent.run(prompt);
  const lastMessage = getLastOutputMessage(result);

  if (lastMessage == null || lastMessage === NO_JOBS) return [];

  return lastMessage
    .split(",")
    .map((jobId) => jobId.trim())
    .filter(Boolean);
}
