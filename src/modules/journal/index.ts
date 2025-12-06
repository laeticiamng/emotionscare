/**
 * Journal Module - Journal vocal et textuel avec IA
 */

export { journalService } from './journalService';
export { useJournalMachine } from './useJournalMachine';
export { default as WhisperInput } from './ui/WhisperInput';
export { default as SummaryChip } from './ui/SummaryChip';
export { default as BurnSealToggle } from './ui/BurnSealToggle';
export type { 
  JournalEntry, 
  JournalVoiceEntry, 
  JournalTextEntry,
  JournalConfig,
  JournalData,
  JournalState 
} from './journalService';
export type { JournalConfig as JournalMachineConfig } from './useJournalMachine';
