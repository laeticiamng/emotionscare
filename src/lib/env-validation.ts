
import { z } from 'zod';

const envSchema = z.object({
  supabaseUrl: z.string().url(),
  supabaseAnonKey: z.string().min(1),
  isDevelopment: z.boolean(),
  isProduction: z.boolean(),
});

export const env = {
  supabaseUrl: 'https://yaincoxihiqdksxgrsrk.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaW5jb3hpaGlxZGtzeGdyc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTE4MjcsImV4cCI6MjA1ODM4NzgyN30.HBfwymB2F9VBvb3uyeTtHBMZFZYXzL0wQmS5fqd65yU',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};
