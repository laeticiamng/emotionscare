/**
 * HomePage - Page d'accueil accessible à tous
 */

import React from 'react';
import ModernHomePage from './modern-features/ModernHomePage';
import { usePageSEO } from '@/hooks/usePageSEO';
import HomePageErrorBoundary from './error/HomePageErrorBoundary';
import { useOptimizedPage } from '@/hooks/useOptimizedPage';

const HomePage: React.FC = () => {
  useOptimizedPage('HomePage');
  usePageSEO({
    title: 'Accueil - Intelligence émotionnelle et bien-être',
    description: 'EmotionsCare : plateforme d\'intelligence émotionnelle pour particuliers et entreprises. Scan émotions, musicothérapie IA, coach virtuel, VR bien-être.',
    keywords: 'émotions, bien-être, intelligence émotionnelle, musicothérapie, coach IA, santé mentale',
    // Open Graph pour partage social
    ogType: 'website',
    ogImage: '/og-image.svg',
    ogImageAlt: 'EmotionsCare - Plateforme d\'intelligence émotionnelle avec dashboard et outils',
    // Twitter Cards
    twitterCard: 'summary_large_image',
    twitterImage: '/twitter-card.svg',
    // Canonical URL
    canonical: 'https://emotionscare.app/',
    // Inclure le schema Organization
    includeOrganization: true,
    // Structured Data
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      '@id': 'https://emotionscare.app/#webapp',
      name: 'EmotionsCare',
      url: 'https://emotionscare.app',
      applicationCategory: 'HealthApplication',
      operatingSystem: 'Web',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'EUR',
        description: 'Essai gratuit 30 jours',
        availability: 'https://schema.org/InStock'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '2847',
        bestRating: '5',
        worstRating: '1'
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

  return (
    <HomePageErrorBoundary>
      <ModernHomePage />
    </HomePageErrorBoundary>
  );
};

export default HomePage;