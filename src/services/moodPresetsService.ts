import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { MoodPresetBlend, MoodPresetRecord } from '@/types/mood-mixer';

export type MoodPresetRow = Database['public']['Tables']['mood_presets']['Row'];
export type MoodPresetInsert = Database['public']['Tables']['mood_presets']['Insert'];
export type MoodPresetUpdate = Database['public']['Tables']['mood_presets']['Update'];

export interface MoodPresetPayload {
  name: string;
  description?: string | null;
  icon?: string | null;
  gradient?: string | null;
  tags?: string[];
  blend: MoodPresetBlend;
  softness?: number;
  clarity?: number;
  slug?: string | null;
  userId?: string | null;
}

const DEFAULT_BLEND: MoodPresetBlend = {
  joy: 0.5,
  calm: 0.5,
  energy: 0.5,
  focus: 0.5,
};

const clampRatio = (value: number | undefined, fallback: number) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return fallback;
  }
  return Math.min(1, Math.max(0, value));
};

const clampPercentage = (value: number | undefined, fallback: number) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return fallback;
  }
  return Math.min(100, Math.max(0, Math.round(value)));
};

const normalizeBlend = (blend?: Partial<MoodPresetBlend>): MoodPresetBlend => ({
  joy: clampRatio(blend?.joy, DEFAULT_BLEND.joy),
  calm: clampRatio(blend?.calm, DEFAULT_BLEND.calm),
  energy: clampRatio(blend?.energy, DEFAULT_BLEND.energy),
  focus: clampRatio(blend?.focus, DEFAULT_BLEND.focus),
});

const parseBlend = (value: MoodPresetRow['blend']): MoodPresetBlend => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const candidate = value as Partial<MoodPresetBlend>;
    return normalizeBlend(candidate);
  }
  return { ...DEFAULT_BLEND };
};

const toRecord = (row: MoodPresetRow): MoodPresetRecord => {
  const blend = parseBlend(row.blend);
  return {
    id: row.id,
    slug: row.slug ?? null,
    userId: row.user_id ?? null,
    name: row.name,
    description: row.description ?? null,
    icon: row.icon ?? null,
    gradient: row.gradient ?? null,
    tags: row.tags ?? [],
    softness: typeof row.softness === 'number' ? row.softness : Math.round(blend.joy * 100),
    clarity: typeof row.clarity === 'number' ? row.clarity : Math.round(blend.energy * 100),
    blend,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const toInsert = (payload: MoodPresetPayload): MoodPresetInsert => {
  const blend = normalizeBlend(payload.blend);
  const softness = clampPercentage(payload.softness, Math.round(blend.joy * 100));
  const clarity = clampPercentage(payload.clarity, Math.round(blend.energy * 100));

  return {
    name: payload.name,
    description: payload.description ?? null,
    icon: payload.icon ?? null,
    gradient: payload.gradient ?? null,
    tags: payload.tags ?? [],
    blend,
    softness,
    clarity,
    slug: payload.slug ?? null,
    user_id: payload.userId ?? null,
  };
};

const toUpdate = (payload: Partial<MoodPresetPayload>): MoodPresetUpdate => {
  const update: MoodPresetUpdate = {
    updated_at: new Date().toISOString(),
  };

  if (typeof payload.slug !== 'undefined') update.slug = payload.slug;
  if (typeof payload.name !== 'undefined') update.name = payload.name;
  if (typeof payload.description !== 'undefined') update.description = payload.description;
  if (typeof payload.icon !== 'undefined') update.icon = payload.icon;
  if (typeof payload.gradient !== 'undefined') update.gradient = payload.gradient;
  if (typeof payload.tags !== 'undefined') update.tags = payload.tags;
  if (typeof payload.userId !== 'undefined') update.user_id = payload.userId;

  if (typeof payload.softness !== 'undefined') {
    update.softness = clampPercentage(payload.softness, Math.round(DEFAULT_BLEND.joy * 100));
  }

  if (typeof payload.clarity !== 'undefined') {
    update.clarity = clampPercentage(payload.clarity, Math.round(DEFAULT_BLEND.energy * 100));
  }

  if (payload.blend) {
    update.blend = normalizeBlend(payload.blend);
  }

  return update;
};

export const moodPresetsService = {
  async listPresets(): Promise<MoodPresetRecord[]> {
    const { data, error } = await supabase
      .from('mood_presets')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching mood presets:', error);
      return [];
    }

    return (data ?? []).map(toRecord);
  },

  async getPresetById(id: string): Promise<MoodPresetRecord | null> {
    const { data, error } = await supabase
      .from('mood_presets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching mood preset:', error);
      return null;
    }

    return data ? toRecord(data) : null;
  },

  async createPreset(payload: MoodPresetPayload): Promise<MoodPresetRecord | null> {
    const { data, error } = await supabase
      .from('mood_presets')
      .insert(toInsert(payload))
      .select()
      .single();

    if (error) {
      console.error('Error creating mood preset:', error);
      throw error;
    }

    return data ? toRecord(data) : null;
  },

  async updatePreset(id: string, payload: Partial<MoodPresetPayload>): Promise<MoodPresetRecord | null> {
    const { data, error } = await supabase
      .from('mood_presets')
      .update(toUpdate(payload))
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating mood preset:', error);
      throw error;
    }

    return data ? toRecord(data) : null;
  },

  async deletePreset(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('mood_presets')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting mood preset:', error);
      throw error;
    }

    return true;
  }
};

export type MoodPresetsService = typeof moodPresetsService;
