
import { Story } from '@/types';

export interface StorytellingContextType {
  stories: Story[];
  activeStory: Story | null;
  isLoading: boolean;
  
  // Add missing properties
  storyQueue: Story[];
  addStory: (story: Story) => void;
  markStorySeen: (storyId: string) => void;
  playFunctionalSound?: (soundType: string) => void;
}
