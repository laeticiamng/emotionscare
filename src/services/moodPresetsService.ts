import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { MoodPresetBlend, MoodPresetRecord } from '@/types/mood-mixer';

export type MoodPresetRow = Database['public']['Tables']['mood_presets']['Row'];
export type MoodPresetInsert = Database['public']['Tables']['mood_presets']['Insert'];
export type MoodPresetUpdate = Database['public']['Tables']['mood_presets']['Update'];

export interface MoodPresetPayload {
  slug: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  gradient?: string | null;
  tags?: string[];
  blend: MoodPresetBlend;
}

const toRecord = (row: MoodPresetRow): MoodPresetRecord => ({
  id: row.id,
  slug: row.slug,
  name: row.name,
  description: row.description,
  icon: row.icon,
  gradient: row.gradient,
  tags: row.tags ?? [],
  blend: {
    joy: Number(row.joy),
    calm: Number(row.calm),
    energy: Number(row.energy),
    focus: Number(row.focus),
  },
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const toInsert = (payload: MoodPresetPayload): MoodPresetInsert => ({
  slug: payload.slug,
  name: payload.name,
  description: payload.description ?? null,
  icon: payload.icon ?? null,
  gradient: payload.gradient ?? null,
  tags: payload.tags ?? [],
  joy: payload.blend.joy,
  calm: payload.blend.calm,
  energy: payload.blend.energy,
  focus: payload.blend.focus,
});

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

  if (payload.blend) {
    if (typeof payload.blend.joy !== 'undefined') update.joy = payload.blend.joy;
    if (typeof payload.blend.calm !== 'undefined') update.calm = payload.blend.calm;
    if (typeof payload.blend.energy !== 'undefined') update.energy = payload.blend.energy;
    if (typeof payload.blend.focus !== 'undefined') update.focus = payload.blend.focus;
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
