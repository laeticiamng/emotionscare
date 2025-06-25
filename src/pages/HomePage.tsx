
import React from 'react';
import { Helmet } from 'react-helmet-async';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import ModulesSection from '@/components/home/ModulesSection';
import CtaSection from '@/components/home/CtaSection';
import { preloadCriticalResources } from '@/utils/performanceOptimizer';

const HomePage: React.FC = () => {
  React.useEffect(() => {
    // Optimisation des temps de chargement
    preloadCriticalResources();
  }, []);

  return (
    <>
      <Helmet>
        <title>EmotionsCare - Plateforme de bien-être émotionnel pour les professionnels de santé</title>
        <meta 
          name="description" 
          content="Découvrez EmotionsCare, la solution complète de bien-être émotionnel avec IA Coach, scan émotionnel, musicothérapie et suivi personnalisé pour les professionnels de santé. Prenez soin de votre santé mentale au quotidien." 
        />
        <meta name="keywords" content="bien-être émotionnel, santé mentale, professionnels de santé, IA coach, scan émotionnel, musicothérapie" />
        <meta property="og:title" content="EmotionsCare - Bien-être émotionnel pour professionnels de santé" />
        <meta property="og:description" content="Solution complète avec IA Coach, scan émotionnel et musicothérapie pour prendre soin de votre santé mentale." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://emotionscare.com" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <HeroSection />
        <FeaturesSection />
        <ModulesSection />
        <TestimonialsSection />
        <CtaSection />
      </div>
    </>
  );
};

export default HomePage;
