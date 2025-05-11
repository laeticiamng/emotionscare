
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Story {
  id: string;
  title: string;
  content: string;
  cta?: {
    text: string;
    route: string;
  };
  seen?: boolean;
}

interface StorytellingContextType {
  activeStory: Story | null;
  setActiveStory: (story: Story | null) => void;
  stories: Story[];
  showStory: (storyId: string) => void;
}

const StorytellingContext = createContext<StorytellingContextType>({
  activeStory: null,
  setActiveStory: () => {},
  stories: [],
  showStory: () => {}
});

interface StorytellingProviderProps {
  children: ReactNode;
}

export const StorytellingProvider: React.FC<StorytellingProviderProps> = ({ children }) => {
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [stories, setStories] = useState<Story[]>([
    {
      id: '1',
      title: 'Bienvenue sur EmotionsCare',
      content: 'Découvrez comment notre application peut vous aider à gérer vos émotions.',
      cta: {
        text: 'En savoir plus',
        route: '/about'
      },
      seen: false
    },
    {
      id: '2',
      title: 'Nouvelle fonctionnalité : Journal émotionnel',
      content: 'Enregistrez vos émotions quotidiennes pour mieux comprendre vos tendances.',
      cta: {
        text: 'Essayer maintenant',
        route: '/journal'
      },
      seen: false
    }
  ]);

  const showStory = (storyId: string) => {
    const story = stories.find(s => s.id === storyId);
    if (story) {
      setActiveStory(story);
      
      // Mark the story as seen
      setStories(prevStories => 
        prevStories.map(s => 
          s.id === storyId ? { ...s, seen: true } : s
        )
      );
    }
  };

  return (
    <StorytellingContext.Provider
      value={{
        activeStory,
        setActiveStory,
        stories,
        showStory
      }}
    >
      {children}
    </StorytellingContext.Provider>
  );
};

export const useStorytelling = () => useContext(StorytellingContext);
