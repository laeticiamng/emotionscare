import React, { createContext, useContext, ReactNode } from 'react';

interface MoodContextType {
  // Mood context can be extended here
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const useMood = () => {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
};

interface MoodProviderProps {
  children: ReactNode;
}

export const MoodProvider: React.FC<MoodProviderProps> = ({ children }) => {
  const value = {};

  return (
    <MoodContext.Provider value={value}>
      {children}
    </MoodContext.Provider>
  );
};