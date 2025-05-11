
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import HeroSection from '@/components/home/HeroSection';
import AccessSection from '@/components/home/AccessSection';
import TherapyModules from '@/components/home/TherapyModules';
import CtaSection from '@/components/home/CtaSection';
import KeyFeatures from '@/components/home/KeyFeatures';
import FaqSection from '@/components/home/FaqSection';

export const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="container mx-auto max-w-7xl py-12 px-4 md:px-8">
      {/* Hero Section */}
      <HeroSection />

      {/* B2C/B2B ACCESS SECTION */}
      {!isAuthenticated && <AccessSection />}

      {/* Modules Section */}
      <TherapyModules />

      {/* CTA Section */}
      <CtaSection />

      {/* Features Section */}
      <KeyFeatures />
      
      {/* FAQ Section */}
      <FaqSection />
    </div>
  );
};

export default Home;
