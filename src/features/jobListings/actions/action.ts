"use server";

import { z } from "zod";
import { jobListingSchema } from "./schemas";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";
import { redirect } from "next/navigation";
import {
  deleteJobListings,
  insertJobListings,
  updateJobListings,
} from "../db/jobListings";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getJobListingIdTag } from "../db/cache/jobListings";
import { db } from "@/drizzle/database";
import { and, eq } from "drizzle-orm";
import { JobListingTable } from "@/drizzle/schema";
import { hasOrgUserPermissions } from "@/services/clerk/lib/orgUserPermission";
import { getNextJobListingStatus } from "../lib/utils";
import {
  hasReachedMaxFeaturedJobListings,
  hasReachedMaxPublishedJobListings,
} from "../lib/planFeatureHelpers";

export async function createJobListing(
  unsafeData: z.infer<typeof jobListingSchema>
) {
  const { orgId } = await getCurrentOrganization();

  if (!orgId || !(await hasOrgUserPermissions("org:job_listings:create"))) {
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

  if (!orgId || !(await hasOrgUserPermissions("org:job_listings:update"))) {
    return {
      error: true,
      message: "You don't have permission to update this Job Listing",
    };
  }

  const { success, data } = jobListingSchema.safeParse(unsafeData);

  if (!success)
    return {
      error: true,
      message: "There was an error updating Job Listing",
    };

  const jobListing = await getJobListing(id, orgId);

  if (!jobListing)
    return {
      error: true,
      message: "There was an error updating your Job Listing",
    };

  const updatedJobListing = await updateJobListings(id, data);

  redirect("/employer/job-listings/" + updatedJobListing.id);
}

export async function toggleJobListingStatus(id: string) {
  const error = {
    error: true,
    message: "You don't have permission to update this Job Listing Status",
  };

  const { orgId } = await getCurrentOrganization();

  if (!orgId) return error;

  const jobListing = await getJobListing(id, orgId);

  if (!jobListing) return error;

  const newStatus = getNextJobListingStatus(jobListing.status);

  if (
    !(await hasOrgUserPermissions("org:job_listings:change_status")) ||
    (newStatus === "published" && (await hasReachedMaxPublishedJobListings()))
  )
    return error;

  await updateJobListings(id, {
    status: newStatus,
    isFeatured: newStatus === "published" ? undefined : false,
    postedAt:
      newStatus === "published" && jobListing.postedAt == null
        ? new Date()
        : undefined,
  });

  return { error: false };
}

export async function toggleJobListingFeatured(id: string) {
  const error = {
    error: true,
    message:
      "You don't have permission to update this Job Listing's Featured status",
  };

  const { orgId } = await getCurrentOrganization();
  if (!orgId) return error;

  const jobListing = await getJobListing(id, orgId);
  if (!jobListing) return error;

  const newFeaturedStatus = !jobListing.isFeatured;

  if (
    !(await hasOrgUserPermissions("org:job_listings:change_status")) ||
    (newFeaturedStatus && (await hasReachedMaxFeaturedJobListings()))
  ) {
    error.message = "" + (await hasReachedMaxFeaturedJobListings());
    return error;
  }

  await updateJobListings(id, {
    isFeatured: newFeaturedStatus,
  });

  return { error: false };
}

export async function deleteJobListing(id: string) {
  const error = {
    error: true,
    message: "You don't have permission to delete this Job Listing",
  };

  const { orgId } = await getCurrentOrganization();
  if (!orgId) return error;

  const jobListing = await getJobListing(id, orgId);
  if (!jobListing) return error;

  if (!(await hasOrgUserPermissions("org:job_listings:delete"))) {
    return error;
  }

  await deleteJobListings(id, orgId);

  redirect("/employer");
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
