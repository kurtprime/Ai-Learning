import { db } from "@/drizzle/database";
import { UserTable } from "@/drizzle/schema";
import { getUserIdTag } from "@/features/users/db/cache/users";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export async function getCurrentUser({
  alldata = false,
}: {
  alldata: boolean;
}) {
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
