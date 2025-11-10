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
    keywords: 'émotions, bien-être, intelligence émotionnelle, musicothérapie, coach IA, santé mentale'
  });

  return <ModernHomePage />;
};

export default HomePage;