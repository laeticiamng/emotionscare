import { 
  NotificationFrequency, 
  NotificationType, 
  NotificationTone,
  NotificationFrequencyEnum,
  NotificationTypeEnum,
  NotificationToneEnum
} from '@/types/notification';

// Default notification preferences
export const DEFAULT_NOTIFICATION_PREFERENCES = [
  {
    id: 'general',
    type: 'general',
    frequency: NotificationFrequencyEnum.DAILY as NotificationFrequency,
    tone: NotificationToneEnum.NEUTRAL as NotificationTone,
    enabled: true,
    emailEnabled: true,
    pushEnabled: true
  },
  {
    id: 'reminders',
    type: 'reminders',
    frequency: NotificationFrequencyEnum.DAILY as NotificationFrequency,
    tone: NotificationToneEnum.GENTLE as NotificationTone,
    enabled: true,
    emailEnabled: false,
    pushEnabled: true
  },
  {
    id: 'scan',
    type: 'scan',
    frequency: NotificationFrequencyEnum.WEEKLY as NotificationFrequency,
    tone: NotificationToneEnum.NEUTRAL as NotificationTone,
    enabled: true,
    emailEnabled: true,
    pushEnabled: true
  }
];

// Other default values can be added here
