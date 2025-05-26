
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface OptimizationData {
  performanceScore: number;
  suggestions: string[];
  lastUpdated: Date;
}

interface OptimizationContextType {
  optimizationData: OptimizationData | null;
  updateOptimization: (data: OptimizationData) => void;
  isOptimizing: boolean;
}

const OptimizationContext = createContext<OptimizationContextType | undefined>(undefined);

interface OptimizationProviderProps {
  children: ReactNode;
}

export const OptimizationProvider: React.FC<OptimizationProviderProps> = ({ children }) => {
  const [optimizationData, setOptimizationData] = useState<OptimizationData | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const updateOptimization = (data: OptimizationData) => {
    setIsOptimizing(true);
    // Simuler un processus d'optimisation
    setTimeout(() => {
      setOptimizationData(data);
      setIsOptimizing(false);
    }, 1000);
  };

  const value: OptimizationContextType = {
    optimizationData,
    updateOptimization,
    isOptimizing,
  };

  return (
    <OptimizationContext.Provider value={value}>
      {children}
    </OptimizationContext.Provider>
  );
};

export const useOptimization = () => {
  const context = useContext(OptimizationContext);
  if (context === undefined) {
    throw new Error('useOptimization must be used within an OptimizationProvider');
  }
  return context;
};
