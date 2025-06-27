type CashTag =
  | "users"
  | "organizations"
  | "jobListings"
  | "userNotificationSettings"
  | "userResumes"
  | "jobListingApplications"
  | "organizationUserSettings";

export function getGlobalTag(tag: CashTag) {
  return `global:${tag}` as const;
}

export function getOrganizationTag(tag: CashTag, id: string) {
  return `organization:${id}-${tag}` as const;
}

export function getIdTag(tag: CashTag, id: string) {
  return `id:${id}-${tag}` as const;
}
