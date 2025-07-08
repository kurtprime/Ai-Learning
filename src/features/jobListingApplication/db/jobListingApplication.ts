import { db } from "@/drizzle/database";
import { JoblistingApplicationTable } from "@/drizzle/schema";
import { revalidateJobListingApplicationCacheTag } from "./cache/jobListingApplications";
import { and, eq } from "drizzle-orm";

export async function insertJoblistingApplication(
  application: typeof JoblistingApplicationTable.$inferInsert
) {
  await db.insert(JoblistingApplicationTable).values(application);

  revalidateJobListingApplicationCacheTag(application);
}

export async function updateJobListingApplication(
  {
    jobListingId,
    userId,
  }: {
    jobListingId: string;
    userId: string;
  },
  data: Partial<typeof JoblistingApplicationTable.$inferInsert>
) {
  await db
    .update(JoblistingApplicationTable)
    .set(data)
    .where(
      and(
        eq(JoblistingApplicationTable.jobListingId, jobListingId),
        eq(JoblistingApplicationTable.userId, userId)
      )
    );

  revalidateJobListingApplicationCacheTag({ jobListingId, userId });
}
