/**
 * Journal Feature
 * 
 * Vocal and text journal with AI enrichment.
 * @module features/journal
 */

// ============================================================================
// SERVICES
// ============================================================================

export { journalApi } from './services/journalApi';

// Re-export from modules
export { journalService } from '@/modules/journal';

// ============================================================================
// HOOKS
// ============================================================================

export { useJournalEntries } from './hooks/useJournalEntries';

// Re-export from modules
export {
  useJournalMachine,
  useJournalComposer,
  usePanasSuggestions,
  useJournalEnriched,
} from '@/modules/journal';

// ============================================================================
// COMPONENTS
// ============================================================================

// Re-export from modules
export {
  WhisperInput,
  SummaryChip,
  BurnSealToggle,
  JournalComposer,
  JournalPromptCard,
  JournalRemindersList,
  JournalStatsCard,
  JournalEditDialog,
  JournalNoteActions,
} from '@/modules/journal';

// ============================================================================
// TYPES
// ============================================================================

export type {
  JournalEntry,
  JournalVoiceEntry,
  JournalTextEntry,
  Note,
  SanitizedNote,
  FeedQuery,
  JournalStats,
  JournalTab,
  UseJournalEnrichedReturn,
} from '@/modules/journal';
