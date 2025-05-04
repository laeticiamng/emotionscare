
import { supabase } from '@/integrations/supabase/client';
import type { JournalEntry } from '@/types';

// Fetch all journal entries for a user
export async function fetchJournalEntries(userId: string): Promise<JournalEntry[]> {
  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;

    // Make sure all returned entries conform to the JournalEntry type
    return (data || []).map(entry => {
      // Add any missing fields with default values
      return {
        id: entry.id,
        user_id: entry.user_id,
        date: entry.date,
        title: entry.title || "Untitled Entry",
        content: entry.content || "",
        text: entry.content || "", // For compatibility
        emotions: entry.emotions || [],
        is_private: entry.is_private !== undefined ? entry.is_private : true,
        created_at: entry.created_at || entry.date || new Date().toISOString(),
        updated_at: entry.updated_at || entry.date || new Date().toISOString(),
        ai_feedback: entry.ai_feedback || "",
      } as JournalEntry;
    });
  } catch (error) {
    console.error('Error in fetchJournalEntries:', error);
    throw error;
  }
}

// Fetch a single journal entry by ID
export async function fetchJournalEntry(entryId: string): Promise<JournalEntry> {
  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('id', entryId)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Journal entry not found');

    // Add any missing fields with default values
    return {
      id: data.id,
      user_id: data.user_id,
      date: data.date,
      title: data.title || "Untitled Entry",
      content: data.content || "",
      text: data.content || "", // For compatibility
      emotions: data.emotions || [],
      is_private: data.is_private !== undefined ? data.is_private : true,
      created_at: data.created_at || data.date || new Date().toISOString(),
      updated_at: data.updated_at || data.date || new Date().toISOString(),
      ai_feedback: data.ai_feedback || "",
    } as JournalEntry;
  } catch (error) {
    console.error('Error in fetchJournalEntry:', error);
    throw error;
  }
}

// Create a new journal entry
export async function createJournalEntry(userId: string, content: string, mood?: string, keywords?: string[]): Promise<JournalEntry> {
  try {
    const entry = {
      user_id: userId,
      date: new Date().toISOString(),
      title: "Journal Entry",
      content: content,
      is_private: true,
      mood: mood, // Store mood if provided
      keywords: keywords, // Store keywords if provided
    };

    const { data, error } = await supabase
      .from('journal_entries')
      .insert([entry])
      .select()
      .single();

    if (error) throw error;

    // Add any missing fields with default values
    return {
      id: data.id,
      user_id: data.user_id,
      date: data.date,
      title: data.title || "Untitled Entry",
      content: data.content || "",
      text: data.content || "", // For compatibility
      emotions: data.emotions || [],
      is_private: data.is_private !== undefined ? data.is_private : true,
      created_at: data.created_at || data.date || new Date().toISOString(),
      updated_at: data.updated_at || data.date || new Date().toISOString(),
      ai_feedback: data.ai_feedback || "",
      mood: data.mood,
      keywords: data.keywords
    } as JournalEntry;
  } catch (error) {
    console.error('Error in createJournalEntry:', error);
    throw error;
  }
}

// Update an existing journal entry
export async function updateJournalEntry(entryId: string, updates: Partial<JournalEntry>): Promise<JournalEntry> {
  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .update(updates)
      .eq('id', entryId)
      .select()
      .single();

    if (error) throw error;
    
    // Get the updated entry
    return await fetchJournalEntry(entryId);
  } catch (error) {
    console.error('Error in updateJournalEntry:', error);
    throw error;
  }
}

// Delete a journal entry
export async function deleteJournalEntry(entryId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', entryId);

    if (error) throw error;
  } catch (error) {
    console.error('Error in deleteJournalEntry:', error);
    throw error;
  }
}
