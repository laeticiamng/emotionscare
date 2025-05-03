
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

export async function createJournalEntry(user_id: string, content: string): Promise<JournalEntry> {
  try {
    const validUserId = ensureValidUUID(user_id);
    
    // 1) Créer l'entrée de journal initiale sans feedback
    const { data, error: insertErr } = await supabase
      .from('journal_entries')
      .insert({
        user_id: validUserId,
        content,
      })
      .select()
      .single();

    if (insertErr || !data) throw insertErr || new Error('Insert failed');

    // 2) Appel à l'Edge Function pour analyser le journal avec OpenAI
    const { data: analysisData, error } = await supabase.functions.invoke('analyze-journal', {
      body: { content, journal_id: data.id }
    });

    if (error) {
      console.error('Error calling analyze-journal function:', error);
      throw new Error('Failed to analyze journal');
    }

    const { ai_feedback } = analysisData;

    // 3) Mettre à jour l'entrée avec le feedback
    const { data: updated, error: updateErr } = await supabase
      .from('journal_entries')
      .update({ ai_feedback })
      .eq('id', data.id)
      .select()
      .single();

    if (updateErr || !updated) throw updateErr || new Error('Update failed');

    return updated as JournalEntry;
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
