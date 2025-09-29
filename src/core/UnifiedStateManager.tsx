import React, { createContext, useContext } from 'react';

interface UnifiedStateType {
  theme: string;
  user: any;
}

const UnifiedStateContext = createContext<UnifiedStateType>({
  theme: 'light',
  user: null,
});

export const useUnifiedState = () => useContext(UnifiedStateContext);

interface UnifiedProviderProps {
  children: React.ReactNode;
}

export const UnifiedProvider: React.FC<UnifiedProviderProps> = ({ children }) => {
  return (
    <UnifiedStateContext.Provider value={{ theme: 'light', user: null }}>
      {children}
    </UnifiedStateContext.Provider>
  );
};