import { db } from "@/drizzle/database";
import { JobListingTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidateJobListingsCache } from "./cache/jobListings";

export async function insertJobListings(
  jobListings: typeof JobListingTable.$inferInsert
) {
  const [newListing] = await db
    .insert(JobListingTable)
    .values(jobListings)
    .returning({
      id: JobListingTable.id,
      organizationId: JobListingTable.organizationId,
    });

  revalidateJobListingsCache(newListing);

  return newListing;
}

export async function updateJobListings(
  id: string,
  jobListings: Partial<typeof JobListingTable.$inferInsert>
) {
  const [updatedListing] = await db
    .update(JobListingTable)
    .set(jobListings)
    .where(eq(JobListingTable.id, id))
    .returning({
      id: JobListingTable.id,
      organizationId: JobListingTable.organizationId,
    });

  revalidateJobListingsCache(updatedListing);

  return updatedListing;
}

export async function deleteJobListings(id: string) {
  const [deleteJoblisting] = await db
    .delete(JobListingTable)
    .where(eq(JobListingTable.id, id))
    .returning({
      id: JobListingTable.id,
      organizationId: JobListingTable.organizationId,
    });

  revalidateJobListingsCache(deleteJoblisting);
  return deleteJoblisting;
}
