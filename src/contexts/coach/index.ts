
// Re-export the elements from the coach context
import { CoachContext, CoachProvider } from './CoachContext';
export { CoachContext, CoachProvider };

// Export the CoachContextType properly with 'export type'
export type { CoachContextType } from './types';

// Don't use star export for this file as it may contain default exports
// export * from './CoachContext';
