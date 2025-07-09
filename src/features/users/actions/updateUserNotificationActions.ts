"use server";

import { getCurrentUser } from "@/services/clerk/lib/getCurrentAuth";
import { updateUserNotificationSettings } from "../db/userNotificationSettings";
import { userNotificationsSettingsSchema } from "./schema";
import { z } from "zod";

export async function updateUserNotificationSetting(
  unsafeData: z.infer<typeof userNotificationsSettingsSchema>
) {
  const { userId } = await getCurrentUser();
  if (userId == null) {
    return {
      error: true,
      message: "You must be signed in to update notification settings",
    };
  }

  const { success, data } =
    userNotificationsSettingsSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: "There was an error updating your notification settings",
    };
  }

  await updateUserNotificationSettings(userId, data);

  return {
    error: false,
    message: "Successfully updated your notification settings",
  };
}
