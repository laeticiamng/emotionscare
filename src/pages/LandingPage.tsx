
import React from 'react';
import FeaturesSection from '@/components/home/FeaturesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CtaSection from '@/components/home/CtaSection';
import WelcomeHero from '@/components/home/WelcomeHero';

const LandingPage: React.FC = () => {
  const ctaButtons = [
    {
      label: 'Commencer',
      link: '/choose-mode',
      text: 'Commencer maintenant',
      variant: 'default' as const,
      icon: true
    },
    {
      label: 'Découvrir',
      link: '/browsing',
      text: 'Découvrir la démo',
      variant: 'outline' as const,
      icon: false
    }
  ];

  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <WelcomeHero
          title="Bienvenue sur EmotionsCare"
          subtitle="La plateforme de bien-être émotionnel pour les professionnels de santé"
          ctaButtons={ctaButtons}
        />
        <FeaturesSection />
        <TestimonialsSection />
        <CtaSection />
      </div>
    </div>
  );
};

export default LandingPage;
