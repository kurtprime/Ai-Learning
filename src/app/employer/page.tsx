import { db } from "@/drizzle/database";
import { JobListingTable } from "@/drizzle/schema";
import { getJobListingOrganizationTag } from "@/features/jobListings/db/cache/jobListings";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";
import { desc, eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

export default function page() {
  return (
    <Suspense>
      <SuspendedPage />
    </Suspense>
  );
}

async function SuspendedPage() {
  const { orgId } = await getCurrentOrganization();

  if (!orgId) return null;

  const jobListing = await getMostRecentJobListing(orgId);
  if (!jobListing) redirect("/employer/job-listings/new");
  redirect("/employer/job-listings/" + jobListing.id);
}

async function getMostRecentJobListing(orgId: string) {
  "use cache";

  cacheTag(getJobListingOrganizationTag(orgId));

  return db.query.JobListingTable.findFirst({
    where: eq(JobListingTable.organizationId, orgId),
    orderBy: desc(JobListingTable.createdAt),
    columns: { id: true },
  });
}
