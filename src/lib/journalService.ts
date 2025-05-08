
import { supabase } from '@/integrations/supabase/client';
import type { JournalEntry } from '@/types';

// Fetch all journal entries for a user
export async function fetchJournalEntries(userId: string): Promise<JournalEntry[]> {
  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('id, user_id, content, date, ai_feedback')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;

    // Make sure all returned entries conform to the JournalEntry type
    return (data || []).map(entry => {
      return {
        id: entry.id,
        user_id: entry.user_id,
        content: entry.content || "",
        date: entry.date,
        title: entry.content?.substring(0, 30) || "Journal Entry", // Generate a title from content
        mood: "neutral", // Default mood
        created_at: entry.date, // Use date as created_at
        ai_feedback: entry.ai_feedback || null,
        text: entry.content || "",  // For compatibility
        is_private: true // Default value
      };
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
      .select('id, user_id, content, date, ai_feedback')
      .eq('id', entryId)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Journal entry not found');

    // Return the entry with our simplified schema
    return {
      id: data.id,
      user_id: data.user_id,
      content: data.content || "",
      title: data.content?.substring(0, 30) || "Journal Entry", // Generate a title from content
      mood: "neutral", // Default mood
      created_at: data.date, // Use date as created_at
      date: data.date,
      ai_feedback: data.ai_feedback || null,
      text: data.content || "",  // For compatibility
      is_private: true // Default value
    };
  } catch (error) {
    console.error('Error in fetchJournalEntry:', error);
    throw error;
  }
}

// Create a new journal entry
export async function createJournalEntry(userId: string, content: string): Promise<JournalEntry> {
  try {
    const entry = {
      user_id: userId,
      date: new Date().toISOString(),
      content: content,
      title: content.substring(0, 30), // Generate a title from content
      mood: "neutral", // Default mood
      created_at: new Date().toISOString(),
      is_private: true // Default value
    };

    const { data, error } = await supabase
      .from('journal_entries')
      .insert([entry])
      .select('id, user_id, content, date, ai_feedback')
      .single();

    if (error) throw error;

    // Return the created entry
    return {
      id: data.id,
      user_id: data.user_id,
      content: data.content || "",
      title: entry.title,
      mood: entry.mood,
      created_at: entry.created_at,
      date: data.date,
      ai_feedback: data.ai_feedback || null,
      text: data.content || "",  // For compatibility
      is_private: true // Default value
    };
  } catch (error) {
    console.error('Error in createJournalEntry:', error);
    throw error;
  }
}

// Update an existing journal entry
export async function updateJournalEntry(entryId: string, updates: Partial<JournalEntry>): Promise<JournalEntry> {
  try {
    // Only include fields that exist in the database
    const validUpdates: any = {};
    if (updates.content !== undefined) validUpdates.content = updates.content;
    if (updates.ai_feedback !== undefined) validUpdates.ai_feedback = updates.ai_feedback;

    const { data, error } = await supabase
      .from('journal_entries')
      .update(validUpdates)
      .eq('id', entryId)
      .select('id, user_id, content, date, ai_feedback')
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
