
import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import CtaSection from '@/components/home/CtaSection';

const LandingPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <CtaSection />
    </div>
  );
};

export default LandingPage;
