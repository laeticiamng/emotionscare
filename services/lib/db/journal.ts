/**
 * Database service for Journal Entries
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import type {
  JournalEntry,
  CreateJournalEntryInput,
  UpdateJournalEntryInput,
  ListJournalEntriesInput,
  JournalStats,
} from '@emotionscare/contracts';

/**
 * List journal entries for a user with filters
 */
export async function listJournalEntries(
  userId: string,
  filters: ListJournalEntriesInput
) {
  try {
    let query = supabase
      .from('journal_entries')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order(filters.sortBy, { ascending: filters.sortOrder === 'asc' })
      .range(filters.offset, filters.offset + filters.limit - 1);

    // Apply filters
    if (filters.mood) {
      query = query.eq('mood', filters.mood);
    }

    if (filters.tags && filters.tags.length > 0) {
      query = query.contains('tags', filters.tags);
    }

    if (filters.startDate) {
      query = query.gte('date', filters.startDate);
    }

    if (filters.endDate) {
      query = query.lte('date', filters.endDate);
    }

    const { data, error, count } = await query;

    if (error) {
      logger.error('Failed to list journal entries', error, 'DB');
      throw new Error(`Failed to list journal entries: ${error.message}`);
    }

    return {
      entries: data as JournalEntry[],
      total: count || 0,
      hasMore: (count || 0) > filters.offset + filters.limit,
    };
  } catch (error) {
    logger.error('Error listing journal entries', error as Error, 'DB');
    throw error;
  }
}

/**
 * Create a new journal entry
 */
export async function createJournalEntry(
  userId: string,
  input: CreateJournalEntryInput
): Promise<JournalEntry> {
  try {
    const entry = {
      user_id: userId,
      title: input.title,
      content: input.content,
      text: input.text || input.content, // Fallback for existing migration
      mood: input.mood,
      mood_score: input.mood_score,
      emotion: input.emotion,
      tags: input.tags || [],
      date: input.date || new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('journal_entries')
      .insert(entry)
      .select()
      .single();

    if (error) {
      logger.error('Failed to create journal entry', error, 'DB');
      throw new Error(`Failed to create journal entry: ${error.message}`);
    }

    return data as JournalEntry;
  } catch (error) {
    logger.error('Error creating journal entry', error as Error, 'DB');
    throw error;
  }
}

/**
 * Get a specific journal entry
 */
export async function getJournalEntry(
  entryId: string,
  userId: string
): Promise<JournalEntry | null> {
  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('id', entryId)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null;
      }
      logger.error('Failed to get journal entry', error, 'DB');
      throw new Error(`Failed to get journal entry: ${error.message}`);
    }

    return data as JournalEntry;
  } catch (error) {
    logger.error('Error getting journal entry', error as Error, 'DB');
    throw error;
  }
}

/**
 * Update a journal entry
 */
export async function updateJournalEntry(
  entryId: string,
  userId: string,
  updates: UpdateJournalEntryInput
): Promise<JournalEntry> {
  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .update(updates)
      .eq('id', entryId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      logger.error('Failed to update journal entry', error, 'DB');
      throw new Error(`Failed to update journal entry: ${error.message}`);
    }

    return data as JournalEntry;
  } catch (error) {
    logger.error('Error updating journal entry', error as Error, 'DB');
    throw error;
  }
}

/**
 * Delete a journal entry
 */
export async function deleteJournalEntry(
  entryId: string,
  userId: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', entryId)
      .eq('user_id', userId);

    if (error) {
      logger.error('Failed to delete journal entry', error, 'DB');
      throw new Error(`Failed to delete journal entry: ${error.message}`);
    }
  } catch (error) {
    logger.error('Error deleting journal entry', error as Error, 'DB');
    throw error;
  }
}

/**
 * Get journal statistics for a user
 */
export async function getJournalStats(userId: string): Promise<JournalStats> {
  try {
    // Get all entries for the user
    const { data: entries, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      logger.error('Failed to get journal stats', error, 'DB');
      throw new Error(`Failed to get journal stats: ${error.message}`);
    }

    if (!entries || entries.length === 0) {
      return {
        totalEntries: 0,
        mostUsedTags: [],
        entriesThisWeek: 0,
        entriesThisMonth: 0,
      };
    }

    // Calculate stats
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const entriesThisWeek = entries.filter(
      (e: any) => new Date(e.date || e.created_at) >= oneWeekAgo
    ).length;

    const entriesThisMonth = entries.filter(
      (e: any) => new Date(e.date || e.created_at) >= oneMonthAgo
    ).length;

    // Calculate average mood score
    const entriesWithMoodScore = entries.filter((e: any) => e.mood_score != null);
    const averageMoodScore =
      entriesWithMoodScore.length > 0
        ? entriesWithMoodScore.reduce((sum: number, e: any) => sum + e.mood_score, 0) /
          entriesWithMoodScore.length
        : undefined;

    // Find most common mood
    const moodCounts: Record<string, number> = {};
    entries.forEach((e: any) => {
      if (e.mood) {
        moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
      }
    });
    const mostCommonMood = Object.keys(moodCounts).length > 0
      ? Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0][0]
      : undefined;

    // Find most used tags
    const tagCounts: Record<string, number> = {};
    entries.forEach((e: any) => {
      if (e.tags && Array.isArray(e.tags)) {
        e.tags.forEach((tag: string) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    const mostUsedTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag]) => tag);

    return {
      totalEntries: entries.length,
      averageMoodScore,
      mostCommonMood,
      mostUsedTags,
      entriesThisWeek,
      entriesThisMonth,
    };
  } catch (error) {
    logger.error(error as Error, 'DB');
    throw error;
  }
}
