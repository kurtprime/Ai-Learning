"use server";

import { z } from "zod";
import { jobListingSchema, jobListingSearchSchema } from "./schemas";
import {
  getCurrentOrganization,
  getCurrentUser,
} from "@/services/clerk/lib/getCurrentAuth";
import { redirect } from "next/navigation";
import {
  deleteJobListings,
  insertJobListings,
  updateJobListings,
} from "../db/jobListings";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import {
  getJobListingGlobalTag,
  getJobListingIdTag,
} from "../db/cache/jobListings";
import { db } from "@/drizzle/database";
import { and, eq } from "drizzle-orm";
import { JobListingTable } from "@/drizzle/schema";
import { hasOrgUserPermissions } from "@/services/clerk/lib/orgUserPermission";
import { getNextJobListingStatus } from "../lib/utils";
import {
  hasReachedMaxFeaturedJobListings,
  hasReachedMaxPublishedJobListings,
} from "../lib/planFeatureHelpers";
import { getMatchingJobListings } from "@/services/inngest/ai/getMatchingJobListings";

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

  await deleteJobListings(id);

  redirect("/employer");
}

export async function getAiJobListingSearchResults(
  unsafeData: z.infer<typeof jobListingSearchSchema>
): Promise<
  { error: true; message: string } | { error: false; jobIds: string[] }
> {
  const { success, data } = jobListingSearchSchema.safeParse(unsafeData);

  if (!success) {
    return {
      error: true,
      message: "There was an error proccessing your search query",
    };
  }

  const { userId } = await getCurrentUser();
  if (!userId) {
    return {
      error: true,
      message: "You need an account to use AI job Search",
    };
  }

  const allListings = await getPublicJobListings();

  const matchedListings = await getMatchingJobListings(
    data.query,
    allListings,
    {
      maxNumberOfJobs: 10,
    }
  );

  if (matchedListings.length === 0) {
    return {
      error: true,
      message: "No job match your search criteria",
    };
  }

  return {
    error: false,
    jobIds: matchedListings,
  };
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

async function getPublicJobListings() {
  "use cache";
  cacheTag(getJobListingGlobalTag());
  return await db.query.JobListingTable.findMany({
    where: eq(JobListingTable.status, "published"),
  });
}
