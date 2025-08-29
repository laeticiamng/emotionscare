import React from 'react';
import PremiumNavigation from '@/components/layout/PremiumNavigation';

const NavigationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5">
      <PremiumNavigation />
    </div>
  );
};

export default NavigationPage;