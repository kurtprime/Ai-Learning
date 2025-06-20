type CashTag =
  | "users"
  | "organizations"
  | "joblistings"
  | "userNotificationSettings"
  | "userResumes"
  | "jobListingApplications"
  | "organizationUserSettings";

export function getGlobalTag(tag: CashTag) {
  return `global:${tag}` as const;
}

export function getIdTag(tag: CashTag, id: string) {
  return `id:${id}-${tag}` as const;
}
