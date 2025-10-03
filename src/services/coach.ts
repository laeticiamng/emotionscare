/**
 * Service de coaching IA EmotionsCare
 * Connexion OpenAI GPT-5 pour conseils personnalisés
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface CoachPersonality {
  name: string;
  approach: 'empathetic' | 'motivational' | 'analytical' | 'spiritual';
  specialties: string[];
  tone: 'warm' | 'professional' | 'friendly' | 'gentle';
}

export interface CoachingSession {
  id: string;
  user_id: string;
  coach_personality: CoachPersonality;
  messages: CoachMessage[];
  emotional_context: {
    current_emotion: string;
    intensity: number;
    triggers?: string[];
    goals?: string[];
  };
  created_at: string;
  updated_at: string;
}

export interface CoachMessage {
  id: string;
  role: 'user' | 'coach' | 'system';
  content: string;
  timestamp: string;
  emotion_analysis?: {
    detected_emotion: string;
    confidence: number;
  };
}

export interface CoachingRecommendation {
  title: string;
  description: string;
  category: 'breathing' | 'mindfulness' | 'exercise' | 'reflection' | 'action';
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  instructions: string[];
}

class CoachService {
  private defaultPersonalities: CoachPersonality[] = [
    {
      name: 'Sofia - Coach Empathique',
      approach: 'empathetic',
      specialties: ['Gestion des émotions', 'Écoute active', 'Soutien émotionnel'],
      tone: 'warm'
    },
    {
      name: 'Marcus - Coach Motivationnel',
      approach: 'motivational',
      specialties: ['Objectifs', 'Performance', 'Dépassement de soi'],
      tone: 'professional'
    },
    {
      name: 'Luna - Coach Mindfulness',
      approach: 'spiritual',
      specialties: ['Méditation', 'Pleine conscience', 'Spiritualité'],
      tone: 'gentle'
    },
    {
      name: 'Alex - Coach Analytique',
      approach: 'analytical',
      specialties: ['Résolution de problèmes', 'Stratégies', 'Analyse comportementale'],
      tone: 'friendly'
    }
  ];

  /**
   * Démarrage d'une session de coaching
   */
  async startCoachingSession(
    userId: string,
    emotionalContext: {
      current_emotion: string;
      intensity: number;
      triggers?: string[];
      goals?: string[];
    },
    preferredPersonality?: string
  ): Promise<CoachingSession> {
    try {
      const personality = this.selectPersonality(emotionalContext.current_emotion, preferredPersonality);
      
      const sessionData = {
        user_id: userId,
        coach_personality: personality,
        emotional_context: emotionalContext,
        status: 'active'
      };

      const { data, error } = await supabase
        .from('coaching_sessions')
        .insert(sessionData)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        user_id: data.user_id,
        coach_personality: data.coach_personality,
        messages: [],
        emotional_context: data.emotional_context,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      logger.error('Error starting coaching session', error, 'coach.legacy');
      throw new Error('Impossible de démarrer la session de coaching');
    }
  }

  /**
   * Envoi d'un message au coach IA
   */
  async sendMessage(
    sessionId: string,
    message: string,
    userId: string
  ): Promise<{
    coachResponse: string;
    recommendations?: CoachingRecommendation[];
    emotionAnalysis?: {
      detected_emotion: string;
      confidence: number;
    };
  }> {
    try {
      // Récupérer la session
      const { data: session, error: sessionError } = await supabase
        .from('coaching_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('user_id', userId)
        .single();

      if (sessionError) throw sessionError;

      // Récupérer l'historique des messages
      const { data: messageHistory } = await supabase
        .from('coaching_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      // Envoyer le message au coach IA
      const { data, error } = await supabase.functions.invoke('coach-ai', {
        body: {
          userMessage: message,
          personality: session.coach_personality,
          context: session.emotional_context,
          conversationHistory: messageHistory || [],
          isOpening: !messageHistory || messageHistory.length === 0
        }
      });

      if (error) throw error;

      // Sauvegarder les messages
      await this.saveMessages(sessionId, [
        {
          role: 'user',
          content: message,
          timestamp: new Date().toISOString()
        },
        {
          role: 'coach',
          content: data.response,
          timestamp: new Date().toISOString()
        }
      ]);

      // Extraire les recommandations si présentes
      const recommendations = this.extractRecommendations(data.response, session.emotional_context.current_emotion);

      return {
        coachResponse: data.response,
        recommendations: recommendations.length > 0 ? recommendations : undefined,
        emotionAnalysis: data.emotion_analysis
      };
    } catch (error) {
      logger.error('Error sending message to coach', error, 'coach.legacy');
      throw new Error('Impossible de communiquer avec le coach');
    }
  }

  /**
   * Récupération des recommendations personnalisées
   */
  async getPersonalizedRecommendations(
    emotion: string,
    intensity: number,
    userPreferences?: {
      preferred_activities?: string[];
      time_available?: number;
      difficulty_preference?: 'easy' | 'medium' | 'hard';
    }
  ): Promise<CoachingRecommendation[]> {
    const baseRecommendations = this.getBaseRecommendations(emotion, intensity);
    
    if (!userPreferences) return baseRecommendations;

    // Filtrer selon les préférences
    return baseRecommendations
      .filter(rec => {
        if (userPreferences.difficulty_preference) {
          return rec.difficulty === userPreferences.difficulty_preference;
        }
        return true;
      })
      .filter(rec => {
        if (userPreferences.preferred_activities) {
          return userPreferences.preferred_activities.some(pref => 
            rec.category.includes(pref.toLowerCase()) || 
            rec.title.toLowerCase().includes(pref.toLowerCase())
          );
        }
        return true;
      })
      .slice(0, 5); // Max 5 recommandations
  }

  /**
   * Historique des sessions de coaching
   */
  async getUserCoachingSessions(userId: string, limit: number = 10): Promise<CoachingSession[]> {
    try {
      const { data, error } = await supabase
        .from('coaching_sessions')
        .select(`
          *,
          coaching_messages(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data.map(session => ({
        id: session.id,
        user_id: session.user_id,
        coach_personality: session.coach_personality,
        messages: session.coaching_messages || [],
        emotional_context: session.emotional_context,
        created_at: session.created_at,
        updated_at: session.updated_at
      }));
    } catch (error) {
      logger.error('Error fetching coaching sessions', error, 'coach.legacy');
      return [];
    }
  }

  /**
   * Analyse des progrès de coaching
   */
  async getCoachingProgress(userId: string, days: number = 30): Promise<{
    total_sessions: number;
    average_session_length: number;
    dominant_emotions: string[];
    improvement_areas: string[];
    consistency_score: number;
    next_recommended_session: {
      suggested_time: string;
      focus_area: string;
      personality: CoachPersonality;
    };
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-coach', {
        body: {
          action: 'analyze_progress',
          userId,
          timeframe: days
        }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      logger.error('Error analyzing coaching progress', error, 'coach.legacy');
      return {
        total_sessions: 0,
        average_session_length: 0,
        dominant_emotions: ['neutral'],
        improvement_areas: ['Gestion du stress'],
        consistency_score: 0,
        next_recommended_session: {
          suggested_time: 'morning',
          focus_area: 'mindfulness',
          personality: this.defaultPersonalities[0]
        }
      };
    }
  }

  /**
   * Sélection de la personnalité de coach appropriée
   */
  private selectPersonality(emotion: string, preferred?: string): CoachPersonality {
    if (preferred) {
      const found = this.defaultPersonalities.find(p => p.name.includes(preferred));
      if (found) return found;
    }

    // Sélection basée sur l'émotion
    const emotionMapping: Record<string, number> = {
      sad: 0, // Empathique
      angry: 1, // Motivationnel
      anxious: 2, // Mindfulness
      confused: 3, // Analytique
    };

    const index = emotionMapping[emotion] ?? 0;
    return this.defaultPersonalities[index];
  }

  /**
   * Sauvegarde des messages de coaching
   */
  private async saveMessages(sessionId: string, messages: Partial<CoachMessage>[]): Promise<void> {
    try {
      const messagesToInsert = messages.map(msg => ({
        session_id: sessionId,
        role: msg.role,
        content: msg.content,
        created_at: msg.timestamp
      }));

      const { error } = await supabase
        .from('coaching_messages')
        .insert(messagesToInsert);

      if (error) throw error;
    } catch (error) {
      logger.error('Error saving coaching messages', error, 'coach.legacy');
    }
  }

  /**
   * Extraction des recommandations du texte de réponse
   */
  private extractRecommendations(response: string, emotion: string): CoachingRecommendation[] {
    // Cette fonction pourrait être améliorée avec du NLP
    // Pour l'instant, retourne des recommandations basées sur l'émotion
    return this.getBaseRecommendations(emotion, 0.7).slice(0, 3);
  }

  /**
   * Recommandations de base par émotion
   */
  private getBaseRecommendations(emotion: string, intensity: number): CoachingRecommendation[] {
    const recommendations: Record<string, CoachingRecommendation[]> = {
      sad: [
        {
          title: 'Respiration de réconfort',
          description: 'Une technique de respiration douce pour apaiser la tristesse',
          category: 'breathing',
          duration: '5-10 minutes',
          difficulty: 'easy',
          instructions: [
            'Asseyez-vous confortablement',
            'Inspirez lentement par le nez (4 secondes)',
            'Retenez votre souffle (2 secondes)',
            'Expirez par la bouche (6 secondes)',
            'Répétez en vous concentrant sur la sensation d\'apaisement'
          ]
        }
      ],
      anxious: [
        {
          title: 'Technique 5-4-3-2-1',
          description: 'Grounding technique pour réduire l\'anxiété',
          category: 'mindfulness',
          duration: '3-5 minutes',
          difficulty: 'easy',
          instructions: [
            'Identifiez 5 choses que vous voyez',
            'Identifiez 4 choses que vous touchez',
            'Identifiez 3 choses que vous entendez',
            'Identifiez 2 choses que vous sentez',
            'Identifiez 1 chose que vous goûtez'
          ]
        }
      ],
      happy: [
        {
          title: 'Gratitude active',
          description: 'Amplifiez votre joie par la reconnaissance',
          category: 'reflection',
          duration: '5 minutes',
          difficulty: 'easy',
          instructions: [
            'Pensez à 3 choses qui vous rendent heureux',
            'Pour chacune, exprimez pourquoi vous êtes reconnaissant',
            'Visualisez ces moments positifs',
            'Partagez cette gratitude avec quelqu\'un'
          ]
        }
      ]
    };

    return recommendations[emotion] || recommendations.happy;
  }
}

export const coachService = new CoachService();
export default coachService;