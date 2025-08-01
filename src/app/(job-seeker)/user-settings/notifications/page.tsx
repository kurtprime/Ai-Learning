import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/drizzle/database";
import { UserNotificationSettingsTable } from "@/drizzle/schema";
import NotificationForm from "@/features/users/components/NotificationForm";
import { getUserNotificationSettingsIdTag } from "@/features/users/db/cache/userNotificationSettings";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentAuth";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

export default function NotificationsPage() {
  return (
    <Suspense>
      <SuspendedComponent />
    </Suspense>
  );
}

async function SuspendedComponent() {
  const { userId } = await getCurrentUser();
  if (userId == null) return notFound();

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Notification Settings</h1>
      <Card>
        <CardContent>
          <Suspense fallback={<LoadingSpinner />}>
            <SuspendedForm userId={userId} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

async function SuspendedForm({ userId }: { userId: string }) {
  const notificationSettings = await getNoticationSettings(userId);

  return <NotificationForm notificationSettings={notificationSettings} />;
}

async function getNoticationSettings(userId: string) {
  "use cache";
  cacheTag(getUserNotificationSettingsIdTag(userId));

  return db.query.UserNotificationSettingsTable.findFirst({
    where: eq(UserNotificationSettingsTable.userId, userId),
    columns: {
      aiPrompt: true,
      newJobEmailNotifications: true,
    },
  });
}
