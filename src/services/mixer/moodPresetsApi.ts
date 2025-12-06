// @ts-nocheck
import { supabase } from '@/integrations/supabase/client';
import {
  PresetIdSchema,
  PresetInsertSchema,
  PresetRecordSchema,
  PresetUpdateSchema,
  mapRecordToPreset,
  type Preset,
  type PresetInsert,
  type PresetUpdate,
} from '@/modules/mood-mixer/types';
import { sortPresetsByFreshness } from '@/modules/mood-mixer/utils';

const SELECT_FIELDS = 'id,name,sliders,created_at,updated_at';

export async function listMyPresets(): Promise<Preset[]> {
  const { data, error } = await supabase
    .from('mood_presets')
    .select(SELECT_FIELDS)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  const records = (data ?? []).map((item) => mapRecordToPreset(PresetRecordSchema.parse(item)));
  return sortPresetsByFreshness(records);
}

export async function createPreset(payload: PresetInsert): Promise<Preset> {
  const parsed = PresetInsertSchema.parse(payload);
  const { data, error } = await supabase
    .from('mood_presets')
    .insert({
      user_id: parsed.userId,
      name: parsed.name.trim(),
      sliders: parsed.sliders,
    })
    .select(SELECT_FIELDS)
    .single();

  if (error) {
    throw error;
  }

  return mapRecordToPreset(PresetRecordSchema.parse(data));
}

export async function updatePreset(id: string, payload: PresetUpdate): Promise<Preset> {
  const presetId = PresetIdSchema.parse(id);
  const parsedPayload = PresetUpdateSchema.parse(payload);

  if (!parsedPayload.name && !parsedPayload.sliders) {
    const { data, error } = await supabase
      .from('mood_presets')
      .select(SELECT_FIELDS)
      .eq('id', presetId)
      .single();

    if (error) {
      throw error;
    }

    return mapRecordToPreset(PresetRecordSchema.parse(data));
  }

  const updatePayload: Record<string, unknown> = {};

  if (typeof parsedPayload.name === 'string') {
    updatePayload.name = parsedPayload.name.trim();
  }

  if (parsedPayload.sliders) {
    updatePayload.sliders = parsedPayload.sliders;
  }

  const { data, error } = await supabase
    .from('mood_presets')
    .update(updatePayload)
    .eq('id', presetId)
    .select(SELECT_FIELDS)
    .single();

  if (error) {
    throw error;
  }

  return mapRecordToPreset(PresetRecordSchema.parse(data));
}

export async function deletePreset(id: string): Promise<void> {
  const presetId = PresetIdSchema.parse(id);
  const { error } = await supabase
    .from('mood_presets')
    .delete()
    .eq('id', presetId);

  if (error) {
    throw error;
  }
}
