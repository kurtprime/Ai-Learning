"use server";

import { db } from "@/drizzle/database";
import {
  applicationStage,
  ApplicationStage,
  JobListingTable,
  UserResumeTable,
} from "@/drizzle/schema";
import { getJobListingIdTag } from "@/features/jobListings/db/cache/jobListings";
import { getUserResumeIdTag } from "@/features/users/db/cache/userResume";
import {
  getCurrentOrganization,
  getCurrentUser,
} from "@/services/clerk/lib/getCurrentAuth";
import { and, eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { z } from "zod";
import { NewJobListingApplicationFormSchema } from "./schemas";
import {
  insertJoblistingApplication,
  updateJobListingApplication,
} from "../db/jobListingApplication";
import { inngest } from "@/services/inngest/client";
import { hasOrgUserPermissions } from "@/services/clerk/lib/orgUserPermission";

export async function createJobListingApplication(
  jobListingId: string,
  unsafeData: z.infer<typeof NewJobListingApplicationFormSchema>
) {
  const permissionError = {
    error: true,
    message: "You don't have permission to submit an application",
  };

  const { userId } = await getCurrentUser();

  if (userId == null) return permissionError;

  const [userResume, jobListing] = await Promise.all([
    getUserResume(userId),
    getPublicJobListing(jobListingId),
  ]);

  if (userResume == null || jobListing == null) return permissionError;

  const { success, data } =
    NewJobListingApplicationFormSchema.safeParse(unsafeData);

  if (!success) {
    return {
      error: true,
      message: "Error when submitting your application",
    };
  }

  await insertJoblistingApplication({
    jobListingId,
    userId,
    ...data,
  });

  //AI GENERATION
  await inngest.send({
    name: "app/jobListingApplication.created",
    data: { jobListingId, userId },
  });

  return {
    error: false,
    message: "Your application was successfully submitted",
  };
}

export async function updateJobListingApplicationStage(
  {
    jobListingId,
    userId,
  }: {
    jobListingId: string;
    userId: string;
  },
  unsafeStage: ApplicationStage
) {
  const { success, data: stage } = z
    .enum(applicationStage)
    .safeParse(unsafeStage);

  if (!success) {
    return {
      error: true,
      message: "Invalid stage",
    };
  }

  if (
    !(await hasOrgUserPermissions("org:job_listing_applications:change_stage"))
  ) {
    return {
      error: true,
      message: "You don't have permission to update the stage",
    };
  }

  const { orgId } = await getCurrentOrganization();
  const jobListing = await getJobListing(jobListingId);
  if (
    orgId == null ||
    jobListing == null ||
    orgId !== jobListing.organizationId
  ) {
    return {
      error: true,
      message: "You don't have permission to update the stage",
    };
  }

  await updateJobListingApplication(
    {
      jobListingId,
      userId,
    },
    { stage }
  );
}

export async function updateJobListingApplicationRating(
  {
    jobListingId,
    userId,
  }: {
    jobListingId: string;
    userId: string;
  },
  unsafeRating: number | null
) {
  const { success, data: rating } = z
    .number()
    .min(1)
    .max(5)
    .nullish()
    .safeParse(unsafeRating);

  if (!success) {
    return {
      error: true,
      message: "Invalid rating",
    };
  }

  if (
    !(await hasOrgUserPermissions("org:job_listing_applications:change_rating"))
  ) {
    return {
      error: true,
      message: "You don't have permission to update the rating",
    };
  }

  const { orgId } = await getCurrentOrganization();
  const jobListing = await getJobListing(jobListingId);
  if (
    orgId == null ||
    jobListing == null ||
    orgId !== jobListing.organizationId
  ) {
    return {
      error: true,
      message: "You don't have permission to update the rating",
    };
  }

  await updateJobListingApplication(
    {
      jobListingId,
      userId,
    },
    { rating }
  );
}

async function getPublicJobListing(jobListingId: string) {
  "use cache";
  cacheTag(getJobListingIdTag(jobListingId));

  return db.query.JobListingTable.findFirst({
    where: and(
      eq(JobListingTable.id, jobListingId),
      eq(JobListingTable.status, "published")
    ),
    columns: { id: true },
  });
}

async function getUserResume(userId: string) {
  "use cache";

  cacheTag(getUserResumeIdTag(userId));

  return db.query.UserResumeTable.findFirst({
    where: eq(UserResumeTable.userId, userId),
    columns: {
      userId: true,
    },
  });
}

async function getJobListing(id: string) {
  "use cache";
  cacheTag(getJobListingIdTag(id));

  return db.query.JobListingTable.findFirst({
    where: eq(JobListingTable.id, id),
    columns: { organizationId: true },
  });
}
