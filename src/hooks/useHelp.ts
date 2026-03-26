// @ts-nocheck
/**
 * useHelp - Hook de gestion de l'aide avec données locales
 * Les articles sont stockés localement pour éviter les appels API cassés
 */

import { useState, useEffect, useCallback } from 'react';
import { useHelpStore, type Section, type ArticleSummary, type Article, type Feedback } from '@/store/help.store';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Articles d'aide en dur (contenu statique)
const HELP_ARTICLES: Record<string, ArticleSummary[]> = {
  modules: [
    { id: 'mod-1', title: 'Flash Glow - Apaisement Express', slug: 'flash-glow', excerpt: 'Découvrez comment utiliser Flash Glow pour un apaisement en 2 minutes.' },
    { id: 'mod-2', title: 'Mood Mixer - Console des Humeurs', slug: 'mood-mixer', excerpt: 'Apprenez à créer votre mix émotionnel parfait.' },
    { id: 'mod-3', title: 'Boss Grit - La Forge Intérieure', slug: 'boss-grit', excerpt: 'Développez votre persévérance avec des quêtes ludiques.' },
    { id: 'mod-4', title: 'Bubble Beat - Défouloir Rythmé', slug: 'bubble-beat', excerpt: 'Éclatez des bulles en rythme pour évacuer le stress.' },
    { id: 'mod-5', title: 'Story Synth - Récits qui Respirent', slug: 'story-synth', excerpt: 'Créez des histoires apaisantes personnalisées.' },
  ],
  account: [
    { id: 'acc-1', title: 'Modifier mon profil', slug: 'modifier-profil', excerpt: 'Comment mettre à jour vos informations personnelles.' },
    { id: 'acc-2', title: 'Changer mon mot de passe', slug: 'changer-mot-de-passe', excerpt: 'Procédure pour modifier votre mot de passe.' },
    { id: 'acc-3', title: 'Supprimer mon compte', slug: 'supprimer-compte', excerpt: 'Comment supprimer définitivement votre compte.' },
  ],
  rgpd: [
    { id: 'rgpd-1', title: 'Exporter mes données', slug: 'export-donnees', excerpt: 'Téléchargez toutes vos données personnelles.' },
    { id: 'rgpd-2', title: 'Politique de confidentialité', slug: 'politique-confidentialite', excerpt: 'Découvrez comment nous protégeons vos données.' },
    { id: 'rgpd-3', title: 'Droits RGPD', slug: 'droits-rgpd', excerpt: 'Vos droits concernant vos données personnelles.' },
  ],
  technical: [
    { id: 'tech-1', title: 'Navigateurs supportés', slug: 'navigateurs-supportes', excerpt: 'Liste des navigateurs compatibles avec EmotionsCare.' },
    { id: 'tech-2', title: 'Résoudre les problèmes audio', slug: 'problemes-audio', excerpt: 'Solutions pour les problèmes de lecture audio.' },
    { id: 'tech-3', title: 'Activer les notifications', slug: 'activer-notifications', excerpt: 'Comment autoriser les notifications push.' },
  ],
};

const FULL_ARTICLES: Record<string, Article> = {
  'flash-glow': {
    id: 'mod-1',
    title: 'Flash Glow - Apaisement Express',
    slug: 'flash-glow',
    content: `
# Flash Glow - Le Dôme d'Étincelles

Flash Glow est votre allié pour un apaisement express en moins de 2 minutes.

## Comment ça marche ?

1. **Lancez une session** - Appuyez sur le bouton "Démarrer"
2. **Respirez** - Suivez le guide de respiration à l'écran
3. **Observez** - Des particules lumineuses dansent au rythme de votre respiration
4. **Terminez** - La session se termine automatiquement après 2 minutes

## Conseils

- Utilisez Flash Glow avant une réunion stressante
- Idéal pour une pause de mi-journée
- Fonctionne même en mode hors-ligne

## Statistiques

Vos sessions sont automatiquement enregistrées. Consultez vos stats pour suivre votre progression.
    `,
    sectionId: 'modules',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'export-donnees': {
    id: 'rgpd-1',
    title: 'Exporter mes données',
    slug: 'export-donnees',
    content: `
# Exporter mes données

Conformément au RGPD, vous pouvez télécharger l'ensemble de vos données personnelles.

## Procédure

1. Rendez-vous dans **Paramètres > Confidentialité**
2. Cliquez sur **Exporter mes données**
3. Un fichier ZIP vous sera envoyé par e-mail sous 24h

## Contenu de l'export

- Informations de profil
- Historique des sessions
- Entrées de journal
- Statistiques d'utilisation
- Préférences

Toutes vos données restent chiffrées et protégées.
    `,
    sectionId: 'rgpd',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

export const useHelp = () => {
  const { user } = useAuth();
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

  // Load sections (statique)
  const loadSections = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
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

  // Load articles for a section (données locales)
  const loadArticles = useCallback(async (sectionId: string, limit = 10) => {
    setLoading(true);
    setError(null);

    try {
      const sectionArticles = HELP_ARTICLES[sectionId] || [];
      setArticles(sectionArticles.slice(0, limit));
    } catch (err) {
      logger.error('Load articles failed', err as Error, 'HELP');
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [setArticles, setLoading, setError]);

  // Load a specific article (données locales)
  const loadArticle = useCallback(async (slug: string) => {
    setLoading(true);
    setError(null);

    try {
      const article = FULL_ARTICLES[slug];
      
      if (article) {
        setCurrentArticle(article);
      } else {
        // Générer un article basique à partir des summaries
        const allArticles = Object.values(HELP_ARTICLES).flat();
        const summary = allArticles.find(a => a.slug === slug);
        
        if (summary) {
          setCurrentArticle({
            id: summary.id,
            title: summary.title,
            slug: summary.slug,
            content: `# ${summary.title}\n\n${summary.excerpt}\n\nContenu détaillé à venir.`,
            sectionId: 'modules',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        } else {
          throw new Error('Article not found');
        }
      }
    } catch (err) {
      logger.error('Load article failed', err as Error, 'HELP');
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [setCurrentArticle, setLoading, setError]);

  // Search articles (recherche locale)
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
      const allArticles = Object.values(HELP_ARTICLES).flat();
      const queryLower = query.toLowerCase();
      
      const results = allArticles.filter(article => 
        article.title.toLowerCase().includes(queryLower) ||
        article.excerpt.toLowerCase().includes(queryLower)
      );
      
      setSearchResults(results);
    } catch (err) {
      logger.error('Search failed', err as Error, 'HELP');
      setError((err as Error).message);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [setSearchQuery, setSearchResults, setLoading, setError]);

  // Send feedback (persistance Supabase)
  const sendFeedback = useCallback(async (feedback: Feedback) => {
    try {
      if (user) {
        // Sauvegarder dans user_settings comme feedback
        await supabase.from('user_settings').insert({
          user_id: user.id,
          key: `help_feedback_${feedback.articleId}_${Date.now()}`,
          value: JSON.stringify(feedback)
        });
      }

      toast({
        title: "Merci pour votre retour !",
        description: "Votre avis nous aide à améliorer l'aide.",
      });

      return true;
    } catch (err) {
      logger.error('Send feedback failed', err as Error, 'HELP');
      
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer votre retour.",
        variant: "destructive"
      });
      
      return false;
    }
  }, [user]);

  // Get top FAQs
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
        answer: 'Oui, toutes vos données sont chiffrées et stockées conformément au RGPD. Nos sous-traitants techniques sont encadrés contractuellement.',
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
