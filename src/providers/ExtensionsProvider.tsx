
import React, { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ExtensionMeta } from '@/types/extensions';
import { useToast } from '@/hooks/use-toast';

interface ExtensionsContextType {
  available: ExtensionMeta[];
  installed: string[];
  toggleExtension: (id: string) => void;
  isInstalled: (id: string) => boolean;
}

const defaultExtensions: ExtensionMeta[] = [
  {
    id: 'mood-widget',
    name: 'Widget Humeur',
    description: "Suivi rapide de votre humeur du jour",
    version: "1.2.0",
    author: "EmotionsCare Team",
    category: "Bien-être",
    tags: ["Humeur", "Tracker", "Journal"],
    isNew: true,
    rating: 4.8,
    usageCount: 1234
  },
  {
    id: 'team-dashboard',
    name: 'Dashboard Équipe',
    description: "Vue consolidée pour les managers",
    version: "2.0.5",
    author: "EmotionsCare Team",
    category: "Entreprise",
    tags: ["Équipe", "Analytics", "Management"],
    rating: 4.2,
    usageCount: 568
  },
  {
    id: 'music-relaxation',
    name: 'Relaxation Musicale',
    description: "Sons et musiques pour la détente et la méditation",
    version: "1.0.2",
    author: "Wellness Audio",
    category: "Bien-être",
    tags: ["Audio", "Méditation", "Relaxation"],
    isNew: true,
    rating: 4.9,
    usageCount: 892
  },
  {
    id: 'ai-insights',
    name: 'Insights IA',
    description: "Analyses avancées de vos données émotionnelles par IA",
    version: "0.5.1",
    author: "EmotionsCare Lab",
    category: "Analytics",
    tags: ["IA", "Prédiction", "Analyse"],
    isBeta: true,
    isEarlyAccess: true,
    rating: 4.1,
    usageCount: 156
  },
  {
    id: 'social-connect',
    name: 'Connexion Sociale',
    description: "Partagez et connectez-vous avec votre cercle de soutien",
    version: "1.3.4",
    author: "Community Tools",
    category: "Social",
    tags: ["Partage", "Communauté", "Support"],
    rating: 4.5,
    usageCount: 723
  },
  {
    id: 'goal-tracker',
    name: 'Suivi d\'Objectifs',
    description: "Définissez et suivez vos objectifs de bien-être",
    version: "2.1.0",
    author: "EmotionsCare Team",
    category: "Productivité",
    tags: ["Objectifs", "Suivi", "Progrès"],
    isNew: true,
    rating: 4.7,
    usageCount: 1057
  },
  {
    id: 'sleep-analytics',
    name: 'Analyse du Sommeil',
    description: "Suivez et améliorez votre qualité de sommeil",
    version: "1.2.3",
    author: "Health Metrics",
    category: "Santé",
    tags: ["Sommeil", "Analyse", "Bien-être"],
    rating: 4.6,
    usageCount: 845
  }
];

const ExtensionsContext = createContext<ExtensionsContextType | undefined>(undefined);

export const ExtensionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [installed, setInstalled] = useLocalStorage<string[]>('installedExtensions', ['mood-widget']);
  const { toast } = useToast();

  useEffect(() => {
    // Show a notification for new extensions
    const newExtensions = defaultExtensions.filter(ext => ext.isNew);
    if (newExtensions.length > 0) {
      setTimeout(() => {
        toast({
          title: `${newExtensions.length} nouvelles extensions disponibles`,
          description: "Découvrez les dernières innovations EmotionsCare",
          variant: "info",
        });
      }, 3000);
    }
  }, [toast]);

  const toggleExtension = (id: string) => {
    setInstalled((current) => {
      if (current.includes(id)) {
        return current.filter((ext) => ext !== id);
      }
      return [...current, id];
    });
  };

  const isInstalled = (id: string): boolean => {
    return installed.includes(id);
  };

  return (
    <ExtensionsContext.Provider value={{ 
      available: defaultExtensions, 
      installed, 
      toggleExtension,
      isInstalled 
    }}>
      {children}
    </ExtensionsContext.Provider>
  );
};

export const useExtensions = () => {
  const ctx = useContext(ExtensionsContext);
  if (!ctx) throw new Error('useExtensions must be used within an ExtensionsProvider');
  return ctx;
};
