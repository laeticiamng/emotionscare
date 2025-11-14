/**
 * HomePage - Page d'accueil accessible à tous
 */

import React from 'react';
import ModernHomePage from './modern-features/ModernHomePage';
import { usePageSEO } from '@/hooks/usePageSEO';

const HomePage: React.FC = () => {
  usePageSEO({
    title: 'Accueil - Intelligence émotionnelle et bien-être',
    description: 'EmotionsCare : plateforme d\'intelligence émotionnelle pour particuliers et entreprises. Scan émotions, musicothérapie IA, coach virtuel, VR bien-être.',
    keywords: 'émotions, bien-être, intelligence émotionnelle, musicothérapie, coach IA, santé mentale',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'EmotionsCare',
      applicationCategory: 'HealthApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'EUR',
        description: 'Essai gratuit 30 jours'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '2847',
        bestRating: '5'
      },
      featureList: [
        'Analyse émotionnelle par IA',
        'Musicothérapie personnalisée',
        'Coach virtuel 24/7',
        'Expériences VR de bien-être',
        'Journal émotionnel intelligent'
      ],
      description: 'Plateforme d\'intelligence émotionnelle pour le bien-être personnel et professionnel. Analysez et améliorez vos émotions avec nos outils innovants.'
    }
  });

  return <ModernHomePage />;
};

export default HomePage;