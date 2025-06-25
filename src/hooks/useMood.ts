
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MoodState {
  valence: number; // -100 à +100 (négatif à positif)
  arousal: number; // 0 à 100 (calme à excité)
  timestamp: string;
  isLoading: boolean;
  error: string | null;
}

interface MoodStore extends MoodState {
  updateMood: (valence: number, arousal: number) => void;
  fetchCurrentMood: () => Promise<void>;
  resetMood: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Store Zustand avec persistance
export const useMoodStore = create<MoodStore>()(
  persist(
    (set, get) => ({
      // État initial
      valence: 0,
      arousal: 50,
      timestamp: new Date().toISOString(),
      isLoading: false,
      error: null,

      // Actions
      updateMood: (valence: number, arousal: number) => {
        set({
          valence: Math.max(-100, Math.min(100, valence)),
          arousal: Math.max(0, Math.min(100, arousal)),
          timestamp: new Date().toISOString(),
          error: null
        });

        // Publier l'événement mood.updated (simulation)
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('mood.updated', {
            detail: { valence, arousal, timestamp: new Date().toISOString() }
          }));
        }
      },

      fetchCurrentMood: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulation de l'appel API
          // En production: const response = await fetch('/edge/humeur/current?user_id=' + userId);
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Données mockées pour le développement
          const mockMood = {
            valence: Math.floor(Math.random() * 201) - 100, // -100 à +100
            arousal: Math.floor(Math.random() * 101), // 0 à 100
            timestamp: new Date().toISOString()
          };

          set({
            ...mockMood,
            isLoading: false,
            error: null
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Erreur inconnue'
          });
        }
      },

      resetMood: () => {
        set({
          valence: 0,
          arousal: 50,
          timestamp: new Date().toISOString(),
          error: null
        });
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error })
    }),
    {
      name: 'emotions-care-mood',
      version: 1,
    }
  )
);

// Hook principal pour utiliser le mood
export const useMood = () => {
  const store = useMoodStore();

  // Auto-fetch au premier montage si pas de données récentes
  React.useEffect(() => {
    const lastUpdate = new Date(store.timestamp);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastUpdate.getTime()) / (1000 * 60);

    // Refresh si les données ont plus de 30 minutes
    if (diffMinutes > 30) {
      store.fetchCurrentMood();
    }
  }, []);

  // Écoute des événements mood.updated (WebSocket simulation)
  React.useEffect(() => {
    const handleMoodUpdate = (event: CustomEvent) => {
      const { valence, arousal, timestamp } = event.detail;
      useMoodStore.setState({ valence, arousal, timestamp });
    };

    window.addEventListener('mood.updated', handleMoodUpdate as EventListener);
    
    return () => {
      window.removeEventListener('mood.updated', handleMoodUpdate as EventListener);
    };
  }, []);

  return store;
};

// Helpers pour adapter l'UI selon l'humeur
export const getMoodColor = (valence: number, arousal: number): string => {
  if (valence > 50 && arousal > 70) return '#10b981'; // Vert énergique
  if (valence > 50 && arousal < 30) return '#3b82f6'; // Bleu calme positif
  if (valence < -50 && arousal > 70) return '#ef4444'; // Rouge agité
  if (valence < -50 && arousal < 30) return '#6b7280'; // Gris triste
  return '#8b5cf6'; // Violet neutre
};

export const getMoodEmoji = (valence: number, arousal: number): string => {
  if (valence > 50 && arousal > 70) return '🎉';
  if (valence > 50 && arousal < 30) return '😌';
  if (valence < -50 && arousal > 70) return '😤';
  if (valence < -50 && arousal < 30) return '😔';
  return '😐';
};

export const getMoodDescription = (valence: number, arousal: number): string => {
  if (valence > 50 && arousal > 70) return 'Énergique et joyeux';
  if (valence > 50 && arousal < 30) return 'Calme et serein';
  if (valence < -50 && arousal > 70) return 'Stressé et agité';
  if (valence < -50 && arousal < 30) return 'Fatigué et morose';
  return 'Humeur neutre';
};
