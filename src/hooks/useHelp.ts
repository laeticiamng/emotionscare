// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { useHelpStore, type Section, type ArticleSummary, type Article, type Feedback } from '@/store/help.store';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

export const useHelp = () => {
  const {
    sections,
    articles,
    currentArticle,
    searchResults,
    searchQuery,
    loading,
    error,
    setSections,
    setArticles,
    setCurrentArticle,
    setSearchResults,
    setSearchQuery,
    setLoading,
    setError
  } = useHelpStore();

  const [initialized, setInitialized] = useState(false);

  // Load sections
  const loadSections = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/help/sections');
      
      if (!response.ok) {
        throw new Error('Failed to load help sections');
      }

      const data = await response.json();
      setSections(data.sections || []);
      
    } catch (error: any) {
      logger.error('Load sections failed', error as Error, 'SYSTEM');
      setError(error.message);
      
      // Fallback data for offline/error scenarios
      setSections([
        { id: '1', name: 'Modules', slug: 'modules', icon: '🧩' },
        { id: '2', name: 'Compte', slug: 'account', icon: '👤' },
        { id: '3', name: 'RGPD', slug: 'rgpd', icon: '🔒' },
        { id: '4', name: 'Technique', slug: 'technical', icon: '⚙️' }
      ]);
    } finally {
      setLoading(false);
    }
  }, [setSections, setLoading, setError]);

  // Load articles for a section
  const loadArticles = useCallback(async (sectionId: string, limit = 10) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/help/articles?section=${sectionId}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error('Failed to load articles');
      }

      const data = await response.json();
      setArticles(data.articles || []);
      
    } catch (error: any) {
      logger.error('Load articles failed', error as Error, 'SYSTEM');
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [setArticles, setLoading, setError]);

  // Load a specific article
  const loadArticle = useCallback(async (slug: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/help/article/${slug}`);
      
      if (!response.ok) {
        throw new Error('Failed to load article');
      }

      const data = await response.json();
      setCurrentArticle(data.article);

      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'help.article.view', {
          slug: slug
        });
      }
      
    } catch (error: any) {
      logger.error('Load article failed', error as Error, 'SYSTEM');
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [setCurrentArticle, setLoading, setError]);

  // Search articles
  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchQuery('');
      return;
    }

    setSearchQuery(query);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/help/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setSearchResults(data.results || []);

      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'help.search', {
          q_len: query.length
        });
      }
      
    } catch (error: any) {
      logger.error('Search failed', error as Error, 'SYSTEM');
      setError(error.message);
      
      // Fallback: show empty results rather than crash
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [setSearchQuery, setSearchResults, setLoading, setError]);

  // Send feedback
  const sendFeedback = useCallback(async (feedback: Feedback) => {
    try {
      const response = await fetch('/api/help/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback)
      });

      if (!response.ok) {
        throw new Error('Failed to send feedback');
      }

      toast({
        title: "Merci pour votre retour !",
        description: "Votre avis nous aide à améliorer l'aide.",
      });

      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'help.feedback', {
          helpful: feedback.helpful
        });
      }

      return true;

    } catch (error: any) {
      logger.error('Send feedback failed', error as Error, 'SYSTEM');
      
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer votre retour.",
        variant: "destructive"
      });
      
      return false;
    }
  }, []);

  // Get top FAQs (mock data for now)
  const getTopFaqs = useCallback(() => {
    return [
      {
        id: 'faq-1',
        question: 'Comment exporter mes données ?',
        answer: 'Rendez-vous dans Paramètres > Confidentialité > Exporter mes données. Un fichier ZIP vous sera envoyé par e-mail.',
        slug: 'export-donnees'
      },
      {
        id: 'faq-2',
        question: 'Mes données sont-elles sécurisées ?',
        answer: 'Oui, toutes vos données sont chiffrées et stockées conformément au RGPD. Nous ne partageons jamais vos informations personnelles.',
        slug: 'securite-donnees'
      },
      {
        id: 'faq-3',
        question: 'Comment supprimer mon compte ?',
        answer: 'Dans Paramètres > Compte, vous pouvez programmer la suppression. Un délai de 30 jours vous permet d\'annuler si vous changez d\'avis.',
        slug: 'supprimer-compte'
      },
      {
        id: 'faq-4',
        question: 'Les modules VR nécessitent-ils un casque ?',
        answer: 'Non ! Nos expériences VR fonctionnent parfaitement sur ordinateur et mobile, avec des modes d\'immersion adaptés.',
        slug: 'vr-sans-casque'
      },
      {
        id: 'faq-5',
        question: 'Comment activer les notifications ?',
        answer: 'Dans Paramètres > Notifications, activez les rappels. Vous pouvez choisir les créneaux et types de notifications.',
        slug: 'activer-notifications'
      }
    ];
  }, []);

  // Initialize
  useEffect(() => {
    if (!initialized) {
      loadSections();
      setInitialized(true);
    }
  }, [initialized, loadSections]);

  // Analytics for help home view
  useEffect(() => {
    if (initialized && typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'help.view_home');
    }
  }, [initialized]);

  return {
    sections,
    articles,
    currentArticle,
    searchResults,
    searchQuery,
    loading,
    error,
    loadSections,
    loadArticles,
    loadArticle,
    search,
    sendFeedback,
    topFaqs: getTopFaqs()
  };
};