// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { useHelpStore, type Section, type ArticleSummary, type Article, type Feedback } from '@/store/help.store';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';

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
      // Try to load from Supabase
      const { data, error } = await supabase
        .from('help_sections')
        .select('*')
        .order('order', { ascending: true });

      if (error) {
        // If table doesn't exist, use fallback data
        if (error.code === '42P01') {
          logger.warn('Help sections table does not exist, using fallback', undefined, 'SYSTEM');
          setSections([
            { id: '1', name: 'Modules', slug: 'modules', icon: '🧩' },
            { id: '2', name: 'Compte', slug: 'account', icon: '👤' },
            { id: '3', name: 'RGPD', slug: 'rgpd', icon: '🔒' },
            { id: '4', name: 'Technique', slug: 'technical', icon: '⚙️' }
          ]);
        } else {
          throw error;
        }
      } else {
        setSections(data || []);
      }
    } catch (error: any) {
      logger.error('Load sections failed', error as Error, 'SYSTEM');
      setError(error.message);
      // Use fallback on error
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
      const { data, error } = await supabase
        .from('help_articles')
        .select('id, title, slug, excerpt, section_id, created_at')
        .eq('section_id', sectionId)
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        if (error.code === '42P01') {
          logger.warn('Help articles table does not exist', undefined, 'SYSTEM');
          setArticles([]);
        } else {
          throw error;
        }
      } else {
        setArticles(data || []);
      }

    } catch (error: any) {
      logger.error('Load articles failed', error as Error, 'SYSTEM');
      setError(error.message);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [setArticles, setLoading, setError]);

  // Load a specific article
  const loadArticle = useCallback(async (slug: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('help_articles')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) {
        if (error.code === '42P01') {
          logger.warn('Help articles table does not exist', undefined, 'SYSTEM');
          setCurrentArticle(null);
        } else if (error.code === 'PGRST116') {
          // Not found
          setCurrentArticle(null);
          toast({
            title: "Article introuvable",
            description: "L'article demandé n'existe pas ou n'est plus disponible.",
            variant: "destructive"
          });
        } else {
          throw error;
        }
      } else {
        setCurrentArticle(data);

        // Analytics
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'help.article.view', {
            slug: slug
          });
        }
      }

    } catch (error: any) {
      logger.error('Load article failed', error as Error, 'SYSTEM');
      setError(error.message);
      setCurrentArticle(null);
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
      // Use Supabase full-text search
      const { data, error } = await supabase
        .from('help_articles')
        .select('id, title, slug, excerpt, section_id')
        .eq('published', true)
        .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
        .limit(20);

      if (error) {
        if (error.code === '42P01') {
          logger.warn('Help articles table does not exist', undefined, 'SYSTEM');
          setSearchResults([]);
        } else {
          throw error;
        }
      } else {
        setSearchResults(data || []);

        // Analytics
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'help.search', {
            q_len: query.length,
            results_count: data?.length || 0
          });
        }
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
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('help_feedback')
        .insert({
          article_id: feedback.articleId,
          user_id: user?.id || null,
          helpful: feedback.helpful,
          comment: feedback.comment || null,
        });

      if (error) {
        if (error.code === '42P01') {
          logger.warn('Help feedback table does not exist', undefined, 'SYSTEM');
          // Still show success to user
        } else {
          throw error;
        }
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