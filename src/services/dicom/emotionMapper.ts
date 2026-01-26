/**
 * Service de mapping émotions -> régions cérébrales
 * Intégration Hume AI pour overlay émotionnel
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { EMOTION_BRAIN_MAPPING, type EmotionRegionMap } from '@/components/brain/types';

export interface HumeEmotionScore {
  name: string;
  score: number;
}

export interface EmotionOverlayData {
  emotions: HumeEmotionScore[];
  mappings: EmotionRegionMap;
  timestamp: string;
  dominantEmotion?: string;
  overallIntensity: number;
}

/**
 * Récupérer les dernières émotions Hume AI pour un patient
 */
export async function fetchPatientEmotions(patientId: string): Promise<EmotionOverlayData | null> {
  try {
    // Récupérer depuis la table emotion_brain_mappings
    const { data, error } = await supabase
      .from('emotion_brain_mappings')
      .select('*')
      .eq('patient_id', patientId)
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    if (data) {
      return {
        emotions: Object.entries(data.mappings as EmotionRegionMap).map(([name, value]) => ({
          name,
          score: value?.intensity || 0,
        })),
        mappings: data.mappings as EmotionRegionMap,
        timestamp: data.timestamp,
        dominantEmotion: getDominantEmotion(data.mappings as EmotionRegionMap),
        overallIntensity: calculateOverallIntensity(data.mappings as EmotionRegionMap),
      };
    }
    
    return null;
  } catch (error) {
    logger.error('Erreur récupération émotions patient', error as Error, 'EMOTION_MAPPER');
    return null;
  }
}

/**
 * Mapper les scores d'émotions aux régions cérébrales
 */
export function mapEmotionsToBrainRegions(emotions: HumeEmotionScore[]): EmotionRegionMap {
  const mappings: EmotionRegionMap = {};
  
  emotions.forEach((emotion) => {
    const emotionKey = emotion.name.toLowerCase();
    const mapping = EMOTION_BRAIN_MAPPING[emotionKey];
    
    if (mapping) {
      mappings[emotionKey] = {
        region: mapping.regions[0], // Région primaire
        intensity: emotion.score,
        color: adjustColorIntensity(mapping.color, emotion.score),
      };
    }
  });
  
  return mappings;
}

/**
 * Appeler l'API Hume AI pour analyser les émotions en temps réel
 */
export async function analyzeEmotionsWithHume(
  audioOrVideoUrl?: string,
  textContent?: string
): Promise<HumeEmotionScore[]> {
  try {
    const { data, error } = await supabase.functions.invoke('hume-emotion-analysis', {
      body: {
        audioUrl: audioOrVideoUrl,
        text: textContent,
      },
    });
    
    if (error) throw error;
    
    return data.emotions || [];
  } catch (error) {
    logger.error('Erreur analyse Hume AI', error as Error, 'HUME');
    // Retourner des données simulées en cas d'erreur
    return getSimulatedEmotions();
  }
}

/**
 * Sauvegarder un mapping émotion-cerveau
 */
export async function saveEmotionBrainMapping(
  patientId: string,
  scanId: string | null,
  mappings: EmotionRegionMap,
  humeSessionId?: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('emotion_brain_mappings')
      .insert({
        patient_id: patientId,
        scan_id: scanId,
        mappings,
        hume_session_id: humeSessionId,
        source: 'hume_ai',
      });
    
    if (error) throw error;
    
    logger.info('Mapping émotion-cerveau sauvegardé', { patientId, scanId }, 'EMOTION_MAPPER');
    return true;
  } catch (error) {
    logger.error('Erreur sauvegarde mapping', error as Error, 'EMOTION_MAPPER');
    return false;
  }
}

/**
 * Obtenir les régions cérébrales affectées par une émotion
 */
export function getAffectedRegions(emotion: string): string[] {
  const mapping = EMOTION_BRAIN_MAPPING[emotion.toLowerCase()];
  return mapping?.regions || [];
}

/**
 * Calculer la couleur de la région en fonction de l'intensité
 */
function adjustColorIntensity(baseColor: string, intensity: number): string {
  // Convertir hex en RGB
  const hex = baseColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Ajuster la luminosité en fonction de l'intensité (0.3 à 1.0)
  const factor = 0.3 + intensity * 0.7;
  
  const newR = Math.round(r * factor);
  const newG = Math.round(g * factor);
  const newB = Math.round(b * factor);
  
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

function getDominantEmotion(mappings: EmotionRegionMap): string | undefined {
  let maxIntensity = 0;
  let dominant: string | undefined;
  
  Object.entries(mappings).forEach(([emotion, data]) => {
    if (data && data.intensity > maxIntensity) {
      maxIntensity = data.intensity;
      dominant = emotion;
    }
  });
  
  return dominant;
}

function calculateOverallIntensity(mappings: EmotionRegionMap): number {
  const values = Object.values(mappings).filter(Boolean);
  if (values.length === 0) return 0;
  
  const sum = values.reduce((acc, val) => acc + (val?.intensity || 0), 0);
  return sum / values.length;
}

/**
 * Émotions simulées pour le mode démo
 */
export function getSimulatedEmotions(): HumeEmotionScore[] {
  return [
    { name: 'Joy', score: 0.6 + Math.random() * 0.3 },
    { name: 'Anxiety', score: 0.2 + Math.random() * 0.3 },
    { name: 'Sadness', score: 0.1 + Math.random() * 0.2 },
    { name: 'Anger', score: 0.05 + Math.random() * 0.1 },
    { name: 'Fear', score: 0.1 + Math.random() * 0.15 },
    { name: 'Surprise', score: 0.3 + Math.random() * 0.2 },
  ].sort((a, b) => b.score - a.score);
}

/**
 * Générer des données temps réel simulées pour la démo
 */
export function generateRealtimeEmotionStream(
  callback: (data: EmotionOverlayData) => void,
  intervalMs: number = 2000
): () => void {
  const intervalId = setInterval(() => {
    const emotions = getSimulatedEmotions();
    const mappings = mapEmotionsToBrainRegions(emotions);
    
    callback({
      emotions,
      mappings,
      timestamp: new Date().toISOString(),
      dominantEmotion: getDominantEmotion(mappings),
      overallIntensity: calculateOverallIntensity(mappings),
    });
  }, intervalMs);
  
  return () => clearInterval(intervalId);
}
