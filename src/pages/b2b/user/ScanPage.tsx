/**
 * B2B User Scan Page - Scan émotionnel avec SEO
 */
import React, { useEffect } from 'react';
import { usePageSEO } from '@/hooks/usePageSEO';
import { useAccessibilityAudit } from '@/lib/accessibility-checker';
import B2CScanPage from '@/pages/b2c/B2CScanPage';

const ScanPage: React.FC = () => {
  usePageSEO({
    title: 'Scan Émotionnel - EmotionsCare',
    description: 'Analysez votre état émotionnel en temps réel avec notre technologie de scan facial.',
    keywords: 'scan, émotions, analyse, bien-être, EmotionsCare',
  });

  const { runAudit } = useAccessibilityAudit();

  useEffect(() => {
    if (import.meta.env.DEV) {
      setTimeout(runAudit, 1500);
    }
  }, [runAudit]);

  return <B2CScanPage />;
};

export default ScanPage;
