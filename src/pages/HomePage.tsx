
import React from 'react';
import HeroSection from '@/components/home/HeroSection';

const HomePage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen">
      <HeroSection />
    </div>
  );
};

export default HomePage;
