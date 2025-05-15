
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Story } from '@/types';

interface StorytellingContextType {
  storyQueue: Story[];
  addStory: (story: Story) => void;
  removeStory: (storyId: string) => void;
  markStorySeen: (storyId: string) => void;
  clearStories: () => void;
}

const StorytellingContext = createContext<StorytellingContextType>({
  storyQueue: [],
  addStory: () => {},
  removeStory: () => {},
  markStorySeen: () => {},
  clearStories: () => {},
});

export const useStorytelling = () => useContext(StorytellingContext);

export const StorytellingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storyQueue, setStoryQueue] = useState<Story[]>([]);

  const addStory = useCallback((story: Story) => {
    setStoryQueue(prevStories => {
      // Don't add duplicate stories with the same ID
      if (prevStories.some(s => s.id === story.id)) {
        return prevStories;
      }
      return [...prevStories, story];
    });
  }, []);

  const removeStory = useCallback((storyId: string) => {
    setStoryQueue(prevStories => prevStories.filter(story => story.id !== storyId));
  }, []);

  const markStorySeen = useCallback((storyId: string) => {
    setStoryQueue(prevStories => 
      prevStories.map(story => 
        story.id === storyId ? { ...story, seen: true } : story
      )
    );
  }, []);

  const clearStories = useCallback(() => {
    setStoryQueue([]);
  }, []);

  return (
    <StorytellingContext.Provider value={{
      storyQueue,
      addStory,
      removeStory,
      markStorySeen,
      clearStories,
    }}>
      {children}
    </StorytellingContext.Provider>
  );
};
