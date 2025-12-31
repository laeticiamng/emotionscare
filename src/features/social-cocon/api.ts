// @ts-nocheck
import { Sentry } from '@/lib/errors/sentry-compat';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import {
  type CreateSocialRoomPayload,
  type JoinSocialRoomPayload,
  type LeaveSocialRoomPayload,
  type MspssSummary,
  type QuietHoursSettings,
  type ScheduleBreakPayload,
  type SocialBreakPlan,
  type SocialRoom,
  type SocialRoomMember,
  type ToggleSoftModePayload,
} from './types';

const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 10);
};

const FALLBACK_ROOMS: SocialRoom[] = [
  {
    id: 'demo-room-1',
    name: 'Cercle d\'écoute',
    topic: 'Écoute bienveillante et partages calmes',
    isPrivate: true,
    inviteCode: 'cercle',
    allowAudio: true,
    softModeEnabled: false,
    host: { id: 'demo-host-1', displayName: 'Camille' },
    members: [
      {
        id: 'demo-host-1',
        displayName: 'Camille',
        role: 'host',
        joinedAt: new Date().toISOString(),
        preferences: { audio: true, text: true },
      },
      {
        id: 'demo-guest-1',
        displayName: 'Lina',
        role: 'guest',
        joinedAt: new Date().toISOString(),
        preferences: { audio: false, text: true },
      },
    ],
    createdAt: new Date().toISOString(),
    lastActivityAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    metadata: {
      tags: ['écoute', 'soutien'],
    },
  },
  {
    id: 'demo-room-2',
    name: 'Atelier respiration',
    topic: 'Petites pauses guidées en douceur',
    isPrivate: true,
    inviteCode: 'respire',
    allowAudio: true,
    softModeEnabled: true,
    host: { id: 'demo-host-2', displayName: 'Noah' },
    members: [
      {
        id: 'demo-host-2',
        displayName: 'Noah',
        role: 'host',
        joinedAt: new Date().toISOString(),
        preferences: { audio: true, text: false },
      },
    ],
    createdAt: new Date().toISOString(),
    lastActivityAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    metadata: {
      tags: ['respiration'],
    },
  },
];

const FALLBACK_BREAKS: SocialBreakPlan[] = [
  {
    id: 'demo-break-1',
    roomId: 'demo-room-1',
    startsAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    durationMinutes: 15,
    remindAt: new Date(Date.now() + 1000 * 60 * 50).toISOString(),
    deliveryChannel: 'in-app',
    invitees: [
      { id: 'demo-guest-1', type: 'member', label: 'Lina (guest)' },
    ],
  },
];

const FALLBACK_QUIET_HOURS: QuietHoursSettings = {
  enabled: false,
  startUtc: '21:00',
  endUtc: '07:00',
};

const FALLBACK_MSPSS: MspssSummary = {
  supportLevel: 'unknown',
};

const sanitizeString = (value: unknown) => {
  if (!value || typeof value !== 'string') return '';
  return value.length > 140 ? `${value.slice(0, 120)}…` : value;
};

const mapMemberRecord = (record: any): SocialRoomMember => ({
  id: record?.member_id || record?.id || generateId(),
  displayName: sanitizeString(record?.display_name || record?.name || 'Membre'),
  role: record?.role === 'host' ? 'host' : 'guest',
  joinedAt: record?.joined_at || new Date().toISOString(),
  preferences: {
    audio: Boolean(record?.preferences?.audio ?? true),
    text: Boolean(record?.preferences?.text ?? true),
  },
});

