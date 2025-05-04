
import { supabase } from '@/integrations/supabase/client';
import type { JournalEntry } from '@/types';

export async function fetchJournalEntries(user_id: string): Promise<JournalEntry[]> {
  try {
    const validUserId = user_id;
    
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', validUserId)
      .order('date', { ascending: false });
    
    if (error) throw error;
    
    // Create properly typed JournalEntry objects with default values for missing fields
    const journalEntries = (data || []).map(entry => {
      // Create a properly typed JournalEntry with all required fields
      const journalEntry: JournalEntry = {
        id: entry.id,
        user_id: entry.user_id,
        title: entry.title || 'Sans titre',
        content: entry.content,
        date: entry.date,
        emotions: entry.emotions || [],
        is_private: entry.is_private !== undefined ? entry.is_private : false,
        created_at: entry.created_at || entry.date,
        updated_at: entry.updated_at || entry.date,
        ai_feedback: entry.ai_feedback,
        text: entry.content // For compatibility
      };
      return journalEntry;
    });
    
    return journalEntries;
  } catch (error) {
    console.error('Error in fetchJournalEntries:', error);
    throw error;
  }
}

export async function fetchJournalEntry(id: string, user_id: string): Promise<JournalEntry | null> {
  try {
    const validUserId = user_id;
    
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('id', id)
      .eq('user_id', validUserId)
      .maybeSingle();
    
    if (error) throw error;
    
    if (!data) return null;
    
    // Create a properly typed JournalEntry with all required fields
    const journalEntry: JournalEntry = {
      id: data.id,
      user_id: data.user_id,
      title: data.title || 'Sans titre',
      content: data.content,
      date: data.date,
      emotions: data.emotions || [],
      is_private: data.is_private !== undefined ? data.is_private : false,
      created_at: data.created_at || data.date,
      updated_at: data.updated_at || data.date,
      ai_feedback: data.ai_feedback,
      text: data.content // For compatibility
    };
    
    return journalEntry;
  } catch (error) {
    console.error('Error in fetchJournalEntry:', error);
    throw error;
  }
}

export async function createJournalEntry(
  user_id: string, 
  content: string,
  title?: string,
  emotions?: string[],
  is_private?: boolean
): Promise<JournalEntry> {
  try {
    const validUserId = user_id;
    
    const entryData = {
      user_id: validUserId,
      content,
      title: title || 'Sans titre',
      emotions: emotions || [],
      is_private: is_private !== undefined ? is_private : false,
      date: new Date().toISOString(),
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('journal_entries')
      .insert(entryData)
      .select()
      .single();

    if (error || !data) throw error || new Error('Insert failed');
    
    // Create a properly typed JournalEntry with all required fields
    const journalEntry: JournalEntry = {
      id: data.id,
      user_id: data.user_id,
      title: data.title || 'Sans titre',
      content: data.content,
      date: data.date,
      emotions: data.emotions || [],
      is_private: data.is_private !== undefined ? data.is_private : false,
      created_at: data.created_at || data.date,
      updated_at: data.updated_at || data.date,
      ai_feedback: data.ai_feedback,
      text: data.content // For compatibility
    };
    
    return journalEntry;
  } catch (error) {
    console.error('Error in createJournalEntry:', error);
    throw error;
  }
}

export async function deleteJournalEntry(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error in deleteJournalEntry:', error);
    throw error;
  }
}
