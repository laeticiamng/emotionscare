
import React from 'react';
import GamificationDashboard from '@/components/gamification/GamificationDashboard';

const GamificationPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Gamification</h1>
      <GamificationDashboard />
    </div>
  );
};

export default GamificationPage;
