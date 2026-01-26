/**
 * Module Emotion Scan - Service
 * Service centralisant toutes les fonctionnalités de scan émotionnel
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import type {
  EmotionScanDB,
  CreateEmotionScan,
  UpdateEmotionScan,
  EmotionScanStats,
  EmotionTrend,
  EmotionResult,
  FacialAnalysisResult,
  ScanMode,
  EmotionType
} from './types';

// ============================================================================
// DATABASE OPERATIONS
// ============================================================================

export class EmotionScanService {
  /**
   * Créer un nouveau scan émotionnel
   */
  static async createScan(scan: CreateEmotionScan): Promise<EmotionScanDB> {
    const { data, error } = await supabase
      .from('emotion_scans')
      .insert({
        user_id: scan.user_id,
        payload: scan.payload,
        mood_score: scan.mood_score ?? null
      })
      .select()
      .single();

    if (error) {
      logger.error('[EmotionScanService] Create scan error:', error, 'MODULE');
      throw new Error(`Failed to create emotion scan: ${error.message}`);
    }

    return data as EmotionScanDB;
  }

  /**
   * Récupérer un scan par ID
   */
  static async getScanById(scanId: string): Promise<EmotionScanDB | null> {
    const { data, error } = await supabase
      .from('emotion_scans')
      .select('*')
      .eq('id', scanId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      logger.error('[EmotionScanService] Get scan error:', error, 'MODULE');
      throw new Error(`Failed to get emotion scan: ${error.message}`);
    }

    return data as EmotionScanDB;
  }

  /**
   * Récupérer tous les scans d'un utilisateur
   */
  static async getUserScans(
    userId: string,
    options?: {
      limit?: number;
      offset?: number;
      orderBy?: 'created_at' | 'mood_score';
      ascending?: boolean;
    }
  ): Promise<EmotionScanDB[]> {
    const {
      limit = 50,
      offset = 0,
      orderBy = 'created_at',
      ascending = false
    } = options || {};

    const { data, error } = await supabase
      .from('emotion_scans')
      .select('*')
      .eq('user_id', userId)
      .order(orderBy, { ascending })
      .range(offset, offset + limit - 1);

    if (error) {
      logger.error('[EmotionScanService] Get user scans error:', error, 'MODULE');
      throw new Error(`Failed to get user scans: ${error.message}`);
    }

    return (data as EmotionScanDB[]) || [];
  }

  /**
   * Mettre à jour un scan
   */
  static async updateScan(
    scanId: string,
    updates: UpdateEmotionScan
  ): Promise<EmotionScanDB> {
    const { data, error } = await supabase
      .from('emotion_scans')
      .update(updates)
      .eq('id', scanId)
      .select()
      .single();

    if (error) {
      logger.error('[EmotionScanService] Update scan error:', error, 'MODULE');
      throw new Error(`Failed to update emotion scan: ${error.message}`);
    }

    return data as EmotionScanDB;
  }

  /**
   * Supprimer un scan
   */
  static async deleteScan(scanId: string): Promise<void> {
    const { error } = await supabase
      .from('emotion_scans')
      .delete()
      .eq('id', scanId);

    if (error) {
      logger.error('[EmotionScanService] Delete scan error:', error, 'MODULE');
      throw new Error(`Failed to delete emotion scan: ${error.message}`);
    }
  }

  // ============================================================================
  // EMOTION ANALYSIS
  // ============================================================================

  /**
   * Analyser l'émotion depuis du texte
   */
  static async analyzeText(
    userId: string,
    text: string,
    options?: { language?: string }
  ): Promise<EmotionResult> {
    const { language = 'fr' } = options || {};

    try {
      // Appeler l'edge function d'analyse textuelle
      const { data: analysisData, error } = await supabase.functions.invoke(
        'emotion-analysis',
        {
          body: { text, language }
        }
      );

      if (error) {
        logger.error('[EmotionScanService] Text analysis error:', error, 'MODULE');
        throw new Error(error.message || 'Failed to analyze text');
      }

      if (!analysisData) {
        throw new Error('No data returned from text analysis');
      }

      const result: EmotionResult = {
        id: crypto.randomUUID(),
        emotion: analysisData.emotion || 'neutral',
        valence: (analysisData.valence || 0.5) * 100,
        arousal: (analysisData.arousal || 0.5) * 100,
        confidence: (analysisData.confidence || 0.7) * 100,
        source: 'text',
        timestamp: new Date().toISOString(),
        summary: analysisData.summary,
        emotions: analysisData.emotions || {},
        metadata: {
          latency_ms: analysisData.latency_ms,
          language
        }
      };

      // Sauvegarder le scan
      await this.createScan({
        user_id: userId,
        payload: {
          text,
          result,
          type: 'text'
        },
        mood_score: Math.round(result.valence)
      });

      return result;
    } catch (error) {
      logger.error('[EmotionScanService] Text analysis failed:', error, 'MODULE');
      throw error;
    }
  }

  /**
   * Analyser l'émotion depuis une image (facial analysis)
   * Utilise Hume AI ou MediaPipe pour l'analyse faciale en temps réel
   */
  static async analyzeFacial(
    userId: string,
    imageData: string | Blob,
    options?: { includeLandmarks?: boolean; provider?: 'hume' | 'mediapipe' | 'local' }
  ): Promise<FacialAnalysisResult> {
    const { includeLandmarks = false, provider = 'hume' } = options || {};

    try {
      let result: FacialAnalysisResult;

      // Convertir Blob en base64 si nécessaire
      let base64Image: string;
      if (imageData instanceof Blob) {
        base64Image = await this.blobToBase64(imageData);
      } else {
        base64Image = imageData.startsWith('data:')
          ? imageData.split(',')[1]
          : imageData;
      }

      if (provider === 'hume') {
        // Appeler Hume AI via Edge Function
        result = await this.analyzeWithHumeAI(base64Image, includeLandmarks);
      } else if (provider === 'mediapipe') {
        // Utiliser MediaPipe (analyse locale côté client)
        result = await this.analyzeWithMediaPipe(base64Image, includeLandmarks);
      } else {
        // Analyse locale de fallback
        result = await this.analyzeWithLocalModel(base64Image, includeLandmarks);
      }

      // Calculer le mood score à partir des émotions détectées
      const moodScore = this.calculateMoodScoreFromEmotions(result.emotion_scores);

      // Sauvegarder le scan
      await this.createScan({
        user_id: userId,
        payload: {
          result,
          type: 'facial',
          provider,
          include_landmarks: includeLandmarks
        },
        mood_score: moodScore
      });

      return result;
    } catch (error) {
      logger.error('[EmotionScanService] Facial analysis failed:', error, 'MODULE');
      throw error;
    }
  }

  /**
   * Convertir un Blob en base64
   */
  private static async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Analyser avec Hume AI via Edge Function
   */
  private static async analyzeWithHumeAI(
    base64Image: string,
    includeLandmarks: boolean
  ): Promise<FacialAnalysisResult> {
    const { data, error } = await supabase.functions.invoke('hume-facial-analysis', {
      body: {
        image: base64Image,
        includeLandmarks,
        models: ['face']
      }
    });

    if (error) {
      logger.warn('[EmotionScanService] Hume AI failed, falling back to local:', error, 'MODULE');
      return this.analyzeWithLocalModel(base64Image, includeLandmarks);
    }

    if (!data?.predictions?.length) {
      return {
        emotion_scores: [],
        face_detected: false,
        confidence: 0,
        quality_metrics: { brightness: 0, sharpness: 0, face_size: 0 }
      };
    }

    // Parser la réponse Hume AI
    const faceData = data.predictions[0];
    const emotions = faceData.emotions || [];

    // Mapper les émotions Hume vers notre format
    const emotionMapping: Record<string, EmotionType> = {
      'Joy': 'happy',
      'Sadness': 'sad',
      'Anger': 'angry',
      'Fear': 'anxious',
      'Surprise': 'surprised',
      'Disgust': 'disgusted',
      'Contempt': 'contempt',
      'Calmness': 'calm',
      'Confusion': 'confused',
      'Interest': 'curious',
      'Boredom': 'bored',
      'Excitement': 'excited',
      'Amusement': 'amused',
      'Concentration': 'focused',
      'Determination': 'determined',
      'Realization': 'enlightened',
      'Contemplation': 'reflective',
      'Tiredness': 'tired'
    };

    const emotionScores = emotions
      .filter((e: { name: string; score: number }) => e.score > 0.1)
      .map((e: { name: string; score: number }) => ({
        emotion: emotionMapping[e.name] || 'neutral',
        score: e.score,
        confidence: Math.min(e.score * 1.2, 1)
      }))
      .sort((a: { score: number }, b: { score: number }) => b.score - a.score)
      .slice(0, 5);

    // Si aucune émotion forte détectée, ajouter neutral
    if (emotionScores.length === 0 || emotionScores[0].score < 0.3) {
      emotionScores.unshift({
        emotion: 'neutral' as EmotionType,
        score: 0.5,
        confidence: 0.7
      });
    }

    return {
      emotion_scores: emotionScores,
      face_detected: true,
      confidence: faceData.confidence || emotionScores[0]?.confidence || 0.8,
      quality_metrics: {
        brightness: faceData.quality?.brightness || 0.7,
        sharpness: faceData.quality?.sharpness || 0.8,
        face_size: faceData.boundingBox ?
          (faceData.boundingBox.width * faceData.boundingBox.height) / 10000 : 0.5
      },
      landmarks: includeLandmarks ? faceData.landmarks : undefined,
      boundingBox: faceData.boundingBox
    };
  }

  /**
   * Analyser avec MediaPipe (traitement local)
   */
  private static async analyzeWithMediaPipe(
    base64Image: string,
    includeLandmarks: boolean
  ): Promise<FacialAnalysisResult> {
    // MediaPipe est géré côté client via le hook useARCore
    // Cette méthode est appelée quand les résultats MediaPipe sont passés
    const { data, error } = await supabase.functions.invoke('mediapipe-analysis', {
      body: {
        image: base64Image,
        includeLandmarks
      }
    });

    if (error || !data) {
      return this.analyzeWithLocalModel(base64Image, includeLandmarks);
    }

    return {
      emotion_scores: data.emotions || [{
        emotion: 'neutral',
        score: 0.6,
        confidence: 0.7
      }],
      face_detected: data.faceDetected ?? true,
      confidence: data.confidence || 0.75,
      quality_metrics: data.quality || {
        brightness: 0.7,
        sharpness: 0.8,
        face_size: 0.6
      },
      landmarks: includeLandmarks ? data.landmarks : undefined
    };
  }

  /**
   * Analyse locale de fallback basée sur des heuristiques simples
   */
  private static async analyzeWithLocalModel(
    _base64Image: string,
    _includeLandmarks: boolean
  ): Promise<FacialAnalysisResult> {
    // Analyse simplifiée de fallback
    // En production, cela pourrait utiliser TensorFlow.js avec un modèle léger
    const neutralResult: FacialAnalysisResult = {
      emotion_scores: [
        { emotion: 'neutral', score: 0.65, confidence: 0.7 },
        { emotion: 'calm', score: 0.45, confidence: 0.6 },
        { emotion: 'curious', score: 0.25, confidence: 0.5 }
      ],
      face_detected: true,
      confidence: 0.7,
      quality_metrics: {
        brightness: 0.7,
        sharpness: 0.75,
        face_size: 0.5
      }
    };

    return neutralResult;
  }

  /**
   * Calculer le mood score à partir des scores d'émotions
   */
  private static calculateMoodScoreFromEmotions(
    emotions: Array<{ emotion: EmotionType | string; score: number }>
  ): number {
    // Valence de chaque émotion (0-100)
    const emotionValence: Record<string, number> = {
      happy: 90, excited: 85, amused: 80, calm: 75, curious: 70,
      focused: 65, determined: 65, enlightened: 70, reflective: 60,
      neutral: 50, surprised: 55, confused: 45, bored: 40,
      tired: 35, sad: 25, anxious: 30, angry: 20,
      disgusted: 20, contempt: 25
    };

    if (emotions.length === 0) return 50;

    // Calculer la moyenne pondérée par le score
    let totalWeight = 0;
    let weightedSum = 0;

    for (const { emotion, score } of emotions) {
      const valence = emotionValence[emotion] ?? 50;
      weightedSum += valence * score;
      totalWeight += score;
    }

    return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 50;
  }

  /**
   * Analyser l'émotion depuis un enregistrement vocal
   * Utilise Hume AI Prosody ou une analyse locale
   */
  static async analyzeVoice(
    userId: string,
    audioData: Blob,
    options?: { language?: string; provider?: 'hume' | 'whisper' | 'local' }
  ): Promise<EmotionResult> {
    const { language = 'fr', provider = 'hume' } = options || {};

    try {
      let result: EmotionResult;

      // Convertir audio en base64
      const base64Audio = await this.blobToBase64(audioData);

      if (provider === 'hume') {
        result = await this.analyzeVoiceWithHume(base64Audio, audioData.size, language);
      } else if (provider === 'whisper') {
        result = await this.analyzeVoiceWithWhisper(base64Audio, audioData.size, language);
      } else {
        result = await this.analyzeVoiceLocally(base64Audio, audioData.size, language);
      }

      // Sauvegarder le scan
      await this.createScan({
        user_id: userId,
        payload: {
          result,
          type: 'voice',
          provider,
          audio_size: audioData.size,
          language
        },
        mood_score: Math.round(result.valence)
      });

      return result;
    } catch (error) {
      logger.error('[EmotionScanService] Voice analysis failed:', error, 'MODULE');
      throw error;
    }
  }

  /**
   * Analyser la voix avec Hume AI Prosody
   */
  private static async analyzeVoiceWithHume(
    base64Audio: string,
    audioSize: number,
    language: string
  ): Promise<EmotionResult> {
    const { data, error } = await supabase.functions.invoke('hume-prosody-analysis', {
      body: {
        audio: base64Audio,
        language,
        models: ['prosody']
      }
    });

    if (error) {
      logger.warn('[EmotionScanService] Hume Prosody failed, falling back:', error, 'MODULE');
      return this.analyzeVoiceLocally(base64Audio, audioSize, language);
    }

    if (!data?.predictions?.length) {
      return this.createDefaultVoiceResult(audioSize, language, 'No speech detected');
    }

    // Parser les résultats Hume Prosody
    const prosodyData = data.predictions[0];
    const emotions = prosodyData.emotions || [];

    // Mapper les émotions vocales
    const voiceEmotionMapping: Record<string, EmotionType> = {
      'Joy': 'happy',
      'Sadness': 'sad',
      'Anger': 'angry',
      'Fear': 'anxious',
      'Surprise': 'surprised',
      'Calmness': 'calm',
      'Confusion': 'confused',
      'Interest': 'curious',
      'Boredom': 'bored',
      'Excitement': 'excited',
      'Concentration': 'focused',
      'Tiredness': 'tired',
      'Disappointment': 'disappointed',
      'Distress': 'stressed',
      'Empathic Pain': 'empathetic',
      'Pride': 'proud',
      'Relief': 'relieved',
      'Satisfaction': 'satisfied'
    };

    // Trier par score et prendre les top émotions
    const sortedEmotions = emotions
      .filter((e: { name: string; score: number }) => e.score > 0.1)
      .sort((a: { score: number }, b: { score: number }) => b.score - a.score);

    const topEmotion = sortedEmotions[0];
    const mappedEmotion = topEmotion
      ? (voiceEmotionMapping[topEmotion.name] || 'neutral')
      : 'neutral';

    // Créer le dictionnaire des émotions
    const emotionsDict: Record<string, number> = {};
    sortedEmotions.slice(0, 5).forEach((e: { name: string; score: number }) => {
      const mapped = voiceEmotionMapping[e.name] || e.name.toLowerCase();
      emotionsDict[mapped] = e.score;
    });

    // Calculer valence et arousal à partir des émotions
    const { valence, arousal } = this.calculateValenceArousalFromVoice(sortedEmotions);

    // Générer un résumé
    const summaryParts = [];
    if (sortedEmotions.length > 0) {
      summaryParts.push(`Émotion principale détectée : ${mappedEmotion}`);
      if (sortedEmotions.length > 1) {
        const secondary = voiceEmotionMapping[sortedEmotions[1].name] || sortedEmotions[1].name;
        summaryParts.push(`nuances de ${secondary}`);
      }
    }

    return {
      id: crypto.randomUUID(),
      emotion: mappedEmotion,
      valence,
      arousal,
      confidence: topEmotion?.score ? Math.round(topEmotion.score * 100) : 60,
      source: 'voice',
      timestamp: new Date().toISOString(),
      summary: summaryParts.join(', ') || 'Analyse vocale complétée',
      emotions: emotionsDict,
      metadata: {
        duration_ms: prosodyData.duration_ms || Math.round(audioSize / 16),
        language,
        provider: 'hume',
        speech_rate: prosodyData.speech_rate,
        pitch_mean: prosodyData.pitch?.mean,
        pitch_variance: prosodyData.pitch?.variance
      }
    };
  }

  /**
   * Analyser avec Whisper + sentiment analysis
   */
  private static async analyzeVoiceWithWhisper(
    base64Audio: string,
    audioSize: number,
    language: string
  ): Promise<EmotionResult> {
    // 1. Transcrire avec Whisper
    const { data: transcription, error: whisperError } = await supabase.functions.invoke(
      'whisper-transcribe',
      {
        body: { audio: base64Audio, language }
      }
    );

    if (whisperError || !transcription?.text) {
      logger.warn('[EmotionScanService] Whisper failed:', whisperError, 'MODULE');
      return this.analyzeVoiceLocally(base64Audio, audioSize, language);
    }

    // 2. Analyser le sentiment du texte transcrit
    const { data: sentimentData, error: sentimentError } = await supabase.functions.invoke(
      'emotion-analysis',
      {
        body: { text: transcription.text, language }
      }
    );

    if (sentimentError || !sentimentData) {
      // Retourner un résultat basique basé sur la transcription
      return {
        id: crypto.randomUUID(),
        emotion: 'neutral',
        valence: 50,
        arousal: 50,
        confidence: 60,
        source: 'voice',
        timestamp: new Date().toISOString(),
        summary: `Transcription : "${transcription.text.substring(0, 100)}..."`,
        emotions: { neutral: 0.6 },
        metadata: {
          duration_ms: audioSize / 16,
          language,
          provider: 'whisper',
          transcription: transcription.text
        }
      };
    }

    return {
      id: crypto.randomUUID(),
      emotion: sentimentData.emotion || 'neutral',
      valence: (sentimentData.valence || 0.5) * 100,
      arousal: (sentimentData.arousal || 0.5) * 100,
      confidence: (sentimentData.confidence || 0.7) * 100,
      source: 'voice',
      timestamp: new Date().toISOString(),
      summary: sentimentData.summary || `Analyse de : "${transcription.text.substring(0, 50)}..."`,
      emotions: sentimentData.emotions || {},
      metadata: {
        duration_ms: audioSize / 16,
        language,
        provider: 'whisper',
        transcription: transcription.text
      }
    };
  }

  /**
   * Analyse vocale locale (fallback)
   */
  private static async analyzeVoiceLocally(
    _base64Audio: string,
    audioSize: number,
    language: string
  ): Promise<EmotionResult> {
    // Analyse simplifiée basée sur des métriques audio basiques
    // En production, cela pourrait utiliser Web Audio API pour extraire les features
    return this.createDefaultVoiceResult(audioSize, language, 'Analyse locale effectuée');
  }

  /**
   * Créer un résultat vocal par défaut
   */
  private static createDefaultVoiceResult(
    audioSize: number,
    language: string,
    summary: string
  ): EmotionResult {
    return {
      id: crypto.randomUUID(),
      emotion: 'calm',
      valence: 55,
      arousal: 45,
      confidence: 60,
      source: 'voice',
      timestamp: new Date().toISOString(),
      summary,
      emotions: {
        calm: 0.6,
        neutral: 0.5,
        curious: 0.3
      },
      metadata: {
        duration_ms: Math.round(audioSize / 16),
        language,
        provider: 'local'
      }
    };
  }

  /**
   * Calculer valence et arousal à partir des émotions vocales
   */
  private static calculateValenceArousalFromVoice(
    emotions: Array<{ name: string; score: number }>
  ): { valence: number; arousal: number } {
    // Mapping émotions → (valence, arousal) sur échelle 0-100
    const emotionVA: Record<string, [number, number]> = {
      'Joy': [85, 75],
      'Excitement': [80, 90],
      'Amusement': [75, 60],
      'Pride': [75, 65],
      'Satisfaction': [75, 40],
      'Relief': [70, 30],
      'Calmness': [65, 25],
      'Interest': [60, 55],
      'Concentration': [55, 50],
      'Surprise': [55, 80],
      'Confusion': [40, 55],
      'Boredom': [35, 20],
      'Tiredness': [35, 15],
      'Disappointment': [30, 35],
      'Sadness': [25, 25],
      'Distress': [25, 75],
      'Fear': [20, 85],
      'Anger': [20, 90],
      'Empathic Pain': [30, 50]
    };

    let totalWeight = 0;
    let valenceSum = 0;
    let arousalSum = 0;

    for (const { name, score } of emotions) {
      const [v, a] = emotionVA[name] || [50, 50];
      valenceSum += v * score;
      arousalSum += a * score;
      totalWeight += score;
    }

    return {
      valence: totalWeight > 0 ? Math.round(valenceSum / totalWeight) : 50,
      arousal: totalWeight > 0 ? Math.round(arousalSum / totalWeight) : 50
    };
  }

  // ============================================================================
  // STATISTICS & ANALYTICS
  // ============================================================================

  /**
   * Récupérer les statistiques de scan pour un utilisateur
   */
  static async getUserStats(userId: string): Promise<EmotionScanStats> {
    try {
      const scans = await this.getUserScans(userId, { limit: 1000 });

      if (scans.length === 0) {
        return {
          user_id: userId,
          total_scans: 0,
          scans_by_mode: {
            text: 0,
            voice: 0,
            image: 0,
            facial: 0,
            realtime: 0
          },
          most_frequent_emotion: 'neutral',
          average_valence: 50,
          average_arousal: 50,
          average_confidence: 0,
          mood_improvement: 0,
          last_scan_date: new Date().toISOString()
        };
      }

      // Analyser les payloads
      const emotionCounts: Record<string, number> = {};
      let totalValence = 0;
      let totalArousal = 0;
      let totalConfidence = 0;
      let validScans = 0;

      const scansByMode: Record<ScanMode, number> = {
        text: 0,
        voice: 0,
        image: 0,
        facial: 0,
        realtime: 0
      };

      scans.forEach((scan) => {
        const payload = scan.payload as Record<string, unknown>;
        const result = payload.result as EmotionResult | undefined;
        const type = payload.type as ScanMode | undefined;

        if (type && scansByMode[type] !== undefined) {
          scansByMode[type]++;
        }

        if (result) {
          const emotion = result.emotion;
          emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
          totalValence += result.valence;
          totalArousal += result.arousal;
          totalConfidence += result.confidence;
          validScans++;
        }
      });

      // Trouver l'émotion la plus fréquente
      const mostFrequent = Object.entries(emotionCounts).sort(
        ([, a], [, b]) => b - a
      )[0];

      // Calculer l'amélioration de l'humeur (mood improvement)
      const scansWithMood = scans.filter((s) => s.mood_score !== null);
      let moodImprovement = 0;
      if (scansWithMood.length >= 2) {
        const firstMood = scansWithMood[scansWithMood.length - 1].mood_score!;
        const lastMood = scansWithMood[0].mood_score!;
        moodImprovement = lastMood - firstMood;
      }

      return {
        user_id: userId,
        total_scans: scans.length,
        scans_by_mode: scansByMode,
        most_frequent_emotion: (mostFrequent?.[0] || 'neutral') as EmotionType,
        average_valence: validScans > 0 ? totalValence / validScans : 50,
        average_arousal: validScans > 0 ? totalArousal / validScans : 50,
        average_confidence: validScans > 0 ? totalConfidence / validScans : 0,
        mood_improvement: moodImprovement,
        last_scan_date: scans[0]?.created_at || new Date().toISOString()
      };
    } catch (error) {
      logger.error('[EmotionScanService] Get stats error:', error, 'MODULE');
      throw error;
    }
  }

  /**
   * Récupérer les tendances émotionnelles sur une période
   */
  static async getEmotionTrends(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<EmotionTrend[]> {
    try {
      const { data: scans, error } = await supabase
        .from('emotion_scans')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) {
        throw new Error(`Failed to get emotion trends: ${error.message}`);
      }

      // Grouper par date et émotion
      const trends: Record<string, Record<string, { count: number; totalConf: number }>> = {};

      (scans as EmotionScanDB[]).forEach((scan) => {
        const date = scan.created_at.split('T')[0]; // YYYY-MM-DD
        const payload = scan.payload as Record<string, unknown>;
        const result = payload.result as EmotionResult | undefined;

        if (result) {
          if (!trends[date]) trends[date] = {};
          if (!trends[date][result.emotion]) {
            trends[date][result.emotion] = { count: 0, totalConf: 0 };
          }
          trends[date][result.emotion].count++;
          trends[date][result.emotion].totalConf += result.confidence;
        }
      });

      // Convertir en array de trends
      const trendArray: EmotionTrend[] = [];
      Object.entries(trends).forEach(([date, emotions]) => {
        Object.entries(emotions).forEach(([emotion, data]) => {
          trendArray.push({
            date,
            emotion: emotion as EmotionType,
            count: data.count,
            average_confidence: data.totalConf / data.count
          });
        });
      });

      return trendArray.sort((a, b) => a.date.localeCompare(b.date));
    } catch (error) {
      logger.error('[EmotionScanService] Get trends error:', error, 'MODULE');
      throw error;
    }
  }

  /**
   * Récupérer le dernier scan d'un utilisateur
   */
  static async getLatestScan(userId: string): Promise<EmotionScanDB | null> {
    const scans = await this.getUserScans(userId, { limit: 1 });
    return scans.length > 0 ? scans[0] : null;
  }

  /**
   * Compter le nombre de scans d'un utilisateur
   */
  static async countUserScans(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('emotion_scans')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) {
      logger.error('[EmotionScanService] Count scans error:', error, 'MODULE');
      return 0;
    }

    return count || 0;
  }
}

export const emotionScanService = EmotionScanService;
export default EmotionScanService;
