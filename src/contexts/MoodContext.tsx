import React, { createContext, useContext, useState } from 'react';

interface MoodContextType {
  currentMood: string | null;
  setMood: (mood: string) => void;
  moodHistory: any[];
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const useMood = () => {
  const context = useContext(MoodContext);
  if (!context) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
};

interface MoodProviderProps {
  children: React.ReactNode;
}

export const MoodProvider: React.FC<MoodProviderProps> = ({ children }) => {
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [moodHistory, setMoodHistory] = useState<any[]>([]);

  const setMood = (mood: string) => {
    setCurrentMood(mood);
    setMoodHistory(prev => [...prev, { mood, timestamp: new Date() }]);
  };

  return (
    <MoodContext.Provider value={{ currentMood, setMood, moodHistory }}>
      {children}
    </MoodContext.Provider>
  );
};