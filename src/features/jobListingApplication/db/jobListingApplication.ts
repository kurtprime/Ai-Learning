import { db } from "@/drizzle/database";
import { JoblistingApplicationTable } from "@/drizzle/schema";
import { revalidateJobListingApplicationCacheTag } from "./cache/jobListingApplications";

export async function insertJoblistingApplication(
  application: typeof JoblistingApplicationTable.$inferInsert
) {
  await db.insert(JoblistingApplicationTable).values(application);

  revalidateJobListingApplicationCacheTag(application);
}
