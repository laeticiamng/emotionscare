
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Story } from '@/types';

interface StorytellingContextType {
  activeStory: Story | null;
  storyQueue: Story[];
  setActiveStory: (story: Story | null) => void;
  addStory: (story: Story) => void;
  addStories: (stories: Story[]) => void;
  dismissStory: (id: string) => void;
  resetStories: () => void;
  markStorySeen: (id: string) => void;
}

const StorytellingContext = createContext<StorytellingContextType>({
  activeStory: null,
  storyQueue: [],
  setActiveStory: () => {},
  addStory: () => {},
  addStories: () => {},
  dismissStory: () => {},
  resetStories: () => {},
  markStorySeen: () => {}
});

export const StorytellingProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [storyQueue, setStoryQueue] = useState<Story[]>([]);
  
  // Load stories from local storage on mount
  useEffect(() => {
    const savedStories = localStorage.getItem('storytelling_queue');
    if (savedStories) {
      try {
        const parsedStories = JSON.parse(savedStories);
        setStoryQueue(parsedStories);
      } catch (error) {
        console.error('Error loading saved stories:', error);
      }
    }
  }, []);
  
  // Save stories to local storage when queue changes
  useEffect(() => {
    localStorage.setItem('storytelling_queue', JSON.stringify(storyQueue));
  }, [storyQueue]);

  const addStory = (story: Story) => {
    // Don't add duplicate stories
    if (storyQueue.some(s => s.id === story.id)) {
      return;
    }
    
    // Add seen property if it doesn't exist
    const storyWithSeen = {
      ...story,
      seen: story.seen !== undefined ? story.seen : false
    };
    
    setStoryQueue(prev => [...prev, storyWithSeen]);
  };

  const addStories = (stories: Story[]) => {
    // Filter out duplicates
    const newStories = stories.filter(
      story => !storyQueue.some(s => s.id === story.id)
    );
    
    // Add seen property to each story
    const storiesWithSeen = newStories.map(story => ({
      ...story,
      seen: story.seen !== undefined ? story.seen : false
    }));
    
    setStoryQueue(prev => [...prev, ...storiesWithSeen]);
  };

  const dismissStory = (id: string) => {
    setStoryQueue(prev => prev.filter(story => story.id !== id));
    if (activeStory && activeStory.id === id) {
      setActiveStory(null);
    }
  };

  const resetStories = () => {
    setStoryQueue([]);
    setActiveStory(null);
  };

  const markStorySeen = (id: string) => {
    setStoryQueue(prev => 
      prev.map(story => 
        story.id === id ? { ...story, seen: true } : story
      )
    );
  };

  return (
    <StorytellingContext.Provider 
      value={{
        activeStory,
        storyQueue,
        setActiveStory,
        addStory,
        addStories,
        dismissStory,
        resetStories,
        markStorySeen
      }}
    >
      {children}
    </StorytellingContext.Provider>
  );
};

export const useStorytelling = () => useContext(StorytellingContext);
