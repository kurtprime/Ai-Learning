import { getGlobalTag, getIdTag, getJobListingTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export function getJoblistingApplicationGlobalTag() {
  return getGlobalTag("jobListingApplications");
}

export function getJoblistingApplicationJobListingTag(jobListingId: string) {
  return getJobListingTag("jobListingApplications", jobListingId);
}

export function getJoblistingApplicationIdTag({
  jobListingId,
  userId,
}: {
  jobListingId: string;
  userId: string;
}) {
  return getIdTag("jobListingApplications", `${jobListingId}-${userId}`);
}

export function revalidateJobListingApplicationCacheTag(id: {
  userId: string;
  jobListingId: string;
}) {
  revalidateTag(getJoblistingApplicationGlobalTag());
  revalidateTag(getJoblistingApplicationJobListingTag(id.jobListingId));
  revalidateTag(getJoblistingApplicationIdTag(id));
}
