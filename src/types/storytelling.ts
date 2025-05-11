// Change import to avoid conflict with local declaration
import { User } from './user';
// Rename the imported Story to avoid conflict
import { Story as ImportedStory } from './story';

// Local declaration
export interface Story {
  id: string;
  title: string;
  content: string;
  // other fields...
}

// Re-export the imported Story with a different name
export { ImportedStory };
