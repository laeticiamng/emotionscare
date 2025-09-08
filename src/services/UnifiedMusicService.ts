/**
 * SERVICE MUSICAL UNIFIÉ - Intelligence Musicale Premium
 * Orchestrateur Suno AI, recommandations intelligentes et thérapie musicale
 */

import { supabase } from '@/integrations/supabase/client';
import { UnifiedEmotionAnalysis, EmotionLabel } from '@/types/unified-emotions';

export interface UnifiedMusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  audioUrl: string;
  coverUrl?: string;
  duration: number; // secondes
  
  // Propriétés émotionnelles
  emotion: EmotionLabel;
  mood: string;
  energy: number;     // 0-1
  valence: number;    // 0-1
  arousal: number;    // 0-1
  
  // Propriétés musicales
  bpm: number;
  key?: string;
  genre: string;
  instruments?: string[];
  
  // Métadonnées
  generatedBy: 'suno' | 'library' | 'user';
  createdAt: Date;
  tags: string[];
  
  // Analytics
  plays: number;
  effectiveness: number; // 0-100, basé sur feedback utilisateur
  userRating?: number;   // 1-5
}

export interface MusicPlaylist {
  id: string;
  name: string;
  description: string;
  coverUrl?: string;
  
  // Propriétés émotionnelles
  targetEmotion: EmotionLabel;
  emotionalJourney?: EmotionLabel[]; // progression émotionnelle
  
  // Contenu
  tracks: UnifiedMusicTrack[];
  totalDuration: number;
  
  // Configuration
  adaptiveMode: boolean;  // s'adapte en temps réel
  transitionMode: 'crossfade' | 'gap' | 'seamless';
  
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
  createdBy: 'ai' | 'user' | 'therapist';
  
  // Analytics
  plays: number;
  completionRate: number; // % d'écoute complète
  effectivenessScore: number;
}

export interface MusicTherapySession {
  id: string;
  userId: string;
  
  // Configuration
  goal: 'relax' | 'energize' | 'focus' | 'mood_boost' | 'sleep' | 'anxiety_relief';
  duration: number; // minutes
  currentEmotion: EmotionLabel;
  targetEmotion: EmotionLabel;
  
  // Playlist et progression
  playlist: MusicPlaylist;
  currentTrackIndex: number;
  progress: number; // 0-100
  
  // États
  startTime: Date;
  endTime?: Date;
  isActive: boolean;
  
  // Tracking émotionnel
  emotionCheckpoints: Array<{
    timestamp: Date;
    emotion: EmotionLabel;
    confidence: number;
    trackId: string;
  }>;
  
  // Résultats
  outcome?: {
    finalEmotion: EmotionLabel;
    goalAchieved: boolean;
    effectivenessScore: number; // 0-100
    userFeedback?: number; // 1-5
  };
}

export class UnifiedMusicService {
  private static instance: UnifiedMusicService;
  private cache = new Map<string, any>();
  private activeSessions = new Map<string, MusicTherapySession>();

  static getInstance(): UnifiedMusicService {
    if (!UnifiedMusicService.instance) {
      UnifiedMusicService.instance = new UnifiedMusicService();
    }
    return UnifiedMusicService.instance;
  }

