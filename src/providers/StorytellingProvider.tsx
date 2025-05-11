
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Story {
  id: string;
  title: string;
  content: string;
  cta?: {
    text: string;
    route: string;
  };
}

interface StorytellingContextType {
  activeStory: Story | null;
  setActiveStory: (story: Story | null) => void;
}

const StorytellingContext = createContext<StorytellingContextType>({
  activeStory: null,
  setActiveStory: () => {}
});

interface StorytellingProviderProps {
  children: ReactNode;
}

export const StorytellingProvider: React.FC<StorytellingProviderProps> = ({ children }) => {
  const [activeStory, setActiveStory] = useState<Story | null>(null);

  return (
    <StorytellingContext.Provider
      value={{
        activeStory,
        setActiveStory
      }}
    >
      {children}
    </StorytellingContext.Provider>
  );
};

export const useStorytelling = () => useContext(StorytellingContext);
