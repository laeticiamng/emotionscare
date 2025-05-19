
// Réexportation des éléments du contexte coach
import { CoachContext, CoachProvider } from './CoachContext';
export { CoachContext, CoachProvider };

// This needs to be exported from CoachContext directly
// Import and re-export the type here
export type { CoachContextType } from './types';
