
import React from 'react';
import PremiumHeroSection from '@/components/home/PremiumHeroSection';
import BusinessSection from '@/components/home/BusinessSection';
import IndividualSection from '@/components/home/IndividualSection';

const ImmersiveHome: React.FC = () => {
  return (
    <div className="min-h-screen">
      <PremiumHeroSection />
      <IndividualSection />
      <BusinessSection />
    </div>
  );
};

export default ImmersiveHome;
