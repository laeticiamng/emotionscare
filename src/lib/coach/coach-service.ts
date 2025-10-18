// @ts-nocheck

import { logger } from '@/lib/logger';

// Basic implementations of the necessary functions

export const getCoachMessages = async () => {
  return [];
};

export const sendCoachMessage = async (message: string) => {
  logger.info("Sending coach message", { message }, 'API');
  return { id: "mock", content: "Response from coach" };
};

export interface CoachMessage {
  id: string;
  content: string;
  role: string;
  timestamp?: string;
}

export interface CoachEvent {
  type: string;
  data?: any;
}

export const createConversation = async (title: string) => {
  logger.info("Creating conversation", { title }, 'API');
  return { id: "mock-conv", title };
};

export const listConversations = async () => {
  return [];
};

export const updateConversationTitle = async (id: string, title: string) => {
  logger.info(`Updating conversation title`, { id, title }, 'API');
  return { id, title };
};
