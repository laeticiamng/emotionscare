
import { createContext } from 'react';

export interface CoachContextType {
  isActive: boolean;
  toggleCoach: () => void;
  lastEmotion?: string | null;
  setLastEmotion?: (emotion: string | null) => void;
  // Add other coach-related properties and functions
}

export const CoachContext = createContext<CoachContextType>({
  isActive: false,
  toggleCoach: () => {},
  lastEmotion: null
});

export const CoachProvider = ({ children }: { children: React.ReactNode }) => {
  // Implementation will be in a separate file
  return null;
};
