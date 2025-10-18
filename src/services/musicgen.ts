// @ts-nocheck

/**
 * Service MusicGen
 * 
 * Ce service gère l'intégration avec les APIs de génération de musique.
 * Il utilise l'API MusicGen via un proxy sécurisé côté serveur.
 */
import { API_URL } from '@/lib/env';
import { AudioTrack } from '@/types/audio';
import { logger } from '@/lib/logger';

// Types pour les options de génération
export interface MusicGenOptions {
  duration?: number; // Durée en secondes
  prompt?: string; // Description textuelle de la musique
  seed?: number; // Graine pour la reproductibilité
  temperature?: number; // Température de génération (0.0 à 1.0)
  topK?: number; // Paramètre top_k pour le sampling
  topP?: number; // Paramètre top_p pour le sampling
  emotion?: string; // Émotion dominante
  genre?: string; // Genre musical
  mood?: string; // Ambiance
  tempo?: 'slow' | 'medium' | 'fast'; // Tempo
  format?: 'mp3' | 'wav'; // Format de sortie
}

// Types pour les résultats
export interface MusicGenResult {
  audioUrl: string; // URL de l'audio généré
  audioDuration: number; // Durée en secondes
  trackInfo: {
    emotion?: string;
    genre?: string;
    mood?: string;
    prompt?: string;
    timestamp: string;
  };
}

// URL de base pour l'API (à remplacer par le réel endpoint)
const API_BASE_URL = API_URL + '/api/music-generation';

/**
 * Vérifie la connectivité avec l'API MusicGen
 * @returns true si la connexion est établie, false sinon
 */
export async function checkApiConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/status`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    return response.ok;
  } catch (error) {
    logger.error('MusicGen API connection check failed', error as Error, 'MUSIC');
    return false;
  }
}

/**
 * Génère une piste musicale basée sur une description textuelle
 * @param options Options de génération
 * @returns Informations sur la piste générée
 */
export async function generateMusic(options: MusicGenOptions): Promise<MusicGenResult> {
  // Valeurs par défaut
  const defaultOptions: MusicGenOptions = {
    duration: 30,
    temperature: 0.8,
    topK: 250,
    topP: 0,
    format: 'mp3'
  };
  
  // Fusion des options par défaut et des options utilisateur
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Si une émotion est fournie sans prompt, on construit un prompt adapté
  if (mergedOptions.emotion && !mergedOptions.prompt) {
    mergedOptions.prompt = buildPromptFromEmotion(mergedOptions.emotion, mergedOptions.genre);
  }
  
  try {
    // Envoi de la requête à l'API
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mergedOptions)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate music');
    }
    
    return await response.json();
  } catch (error) {
    logger.error('Error generating music', error as Error, 'MUSIC');
    throw error;
  }
}

/**
 * Convertit un résultat de génération en objet AudioTrack pour l'intégration avec le lecteur audio
 * @param result Le résultat de la génération
 * @param title Titre optionnel pour la piste
 * @returns Un objet AudioTrack
 */
export function resultToAudioTrack(result: MusicGenResult, title?: string): AudioTrack {
  return {
    id: `musicgen-${Date.now()}`,
    title: title || `Generated Music: ${result.trackInfo.emotion || 'Custom'}`,
    description: result.trackInfo.prompt,
    duration: result.audioDuration,
    url: result.audioUrl,
    audioUrl: result.audioUrl,
    category: 'generated',
    mood: result.trackInfo.mood || result.trackInfo.emotion,
    tags: ['generated', result.trackInfo.emotion || '', result.trackInfo.genre || ''].filter(Boolean),
    source: 'generated'
  };
}

/**
 * Génère une piste musicale basée sur une émotion
 * @param emotion L'émotion principale (happy, sad, calm, etc.)
 * @param options Options additionnelles
 * @returns Un objet AudioTrack prêt à être utilisé
 */
export async function generateMusicByEmotion(emotion: string, options: Partial<MusicGenOptions> = {}): Promise<AudioTrack> {
  // Construction automatique du prompt basé sur l'émotion
  const prompt = buildPromptFromEmotion(emotion, options.genre);
  
  // Générer la musique
  const result = await generateMusic({
    ...options,
    emotion,
    prompt
  });
  
  // Convertir en AudioTrack
  return resultToAudioTrack(result, `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Music`);
}

/**
 * Construit un prompt textuel pour la génération musicale basé sur une émotion
 * @param emotion L'émotion principale
 * @param genre Le genre musical (optionnel)
 * @returns Un prompt textuel
 */
function buildPromptFromEmotion(emotion: string, genre?: string): string {
  const emotionPrompts: Record<string, string> = {
    happy: "Create an upbeat, joyful track with positive energy",
    sad: "Compose a melancholic, reflective piece with emotional depth",
    calm: "Generate a soothing, peaceful ambient track for relaxation",
    energetic: "Produce an energetic, driving track with momentum",
    focused: "Create a minimalist, non-distracting track for concentration",
    anxious: "Compose a gentle track that helps reduce anxiety",
    neutral: "Generate a balanced, versatile track with moderate emotion",
    confident: "Create an empowering track with strong rhythms and melody"
  };
  
  // Prompt de base basé sur l'émotion
  let prompt = emotionPrompts[emotion.toLowerCase()] || 
    `Create a track that evokes a feeling of ${emotion}`;
  
  // Ajout du genre si disponible
  if (genre) {
    prompt += ` in the style of ${genre} music`;
  }
  
  return prompt;
}

// Export des fonctions principales
export default {
  generateMusic,
  generateMusicByEmotion,
  resultToAudioTrack,
  checkApiConnection
};
