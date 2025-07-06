import { db } from "@/drizzle/database";
import { OrganizationTable, UserTable } from "@/drizzle/schema";
import {
  getOrganizationGlobalTag,
  getOrganizationIdTag,
} from "@/features/organizations/db/cache/organizations";
import { getUserIdTag } from "@/features/users/db/cache/users";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export async function getCurrentUser({
  alldata = false,
}: {
  alldata?: boolean;
} = {}) {
  const { userId } = await auth();

  return {
    userId,
    user: alldata && userId != null ? await getUser(userId) : undefined,
  };
}

async function getUser(id: string) {
  "use cache";
  cacheTag(getUserIdTag(id));
  return db.query.UserTable.findFirst({
    where: eq(UserTable.id, id),
  });
}

export async function getCurrentOrganization({
  alldata = false,
}: {
  alldata?: boolean;
} = {}) {
  const { orgId } = await auth();

  return {
    orgId,
    organization:
      alldata && orgId != null ? await getOrganization(orgId) : undefined,
  };
}

async function getOrganization(id: string) {
  "use cache";
  cacheTag(getOrganizationIdTag(id));
  return db.query.OrganizationTable.findFirst({
    where: eq(OrganizationTable.id, id),
  });
}
