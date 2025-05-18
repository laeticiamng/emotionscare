import React, { createContext, useContext, useState } from 'react';

export interface MoodEvent {
  id: string;
  timestamp: string;
  mood: string;
  source: string;
}

interface OrchestrationContextType {
  events: MoodEvent[];
  addEvent: (event: MoodEvent) => void;
}

const OrchestrationContext = createContext<OrchestrationContextType | undefined>(undefined);

export const OrchestrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<MoodEvent[]>([]);

  const addEvent = (event: MoodEvent) => {
    setEvents(prev => [...prev, event]);
  };

  return (
    <OrchestrationContext.Provider value={{ events, addEvent }}>
      {children}
    </OrchestrationContext.Provider>
  );
};

export const useOrchestration = () => {
  const context = useContext(OrchestrationContext);
  if (!context) {
    throw new Error('useOrchestration must be used within an OrchestrationProvider');
  }
  return context;
};
