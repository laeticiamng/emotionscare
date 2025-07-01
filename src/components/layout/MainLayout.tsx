
import React from 'react';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import PremiumLayout from './PremiumLayout';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <PremiumLayout>
      <div className="min-h-screen flex">
        <UnifiedNavigation />
        <main className="flex-1 ml-72 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </PremiumLayout>
  );
};

export default MainLayout;
