/**
 * useTrackFeedback - Hook pour le feedback sur les recommandations musicales
 * Améliore les recommandations futures basées sur les réactions utilisateur
 */

import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';
import type { MusicTrack } from '@/types/music';

export type FeedbackType = 'like' | 'dislike' | 'skip' | 'complete' | 'save';

interface TrackFeedback {
  trackId: string;
  type: FeedbackType;
  rating?: number; // 1-5
  context?: {
    emotion?: string;
    mood?: string;
    source?: string; // 'recommendation' | 'search' | 'playlist'
    listenDuration?: number;
  };
  createdAt: string;
}

interface UseTrackFeedbackReturn {
  submitFeedback: (track: MusicTrack, type: FeedbackType, rating?: number) => Promise<void>;
  getFeedbackForTrack: (trackId: string) => TrackFeedback | null;
  isLoading: boolean;
  feedbackHistory: TrackFeedback[];
}

const FEEDBACK_STORAGE_KEY = 'music:track-feedback';

export function useTrackFeedback(): UseTrackFeedbackReturn {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackHistory, setFeedbackHistory] = useState<TrackFeedback[]>(() => {
    try {
      const stored = localStorage.getItem(FEEDBACK_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save feedback locally and optionally to DB
  const submitFeedback = useCallback(async (
    track: MusicTrack,
    type: FeedbackType,
    rating?: number
  ) => {
    setIsLoading(true);

    const feedback: TrackFeedback = {
      trackId: track.id,
      type,
      rating: rating ? Math.max(1, Math.min(5, rating)) : undefined,
      context: {
        emotion: track.emotion,
        mood: track.mood,
        source: track.isGenerated ? 'generated' : 'library',
      },
      createdAt: new Date().toISOString(),
    };

    try {
      // Update local state
      setFeedbackHistory(prev => {
        const filtered = prev.filter(f => f.trackId !== track.id);
        const updated = [feedback, ...filtered].slice(0, 500); // Keep last 500
        localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });

      // Persist to Supabase if authenticated
      if (user) {
        try {
          await supabase.from('music_track_feedback').upsert({
            user_id: user.id,
            track_id: track.id,
            feedback_type: type,
            rating: rating || null,
            emotion_match: track.emotion ? true : null,
            notes: null,
            context: {
              title: track.title,
              artist: track.artist,
              isGenerated: track.isGenerated,
              emotion: track.emotion || null,
              mood: track.mood || null,
            },
          }, { onConflict: 'user_id,track_id' });
        } catch (dbError) {
          // Table might not exist yet, continue with local storage
          logger.warn('Could not persist feedback to DB', dbError as Error, 'MUSIC');
        }
      }

      // Show feedback to user based on type
      if (type === 'like') {
        toast.success('Merci pour votre avis !', {
          description: 'Nous améliorerons vos recommandations.',
        });
      } else if (type === 'dislike') {
        toast.info('Feedback enregistré', {
          description: 'Nous proposerons moins de titres similaires.',
        });
      }

      logger.info('Track feedback submitted', { 
        trackId: track.id, 
        type, 
        rating 
      }, 'MUSIC');

    } catch (error) {
      logger.error('Failed to submit feedback', error as Error, 'MUSIC');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Get feedback for a specific track
  const getFeedbackForTrack = useCallback((trackId: string): TrackFeedback | null => {
    return feedbackHistory.find(f => f.trackId === trackId) || null;
  }, [feedbackHistory]);

  return {
    submitFeedback,
    getFeedbackForTrack,
    isLoading,
    feedbackHistory,
  };
}

export default useTrackFeedback;
