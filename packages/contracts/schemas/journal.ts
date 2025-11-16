import { z } from 'zod';

/**
 * Journal Entry Schemas
 * These schemas are shared between frontend and backend for type-safe validation
 */

// Base journal entry type
export const journalEntrySchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(10000),
  text: z.string().optional(),
  mood: z.string().min(1),
  mood_score: z.number().min(1).max(10).optional(),
  emotion: z.string().optional(),
  date: z.union([z.date(), z.string().datetime()]),
  tags: z.array(z.string()).max(10).optional(),
  ai_feedback: z.string().max(5000).optional(),
  user_id: z.string().uuid().optional(),
});

// Schema for creating a new journal entry
export const createJournalEntrySchema = journalEntrySchema
  .omit({ id: true, ai_feedback: true, user_id: true })
  .extend({
    title: z.string().min(1).max(200).default('Untitled'),
    content: z.string().min(1).max(10000),
    mood: z.string().min(1),
    mood_score: z.number().min(1).max(10).optional(),
    tags: z.array(z.string().min(1).max(50)).max(10).default([]),
  });

// Schema for updating an existing journal entry
export const updateJournalEntrySchema = createJournalEntrySchema.partial();

// Schema for listing journal entries with filters
export const listJournalEntriesSchema = z.object({
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().nonnegative().default(0),
  mood: z.string().optional(),
  tags: z.array(z.string()).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  sortBy: z.enum(['date', 'mood_score', 'created_at']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Schema for journal entry statistics
export const journalStatsSchema = z.object({
  totalEntries: z.number().int().nonnegative(),
  averageMoodScore: z.number().min(1).max(10).optional(),
  mostCommonMood: z.string().optional(),
  mostUsedTags: z.array(z.string()).max(10),
  entriesThisWeek: z.number().int().nonnegative(),
  entriesThisMonth: z.number().int().nonnegative(),
});

// Type exports
export type JournalEntry = z.infer<typeof journalEntrySchema>;
export type CreateJournalEntryInput = z.infer<typeof createJournalEntrySchema>;
export type UpdateJournalEntryInput = z.infer<typeof updateJournalEntrySchema>;
export type ListJournalEntriesInput = z.infer<typeof listJournalEntriesSchema>;
export type JournalStats = z.infer<typeof journalStatsSchema>;
