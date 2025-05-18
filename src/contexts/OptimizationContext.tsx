import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import {
  OptimizationEvent,
  OptimizationSuggestion,
  logEvent,
  generateOptimizationSuggestions
} from '@/services/optimizationService';

interface OptimizationContextType {
  suggestions: OptimizationSuggestion[];
  isLoading: boolean;
  error: string | null;
  logEvent: (event: OptimizationEvent) => Promise<void>;
  generateSuggestions: () => Promise<void>;
}

const OptimizationContext = createContext<OptimizationContextType | undefined>(undefined);

export const OptimizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogEvent = async (event: OptimizationEvent) => {
    try {
      await logEvent(event);
    } catch (e) {
      console.error('Failed to log event', e);
    }
  };

  const generateSuggestions = async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateOptimizationSuggestions(user.id);
      setSuggestions(result);
    } catch (e) {
      console.error('Failed to generate suggestions', e);
      setError('Erreur lors de la génération des suggestions');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OptimizationContext.Provider
      value={{ suggestions, isLoading, error, logEvent: handleLogEvent, generateSuggestions }}
    >
      {children}
    </OptimizationContext.Provider>
  );
};

export const useOptimization = () => {
  const ctx = useContext(OptimizationContext);
  if (!ctx) throw new Error('useOptimization must be used within an OptimizationProvider');
  return ctx;
};
