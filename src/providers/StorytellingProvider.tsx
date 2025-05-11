
import React, { createContext, useContext, useState, ReactNode } from 'react';

type StoryType = 'achievement' | 'insight' | 'milestone' | 'feature';
type StoryVoice = 'supportive' | 'motivational' | 'informative' | 'celebratory';

interface StoryCTA {
  text: string;
  action: string | (() => void);
}

interface Story {
  id: string;
  type: StoryType;
  title: string;
  content: string;
  voice: StoryVoice;
  emotion?: string;
  created: Date;
  viewed: boolean;
  cta?: StoryCTA;
  image?: string;
}

interface StorytellingContextType {
  stories: Story[];
  addStory: (story: Omit<Story, 'id' | 'created' | 'viewed'>) => void;
  markStoryAsViewed: (id: string) => void;
  clearStories: () => void;
  getActiveStories: () => Story[];
}

const StorytellingContext = createContext<StorytellingContextType>({
  stories: [],
  addStory: () => {},
  markStoryAsViewed: () => {},
  clearStories: () => {},
  getActiveStories: () => []
});

interface StorytellingProviderProps {
  children: ReactNode;
}

export const StorytellingProvider: React.FC<StorytellingProviderProps> = ({ children }) => {
  const [stories, setStories] = useState<Story[]>([]);

  // Ajouter une nouvelle story
  const addStory = (story: Omit<Story, 'id' | 'created' | 'viewed'>) => {
    const newStory: Story = {
      ...story,
      id: `story-${Date.now()}`,
      created: new Date(),
      viewed: false
    };
    
    setStories(current => [newStory, ...current]);
  };

  // Marquer une story comme vue
  const markStoryAsViewed = (id: string) => {
    setStories(current =>
      current.map(story =>
        story.id === id ? { ...story, viewed: true } : story
      )
    );
  };

  // Effacer toutes les stories
  const clearStories = () => {
    setStories([]);
  };

  // Obtenir les stories actives (non vues)
  const getActiveStories = () => {
    return stories.filter(story => !story.viewed);
  };

  return (
    <StorytellingContext.Provider
      value={{
        stories,
        addStory,
        markStoryAsViewed,
        clearStories,
        getActiveStories
      }}
    >
      {children}
    </StorytellingContext.Provider>
  );
};

export const useStorytelling = () => useContext(StorytellingContext);
