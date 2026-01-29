/**
 * useSEOMeta - Hook pour gérer les meta tags SEO
 * Corrige: SEO meta tags manquants
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  twitterCard?: 'summary' | 'summary_large_image';
  canonical?: string;
  noIndex?: boolean;
}

const DEFAULT_CONFIG: SEOConfig = {
  title: 'EmotionsCare - Bien-être émotionnel intelligent',
  description: 'Plateforme de bien-être émotionnel avec scan IA, coach virtuel, méditation guidée et gamification. Prenez soin de vos émotions.',
  keywords: ['bien-être', 'émotions', 'santé mentale', 'méditation', 'respiration', 'coach IA'],
  ogImage: 'https://emotions-care.lovable.app/og-image.png',
  ogType: 'website',
  twitterCard: 'summary_large_image',
};

// Page-specific SEO configs
const PAGE_SEO: Record<string, Partial<SEOConfig>> = {
  '/': {
    title: 'EmotionsCare - Votre compagnon de bien-être émotionnel',
    description: 'Transformez votre bien-être avec l\'IA. Scan émotionnel, coach personnel, méditation guidée et plus.',
  },
  '/login': {
    title: 'Connexion - EmotionsCare',
    description: 'Connectez-vous à votre espace EmotionsCare pour accéder à vos outils de bien-être.',
    noIndex: true,
  },
  '/signup': {
    title: 'Inscription - EmotionsCare',
    description: 'Rejoignez EmotionsCare et commencez votre voyage vers le bien-être émotionnel.',
  },
  '/app/scan': {
    title: 'Scan Émotionnel IA - EmotionsCare',
    description: 'Analysez vos émotions avec notre technologie de reconnaissance faciale. Comprenez ce que vous ressentez.',
    keywords: ['scan émotionnel', 'reconnaissance faciale', 'analyse émotions', 'Hume AI'],
  },
  '/app/coach': {
    title: 'Coach IA Personnel - EmotionsCare',
    description: 'Un coach IA disponible 24/7 pour vous accompagner. Conseils personnalisés et exercices guidés.',
    keywords: ['coach IA', 'coaching émotionnel', 'thérapie IA', 'GPT-4'],
  },
  '/app/journal': {
    title: 'Journal Émotionnel - EmotionsCare',
    description: 'Tenez un journal de vos émotions. Dictée vocale, analyse de sentiment et insights personnalisés.',
    keywords: ['journal émotionnel', 'écriture thérapeutique', 'self-care'],
  },
  '/app/breath': {
    title: 'Exercices de Respiration - EmotionsCare',
    description: 'Techniques de respiration guidées : cohérence cardiaque, 4-7-8, box breathing. Réduisez stress et anxiété.',
    keywords: ['respiration', 'cohérence cardiaque', 'box breathing', 'anti-stress'],
  },
  '/app/meditation': {
    title: 'Méditation Guidée - EmotionsCare',
    description: 'Sessions de méditation pour tous niveaux. Relaxation, sommeil, concentration et plus.',
    keywords: ['méditation', 'relaxation', 'pleine conscience', 'mindfulness'],
  },
  '/gamification': {
    title: 'Gamification & Récompenses - EmotionsCare',
    description: 'Gagnez des XP, débloquez des badges et relevez des défis quotidiens. Votre bien-être devient un jeu.',
    keywords: ['gamification', 'badges', 'XP', 'défis bien-être'],
  },
  '/pricing': {
    title: 'Tarifs - EmotionsCare',
    description: 'Découvrez nos offres : gratuit, premium et entreprise. Choisissez le plan adapté à vos besoins.',
    keywords: ['prix', 'abonnement', 'premium', 'gratuit'],
  },
};

export function useSEOMeta(customConfig?: Partial<SEOConfig>) {
  const location = useLocation();

  useEffect(() => {
    const pageConfig = PAGE_SEO[location.pathname] || {};
    const config: SEOConfig = {
      ...DEFAULT_CONFIG,
      ...pageConfig,
      ...customConfig,
    };

    // Update title
    document.title = config.title;

    // Update meta tags
    updateMetaTag('description', config.description);
    updateMetaTag('keywords', config.keywords?.join(', ') || '');

    // Open Graph
    updateMetaTag('og:title', config.title, 'property');
    updateMetaTag('og:description', config.description, 'property');
    updateMetaTag('og:image', config.ogImage || '', 'property');
    updateMetaTag('og:type', config.ogType || 'website', 'property');
    updateMetaTag('og:url', window.location.href, 'property');

    // Twitter Card
    updateMetaTag('twitter:card', config.twitterCard || 'summary', 'name');
    updateMetaTag('twitter:title', config.title, 'name');
    updateMetaTag('twitter:description', config.description, 'name');
    updateMetaTag('twitter:image', config.ogImage || '', 'name');

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = config.canonical || window.location.href;

    // Robots (noindex)
    if (config.noIndex) {
      updateMetaTag('robots', 'noindex, nofollow', 'name');
    } else {
      updateMetaTag('robots', 'index, follow', 'name');
    }

    // Cleanup function not needed as we're just updating existing tags
  }, [location.pathname, customConfig]);
}

function updateMetaTag(name: string, content: string, attribute: 'name' | 'property' = 'name') {
  let tag = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }
  
  tag.content = content;
}

export default useSEOMeta;
