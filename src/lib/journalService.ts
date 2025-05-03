
import { supabase } from '@/integrations/supabase/client';
import type { JournalEntry } from '@/types';
import { ensureValidUUID } from './scanService';

export async function fetchJournalEntries(user_id: string): Promise<JournalEntry[]> {
  try {
    const validUserId = ensureValidUUID(user_id);
    
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', validUserId)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data as JournalEntry[] || [];
  } catch (error) {
    console.error('Error in fetchJournalEntries:', error);
    throw error;
  }
}

export async function fetchJournalEntry(id: string, user_id: string): Promise<JournalEntry | null> {
  try {
    const validUserId = ensureValidUUID(user_id);
    
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('id', id)
      .eq('user_id', validUserId)
      .maybeSingle();
    
    if (error) throw error;
    return data as JournalEntry | null;
  } catch (error) {
    console.error('Error in fetchJournalEntry:', error);
    throw error;
  }
}

export async function createJournalEntry(
  user_id: string, 
  content: string,
  mood?: JournalEntry['mood'],
  keywords?: string[]
): Promise<JournalEntry> {
  try {
    const validUserId = ensureValidUUID(user_id);
    
    const entryData: Partial<JournalEntry> = {
      user_id: validUserId,
      content,
      date: new Date().toISOString()
    };
    
    if (mood) entryData.mood = mood;
    if (keywords) entryData.keywords = keywords;
    
    const { data, error } = await supabase
      .from('journal_entries')
      .insert(entryData)
      .select()
      .single();

    if (error || !data) throw error || new Error('Insert failed');
    return data as JournalEntry;
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
