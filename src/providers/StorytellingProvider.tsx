
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Story {
  id: string;
  title: string;
  content: string;
  emotion?: string;
  imageUrl?: string;
}

interface StorytellingContextType {
  activeStory: Story | null;
  stories: Story[];
  showStory: (storyId: string) => void;
  hideStory: () => void;
  addStory: (story: Story) => void;
}

const StorytellingContext = createContext<StorytellingContextType>({
  activeStory: null,
  stories: [],
  showStory: () => {},
  hideStory: () => {},
  addStory: () => {}
});

interface StorytellingProviderProps {
  children: ReactNode;
}

export const StorytellingProvider: React.FC<StorytellingProviderProps> = ({ children }) => {
  const [stories, setStories] = useState<Story[]>([
    {
      id: 'welcome',
      title: 'Bienvenue à EmotionsCare',
      content: 'Découvrez comment gérer vos émotions et améliorer votre bien-être émotionnel.',
      emotion: 'joy',
      imageUrl: '/images/welcome.jpg'
    },
    {
      id: 'mindfulness',
      title: 'Pratique de la pleine conscience',
      content: 'Apprenez à être présent dans le moment et à observer vos émotions sans jugement.',
      emotion: 'calm',
      imageUrl: '/images/mindfulness.jpg'
    }
  ]);
  const [activeStory, setActiveStory] = useState<Story | null>(null);

  const showStory = (storyId: string) => {
    const story = stories.find(s => s.id === storyId);
    if (story) {
      setActiveStory(story);
    }
  };

  const hideStory = () => {
    setActiveStory(null);
  };

  const addStory = (story: Story) => {
    setStories(prev => [...prev, story]);
  };

  return (
    <StorytellingContext.Provider
      value={{
        activeStory,
        stories,
        showStory,
        hideStory,
        addStory
      }}
    >
      {children}
    </StorytellingContext.Provider>
  );
};

export const useStorytelling = () => useContext(StorytellingContext);
