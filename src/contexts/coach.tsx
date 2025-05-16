
import { createContext, useState, useContext } from 'react';

export interface CoachContextType {
  isActive: boolean;
  toggleCoach: () => void;
  lastEmotion?: string | null;
  setLastEmotion?: (emotion: string | null) => void;
}

export const CoachContext = createContext<CoachContextType>({
  isActive: false,
  toggleCoach: () => {},
  lastEmotion: null
});

export const useCoach = () => {
  const context = useContext(CoachContext);
  if (context === undefined) {
    throw new Error('useCoach must be used within a CoachProvider');
  }
  return context;
};

export const CoachProvider = ({ children }: { children: React.ReactNode }) => {
  const [isActive, setIsActive] = useState(false);
  const [lastEmotion, setLastEmotion] = useState<string | null>(null);
  
  const toggleCoach = () => {
    setIsActive(prev => !prev);
  };
  
  // Create the value object to be passed to the Provider
  const value: CoachContextType = {
    isActive,
    toggleCoach,
    lastEmotion,
    setLastEmotion
  };
  
  // Return the Provider with the value
  return (
    <CoachContext.Provider value={value}>
      {children}
    </CoachContext.Provider>
  );
};
