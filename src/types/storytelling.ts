
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

export interface Story {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  seen: boolean;
  category: string;
  createdAt: Date | string;
  action?: {
    label: string;
    route: string;
    text?: string;
  };
  emotion?: string;
}
