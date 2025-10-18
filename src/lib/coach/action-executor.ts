// @ts-nocheck

import { logger } from '@/lib/logger';

export const executeAction = async (actionType: string, data: any) => {
  logger.info(`Executing action ${actionType}`, data, 'API');
  return { success: true };
};

export const getSupportedActions = () => {
  return ["notify", "schedule", "recommend", "analyze"];
};
