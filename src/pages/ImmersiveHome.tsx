
import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import WelcomeHero from '@/components/home/WelcomeHero';

const ImmersiveHome: React.FC = () => {
  const ctaButtons = [
    {
      label: 'get-started',
      link: '/login',
      text: 'Commencer',
      variant: 'default' as const,
      icon: true
    },
    {
      label: 'enterprise',
      link: '/b2b/selection',
      text: 'Solutions entreprise',
      variant: 'outline' as const
    }
  ];

  return (
    <div className="min-h-screen">
      <HeroSection />
      
      <div className="container mx-auto px-4 py-12">
        <WelcomeHero 
          title="Bienvenue sur EmotionsCare"
          subtitle="Votre plateforme de bien-être émotionnel powered by AI"
          ctaButtons={ctaButtons}
        />
      </div>
    </div>
  );
};

export default ImmersiveHome;
