// @ts-nocheck

import React, { createContext, useContext, ReactNode, useState } from 'react';

interface PerformanceContextType {
  isSlowDevice: boolean;
  shouldReduceAnimations: boolean;
  shouldLazyLoad: boolean;
  connectionType: string;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
};

interface PerformanceProviderProps {
  children: ReactNode;
}

export const PerformanceProvider: React.FC<PerformanceProviderProps> = ({ children }) => {
  const [performanceSettings] = useState<PerformanceContextType>({
    isSlowDevice: false,
    shouldReduceAnimations: false,
    shouldLazyLoad: true,
    connectionType: 'unknown'
  });

  return (
    <PerformanceContext.Provider value={performanceSettings}>
      {children}
    </PerformanceContext.Provider>
  );
};
