
import React, { createContext, useContext, useState } from 'react';
import { Story } from '@/types';

interface StorytellingContextType {
  stories: Story[];
  activeStory: Story | null;
  showStory: (storyId: string) => void;
  dismissStory: (storyId: string) => void;
}

const defaultStories: Story[] = [
  {
    id: '1',
    title: 'Bienvenue sur notre plateforme',
    content: 'Découvrez comment nous pouvons vous aider à améliorer votre bien-être émotionnel.',
    type: 'onboarding',
    seen: false
  },
  {
    id: '2',
    title: 'Nouvelle fonctionnalité: Scan émotionnel',
    content: 'Utilisez notre nouvelle fonctionnalité pour scanner et analyser vos émotions.',
    type: 'feature',
    seen: false
  }
];

const StorytellingContext = createContext<StorytellingContextType>({
  stories: [],
  activeStory: null,
  showStory: () => {},
  dismissStory: () => {}
});

export const StorytellingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stories, setStories] = useState<Story[]>(defaultStories);
  const [activeStory, setActiveStory] = useState<Story | null>(null);

  const showStory = (storyId: string) => {
    const story = stories.find(s => s.id === storyId);
    if (story) {
      setActiveStory(story);
    }
  };

  const dismissStory = (storyId: string) => {
    setStories(prevStories => 
      prevStories.map(story => 
        story.id === storyId ? { ...story, seen: true } : story
      )
    );
    setActiveStory(null);
  };

  return (
    <StorytellingContext.Provider value={{ stories, activeStory, showStory, dismissStory }}>
      {children}
    </StorytellingContext.Provider>
  );
};

export const useStorytelling = () => useContext(StorytellingContext);
