export interface AlertConfiguration {
  id: string;
  created_at: string;
  updated_at: string;
  enabled: boolean;
  name: string;
  description?: string;
  min_priority: 'urgent' | 'high' | 'medium' | 'low';
  min_severity: 'critical' | 'high' | 'medium' | 'low';
  included_categories: string[];
  excluded_categories: string[];
  notify_email: boolean;
  email_recipients: string[];
  notify_slack: boolean;
  slack_webhook_url?: string;
  slack_channel?: string;
  notify_discord: boolean;
  discord_webhook_url?: string;
  discord_username?: string;
  throttle_minutes: number;
  max_alerts_per_hour: number;
  require_alert_flag: boolean;
  last_triggered_at?: string;
}

export const defaultConfig: Omit<AlertConfiguration, 'id' | 'created_at' | 'updated_at' | 'last_triggered_at'> = {
  enabled: true,
  name: '',
  description: '',
  min_priority: 'high',
  min_severity: 'high',
  included_categories: [],
  excluded_categories: [],
  notify_email: true,
  email_recipients: [],
  notify_slack: false,
  slack_webhook_url: '',
  slack_channel: '',
  notify_discord: false,
  discord_webhook_url: '',
  discord_username: 'EmotionsCare Monitor',
  throttle_minutes: 5,
  max_alerts_per_hour: 10,
  require_alert_flag: false,
};
