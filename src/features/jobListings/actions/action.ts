"use server";

import { z } from "zod";
import { jobListingSchema } from "./schemas";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";
import { redirect } from "next/navigation";
import { insertJobListings } from "../db/jobListings";

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
