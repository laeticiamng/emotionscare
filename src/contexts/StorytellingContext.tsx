import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Story } from '@/types/types';

interface StorytellingContextType {
  storyQueue: Story[];
  addStory: (story: Story) => void;
  markStorySeen: (storyId: string) => void;
  clearStories: () => void;
}

const StorytellingContext = createContext<StorytellingContextType>({
  storyQueue: [],
  addStory: () => {},
  markStorySeen: () => {},
  clearStories: () => {}
});

export const StorytellingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storyQueue, setStoryQueue] = useState<Story[]>([]);

  const addStory = (story: Story) => {
    setStoryQueue(prev => [...prev, story]);
  };

  const markStorySeen = (storyId: string) => {
    setStoryQueue(prev => 
      prev.map(story => 
        story.id === storyId ? { ...story, seen: true } : story
      )
    );
  };

  const clearStories = () => {
    setStoryQueue([]);
  };

  return (
    <StorytellingContext.Provider value={{
      storyQueue,
      addStory,
      markStorySeen,
      clearStories
    }}>
      {children}
    </StorytellingContext.Provider>
  );
};

export const useStorytelling = () => useContext(StorytellingContext);
