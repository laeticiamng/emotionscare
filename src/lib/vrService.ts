// @ts-nocheck

import { supabase } from '@/integrations/supabase/client';
import { VRSession, VRSessionTemplate, VRSessionFeedback } from '@/types/vr';

/**
 * VR Service - Communicates with router-wellness Edge Function
 */
const VRService = {
  /**
   * Get available VR session templates
   */
  getTemplates: async (): Promise<VRSessionTemplate[]> => {
    try {
      const { data, error } = await supabase.functions.invoke('router-wellness', {
        body: { action: 'vr-templates', payload: {} }
      });

      if (error) throw error;

      return (data?.templates || []).map((t: any) => ({
        id: t.id,
        name: t.name,
        title: t.name,
        description: t.description,
        duration: t.duration_seconds || 600,
        thumbnailUrl: t.thumbnail_url || '/images/vr/default-thumb.jpg',
        environmentId: t.environment_id,
        category: t.category || 'relaxation',
        intensity: t.intensity || 3,
        difficulty: t.difficulty || 'medium',
        immersionLevel: t.immersion_level || 'medium',
        goalType: t.goal_type || 'relaxation',
        interactive: t.is_interactive || false,
        tags: t.tags || [],
        recommendedMood: t.recommended_mood || 'calm'
      }));
    } catch (error) {
      console.error('[VRService] Error fetching templates:', error);
      // Fallback to default templates
      return getDefaultTemplates();
    }
  },

  /**
   * Get user's VR session history
   */
  getUserSessions: async (userId?: string, options: { limit?: number; type?: string } = {}): Promise<VRSession[]> => {
    try {
      const { data, error } = await supabase.functions.invoke('router-wellness', {
        body: { 
          action: 'vr-history', 
          payload: { 
            limit: options.limit || 20,
            type: options.type 
          }
        }
      });

      if (error) throw error;

      return (data?.sessions || []).map(mapSessionFromDB);
    } catch (error) {
      console.error('[VRService] Error fetching sessions:', error);
      return [];
    }
  },

  /**
   * Start a new VR session
   */
  startSession: async (userId: string, templateId: string, environment?: string): Promise<VRSession> => {
    try {
      const { data, error } = await supabase.functions.invoke('router-wellness', {
        body: { 
          action: 'vr-start', 
          payload: { 
            templateId,
            environment: environment || 'default'
          }
        }
      });

      if (error) throw error;

      return mapSessionFromDB(data?.session);
    } catch (error) {
      console.error('[VRService] Error starting session:', error);
      throw error;
    }
  },

  /**
   * End an active VR session
   */
  endSession: async (sessionId: string, feedback?: {
    rating?: number;
    emotionBefore?: string;
    emotionAfter?: string;
    comment?: string;
    stressReduction?: number;
    metrics?: Record<string, any>;
  }): Promise<VRSession> => {
    try {
      const { data, error } = await supabase.functions.invoke('router-wellness', {
        body: { 
          action: 'vr-complete', 
          payload: {
            sessionId,
            rating: feedback?.rating,
            moodBefore: feedback?.emotionBefore,
            moodAfter: feedback?.emotionAfter,
            stressReduction: feedback?.stressReduction,
            metrics: feedback?.metrics
          }
        }
      });

      if (error) throw error;

      return {
        id: sessionId,
        templateId: '',
        userId: '',
        startTime: '',
        duration: 0,
        completed: true,
        progress: 1,
        feedback: feedback ? {
          id: `feedback-${Date.now()}`,
          sessionId,
          userId: '',
          timestamp: new Date().toISOString(),
          rating: feedback.rating || 5,
          emotionBefore: feedback.emotionBefore || 'neutral',
          emotionAfter: feedback.emotionAfter || 'calm',
          comment: feedback.comment || ''
        } : undefined
      };
    } catch (error) {
      console.error('[VRService] Error ending session:', error);
      throw error;
    }
  },

  /**
   * Get VR session metrics summary
   */
  getMetrics: async (days: number = 30): Promise<{
    totalSessions: number;
    totalMinutes: number;
    avgStressReduction: number;
    avgMoodImprovement: number;
    metrics: any[];
  }> => {
    try {
      const { data, error } = await supabase.functions.invoke('router-wellness', {
        body: { 
          action: 'vr-metrics', 
          payload: { days }
        }
      });

      if (error) throw error;

      return {
        totalSessions: data?.summary?.totalSessions || 0,
        totalMinutes: data?.summary?.totalMinutes || 0,
        avgStressReduction: data?.summary?.avgStressReduction || 0,
        avgMoodImprovement: data?.summary?.avgMoodImprovement || 0,
        metrics: data?.metrics || []
      };
    } catch (error) {
      console.error('[VRService] Error fetching metrics:', error);
      return {
        totalSessions: 0,
        totalMinutes: 0,
        avgStressReduction: 0,
        avgMoodImprovement: 0,
        metrics: []
      };
    }
  }
};

