// @ts-nocheck

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '@/hooks/useDebounce';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

export interface SearchResult {
  id?: string | number;
  key?: string;
  name?: string;
  label?: string;
  title?: string;
  to: string;
  icon?: React.ReactNode;
}

export interface SearchResults {
  users: SearchResult[];
  modules: SearchResult[];
  kpis: SearchResult[];
  notifications: SearchResult[];
}

export const sectionLabels: Record<keyof SearchResults, string> = {
  users: 'Utilisateurs',
  modules: 'Modules',
  kpis: 'Indicateurs',
  notifications: 'Notifications',
};

export function useGlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const debouncedQuery = useDebounce(query, 300);
  
  const fetchResults = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults(null);
      return;
    }

    setIsLoading(true);
    
    try {
      // In a real app, this would be a call to your backend API
      // For now, we'll simulate results with mock data
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
      
      // Mock data for demonstration purposes
      const mockResults: SearchResults = {
        users: [
          { id: 1, name: 'Sophie Martin', to: '/users/1', },
          { id: 2, name: 'Thomas Dubois', to: '/users/2', },
          { id: 3, name: 'Julie Bernard', to: '/users/3', },
        ].filter(user => 
          user.name.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        
        modules: [
          { key: 'dashboard', label: 'Dashboard', to: '/dashboard' },
          { key: 'scan', label: 'Scan émotionnel', to: '/scan' },
          { key: 'journal', label: 'Journal', to: '/journal' },
          { key: 'vr-sessions', label: 'VR Sessions', to: '/vr-sessions' },
          { key: 'community', label: 'Communauté', to: '/community/feed' },
          { key: 'music', label: 'Musique & Bien-être', to: '/music-wellbeing' },
          { key: 'coach', label: 'Coach IA', to: '/coach' },
        ].filter(module => 
          module.label.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        
        kpis: [
          { key: 'sessions_today', label: 'Sessions aujourd\'hui', to: '/dashboard#sessions' },
          { key: 'emotional_score', label: 'Score émotionnel', to: '/dashboard#emotional' },
          { key: 'wellbeing', label: 'Bien-être général', to: '/dashboard#wellbeing' },
          { key: 'productivity', label: 'Productivité', to: '/dashboard#productivity' },
        ].filter(kpi => 
          kpi.label.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        
        notifications: [
          { id: 1, title: 'Nouvelle analyse disponible', to: '/notifications/1' },
          { id: 2, title: 'Rappel: Session VR planifiée', to: '/notifications/2' },
          { id: 3, title: 'Alerte bien-être', to: '/notifications/3' },
        ].filter(notification => 
          notification.title.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      };
      
      setResults(mockResults);
    } catch (error) {
      logger.error('Error fetching search results', error as Error, 'UI');
      toast({
        title: 'Erreur de recherche',
        description: 'Impossible de charger les résultats. Veuillez réessayer.',
        variant: 'destructive',
      });
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  // Effect to fetch results when debounced query changes
  useEffect(() => {
    if (debouncedQuery) {
      fetchResults(debouncedQuery);
    } else {
      setResults(null);
    }
  }, [debouncedQuery, fetchResults]);
  
  // Effect to add keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);
  
  // Navigate to the selected result and close the search
  const handleSelect = useCallback((to: string) => {
    navigate(to);
    setIsOpen(false);
    setQuery('');
  }, [navigate]);
  
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setQuery('');
  }, []);
  
  return {
    isOpen,
    setIsOpen,
    query,
    setQuery,
    results,
    isLoading,
    handleSelect,
    handleClose,
  };
}
