export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export type SocialRoomMemberRole = 'host' | 'guest';

export interface SocialRoomMember {
  id: string;
  displayName: string;
  role: SocialRoomMemberRole;
  joinedAt: string;
  preferences: {
    audio: boolean;
    text: boolean;
  };
}

export interface SocialRoom {
  id: string;
  name: string;
  topic: string;
  isPrivate: boolean;
  inviteCode: string;
  allowAudio: boolean;
  softModeEnabled: boolean;
  host: {
    id: string;
    displayName: string;
  };
  members: SocialRoomMember[];
  createdAt: string;
  lastActivityAt?: string;
  metadata?: Json | null;
}

export interface SocialBreakPlan {
  id: string;
  roomId: string;
  startsAt: string; // ISO string in UTC
  durationMinutes: number;
  remindAt?: string | null; // ISO string in UTC
  deliveryChannel: 'email' | 'in-app';
  invitees: Array<{ id: string; type: 'member' | 'email'; label: string }>;
}

export interface QuietHoursSettings {
  enabled: boolean;
  startUtc: string; // HH:mm format
  endUtc: string; // HH:mm format
}

export type MspssSupportLevel = 'low' | 'medium' | 'high' | 'unknown';

export interface MspssSummary {
  supportLevel: MspssSupportLevel;
  lastUpdated?: string;
  note?: string;
}

export interface CreateSocialRoomPayload {
  name: string;
  topic: string;
  allowAudio: boolean;
}

export interface JoinSocialRoomPayload {
  roomId: string;
  memberId?: string;
  displayName: string;
  preferAudio: boolean;
  preferText: boolean;
}

export interface LeaveSocialRoomPayload {
  roomId: string;
  memberId?: string;
}

export interface ToggleSoftModePayload {
  roomId: string;
  softMode: boolean;
}

export interface ScheduleBreakPayload {
  roomId: string;
  startsAtUtc: string;
  durationMinutes: number;
  reminderOptIn: boolean;
  deliveryChannel: 'email' | 'in-app';
  invitees: Array<{ id: string; type: 'member' | 'email'; label: string }>;
}

export const isWithinQuietHours = (
  date: Date,
  quietHours: QuietHoursSettings | null,
): boolean => {
  if (!quietHours?.enabled) return false;

  const dateUtcHours = date.getUTCHours();
  const dateUtcMinutes = date.getUTCMinutes();
  const toMinutes = (value: string) => {
    const [hours, minutes] = value.split(':').map((part) => Number.parseInt(part, 10));
    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return null;
    }
    return hours * 60 + minutes;
  };

  const startMinutes = toMinutes(quietHours.startUtc);
  const endMinutes = toMinutes(quietHours.endUtc);
  if (startMinutes == null || endMinutes == null) {
    return false;
  }

  const currentMinutes = dateUtcHours * 60 + dateUtcMinutes;

  if (startMinutes <= endMinutes) {
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  }

  return currentMinutes >= startMinutes || currentMinutes < endMinutes;
};
