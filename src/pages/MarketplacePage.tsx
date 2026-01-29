/**
 * Page Marketplace - Découverte des programmes
 */

import React from 'react';
import { usePageSEO } from '@/hooks/usePageSEO';
import MarketplaceBrowser from '@/features/marketplace/components/MarketplaceBrowser';

const MarketplacePage: React.FC = () => {
  usePageSEO({
    title: 'Marketplace Créateurs - EmotionsCare',
    description: 'Découvrez des programmes thérapeutiques créés par des experts certifiés. Audio, vidéo, et exercices guidés pour votre bien-être.',
    keywords: 'marketplace, programmes thérapeutiques, experts, audio, vidéo, bien-être, soignants'
  });

  return <MarketplaceBrowser />;
};

export default MarketplacePage;