const mapRoomRecord = (record: any): SocialRoom => ({
  id: record?.id || generateId(),
  name: sanitizeString(record?.name || record?.title || 'Room privée'),
  topic: sanitizeString(record?.topic || record?.description || 'Espace confidentiel'),
  isPrivate: Boolean(record?.is_private ?? true),
  inviteCode: sanitizeString(record?.invite_code || record?.invite || 'privé'),
  allowAudio: Boolean(record?.allow_audio ?? true),
  softModeEnabled: Boolean(record?.soft_mode_enabled ?? record?.soft_mode ?? false),
  host: {
    id: record?.host_id || record?.owner_id || 'unknown-host',
    displayName: sanitizeString(record?.host_display_name || record?.host_name || 'Hôte'),
  },
  members: Array.isArray(record?.members)
    ? record.members.map(mapMemberRecord)
    : Array.isArray(record?.room_members)
      ? record.room_members.map(mapMemberRecord)
      : [],
  createdAt: record?.created_at || new Date().toISOString(),
  lastActivityAt: record?.last_activity_at || record?.updated_at || undefined,
  metadata: record?.metadata ?? null,
});

const mapBreakRecord = (record: any): SocialBreakPlan => ({
  id: record?.id || generateId(),
  roomId: record?.room_id || record?.social_room_id || 'unknown',
  startsAt: record?.starts_at || record?.startsAt || new Date().toISOString(),
  durationMinutes: Number.parseInt(record?.duration_minutes ?? record?.duration ?? 10, 10),
  remindAt: record?.remind_at || null,
  deliveryChannel: record?.delivery_channel === 'email' ? 'email' : 'in-app',
  invitees: Array.isArray(record?.invitees)
    ? record.invitees.map((invite: any) => ({
        id: invite?.id || crypto.randomUUID(),
        type: invite?.type === 'email' ? 'email' : 'member',
        label: sanitizeString(invite?.label || invite?.display_name || 'Invité'),
      }))
    : [],
});

const anonymizeIdentifier = async (value: string): Promise<string> => {
  if (typeof value !== 'string' || value.length === 0) {
    return 'unknown';
  }

  if (typeof crypto !== 'undefined' && crypto.subtle && typeof TextEncoder !== 'undefined') {
    try {
      const encoded = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest('SHA-256', encoded);
      const hash = Array.from(new Uint8Array(digest))
        .slice(0, 8)
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
      return hash;
    } catch (error) {
      logger.warn('[social-cocon] Unable to hash identifier', error as Error, 'SYSTEM');
    }
  }

  return value.slice(0, 8);
};

const logSocialEvent = async (
  event: 'create' | 'join' | 'leave',
  payload: { roomId: string; role?: string }
) => {
  try {
    const anonymizedRoomId = await anonymizeIdentifier(payload.roomId);
    await supabase.from('social_room_events').insert({
      event_type: event,
      room_ref: anonymizedRoomId,
      role: payload.role ?? 'guest',
    });
  } catch (error) {
    if (import.meta.env.DEV) {
      logger.info('[social-cocon] Event log skipped', { event, error }, 'SYSTEM');
    }
  }
};

export const fetchSocialRooms = async (): Promise<SocialRoom[]> => {
  try {
    const { data, error } = await supabase
      .from('social_rooms')
      .select(
        `id, name, topic, description, is_private, invite_code, allow_audio, soft_mode_enabled, host_id, host_display_name, created_at, updated_at, metadata, room_members (member_id, display_name, role, joined_at, preferences)`
      )
      .order('created_at', { ascending: false })
      .limit(12);

    if (error || !data) {
      if (import.meta.env.DEV) {
        logger.info('[social-cocon] Falling back to demo rooms', { errorMessage: error?.message }, 'SYSTEM');
      }
      return FALLBACK_ROOMS;
    }

    return data.map(mapRoomRecord);
  } catch (error) {
    if (import.meta.env.DEV) {
      logger.warn('[social-cocon] Failed to load rooms', error as Error, 'SYSTEM');
    }
    return FALLBACK_ROOMS;
  }
};

const generateInviteCode = () => Math.random().toString(36).slice(2, 8);

