// @ts-nocheck
import { Notification } from "@/types/notification";
import { logger } from '@/lib/logger';

export const createNotification = async (notification: Partial<Notification>) => {
  logger.info("Creating notification", { notification }, 'API');
  return { id: "mock-notification", ...notification };
};

export const markNotificationAsRead = async (id: string) => {
  logger.info(`Marking notification as read`, { id }, 'API');
  return { success: true };
};

export const getUserNotifications = async (userId: string) => {
  logger.info(`Getting notifications for user`, { userId }, 'API');
  return [];
};
