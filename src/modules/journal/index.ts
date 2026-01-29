/**
 * Journal Module - Journal vocal et textuel avec IA
 * @version 2.0.0
 */

// ============ Services ============
export { journalService } from './journalService';

// ============ Hooks ============
export { useJournalMachine } from './useJournalMachine';
export { useJournalComposer } from './useJournalComposer';
export { usePanasSuggestions } from './usePanasSuggestions';
export { useJournalEnriched } from './useJournalEnriched';
export { useJournalAutoSave } from './useJournalAutoSave';

// ============ UI Components ============
export { default as WhisperInput } from './ui/WhisperInput';
export { default as SummaryChip } from './ui/SummaryChip';
export { default as BurnSealToggle } from './ui/BurnSealToggle';

// ============ Business Components ============
export { JournalComposer } from './components/JournalComposer';
export { JournalPromptCard } from './components/JournalPromptCard';
export { JournalRemindersList } from './components/JournalRemindersList';
export { JournalStatsCard } from './components/JournalStatsCard';
export { JournalEditDialog } from './components/JournalEditDialog';
export { JournalNoteActions } from './components/JournalNoteActions';

// ============ Types ============
export type { 
  JournalEntry, 
  JournalVoiceEntry, 
  JournalTextEntry
} from './journalService';

export type {
  Note,
  SanitizedNote,
  FeedQuery
} from './types';

export type {
  JournalStats,
  JournalTab,
  UseJournalEnrichedReturn
} from './useJournalEnriched';
