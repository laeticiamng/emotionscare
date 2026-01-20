/**
 * Hook pour gérer les paramètres du journal
 * @deprecated Use useJournalSettingsSupabase for Supabase persistence
 * This file re-exports the Supabase version for backwards compatibility
 */
export { useJournalSettingsSupabase as useJournalSettings } from './useJournalSettingsSupabase';
export type { JournalSettings } from './useJournalSettingsSupabase';
