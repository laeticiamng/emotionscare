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
      const { supabase } = await import('@/integrations/supabase/client');
      const { data: { user } } = await supabase.auth.getUser();

      // Static modules list (always available)
      const modules = [
        { key: 'dashboard', label: 'Dashboard', to: '/dashboard' },
        { key: 'scan', label: 'Scan émotionnel', to: '/scan' },
        { key: 'journal', label: 'Journal', to: '/journal' },
        { key: 'vr-sessions', label: 'VR Sessions', to: '/vr-sessions' },
        { key: 'community', label: 'Communauté', to: '/community/feed' },
        { key: 'music', label: 'Musique & Bien-être', to: '/music-wellbeing' },
        { key: 'coach', label: 'Coach IA', to: '/coach' },
        { key: 'meditation', label: 'Méditation', to: '/meditation' },
        { key: 'breathing', label: 'Respiration', to: '/breathing' },
        { key: 'analytics', label: 'Analytiques', to: '/analytics' },
        { key: 'settings', label: 'Paramètres', to: '/settings' },
        { key: 'help', label: 'Aide', to: '/help' },
      ].filter(module =>
        module.label.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Static KPIs
      const kpis = [
        { key: 'sessions_today', label: 'Sessions aujourd\'hui', to: '/dashboard#sessions' },
        { key: 'emotional_score', label: 'Score émotionnel', to: '/dashboard#emotional' },
        { key: 'wellbeing', label: 'Bien-être général', to: '/dashboard#wellbeing' },
        { key: 'productivity', label: 'Productivité', to: '/dashboard#productivity' },
      ].filter(kpi =>
        kpi.label.toLowerCase().includes(searchQuery.toLowerCase())
      );

      let users: SearchResult[] = [];
      let notifications: SearchResult[] = [];

      if (user) {
        // Search users from profiles table
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('user_id, full_name, avatar_url')
          .ilike('full_name', `%${searchQuery}%`)
          .limit(5);

        users = (profilesData || []).map(p => ({
          id: p.user_id,
          name: p.full_name || 'Utilisateur',
          to: `/users/${p.user_id}`
        }));

        // Search notifications
        const { data: notificationsData } = await supabase
          .from('notifications')
          .select('id, title')
          .eq('user_id', user.id)
          .ilike('title', `%${searchQuery}%`)
          .limit(5);

        notifications = (notificationsData || []).map(n => ({
          id: n.id,
          title: n.title,
          to: `/notifications/${n.id}`
        }));
      }

      setResults({
        users,
        modules,
        kpis,
        notifications
      });
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
