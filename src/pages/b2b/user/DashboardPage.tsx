// @ts-nocheck
/**
 * B2B User Dashboard Page avec SEO et enrichissements
 */
import React, { useEffect } from 'react';
import { usePageSEO } from '@/hooks/usePageSEO';
import { useAccessibilityAudit } from '@/lib/accessibility-checker';
import B2BCollabDashboard from '@/pages/B2BCollabDashboard';

const DashboardPage: React.FC = () => {
  // SEO
  usePageSEO({
    title: 'Mon Espace Bien-être - EmotionsCare',
    description: 'Votre espace personnel de bien-être émotionnel. Suivez vos progrès, accédez aux activités et gérez votre équilibre.',
    keywords: ['bien-être', 'émotions', 'personnel', 'collaborateur', 'EmotionsCare'],
  });

  const { runAudit } = useAccessibilityAudit();

  useEffect(() => {
    if (import.meta.env.DEV) {
      setTimeout(runAudit, 1500);
    }
  }, [runAudit]);

  return <B2BCollabDashboard />;
};

export default DashboardPage;
