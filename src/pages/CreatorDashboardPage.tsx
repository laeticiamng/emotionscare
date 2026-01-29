/**
 * Page Dashboard Créateur
 */

import React from 'react';
import { usePageSEO } from '@/hooks/usePageSEO';
import CreatorDashboard from '@/features/marketplace/components/CreatorDashboard';

const CreatorDashboardPage: React.FC = () => {
  usePageSEO({
    title: 'Dashboard Créateur - EmotionsCare',
    description: 'Gérez vos programmes, suivez vos ventes et vos revenus en tant que créateur sur EmotionsCare.',
    keywords: 'créateur, dashboard, programmes, ventes, revenus'
  });

  return <CreatorDashboard />;
};

export default CreatorDashboardPage;
