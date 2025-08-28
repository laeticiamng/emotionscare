import { useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboard.store';

const MOCK_NUDGES = [
  {
    text: '1 min pour respirer ?',
    deeplink: '/flash-glow?quick=true',
    emoji: '✨'
  },
  {
    text: 'Micro-pause 90 secondes',
    deeplink: '/screen-silk?duration=90',
    emoji: '🌊'
  },
  {
    text: 'Note rapide dans ton journal',
    deeplink: '/journal?mode=quick',
    emoji: '📝'
  },
  {
    text: 'Musique apaisante ?',
    deeplink: '/music?mood=calm',
    emoji: '🎵'
  }
];

export const useNudges = () => {
  const store = useDashboardStore();

  useEffect(() => {
    const fetchNudge = async () => {
      try {
        store.setLoading('nudge', true);
        
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Show nudge based on time of day and random chance
        const hour = new Date().getHours();
        const shouldShowNudge = Math.random() > 0.3; // 70% chance
        
        if (!shouldShowNudge) {
          store.setNudge(null);
          return;
        }

        // Different nudges based on time of day
        let availableNudges = [...MOCK_NUDGES];
        
        if (hour >= 12 && hour < 14) {
          // Lunch time - prioritize micro-break
          availableNudges = MOCK_NUDGES.filter(n => n.deeplink.includes('screen-silk'));
        } else if (hour >= 18) {
          // Evening - prioritize calm activities
          availableNudges = MOCK_NUDGES.filter(n => 
            n.deeplink.includes('music') || n.deeplink.includes('journal')
          );
        }
        
        const randomNudge = availableNudges[Math.floor(Math.random() * availableNudges.length)];
        store.setNudge(randomNudge);
      } catch (error) {
        console.error('Failed to fetch nudge:', error);
        store.setNudge(null);
      } finally {
        store.setLoading('nudge', false);
      }
    };

    if (store.nudge === null && !store.loading.nudge) {
      fetchNudge();
    }
  }, []); // Empty dependencies to run only once

  return {
    nudge: store.nudge,
    loading: store.loading.nudge
  };
};