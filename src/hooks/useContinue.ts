import { useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboard.store';

const MOCK_CONTINUE_ITEMS = [
  {
    title: 'Story Synth',
    subtitle: 'Chapitre 2 - La forêt enchantée',
    deeplink: '/story-synth?resume=chapter2',
    module: 'story_synth'
  },
  {
    title: 'VR Respiration',
    subtitle: 'Session paisible (3 min restantes)',
    deeplink: '/vr-breath?resume=peaceful_3min',
    module: 'vr_breath'
  }
];

export const useContinue = () => {
  const { continueItem, loading, setContinueItem, setLoading } = useDashboardStore();

  useEffect(() => {
    const fetchContinue = async () => {
      try {
        setLoading('continue', true);
        
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Randomly return a continue item or none
        const hasContinue = Math.random() > 0.5;
        const item = hasContinue 
          ? MOCK_CONTINUE_ITEMS[Math.floor(Math.random() * MOCK_CONTINUE_ITEMS.length)]
          : null;
          
        setContinueItem(item);
      } catch (error) {
        console.error('Failed to fetch continue data:', error);
        setContinueItem(null);
      } finally {
        setLoading('continue', false);
      }
    };

    if (continueItem === null && !loading.continue) {
      fetchContinue();
    }
  }, [continueItem, loading.continue, setContinueItem, setLoading]);

  return {
    item: continueItem,
    loading: loading.continue
  };
};