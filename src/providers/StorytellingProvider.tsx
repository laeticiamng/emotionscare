
import React, { createContext, useContext, useState } from 'react';
import { Story } from '@/types';

interface StorytellingContextType {
  activeStory: Story | null;
  setActiveStory: (story: Story | null) => void;
  stories: Story[];
  hasUnreadStories: boolean;
  markStoryAsSeen: (storyId: string) => void;
  loadStories: () => void;
}

const StorytellingContext = createContext<StorytellingContextType>({
  activeStory: null,
  setActiveStory: () => {},
  stories: [],
  hasUnreadStories: false,
  markStoryAsSeen: () => {},
  loadStories: () => {}
});

export const StorytellingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  
  // Check if we have any unread stories
  const hasUnreadStories = stories.some(story => !story.seen);
  
  // Mark a story as seen
  const markStoryAsSeen = (storyId: string) => {
    setStories(prev => 
      prev.map(story => 
        story.id === storyId ? { ...story, seen: true } : story
      )
    );
  };
  
  // Load stories from API (mock implementation)
  const loadStories = () => {
    // Mock data
    setStories([
      {
        id: '1',
        title: 'Découvrez la nouvelle fonctionnalité de méditation',
        content: 'Notre nouvelle fonctionnalité de méditation guidée est maintenant disponible...',
        type: 'feature',
        seen: false,
        image: '/images/meditation.jpg',
        cta: {
          label: 'Essayer maintenant',
          route: '/meditation'
        }
      },
      {
        id: '2',
        title: 'Votre rapport hebdomadaire',
        content: 'Voici votre résumé des activités de la semaine...',
        type: 'report',
        seen: true,
        cta: {
          label: 'Voir le rapport',
          route: '/report'
        }
      }
    ]);
  };
  
  return (
    <StorytellingContext.Provider value={{
      activeStory,
      setActiveStory,
      stories,
      hasUnreadStories,
      markStoryAsSeen,
      loadStories
    }}>
      {children}
    </StorytellingContext.Provider>
  );
};

export const useStorytelling = () => useContext(StorytellingContext);
