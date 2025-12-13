/**
 * AI Coach Service Enriched - Service avancé pour le coaching IA
 * Inclut personnalisation, mémoire conversationnelle, et recommandations adaptatives
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export type CoachPersonality = 
  | 'empathic' // Empathique et chaleureux
  | 'motivational' // Motivant et dynamique
  | 'mindful' // Orienté pleine conscience
  | 'analytical' // Analytique et structuré
  | 'supportive' // Soutien inconditionnel
  | 'challenging'; // Défie pour progresser

export type EmotionalState = 
  | 'anxious' | 'stressed' | 'sad' | 'angry' | 'neutral' 
  | 'calm' | 'happy' | 'excited' | 'overwhelmed' | 'hopeful';

export interface CoachContext {
  userId: string;
  sessionId: string;
  personality: CoachPersonality;
  currentEmotion: EmotionalState;
  conversationHistory: ConversationMessage[];
  userProfile: UserCoachProfile;
  sessionGoals: string[];
  suggestedTechniques: string[];
}

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  emotion?: EmotionalState;
  intent?: string;
  techniques?: string[];
}

export interface UserCoachProfile {
  preferredPersonality: CoachPersonality;
  emotionPatterns: Record<EmotionalState, number>;
  effectiveTechniques: TechniqueEffectiveness[];
  triggerPatterns: string[];
  growthAreas: string[];
  strengths: string[];
  sessionCount: number;
  averageSatisfaction: number;
}

export interface TechniqueEffectiveness {
  technique: string;
  usageCount: number;
  avgEffectiveness: number; // 1-5
  bestForEmotions: EmotionalState[];
}

export interface CoachResponse {
  message: string;
  emotion: EmotionalState;
  suggestedTechniques: TechniqueRecommendation[];
  followUpQuestions: string[];
  resources: Resource[];
  crisisDetected: boolean;
  sessionInsights: string[];
}

export interface TechniqueRecommendation {
  id: string;
  name: string;
  description: string;
  duration: number; // minutes
  effectiveness: number; // predicted 1-5
  steps: string[];
  suitable: boolean;
}

export interface Resource {
  type: 'article' | 'video' | 'exercise' | 'meditation' | 'external';
  title: string;
  description: string;
  url?: string;
  duration?: number;
}

// Techniques de coaching disponibles
const COACHING_TECHNIQUES: Record<string, TechniqueRecommendation> = {
  'breathing-4-7-8': {
    id: 'breathing-4-7-8',
    name: 'Respiration 4-7-8',
    description: 'Technique de respiration calmante du Dr. Weil',
    duration: 5,
    effectiveness: 4.5,
    steps: [
      'Inspirez par le nez pendant 4 secondes',
      'Retenez votre souffle pendant 7 secondes',
      'Expirez lentement par la bouche pendant 8 secondes',
      'Répétez 4 cycles',
    ],
    suitable: true,
  },
  'grounding-5-4-3-2-1': {
    id: 'grounding-5-4-3-2-1',
    name: 'Ancrage sensoriel 5-4-3-2-1',
    description: 'Technique d\'ancrage pour l\'anxiété',
    duration: 3,
    effectiveness: 4.2,
    steps: [
      'Nommez 5 choses que vous voyez',
      'Nommez 4 choses que vous touchez',
      'Nommez 3 choses que vous entendez',
      'Nommez 2 choses que vous sentez',
      'Nommez 1 chose que vous goûtez',
    ],
    suitable: true,
  },
  'body-scan': {
    id: 'body-scan',
    name: 'Scan corporel',
    description: 'Exploration progressive du corps pour relâcher les tensions',
    duration: 10,
    effectiveness: 4.0,
    steps: [
      'Allongez-vous confortablement',
      'Portez attention à vos pieds',
      'Remontez progressivement le long du corps',
      'Notez les tensions sans jugement',
      'Relâchez chaque zone consciemment',
    ],
    suitable: true,
  },
  'cognitive-reframing': {
    id: 'cognitive-reframing',
    name: 'Recadrage cognitif',
    description: 'Transformer les pensées négatives en perspectives constructives',
    duration: 8,
    effectiveness: 4.3,
    steps: [
      'Identifiez la pensée négative',
      'Questionnez sa validité',
      'Cherchez des preuves contraires',
      'Formulez une pensée alternative équilibrée',
      'Notez comment vous vous sentez',
    ],
    suitable: true,
  },
  'gratitude-practice': {
    id: 'gratitude-practice',
    name: 'Pratique de gratitude',
    description: 'Cultiver la reconnaissance pour améliorer le bien-être',
    duration: 5,
    effectiveness: 4.1,
    steps: [
      'Prenez 3 respirations profondes',
      'Pensez à 3 choses pour lesquelles vous êtes reconnaissant',
      'Pour chacune, ressentez vraiment la gratitude',
      'Notez-les si possible',
    ],
    suitable: true,
  },
  'progressive-muscle-relaxation': {
    id: 'progressive-muscle-relaxation',
    name: 'Relaxation musculaire progressive',
    description: 'Tension et relâchement des muscles pour la détente profonde',
    duration: 15,
    effectiveness: 4.4,
    steps: [
      'Installez-vous confortablement',
      'Contractez les muscles des pieds pendant 5 secondes',
      'Relâchez et ressentez la détente',
      'Remontez progressivement vers le visage',
      'Terminez par une détente globale',
    ],
    suitable: true,
  },
};

// Mapping émotions -> techniques recommandées
const EMOTION_TECHNIQUE_MAP: Record<EmotionalState, string[]> = {
  anxious: ['breathing-4-7-8', 'grounding-5-4-3-2-1', 'body-scan'],
  stressed: ['breathing-4-7-8', 'progressive-muscle-relaxation', 'body-scan'],
  sad: ['gratitude-practice', 'cognitive-reframing', 'body-scan'],
  angry: ['breathing-4-7-8', 'progressive-muscle-relaxation', 'cognitive-reframing'],
  neutral: ['gratitude-practice', 'body-scan'],
  calm: ['gratitude-practice', 'body-scan'],
  happy: ['gratitude-practice'],
  excited: ['breathing-4-7-8', 'body-scan'],
  overwhelmed: ['grounding-5-4-3-2-1', 'breathing-4-7-8', 'progressive-muscle-relaxation'],
  hopeful: ['gratitude-practice', 'cognitive-reframing'],
};

class AICoachServiceEnriched {
  private context: CoachContext | null = null;

  /**
   * Initialize a new coaching session
   */
  async initializeSession(
    userId: string,
    personality: CoachPersonality = 'empathic'
  ): Promise<CoachContext> {
    const sessionId = crypto.randomUUID();

    // Load user profile
    const userProfile = await this.loadUserProfile(userId);

    // Create context
    this.context = {
      userId,
      sessionId,
      personality: userProfile.preferredPersonality || personality,
      currentEmotion: 'neutral',
      conversationHistory: [],
      userProfile,
      sessionGoals: [],
      suggestedTechniques: [],
    };

    // Log session start
    await this.logSessionEvent('session_started', { personality, sessionId });

    logger.info('Coach session initialized', { sessionId, personality }, 'AI_COACH');

    return this.context;
  }

  /**
   * Load user's coaching profile
   */
  private async loadUserProfile(userId: string): Promise<UserCoachProfile> {
    try {
      const { data } = await supabase
        .from('user_settings')
        .select('value')
        .eq('user_id', userId)
        .eq('key', 'coach_profile')
        .maybeSingle();

      if (data?.value) {
        return JSON.parse(data.value);
      }
    } catch (err) {
      logger.error('Failed to load coach profile', err as Error, 'AI_COACH');
    }

    // Return default profile
    return {
      preferredPersonality: 'empathic',
      emotionPatterns: {} as Record<EmotionalState, number>,
      effectiveTechniques: [],
      triggerPatterns: [],
      growthAreas: [],
      strengths: [],
      sessionCount: 0,
      averageSatisfaction: 0,
    };
  }

  /**
   * Save user's coaching profile
   */
  private async saveUserProfile(profile: UserCoachProfile): Promise<void> {
    if (!this.context) return;

    try {
      await supabase.from('user_settings').upsert({
        user_id: this.context.userId,
        key: 'coach_profile',
        value: JSON.stringify(profile),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,key' });
    } catch (err) {
      logger.error('Failed to save coach profile', err as Error, 'AI_COACH');
    }
  }

  /**
   * Process user message and generate response
   */
  async processMessage(userMessage: string): Promise<CoachResponse> {
    if (!this.context) {
      throw new Error('Session not initialized');
    }

    // Detect emotion from message
    const detectedEmotion = await this.detectEmotion(userMessage);
    this.context.currentEmotion = detectedEmotion;

    // Add to conversation history
    this.context.conversationHistory.push({
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
      emotion: detectedEmotion,
    });

    // Check for crisis indicators
    const crisisDetected = this.detectCrisis(userMessage);

    // Get recommended techniques
    const techniques = this.getRecommendedTechniques(detectedEmotion);

    // Generate response via edge function
    const response = await this.generateResponse(userMessage, detectedEmotion, techniques);

    // Add assistant response to history
    this.context.conversationHistory.push({
      role: 'assistant',
      content: response.message,
      timestamp: new Date().toISOString(),
      techniques: response.suggestedTechniques.map(t => t.id),
    });

    // Update emotion patterns
    this.updateEmotionPatterns(detectedEmotion);

    // Log message
    await this.logSessionEvent('message_exchanged', {
      userEmotion: detectedEmotion,
      techniquesOffered: techniques.length,
    });

    return {
      ...response,
      crisisDetected,
    };
  }

  /**
   * Detect emotion from text using heuristics and keywords
   */
  private async detectEmotion(text: string): Promise<EmotionalState> {
    const lower = text.toLowerCase();

    // Keyword-based detection (simplified - in production, use ML model)
    const emotionKeywords: Record<EmotionalState, string[]> = {
      anxious: ['anxieux', 'inquiet', 'peur', 'angoisse', 'nerveux', 'tendu', 'panic'],
      stressed: ['stress', 'pressé', 'débordé', 'submergé', 'deadline', 'travail'],
      sad: ['triste', 'déprimé', 'malheureux', 'pleurer', 'seul', 'vide', 'désespoir'],
      angry: ['colère', 'énervé', 'frustré', 'agacé', 'furieux', 'rage'],
      neutral: ['normal', 'ordinaire', 'habituel', 'classique'],
      calm: ['calme', 'serein', 'paisible', 'tranquille', 'relaxé', 'détendu'],
      happy: ['heureux', 'content', 'joyeux', 'bien', 'super', 'génial', 'sourire'],
      excited: ['excité', 'enthousiaste', 'impatient', 'motivé', 'énergique'],
      overwhelmed: ['submergé', 'trop', 'incapable', 'écrasé', 'impossible'],
      hopeful: ['espoir', 'optimiste', 'confiant', 'positif', 'avenir'],
    };

    let detectedEmotion: EmotionalState = 'neutral';
    let maxScore = 0;

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      const score = keywords.filter(kw => lower.includes(kw)).length;
      if (score > maxScore) {
        maxScore = score;
        detectedEmotion = emotion as EmotionalState;
      }
    }

    return detectedEmotion;
  }

  /**
   * Detect crisis indicators in text
   */
  private detectCrisis(text: string): boolean {
    const crisisKeywords = [
      'suicide', 'mourir', 'en finir', 'plus la force', 
      'me faire du mal', 'disparaître', 'mort', 'tuer'
    ];

    const lower = text.toLowerCase();
    return crisisKeywords.some(kw => lower.includes(kw));
  }

  /**
   * Get recommended techniques based on emotion
   */
  private getRecommendedTechniques(emotion: EmotionalState): TechniqueRecommendation[] {
    const recommendedIds = EMOTION_TECHNIQUE_MAP[emotion] || [];
    const techniques: TechniqueRecommendation[] = [];

    for (const id of recommendedIds) {
      const technique = COACHING_TECHNIQUES[id];
      if (technique) {
        // Adjust effectiveness based on user history
        const userHistory = this.context?.userProfile.effectiveTechniques.find(
          t => t.technique === id
        );
        
        techniques.push({
          ...technique,
          effectiveness: userHistory?.avgEffectiveness || technique.effectiveness,
        });
      }
    }

    // Sort by effectiveness
    return techniques.sort((a, b) => b.effectiveness - a.effectiveness).slice(0, 3);
  }

  /**
   * Generate AI response via edge function
   */
  private async generateResponse(
    userMessage: string,
    emotion: EmotionalState,
    techniques: TechniqueRecommendation[]
  ): Promise<CoachResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-coach', {
        body: {
          message: userMessage,
          emotion,
          personality: this.context?.personality,
          conversationHistory: this.context?.conversationHistory.slice(-10),
          suggestedTechniques: techniques.map(t => t.id),
        },
      });

      if (error) throw error;

      return {
        message: data.response || this.getFallbackResponse(emotion),
        emotion,
        suggestedTechniques: techniques,
        followUpQuestions: data.followUpQuestions || [],
        resources: data.resources || [],
        crisisDetected: false,
        sessionInsights: data.insights || [],
      };
    } catch (err) {
      logger.error('AI Coach response failed', err as Error, 'AI_COACH');

      // Return fallback response
      return {
        message: this.getFallbackResponse(emotion),
        emotion,
        suggestedTechniques: techniques,
        followUpQuestions: [],
        resources: [],
        crisisDetected: false,
        sessionInsights: [],
      };
    }
  }

  /**
   * Get fallback response based on emotion
   */
  private getFallbackResponse(emotion: EmotionalState): string {
    const responses: Record<EmotionalState, string> = {
      anxious: "Je comprends que vous vous sentez anxieux. C'est une réaction naturelle. Voulez-vous essayer une technique de respiration pour vous aider à vous calmer ?",
      stressed: "Le stress peut être accablant. Prenons un moment ensemble pour identifier ce qui vous pèse le plus et trouver des solutions.",
      sad: "Je suis là pour vous. La tristesse fait partie de l'expérience humaine. Voulez-vous me parler de ce qui vous rend triste ?",
      angry: "Je vois que vous êtes en colère. C'est une émotion légitime. Essayons de comprendre ensemble ce qui a déclenché cette réaction.",
      neutral: "Comment puis-je vous aider aujourd'hui ? Je suis là pour vous accompagner.",
      calm: "C'est merveilleux que vous vous sentiez calme. Profitons de ce moment pour renforcer ce bien-être.",
      happy: "Quelle joie de vous savoir heureux ! Qu'est-ce qui contribue à ce sentiment positif ?",
      excited: "Votre enthousiasme est contagieux ! Parlez-moi de ce qui vous excite tant.",
      overwhelmed: "Je comprends que tout semble beaucoup en ce moment. Prenons les choses une par une, d'accord ?",
      hopeful: "C'est inspirant de vous sentir plein d'espoir. Cultivons ensemble cette énergie positive.",
    };

    return responses[emotion];
  }

  /**
   * Update emotion patterns in user profile
   */
  private updateEmotionPatterns(emotion: EmotionalState): void {
    if (!this.context) return;

    const patterns = this.context.userProfile.emotionPatterns;
    patterns[emotion] = (patterns[emotion] || 0) + 1;
    this.context.userProfile.emotionPatterns = patterns;
  }

  /**
   * Record technique feedback
   */
  async recordTechniqueFeedback(
    techniqueId: string,
    effectiveness: number // 1-5
  ): Promise<void> {
    if (!this.context) return;

    const profile = this.context.userProfile;
    const existing = profile.effectiveTechniques.find(t => t.technique === techniqueId);

    if (existing) {
      existing.usageCount++;
      existing.avgEffectiveness = 
        (existing.avgEffectiveness * (existing.usageCount - 1) + effectiveness) / existing.usageCount;
    } else {
      profile.effectiveTechniques.push({
        technique: techniqueId,
        usageCount: 1,
        avgEffectiveness: effectiveness,
        bestForEmotions: [this.context.currentEmotion],
      });
    }

    await this.saveUserProfile(profile);
    logger.info('Technique feedback recorded', { techniqueId, effectiveness }, 'AI_COACH');
  }

  /**
   * Complete session with rating
   */
  async completeSession(satisfaction: number, notes?: string): Promise<void> {
    if (!this.context) return;

    // Update profile
    const profile = this.context.userProfile;
    profile.sessionCount++;
    profile.averageSatisfaction = 
      (profile.averageSatisfaction * (profile.sessionCount - 1) + satisfaction) / profile.sessionCount;

    await this.saveUserProfile(profile);

    // Log session completion
    await this.logSessionEvent('session_completed', {
      satisfaction,
      notes,
      messagesCount: this.context.conversationHistory.length,
      duration: this.context.conversationHistory.length > 0
        ? new Date().getTime() - new Date(this.context.conversationHistory[0].timestamp).getTime()
        : 0,
    });

    // Save session to database
    await supabase.from('ai_coach_sessions').update({
      user_satisfaction: satisfaction,
      session_notes: notes,
      updated_at: new Date().toISOString(),
    }).eq('id', this.context.sessionId);

    logger.info('Coach session completed', { satisfaction, sessionId: this.context.sessionId }, 'AI_COACH');

    this.context = null;
  }

  /**
   * Log session event
   */
  private async logSessionEvent(event: string, data: Record<string, any>): Promise<void> {
    try {
      await supabase.from('activity_logs').insert({
        user_id: this.context?.userId,
        action: `coach_${event}`,
        details: {
          sessionId: this.context?.sessionId,
          ...data,
        },
      });
    } catch {
      // Ignore logging errors
    }
  }

  /**
   * Get session stats
   */
  async getSessionStats(userId: string): Promise<{
    totalSessions: number;
    avgSatisfaction: number;
    favoritePersonality: CoachPersonality;
    topTechniques: string[];
    emotionTrends: Record<EmotionalState, number>;
  }> {
    const profile = await this.loadUserProfile(userId);

    // Find favorite personality (most effective)
    const favoritePersonality = profile.preferredPersonality || 'empathic';

    // Get top techniques
    const topTechniques = profile.effectiveTechniques
      .sort((a, b) => b.avgEffectiveness - a.avgEffectiveness)
      .slice(0, 5)
      .map(t => t.technique);

    return {
      totalSessions: profile.sessionCount,
      avgSatisfaction: profile.averageSatisfaction,
      favoritePersonality,
      topTechniques,
      emotionTrends: profile.emotionPatterns,
    };
  }
}

export const aiCoachServiceEnriched = new AICoachServiceEnriched();
export default aiCoachServiceEnriched;