  /**
   * Génération musicale intelligente via Suno AI
   */
  async generateMusic(params: {
    emotion: EmotionLabel;
    mood?: string;
    style?: string;
    duration?: number;
    lyrics?: string;
    intensity?: number;
    context?: string;
  }): Promise<UnifiedMusicTrack> {
    console.log('🎵 Génération musicale Suno AI:', params);
    
    const cacheKey = `music_${params.emotion}_${params.style}_${params.intensity}`;
    
    if (this.cache.has(cacheKey)) {
      console.log('🎵 Cache hit pour génération musicale');
      return this.cache.get(cacheKey);
    }

    try {
      const { data, error } = await supabase.functions.invoke('suno-music-generation', {
        body: {
          emotion: params.emotion,
          mood: params.mood || params.emotion,
          style: params.style || this.getStyleForEmotion(params.emotion),
          intensity: params.intensity || 0.7,
          lyrics: params.lyrics,
          context: params.context || 'emotional_wellness',
          quality: 'high',
          make_instrumental: !params.lyrics
        }
      });

      if (error) throw error;

      const track: UnifiedMusicTrack = {
        id: data.id || `track_${Date.now()}`,
        title: data.title || `Musique ${params.emotion}`,
        artist: data.artist || 'Suno AI',
        url: data.url || data.audio_url,
        audioUrl: data.audio_url || data.url,
        coverUrl: data.cover_url || data.image_url,
        duration: data.duration || 120,
        
        emotion: params.emotion,
        mood: params.mood || params.emotion,
        energy: this.getEnergyForEmotion(params.emotion),
        valence: this.getValenceForEmotion(params.emotion),
        arousal: this.getArousalForEmotion(params.emotion),
        
        bpm: data.bpm || this.getBpmForEmotion(params.emotion),
        genre: params.style || this.getStyleForEmotion(params.emotion),
        
        generatedBy: 'suno',
        createdAt: new Date(),
        tags: [params.emotion, params.style || 'ai-generated'],
        plays: 0,
        effectiveness: 85 // Score initial basé sur Suno AI
      };

      // Cache pour 1 heure
      this.cache.set(cacheKey, track);
      setTimeout(() => this.cache.delete(cacheKey), 60 * 60 * 1000);

      console.log('✅ Musique générée avec succès:', track.title);
      return track;

    } catch (error) {
      console.error('❌ Erreur génération musicale:', error);
      throw new Error(`Music generation failed: ${error.message}`);
    }
  }

