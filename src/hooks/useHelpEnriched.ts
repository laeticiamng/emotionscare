// @ts-nocheck -- TODO: typer 461 lignes de service help (Supabase dynamique)
import { useState, useEffect, useCallback } from 'react';
import { useHelpStore, type Section, type ArticleSummary, type Article, type Feedback } from '@/store/help.store';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';

interface SearchHistory {
  id: string;
  query: string;
  timestamp: string;
  resultCount: number;
}

interface ArticleBookmark {
  articleId: string;
  slug: string;
  title: string;
  savedAt: string;
}

interface HelpStats {
  articlesViewed: number;
  searchesPerformed: number;
  feedbackGiven: number;
  bookmarksCount: number;
  favoriteSection?: string;
}

const SEARCH_HISTORY_KEY = 'emotionscare_help_search_history';
const BOOKMARKS_KEY = 'emotionscare_help_bookmarks';
const VIEWED_ARTICLES_KEY = 'emotionscare_help_viewed';

export const useHelpEnriched = () => {
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
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [bookmarks, setBookmarks] = useState<ArticleBookmark[]>([]);
  const [viewedArticles, setViewedArticles] = useState<string[]>([]);
  const [stats, setStats] = useState<HelpStats | null>(null);

  // Charger les données persistantes
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (storedHistory) setSearchHistory(JSON.parse(storedHistory));

      const storedBookmarks = localStorage.getItem(BOOKMARKS_KEY);
      if (storedBookmarks) setBookmarks(JSON.parse(storedBookmarks));

      const storedViewed = localStorage.getItem(VIEWED_ARTICLES_KEY);
      if (storedViewed) setViewedArticles(JSON.parse(storedViewed));
    } catch (error) {
      logger.error('Erreur chargement données aide', error as Error, 'SYSTEM');
    }
  }, []);

  // Calculer les stats
  const calculateStats = useCallback((): HelpStats => {
    const sectionCount = new Map<string, number>();
    // Compter les vues par section (simplifié)
    viewedArticles.forEach(slug => {
      const section = slug.split('-')[0] || 'general';
      sectionCount.set(section, (sectionCount.get(section) || 0) + 1);
    });

    const favoriteSection = sectionCount.size > 0
      ? Array.from(sectionCount.entries()).sort((a, b) => b[1] - a[1])[0][0]
      : undefined;

    return {
      articlesViewed: viewedArticles.length,
      searchesPerformed: searchHistory.length,
      feedbackGiven: 0, // À implémenter avec Supabase
      bookmarksCount: bookmarks.length,
      favoriteSection
    };
  }, [viewedArticles, searchHistory, bookmarks]);

  useEffect(() => {
    setStats(calculateStats());
  }, [viewedArticles, searchHistory, bookmarks, calculateStats]);

  // Load sections enrichi avec données Supabase
  const loadSections = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Tenter de charger depuis Supabase/Edge Function
      const { data, error: fetchError } = await supabase.functions.invoke('help-center-ai', {
        body: { action: 'get_sections' }
      });

      if (!fetchError && data?.sections) {
        setSections(data.sections);
      } else {
        // Fallback avec données enrichies
        setSections([
          { id: '1', name: 'Modules', slug: 'modules', icon: '🧩', description: 'Découvrez tous nos modules bien-être' },
          { id: '2', name: 'Compte', slug: 'account', icon: '👤', description: 'Gérez votre compte et profil' },
          { id: '3', name: 'RGPD', slug: 'rgpd', icon: '🔒', description: 'Protection de vos données' },
          { id: '4', name: 'Technique', slug: 'technical', icon: '⚙️', description: 'Aide technique et dépannage' },
          { id: '5', name: 'Premium', slug: 'premium', icon: '⭐', description: 'Fonctionnalités premium' },
          { id: '6', name: 'Communauté', slug: 'community', icon: '👥', description: 'Aide entre utilisateurs' }
        ]);
      }
    } finally {
      setLoading(false);
    }
  }, [setSections, setLoading, setError]);

  // Search enrichi avec historique
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
      // Essayer l'IA d'abord
      const { data, error: searchError } = await supabase.functions.invoke('help-center-ai', {
        body: {
          action: 'search',
          query,
          includeAI: true
        }
      });

      if (!searchError && data?.results) {
        setSearchResults(data.results);
      } else {
        // Fallback: recherche locale dans les FAQs
        const faqs = getTopFaqs();
        const filtered = faqs.filter(faq =>
          faq.question.toLowerCase().includes(query.toLowerCase()) ||
          faq.answer.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filtered as any);
      }

      // Sauvegarder dans l'historique
      const newEntry: SearchHistory = {
        id: Date.now().toString(),
        query,
        timestamp: new Date().toISOString(),
        resultCount: searchResults?.length || 0
      };

      const updatedHistory = [newEntry, ...searchHistory].slice(0, 50);
      setSearchHistory(updatedHistory);
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));

      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'help.search', {
          q_len: query.length,
          results: searchResults?.length || 0
        });
      }

    } catch (error: unknown) {
      logger.error('Search failed', error instanceof Error ? error : undefined, 'SYSTEM');
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchHistory, setSearchQuery, setSearchResults, setLoading, setError]);

  // Charger un article avec tracking
  const loadArticle = useCallback(async (slug: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase.functions.invoke('help-center-ai', {
        body: { action: 'get_article', slug }
      });

      if (!fetchError && data?.article) {
        setCurrentArticle(data.article);
      }

      // Tracker la vue
      if (!viewedArticles.includes(slug)) {
        const updated = [...viewedArticles, slug];
        setViewedArticles(updated);
        localStorage.setItem(VIEWED_ARTICLES_KEY, JSON.stringify(updated));
      }

      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'help.article.view', { slug });
      }

    } catch (error: unknown) {
      logger.error('Load article failed', error instanceof Error ? error : undefined, 'SYSTEM');
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [viewedArticles, setCurrentArticle, setLoading, setError]);

  // Ajouter/retirer un bookmark
  const toggleBookmark = useCallback((article: { slug: string; title: string }) => {
    const existing = bookmarks.find(b => b.slug === article.slug);

    if (existing) {
      const updated = bookmarks.filter(b => b.slug !== article.slug);
      setBookmarks(updated);
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
      toast({ title: 'Marque-page retiré' });
    } else {
      const newBookmark: ArticleBookmark = {
        articleId: Date.now().toString(),
        slug: article.slug,
        title: article.title,
        savedAt: new Date().toISOString()
      };
      const updated = [...bookmarks, newBookmark];
      setBookmarks(updated);
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
      toast({ title: 'Article sauvegardé' });
    }
  }, [bookmarks]);

  // Vérifier si un article est bookmarké
  const isBookmarked = useCallback((slug: string) => {
    return bookmarks.some(b => b.slug === slug);
  }, [bookmarks]);

  // Send feedback enrichi
  const sendFeedback = useCallback(async (feedback: Feedback & { rating?: number; comment?: string }) => {
    try {
      const { error: feedbackError } = await supabase.functions.invoke('help-center-ai', {
        body: {
          action: 'submit_feedback',
          feedback: {
            ...feedback,
            timestamp: new Date().toISOString()
          }
        }
      });

      if (feedbackError) throw feedbackError;

      toast({
        title: "Merci pour votre retour !",
        description: "Votre avis nous aide à améliorer l'aide.",
      });

      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'help.feedback', {
          helpful: feedback.helpful,
          rating: feedback.rating
        });
      }

      return true;

    } catch (error: unknown) {
      logger.error('Send feedback failed', error instanceof Error ? error : undefined, 'SYSTEM');
      
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer votre retour.",
        variant: "destructive"
      });
      
      return false;
    }
  }, []);

  // Exporter les données d'aide
  const exportHelpData = useCallback(() => {
    const data = {
      searchHistory,
      bookmarks,
      viewedArticles,
      stats,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `help-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [searchHistory, bookmarks, viewedArticles, stats]);

  // Effacer l'historique de recherche
  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
    toast({ title: 'Historique de recherche effacé' });
  }, []);

  // Suggestions de recherche basées sur l'historique
  const getSearchSuggestions = useCallback((query: string) => {
    if (!query) return [];

    return searchHistory
      .filter(h => h.query.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5)
      .map(h => h.query);
  }, [searchHistory]);

  // Get top FAQs enrichi
  const getTopFaqs = useCallback(() => {
    return [
      {
        id: 'faq-1',
        question: 'Comment exporter mes données ?',
        answer: 'Rendez-vous dans Paramètres > Confidentialité > Exporter mes données. Un fichier ZIP vous sera envoyé par e-mail.',
        slug: 'export-donnees',
        category: 'rgpd',
        views: 1250
      },
      {
        id: 'faq-2',
        question: 'Mes données sont-elles sécurisées ?',
        answer: 'Oui, toutes vos données sont chiffrées et stockées conformément au RGPD. Nous ne partageons jamais vos informations personnelles.',
        slug: 'securite-donnees',
        category: 'rgpd',
        views: 980
      },
      {
        id: 'faq-3',
        question: 'Comment supprimer mon compte ?',
        answer: 'Dans Paramètres > Compte, vous pouvez programmer la suppression. Un délai de 30 jours vous permet d\'annuler si vous changez d\'avis.',
        slug: 'supprimer-compte',
        category: 'account',
        views: 850
      },
      {
        id: 'faq-4',
        question: 'Les modules VR nécessitent-ils un casque ?',
        answer: 'Non ! Nos expériences VR fonctionnent parfaitement sur ordinateur et mobile, avec des modes d\'immersion adaptés.',
        slug: 'vr-sans-casque',
        category: 'modules',
        views: 720
      },
      {
        id: 'faq-5',
        question: 'Comment activer les notifications ?',
        answer: 'Dans Paramètres > Notifications, activez les rappels. Vous pouvez choisir les créneaux et types de notifications.',
        slug: 'activer-notifications',
        category: 'account',
        views: 650
      },
      {
        id: 'faq-6',
        question: 'Comment fonctionne le coach IA ?',
        answer: 'Le coach IA analyse vos émotions et vous propose des exercices personnalisés. Il apprend de vos préférences pour s\'améliorer.',
        slug: 'coach-ia',
        category: 'modules',
        views: 580
      },
      {
        id: 'faq-7',
        question: 'Puis-je partager mes progrès ?',
        answer: 'Oui ! Vous pouvez partager vos badges et achievements sur les réseaux sociaux depuis votre profil.',
        slug: 'partage-progres',
        category: 'community',
        views: 450
      }
    ];
  }, []);

  // Articles populaires
  const getPopularArticles = useCallback(() => {
    return getTopFaqs()
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5);
  }, [getTopFaqs]);

  // Initialize
  useEffect(() => {
    if (!initialized) {
      loadSections();
      setInitialized(true);
    }
  }, [initialized, loadSections]);

  // Load articles for a section
  const loadArticles = useCallback(async (sectionId: string, limit = 10) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase.functions.invoke('help-center-ai', {
        body: { action: 'get_articles', sectionId, limit }
      });

      if (!fetchError && data?.articles) {
        setArticles(data.articles);
      } else {
        setArticles([]);
      }
    } catch (error: unknown) {
      logger.error('Load articles failed', error instanceof Error ? error : undefined, 'SYSTEM');
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [setArticles, setLoading, setError]);

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
    topFaqs: getTopFaqs(),
    // Enriched features
    searchHistory,
    bookmarks,
    viewedArticles,
    stats,
    toggleBookmark,
    isBookmarked,
    exportHelpData,
    clearSearchHistory,
    getSearchSuggestions,
    getPopularArticles
  };
};

export default useHelpEnriched;
