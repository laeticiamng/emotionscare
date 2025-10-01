// @ts-nocheck
import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ExtensionMeta } from '@/types/extensions';

interface ExtensionsContextType {
  available: ExtensionMeta[];
  installed: string[];
  toggleExtension: (id: string) => void;
}

const defaultExtensions: ExtensionMeta[] = [
  {
    id: 'mood-widget',
    name: 'Widget Humeur',
    description: "Suivi rapide de votre humeur du jour"
  },
  {
    id: 'team-dashboard',
    name: 'Dashboard Équipe',
    description: "Vue consolidée pour les managers"
  }
];

const ExtensionsContext = createContext<ExtensionsContextType | undefined>(undefined);

export const ExtensionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [installed, setInstalled] = useLocalStorage<string[]>('installedExtensions', []);

  const toggleExtension = (id: string) => {
    setInstalled((current) => {
      if (current.includes(id)) {
        return current.filter((ext) => ext !== id);
      }
      return [...current, id];
    });
  };

  return (
    <ExtensionsContext.Provider value={{ available: defaultExtensions, installed, toggleExtension }}>
      {children}
    </ExtensionsContext.Provider>
  );
};

export const useExtensions = () => {
  const ctx = useContext(ExtensionsContext);
  if (!ctx) throw new Error('useExtensions must be used within an ExtensionsProvider');
  return ctx;
};