  /**
   * Création de playlist thérapeutique intelligente
   */
  async createTherapeuticPlaylist(params: {
    currentEmotion: EmotionLabel;
    targetEmotion: EmotionLabel;
    duration: number; // minutes
    style?: string;
    adaptiveMode?: boolean;
  }): Promise<MusicPlaylist> {
    console.log('🎼 Création playlist thérapeutique:', params);

    try {
      // Planification du voyage émotionnel
      const emotionalJourney = this.planEmotionalJourney(
        params.currentEmotion,
        params.targetEmotion,
        params.duration
      );

      console.log('🗺️ Voyage émotionnel planifié:', emotionalJourney);

      // Génération des tracks pour chaque étape
      const tracks: UnifiedMusicTrack[] = [];
      const tracksPerSegment = Math.ceil(params.duration / emotionalJourney.length / 3); // ~3min par track

      for (const [index, segmentEmotion] of emotionalJourney.entries()) {
        const intensity = this.calculateIntensityForSegment(index, emotionalJourney.length);
        
        for (let i = 0; i < tracksPerSegment; i++) {
          try {
            const track = await this.generateMusic({
              emotion: segmentEmotion,
              style: params.style,
              intensity,
              duration: 180, // 3 minutes par track
              context: `therapeutic_journey_segment_${index + 1}`
            });
            
            tracks.push(track);
          } catch (error) {
            console.warn(`⚠️ Échec génération track ${i} pour segment ${index}:`, error);
            // Utiliser une track de fallback
            tracks.push(await this.getFallbackTrack(segmentEmotion));
          }
        }
      }

      const playlist: MusicPlaylist = {
        id: `playlist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: `Thérapie: ${params.currentEmotion} → ${params.targetEmotion}`,
        description: `Voyage musical thérapeutique de ${params.duration} minutes`,
        targetEmotion: params.targetEmotion,
        emotionalJourney,
        tracks,
        totalDuration: tracks.reduce((sum, track) => sum + track.duration, 0),
        adaptiveMode: params.adaptiveMode || true,
        transitionMode: 'crossfade',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'ai',
        plays: 0,
        completionRate: 0,
        effectivenessScore: 0
      };

      console.log('✅ Playlist thérapeutique créée:', {
        name: playlist.name,
        tracks: playlist.tracks.length,
        duration: Math.round(playlist.totalDuration / 60)
      });

      return playlist;

    } catch (error) {
      console.error('❌ Erreur création playlist:', error);
      throw new Error(`Playlist creation failed: ${error.message}`);
    }
  }

  /**
   * Démarrage d'une session de thérapie musicale
   */
  async startTherapySession(params: {
    userId: string;
    goal: MusicTherapySession['goal'];
    currentEmotion: EmotionLabel;
    targetEmotion?: EmotionLabel;
    duration: number;
    style?: string;
  }): Promise<MusicTherapySession> {
    console.log('🎭 Démarrage session thérapie musicale:', params);

    const targetEmotion = params.targetEmotion || this.getTargetEmotionForGoal(params.goal);
    
    // Création de la playlist thérapeutique
    const playlist = await this.createTherapeuticPlaylist({
      currentEmotion: params.currentEmotion,
      targetEmotion,
      duration: params.duration,
      style: params.style,
      adaptiveMode: true
    });

    const session: MusicTherapySession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: params.userId,
      goal: params.goal,
      duration: params.duration,
      currentEmotion: params.currentEmotion,
      targetEmotion,
      playlist,
      currentTrackIndex: 0,
      progress: 0,
      startTime: new Date(),
      isActive: true,
      emotionCheckpoints: [{
        timestamp: new Date(),
        emotion: params.currentEmotion,
        confidence: 1.0,
        trackId: playlist.tracks[0]?.id || 'none'
      }]
    };

    // Stockage de la session active
    this.activeSessions.set(session.id, session);

    console.log('✅ Session de thérapie démarrée:', session.id);
    return session;
  }

  /**
   * Mise à jour d'une session avec feedback émotionnel
   */
  async updateSessionWithEmotion(
    sessionId: string,
    emotionAnalysis: UnifiedEmotionAnalysis
  ): Promise<MusicTherapySession> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    // Ajout du checkpoint émotionnel
    session.emotionCheckpoints.push({
      timestamp: new Date(),
      emotion: emotionAnalysis.primaryEmotion,
      confidence: emotionAnalysis.overallConfidence,
      trackId: session.playlist.tracks[session.currentTrackIndex]?.id || 'unknown'
    });

    // Adaptation intelligente de la playlist si nécessaire
    if (session.playlist.adaptiveMode) {
      await this.adaptPlaylistToEmotion(session, emotionAnalysis);
    }

    // Calcul du progrès
    const elapsedTime = (Date.now() - session.startTime.getTime()) / 1000 / 60; // minutes
    session.progress = Math.min(100, (elapsedTime / session.duration) * 100);

    console.log('📊 Session mise à jour:', {
      sessionId,
      emotion: emotionAnalysis.primaryEmotion,
      progress: Math.round(session.progress)
    });

    return session;
  }

  /**
   * Finalisation d'une session
   */
  async endTherapySession(sessionId: string, userFeedback?: number): Promise<MusicTherapySession> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    session.isActive = false;
    session.endTime = new Date();

    // Calcul des résultats
    const lastCheckpoint = session.emotionCheckpoints[session.emotionCheckpoints.length - 1];
    const goalAchieved = this.evaluateGoalAchievement(session, lastCheckpoint.emotion);
    
    session.outcome = {
      finalEmotion: lastCheckpoint.emotion,
      goalAchieved,
      effectivenessScore: this.calculateEffectivenessScore(session),
      userFeedback
    };

    // Sauvegarde en base
    await this.saveSessionToDatabase(session);

    // Nettoyage
    this.activeSessions.delete(sessionId);

    console.log('🏁 Session terminée:', {
      sessionId,
      goalAchieved,
      effectiveness: session.outcome.effectivenessScore
    });

    return session;
  }

  // === MÉTHODES UTILITAIRES PRIVÉES ===

  private planEmotionalJourney(
    current: EmotionLabel,
    target: EmotionLabel,
    duration: number
  ): EmotionLabel[] {
    // Algorithme de planification du voyage émotionnel
    const journey: EmotionLabel[] = [current];
    
    // Segments intermédiaires basés sur la distance émotionnelle
    const segments = Math.max(3, Math.ceil(duration / 5)); // au moins 3 segments
    
    // Routes émotionnelles prédéfinies
    const emotionRoutes: Record<string, EmotionLabel[]> = {
      'anger_to_calm': ['anger', 'frustration', 'neutral', 'contentment', 'serenity'],
      'sadness_to_joy': ['sadness', 'melancholy', 'neutral', 'contentment', 'joy'],
      'anxiety_to_calm': ['anxiety', 'worry', 'focus', 'contentment', 'serenity'],
      'neutral_to_excitement': ['neutral', 'interest', 'anticipation', 'excitement'],
    };
    
    const routeKey = `${current}_to_${target}`;
    const predefinedRoute = emotionRoutes[routeKey];
    
    if (predefinedRoute) {
      // Utiliser la route prédéfinie
      const stepSize = Math.max(1, Math.floor(predefinedRoute.length / segments));
      for (let i = stepSize; i < predefinedRoute.length; i += stepSize) {
        journey.push(predefinedRoute[i]);
      }
    } else {
      // Génération algorithmique du parcours
      // TODO: Implémenter l'algorithme de pathfinding émotionnel
      journey.push(target);
    }
    
    // S'assurer que la destination finale est atteinte
    if (journey[journey.length - 1] !== target) {
      journey.push(target);
    }
    
    return journey;
  }

  private calculateIntensityForSegment(segmentIndex: number, totalSegments: number): number {
    // Courbe d'intensité adaptée au voyage thérapeutique
    const progress = segmentIndex / (totalSegments - 1);
    
    if (segmentIndex === 0) return 0.3; // Début doux
    if (segmentIndex === totalSegments - 1) return 0.8; // Fin énergique
    
    // Pic au milieu du parcours
    return 0.4 + 0.4 * Math.sin(progress * Math.PI);
  }

  private async adaptPlaylistToEmotion(
    session: MusicTherapySession,
    emotionAnalysis: UnifiedEmotionAnalysis
  ): Promise<void> {
    // Adaptation intelligente de la playlist basée sur le feedback émotionnel
    console.log('🔄 Adaptation playlist basée sur émotion:', emotionAnalysis.primaryEmotion);
    
    // Si l'émotion s'éloigne trop du parcours prévu, générer de nouvelles tracks
    const expectedEmotion = session.playlist.emotionalJourney?.[Math.floor(session.progress / 20)];
    const emotionDistance = this.calculateEmotionDistance(
      emotionAnalysis.primaryEmotion,
      expectedEmotion || session.targetEmotion
    );
    
    if (emotionDistance > 0.7) {
      console.log('🎯 Distance émotionnelle élevée, adaptation nécessaire');
      // Générer une track de transition
      try {
        const bridgeTrack = await this.generateMusic({
          emotion: emotionAnalysis.primaryEmotion,
          intensity: 0.6,
          context: 'adaptive_bridge',
          duration: 120
        });
        
        // Insérer la track de pont
        session.playlist.tracks.splice(session.currentTrackIndex + 1, 0, bridgeTrack);
      } catch (error) {
        console.warn('⚠️ Échec génération track d\'adaptation:', error);
      }
    }
  }

  private calculateEmotionDistance(emotion1: EmotionLabel, emotion2: EmotionLabel): number {
    // Calculer la distance dans l'espace émotionnel valence-arousal
    const e1 = { 
      valence: this.getValenceForEmotion(emotion1),
      arousal: this.getArousalForEmotion(emotion1)
    };
    const e2 = { 
      valence: this.getValenceForEmotion(emotion2),
      arousal: this.getArousalForEmotion(emotion2)
    };
    
    return Math.sqrt(
      Math.pow(e1.valence - e2.valence, 2) + 
      Math.pow(e1.arousal - e2.arousal, 2)
    ) / Math.sqrt(2); // Normaliser entre 0-1
  }

  private evaluateGoalAchievement(session: MusicTherapySession, finalEmotion: EmotionLabel): boolean {
    const distance = this.calculateEmotionDistance(finalEmotion, session.targetEmotion);
    return distance < 0.3; // Objectif atteint si distance < 30%
  }

  private calculateEffectivenessScore(session: MusicTherapySession): number {
    // Score basé sur progression émotionnelle et durée de session
    let score = 50; // Score de base
    
    // Bonus pour progression vers l'objectif
    const initialEmotion = session.emotionCheckpoints[0].emotion;
    const finalEmotion = session.emotionCheckpoints[session.emotionCheckpoints.length - 1].emotion;
    
    const initialDistance = this.calculateEmotionDistance(initialEmotion, session.targetEmotion);
    const finalDistance = this.calculateEmotionDistance(finalEmotion, session.targetEmotion);
    
    const improvement = initialDistance - finalDistance;
    score += improvement * 50; // Max 50 points pour amélioration parfaite
    
    // Bonus pour completion de session
    if (session.progress > 80) score += 20;
    
    // Malus pour abandons précoces
    if (session.progress < 20) score -= 30;
    
    return Math.max(0, Math.min(100, score));
  }

  private async saveSessionToDatabase(session: MusicTherapySession): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke('save-music-therapy-session', {
        body: { session }
      });
      
      if (error) throw error;
      console.log('💾 Session sauvegardée en base');
    } catch (error) {
      console.error('❌ Erreur sauvegarde session:', error);
    }
  }

  private async getFallbackTrack(emotion: EmotionLabel): Promise<UnifiedMusicTrack> {
    // Track de fallback en cas d'échec de génération
    return {
      id: `fallback_${Date.now()}`,
      title: `Musique ${emotion} (Fallback)`,
      artist: 'Bibliothèque EmotionsCare',
      url: '/sounds/ambient-calm.mp3',
      audioUrl: '/sounds/ambient-calm.mp3',
      duration: 180,
      emotion,
      mood: emotion,
      energy: this.getEnergyForEmotion(emotion),
      valence: this.getValenceForEmotion(emotion),
      arousal: this.getArousalForEmotion(emotion),
      bpm: this.getBpmForEmotion(emotion),
      genre: 'ambient',
      generatedBy: 'library',
      createdAt: new Date(),
      tags: [emotion, 'fallback'],
      plays: 0,
      effectiveness: 70
    };
  }

  private getStyleForEmotion(emotion: EmotionLabel): string {
    const styleMap: Record<EmotionLabel, string> = {
      joy: 'upbeat pop',
      contentment: 'acoustic folk',
      serenity: 'ambient meditation',
      excitement: 'electronic dance',
      amusement: 'jazz fusion',
      anger: 'rock metal',
      sadness: 'melancholic piano',
      fear: 'dark ambient',
      anxiety: 'minimal techno',
      disgust: 'experimental',
      surprise: 'orchestral',
      concentration: 'lo-fi hip hop',
      contemplation: 'classical',
      confusion: 'progressive rock'
    };
    return styleMap[emotion] || 'ambient';
  }

  private getEnergyForEmotion(emotion: EmotionLabel): number {
    const energyMap: Record<EmotionLabel, number> = {
      joy: 0.8, contentment: 0.4, serenity: 0.2, excitement: 0.9, amusement: 0.6,
      anger: 0.9, sadness: 0.2, fear: 0.7, anxiety: 0.8, disgust: 0.3,
      surprise: 0.7, concentration: 0.5, contemplation: 0.3, confusion: 0.4
    };
    return energyMap[emotion] || 0.5;
  }

  private getValenceForEmotion(emotion: EmotionLabel): number {
    const valenceMap: Record<EmotionLabel, number> = {
      joy: 0.9, contentment: 0.7, serenity: 0.8, excitement: 0.8, amusement: 0.8,
      anger: 0.1, sadness: 0.1, fear: 0.2, anxiety: 0.2, disgust: 0.1,
      surprise: 0.6, concentration: 0.6, contemplation: 0.5, confusion: 0.3
    };
    return valenceMap[emotion] || 0.5;
  }

  private getArousalForEmotion(emotion: EmotionLabel): number {
    const arousalMap: Record<EmotionLabel, number> = {
      joy: 0.7, contentment: 0.3, serenity: 0.1, excitement: 0.9, amusement: 0.6,
      anger: 0.9, sadness: 0.2, fear: 0.8, anxiety: 0.9, disgust: 0.5,
      surprise: 0.8, concentration: 0.4, contemplation: 0.2, confusion: 0.6
    };
    return arousalMap[emotion] || 0.5;
  }

  private getBpmForEmotion(emotion: EmotionLabel): number {
    const bpmMap: Record<EmotionLabel, number> = {
      joy: 120, contentment: 80, serenity: 60, excitement: 140, amusement: 110,
      anger: 130, sadness: 65, fear: 100, anxiety: 120, disgust: 90,
      surprise: 115, concentration: 85, contemplation: 70, confusion: 95
    };
    return bpmMap[emotion] || 80;
  }

  private getTargetEmotionForGoal(goal: MusicTherapySession['goal']): EmotionLabel {
    const goalEmotionMap: Record<MusicTherapySession['goal'], EmotionLabel> = {
      relax: 'serenity',
      energize: 'excitement',
      focus: 'concentration',
      mood_boost: 'joy',
      sleep: 'serenity',
      anxiety_relief: 'contentment'
    };
    return goalEmotionMap[goal] || 'contentment';
  }
}

// Export singleton
export const unifiedMusicService = UnifiedMusicService.getInstance();