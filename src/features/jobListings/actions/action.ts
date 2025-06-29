"use server";

import { z } from "zod";
import { jobListingSchema } from "./schemas";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";
import { redirect } from "next/navigation";
import { insertJobListings, updateJobListings } from "../db/jobListings";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getJobListingIdTag } from "../db/cache/jobListings";
import { db } from "@/drizzle/database";
import { and, eq } from "drizzle-orm";
import { JobListingTable } from "@/drizzle/schema";

export async function createJobListing(
  unsafeData: z.infer<typeof jobListingSchema>
) {
  const { orgId } = await getCurrentOrganization();

  if (!orgId) {
    return {
      error: true,
      message: "You don't have permission to create Job Listing",
    };
  }

  const { success, data } = jobListingSchema.safeParse(unsafeData);

  if (!success)
    return {
      error: true,
      message: "There was an error creating Job Listing",
    };

  const jobListing = await insertJobListings({
    ...data,
    organizationId: orgId,
    status: "draft",
  });

  redirect("/employer/job-listings/" + jobListing.id);
}

export async function updateJoblisting(
  id: string,
  unsafeData: z.infer<typeof jobListingSchema>
) {
  const { orgId } = await getCurrentOrganization();

  if (!orgId) {
    return {
      error: true,
      message: "You don't have permission to create Job Listing",
    };
  }

  const { success, data } = jobListingSchema.safeParse(unsafeData);

  if (!success)
    return {
      error: true,
      message: "There was an error creating Job Listing",
    };

  const jobListing = await getJobListing(id, orgId);

  const updatedJobListing = await updateJobListings(id, data);

  redirect("/employer/job-listings/" + updatedJobListing.id);
}

async function getJobListing(id: string, orgId: string) {
  "use cache";

  cacheTag(getJobListingIdTag(id));

  return db.query.JobListingTable.findFirst({
    where: and(
      eq(JobListingTable.id, id),
      eq(JobListingTable.organizationId, orgId)
    ),
  });
}
