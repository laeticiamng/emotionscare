import React, { createContext, useContext, useState } from 'react';

interface ErrorContextType {
  errors: string[];
  addError: (error: string) => void;
  removeError: (error: string) => void;
  clearErrors: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

interface ErrorProviderProps {
  children: React.ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [errors, setErrors] = useState<string[]>([]);

  const addError = (error: string) => {
    setErrors(prev => [...prev, error]);
  };

  const removeError = (error: string) => {
    setErrors(prev => prev.filter(e => e !== error));
  };

  const clearErrors = () => setErrors([]);

  return (
    <ErrorContext.Provider value={{
      errors,
      addError,
      removeError,
      clearErrors,
    }}>
      {children}
    </ErrorContext.Provider>
  );
};