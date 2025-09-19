import { z } from 'zod';

export const SlidersSchema = z.object({
  energy: z.number().min(0).max(100),
  calm: z.number().min(0).max(100),
  focus: z.number().min(0).max(100),
  light: z.number().min(0).max(100),
});

export const PresetSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(40),
  sliders: SlidersSchema,
});

export const PresetInsertSchema = PresetSchema.extend({
  userId: z.string().uuid(),
});

export const PresetRecordSchema = PresetSchema.extend({
  id: z.string().uuid(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export const PresetUpdateSchema = z.object({
  name: PresetSchema.shape.name.optional(),
  sliders: SlidersSchema.optional(),
});

export const PresetIdSchema = z.string().uuid();

export type Sliders = z.infer<typeof SlidersSchema>;
export type PresetDraft = z.infer<typeof PresetSchema>;
export type PresetInsert = z.infer<typeof PresetInsertSchema>;
export type PresetRecord = z.infer<typeof PresetRecordSchema>;
export type PresetUpdate = z.infer<typeof PresetUpdateSchema>;

export type Preset = Omit<PresetRecord, 'created_at' | 'updated_at'> & {
  createdAt?: string;
  updatedAt?: string;
};

export function mapRecordToPreset(record: PresetRecord): Preset {
  return {
    id: record.id,
    name: record.name,
    sliders: record.sliders,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}
