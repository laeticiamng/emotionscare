export interface PushNotificationConfig {
  enabled: boolean;
  channels: string[];
}

export const getPushNotificationConfig = async (): Promise<PushNotificationConfig> => {
  return {
    enabled: false,
    channels: []
  };
};

export const updatePushNotificationConfig = async (
  config: Partial<PushNotificationConfig>
): Promise<void> => {
  // Implementation to come
};
