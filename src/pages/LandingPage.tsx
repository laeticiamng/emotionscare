
import React from 'react';
import PremiumHeroSection from '@/components/home/PremiumHeroSection';
import PhilosophySection from '@/components/home/PhilosophySection';
import ExperienceShowcase from '@/components/home/ExperienceShowcase';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <PremiumHeroSection />
      <PhilosophySection />
      <ExperienceShowcase />
    </div>
  );
};

export default LandingPage;
