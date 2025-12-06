
import { Notification } from "@/types/notification";

export const createNotification = async (notification: Partial<Notification>) => {
  console.log("Creating notification:", notification);
  return { id: "mock-notification", ...notification };
};

export const markNotificationAsRead = async (id: string) => {
  console.log(`Marking notification ${id} as read`);
  return { success: true };
};

export const getUserNotifications = async (userId: string) => {
  console.log(`Getting notifications for user ${userId}`);
  return [];
};
