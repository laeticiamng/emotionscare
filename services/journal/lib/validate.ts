import { z } from 'zod';

export const VoiceSchema = z.object({
  audio_url: z.string().url(),
  text_raw: z.string().max(2000),
  summary_120: z.string().max(150),
  valence: z.number().min(-1).max(1),
  emo_vec: z.array(z.number()).length(8),
  pitch_avg: z.number().positive(),
  crystal_meta: z.object({
    form: z.enum(['gem','spike','wave']),
    palette: z.array(z.string()).length(2),
    mesh_url: z.string().url()
  })
});

export const TextSchema = z.object({
  text_raw: z.string().max(2000),
  styled_html: z.string(),
  preview: z.string().max(150),
  valence: z.number().min(-1).max(1),
  emo_vec: z.array(z.number()).length(8)
});
