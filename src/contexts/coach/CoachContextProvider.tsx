
import React, { createContext, useContext, useState } from 'react';

interface CoachContextType {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  coachData: any;
}

const CoachContext = createContext<CoachContextType>({
  loading: false,
  setLoading: () => {},
  coachData: null,
});

export const CoachContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [coachData, setCoachData] = useState(null);

  return (
    <CoachContext.Provider value={{ loading, setLoading, coachData }}>
      {children}
    </CoachContext.Provider>
  );
};

export const useCoach = () => useContext(CoachContext);