export const createSocialRoom = async (
  payload: CreateSocialRoomPayload
): Promise<SocialRoom> => {
  const optimisticRoom: SocialRoom = {
    id: generateId(),
    name: payload.name,
    topic: payload.topic,
    isPrivate: true,
    inviteCode: generateInviteCode(),
    allowAudio: payload.allowAudio,
    softModeEnabled: false,
    host: {
      id: 'me',
      displayName: 'Moi',
    },
    members: [],
    createdAt: new Date().toISOString(),
    lastActivityAt: undefined,
    metadata: { origin: 'client-optimistic' },
  };

  try {
    const { data, error } = await supabase
      .from('social_rooms')
      .insert({
        name: payload.name,
        topic: payload.topic,
        is_private: true,
        invite_code: optimisticRoom.inviteCode,
        allow_audio: payload.allowAudio,
      })
      .select(
        `id, name, topic, description, is_private, invite_code, allow_audio, soft_mode_enabled, host_id, host_display_name, created_at, updated_at, metadata, room_members (member_id, display_name, role, joined_at, preferences)`
      )
      .single();

    if (error || !data) {
      throw error ?? new Error('create_room_failed');
    }

    await logSocialEvent('create', { roomId: data.id, role: 'host' });
    return mapRoomRecord(data);
  } catch (error) {
    Sentry.captureException(error, {
      tags: { feature: 'social-cocon', action: 'create-room' },
    });
    return optimisticRoom;
  }
};

export const joinSocialRoom = async (
  payload: JoinSocialRoomPayload
): Promise<SocialRoomMember> => {
  const member: SocialRoomMember = {
    id: payload.memberId || generateId(),
    displayName: payload.displayName,
    role: 'guest',
    joinedAt: new Date().toISOString(),
    preferences: {
      audio: payload.preferAudio,
      text: payload.preferText,
    },
  };

  try {
    const { error } = await supabase.from('room_members').insert({
      room_id: payload.roomId,
      member_id: member.id,
      role: 'guest',
      preferences: member.preferences,
      display_name: member.displayName,
    });

    if (error) {
      throw error;
    }

    await logSocialEvent('join', { roomId: payload.roomId, role: 'guest' });
    return member;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { feature: 'social-cocon', action: 'join-room' },
    });
    return member;
  }
};

export const leaveSocialRoom = async (
  payload: LeaveSocialRoomPayload
): Promise<void> => {
  try {
    if (payload.memberId) {
      await supabase
        .from('room_members')
        .delete()
        .eq('room_id', payload.roomId)
        .eq('member_id', payload.memberId);
    }
    await logSocialEvent('leave', { roomId: payload.roomId });
  } catch (error) {
    if (import.meta.env.DEV) {
      logger.info('[social-cocon] Leave room fallback', { error }, 'SYSTEM');
    }
  }
};

export const toggleSoftMode = async (
  payload: ToggleSoftModePayload
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('social_rooms')
      .update({ soft_mode_enabled: payload.softMode })
      .eq('id', payload.roomId)
      .select('soft_mode_enabled')
      .single();

    if (error) {
      throw error;
    }

    return Boolean(data?.soft_mode_enabled ?? payload.softMode);
  } catch (error) {
    if (import.meta.env.DEV) {
      logger.info('[social-cocon] Soft mode fallback', { error }, 'SYSTEM');
    }
    return payload.softMode;
  }
};

export const fetchUpcomingBreaks = async (): Promise<SocialBreakPlan[]> => {
  try {
    const { data, error } = await supabase
      .from('social_room_breaks')
      .select('id, room_id, starts_at, duration_minutes, remind_at, delivery_channel, invitees')
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true })
      .limit(6);

    if (error || !data) {
      throw error ?? new Error('no_breaks');
    }

    return data.map(mapBreakRecord);
  } catch (error) {
    if (import.meta.env.DEV) {
      logger.info('[social-cocon] Breaks fallback', { error }, 'SYSTEM');
    }
    return FALLBACK_BREAKS;
  }
};

