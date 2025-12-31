// @ts-nocheck
/**
 * B2B Admin Dashboard Page avec SEO et enrichissements
 */
import React, { useEffect } from 'react';
import { usePageSEO } from '@/hooks/usePageSEO';
import { useAccessibilityAudit } from '@/lib/accessibility-checker';
import B2BRHDashboard from '@/pages/B2BRHDashboard';

const DashboardPage: React.FC = () => {
  // SEO
  usePageSEO({
    title: 'Dashboard RH - EmotionsCare B2B',
    description: 'Tableau de bord RH pour le suivi anonymisé du bien-être de vos équipes. Visualisez les KPIs, alertes et tendances.',
    keywords: ['RH', 'bien-être', 'équipe', 'dashboard', 'B2B', 'EmotionsCare'],
  });

  const { runAudit } = useAccessibilityAudit();

  useEffect(() => {
    if (import.meta.env.DEV) {
      setTimeout(runAudit, 1500);
    }
  }, [runAudit]);

  return <B2BRHDashboard />;
};

export default DashboardPage;
