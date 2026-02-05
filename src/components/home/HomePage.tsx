/**
 * HomePage - Page d'accueil accessible à tous
 */

import React from 'react';
import ModernHomePage from '@/components/modern-features/ModernHomePage';
import { usePageSEO } from '@/hooks/usePageSEO';
import HomePageErrorBoundary from '@/components/error/HomePageErrorBoundary';
import { useOptimizedPage } from '@/hooks/useOptimizedPage';

const HomePage: React.FC = () => {
  useOptimizedPage('HomePage');
  usePageSEO({
    title: 'EmotionsCare - Bien-être émotionnel pour soignants',
    description: 'Plateforme de régulation émotionnelle dédiée aux étudiants en santé et aux professionnels du soin. Gérer le stress, prévenir l\'épuisement.',
    keywords: 'soignants, étudiants santé, stress, burn-out, régulation émotionnelle, médecine, infirmier, bien-être santé',
    // Open Graph pour partage social
    ogType: 'website',
    ogImage: '/og-image.svg',
    ogImageAlt: 'EmotionsCare - Régulation émotionnelle pour soignants',
    // Twitter Cards
    twitterCard: 'summary_large_image',
    twitterImage: '/twitter-card.svg',
    // Canonical URL
    canonical: 'https://emotionscare.com/',
    // Inclure le schema Organization
    includeOrganization: true,
    // Structured Data sans données fictives
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      '@id': 'https://emotionscare.com/#webapp',
      name: 'EmotionsCare',
      url: 'https://emotionscare.com',
      applicationCategory: 'HealthApplication',
      operatingSystem: 'Web',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'EUR',
        description: 'Version gratuite disponible',
        availability: 'https://schema.org/InStock'
      },
      featureList: [
        'Régulation émotionnelle pour soignants',
        'Gestion du stress en milieu médical',
        'Prévention du burn-out',
        'Accompagnement étudiants en santé'
      ],
      description: 'Plateforme de régulation émotionnelle dédiée aux étudiants en santé et aux professionnels du soin.'
    }
  });

  return (
    <HomePageErrorBoundary>
      <ModernHomePage />
    </HomePageErrorBoundary>
  );
};

export default HomePage;