// Helper function to map DB session to VRSession type
function mapSessionFromDB(session: any): VRSession {
  if (!session) return {} as VRSession;
  
  return {
    id: session.id,
    templateId: session.template_id,
    userId: session.user_id,
    startTime: session.started_at,
    endTime: session.completed_at,
    duration: session.duration_seconds || 0,
    completed: session.status === 'completed',
    progress: session.status === 'completed' ? 1 : 0,
    metrics: session.metrics,
    feedback: session.rating ? {
      id: `feedback-${session.id}`,
      sessionId: session.id,
      userId: session.user_id,
      timestamp: session.completed_at,
      rating: session.rating,
      emotionBefore: session.mood_before,
      emotionAfter: session.mood_after,
      comment: ''
    } : undefined
  };
}

// Fallback templates when API is unavailable
function getDefaultTemplates(): VRSessionTemplate[] {
  return [
    {
      id: 'galaxy-calm',
      name: 'VR Galaxy - Calm',
      title: 'VR Galaxy - Voyage Cosmique Apaisant',
      description: 'Explorez une galaxie sereine avec des étoiles apaisantes et de la musique ambiante',
      duration: 600,
      thumbnailUrl: '/images/vr/galaxy-thumb.jpg',
      environmentId: 'env-galaxy',
      category: 'relaxation',
      intensity: 2,
      difficulty: 'easy',
      immersionLevel: 'high',
      goalType: 'relaxation',
      interactive: false,
      tags: ['calm', 'space', 'ambient'],
      recommendedMood: 'calm'
    },
    {
      id: 'breath-ocean',
      name: 'VR Breath - Ocean',
      title: 'VR Breath - Cohérence Cardiaque Océanique',
      description: 'Exercices de respiration guidés au rythme des vagues de l\'océan',
      duration: 300,
      thumbnailUrl: '/images/vr/ocean-thumb.jpg',
      environmentId: 'env-ocean',
      category: 'breathing',
      intensity: 3,
      difficulty: 'easy',
      immersionLevel: 'medium',
      goalType: 'focus',
      interactive: true,
      tags: ['breathing', 'ocean', 'coherence'],
      recommendedMood: 'neutral'
    },
    {
      id: 'forest-mindfulness',
      name: 'VR Forest - Mindfulness',
      title: 'VR Forest - Méditation en Forêt',
      description: 'Méditation guidée dans une forêt immersive avec sons de la nature',
      duration: 900,
      thumbnailUrl: '/images/vr/forest-thumb.jpg',
      environmentId: 'env-forest',
      category: 'meditation',
      intensity: 2,
      difficulty: 'medium',
      immersionLevel: 'high',
      goalType: 'mindfulness',
      interactive: false,
      tags: ['forest', 'meditation', 'nature'],
      recommendedMood: 'peaceful'
    }
  ];
}

export default VRService;
