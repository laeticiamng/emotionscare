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
  const { nudge, loading, setNudge, setLoading } = useDashboardStore();

  useEffect(() => {
    const fetchNudge = async () => {
      try {
        setLoading('nudge', true);
        
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Show nudge based on time of day and random chance
        const hour = new Date().getHours();
        const shouldShowNudge = Math.random() > 0.3; // 70% chance
        
        if (!shouldShowNudge) {
          setNudge(null);
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
        setNudge(randomNudge);
      } catch (error) {
        console.error('Failed to fetch nudge:', error);
        setNudge(null);
      } finally {
        setLoading('nudge', false);
      }
    };

    if (nudge === null && !loading.nudge) {
      fetchNudge();
    }
  }, [nudge, loading.nudge, setNudge, setLoading]);

  return {
    nudge,
    loading: loading.nudge
  };
};