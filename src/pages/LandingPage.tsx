
import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CtaSection from '@/components/home/CtaSection';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CtaSection />
    </div>
  );
};

export default LandingPage;
