
import React, { createContext, useContext, useState } from 'react';
import { Story } from '@/types';

interface StorytellingContextType {
  stories: Story[];
  activeStory: Story | null;
  showStory: (storyId: string) => void;
  dismissStory: (storyId: string) => void;
  storyQueue: Story[]; // Add storyQueue property
  addStory: (story: Partial<Story> | any) => void; // Add addStory method
  markStorySeen: (storyId: string) => void; // Add markStorySeen method
}

const defaultStories: Story[] = [
  {
    id: '1',
    title: 'Bienvenue sur notre plateforme',
    content: 'Découvrez comment nous pouvons vous aider à améliorer votre bien-être émotionnel.',
    type: 'onboarding',
    seen: false,
    emotion: 'neutral' // Use emotion property correctly
  },
  {
    id: '2',
    title: 'Nouvelle fonctionnalité: Scan émotionnel',
    content: 'Utilisez notre nouvelle fonctionnalité pour scanner et analyser vos émotions.',
    type: 'feature',
    seen: false,
    emotion: 'neutral' // Use emotion property correctly
  }
];

const StorytellingContext = createContext<StorytellingContextType>({
  stories: [],
  activeStory: null,
  showStory: () => {},
  dismissStory: () => {},
  storyQueue: [],
  addStory: () => {},
  markStorySeen: () => {}
});

export const StorytellingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stories, setStories] = useState<Story[]>(defaultStories);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [storyQueue, setStoryQueue] = useState<Story[]>([]);

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
  
  const addStory = (storyData: Partial<Story> | any) => {
    const newStory: Story = {
      id: `story-${Date.now()}`,
      title: storyData.title || 'New Story',
      content: storyData.content || '',
      type: storyData.type || 'general',
      seen: false,
      emotion: storyData.emotion || 'neutral',
      image: storyData.image,
      cta: storyData.cta ? {
        label: storyData.cta.label || 'View',
        route: storyData.cta.route || '/',
        text: storyData.cta.text || 'View',
        action: storyData.cta.action || '/'
      } : undefined
    };
    
    setStories(prev => [...prev, newStory]);
    setStoryQueue(prev => [...prev, newStory]);
  };
  
  const markStorySeen = (storyId: string) => {
    setStories(prevStories => 
      prevStories.map(story => 
        story.id === storyId ? { ...story, seen: true } : story
      )
    );
  };

  return (
    <StorytellingContext.Provider value={{ 
      stories, 
      activeStory, 
      showStory, 
      dismissStory,
      storyQueue,
      addStory,
      markStorySeen
    }}>
      {children}
    </StorytellingContext.Provider>
  );
};

export const useStorytelling = () => useContext(StorytellingContext);