export const scheduleBreak = async (
  payload: ScheduleBreakPayload
): Promise<SocialBreakPlan> => {
  const reminder = payload.reminderOptIn
    ? new Date(new Date(payload.startsAtUtc).getTime() - 10 * 60 * 1000).toISOString()
    : null;

  const basePlan: SocialBreakPlan = {
    id: generateId(),
    roomId: payload.roomId,
    startsAt: payload.startsAtUtc,
    durationMinutes: payload.durationMinutes,
    remindAt: reminder,
    deliveryChannel: payload.deliveryChannel,
    invitees: payload.invitees,
  };

  try {
    const { data, error } = await supabase
      .from('social_room_breaks')
      .insert({
        room_id: payload.roomId,
        starts_at: payload.startsAtUtc,
        duration_minutes: payload.durationMinutes,
        remind_at: reminder,
        delivery_channel: payload.deliveryChannel,
        invitees: payload.invitees,
      })
      .select('id, room_id, starts_at, duration_minutes, remind_at, delivery_channel, invitees')
      .single();

    if (error || !data) {
      throw error ?? new Error('schedule_failed');
    }

    await supabase.functions.invoke('social-cocon-invite', {
      body: {
        roomId: payload.roomId,
        startsAt: payload.startsAtUtc,
        reminderAt: reminder,
        deliveryChannel: payload.deliveryChannel,
        invitees: payload.invitees,
      },
    });

    return mapBreakRecord(data);
  } catch (error) {
    const normalizedError =
      error instanceof Error ? error : new Error('schedule_failed');

    Sentry.captureException(normalizedError, {
      tags: { feature: 'social-cocon', action: 'schedule-break' },
      extra: { basePlan },
    });

    throw normalizedError;
  }
};

export const cancelScheduledBreak = async (breakId: string): Promise<void> => {
  try {
    await supabase.from('social_room_breaks').delete().eq('id', breakId);
  } catch (error) {
    if (import.meta.env.DEV) {
      logger.info('[social-cocon] Cancel break fallback', { error }, 'SYSTEM');
    }
  }
};

export const fetchQuietHours = async (): Promise<QuietHoursSettings> => {
  try {
    const { data, error } = await supabase
      .from('quiet_hours_settings')
      .select('enabled, start_utc, end_utc')
      .single();

    if (error || !data) {
      throw error ?? new Error('quiet_hours_missing');
    }

    return {
      enabled: Boolean(data.enabled),
      startUtc: data.start_utc || '21:00',
      endUtc: data.end_utc || '07:00',
    };
  } catch (error) {
    if (import.meta.env.DEV) {
      logger.info('[social-cocon] Quiet hours fallback', { error }, 'SYSTEM');
    }
    return FALLBACK_QUIET_HOURS;
  }
};

export const fetchMspssSummary = async (): Promise<MspssSummary> => {
  try {
    const { data, error } = await supabase
      .from('assessment_summaries')
      .select('instrument, summary, support_level, updated_at')
      .eq('instrument', 'MSPSS')
      .maybeSingle();

    if (error || !data) {
      throw error ?? new Error('no_mspss');
    }

    const supportLevel = (data.support_level as MspssSummary['supportLevel']) || 'unknown';

    return {
      supportLevel,
      lastUpdated: data.updated_at || undefined,
      note: typeof data.summary === 'string' ? sanitizeString(data.summary) : undefined,
    };
  } catch (error) {
    if (import.meta.env.DEV) {
      logger.info('[social-cocon] MSPSS summary fallback', { error }, 'SYSTEM');
    }
    return FALLBACK_MSPSS;
  }
};

export const saveQuietHours = async (
  settings: QuietHoursSettings
): Promise<QuietHoursSettings> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('quiet_hours_settings')
      .upsert({
        user_id: user?.id,
        enabled: settings.enabled,
        start_utc: settings.startUtc,
        end_utc: settings.endUtc,
        updated_at: new Date().toISOString(),
      })
      .select('enabled, start_utc, end_utc')
      .single();

    if (error) {
      throw error;
    }

    return {
      enabled: Boolean(data?.enabled),
      startUtc: data?.start_utc || settings.startUtc,
      endUtc: data?.end_utc || settings.endUtc,
    };
  } catch (error) {
    Sentry.captureException(error, {
      tags: { feature: 'social-cocon', action: 'save-quiet-hours' },
    });
    throw error;
  }
};
