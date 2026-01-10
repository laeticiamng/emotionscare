/**
 * Service MusicGen
 * 
 * Ce service gère l'intégration avec les APIs de génération de musique.
 * Il utilise l'Edge Function Supabase pour la génération sécurisée.
 */
import { supabase } from '@/integrations/supabase/client';
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

/**
 * Vérifie la connectivité avec l'API MusicGen via Edge Function
 * @returns true si la connexion est établie, false sinon
 */
export async function checkApiConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke('health-check', {
      body: { service: 'music-generation' },
    });
    
    return !error && data?.status === 'ok';
  } catch (error) {
    logger.error('MusicGen API connection check failed', error as Error, 'MUSIC');
    return false;
  }
}

/**
 * Génère une piste musicale basée sur une description textuelle via Edge Function
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
    // Appel à l'Edge Function generate-music
    const { data, error } = await supabase.functions.invoke('generate-music', {
      body: {
        emotion: mergedOptions.emotion || 'calm',
        target_energy: mergedOptions.mood || 'medium',
        duration_seconds: mergedOptions.duration || 60,
        style_preferences: [mergedOptions.genre, mergedOptions.tempo].filter(Boolean),
      },
    });
    
    if (error) {
      throw new Error(error.message || 'Failed to generate music');
    }
    
    // Si la génération est en cours, retourner un résultat temporaire
    if (data?.status === 'pending' && data?.request_id) {
      return {
        audioUrl: '', // Sera rempli une fois la génération terminée
        audioDuration: mergedOptions.duration || 60,
        trackInfo: {
          emotion: mergedOptions.emotion,
          genre: mergedOptions.genre,
          mood: mergedOptions.mood,
          prompt: mergedOptions.prompt,
          timestamp: new Date().toISOString(),
        },
      };
    }
    
    return data;
  } catch (error) {
    logger.error('Error generating music', error as Error, 'MUSIC');
    
    // Fallback: générer une URL de musique de relaxation par défaut
    return generateFallbackMusic(mergedOptions);
  }
}

/**
 * Génère une musique de fallback si l'API n'est pas disponible
 */
function generateFallbackMusic(options: MusicGenOptions): MusicGenResult {
  // URLs de musiques libres de droits par émotion
  const fallbackTracks: Record<string, string> = {
    calm: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    happy: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_946f9f6a23.mp3',
    sad: 'https://cdn.pixabay.com/download/audio/2021/11/25/audio_ba2e5f8d08.mp3',
    energetic: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_4a39a9c6a7.mp3',
    focused: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1b14.mp3',
    anxious: 'https://cdn.pixabay.com/download/audio/2021/10/25/audio_e8df7c3a82.mp3',
    neutral: 'https://cdn.pixabay.com/download/audio/2022/02/22/audio_d1718ab41b.mp3',
  };
  
  const emotion = options.emotion?.toLowerCase() || 'neutral';
  const audioUrl = fallbackTracks[emotion] || fallbackTracks.neutral;
  
  return {
    audioUrl,
    audioDuration: options.duration || 60,
    trackInfo: {
      emotion: options.emotion,
      genre: options.genre,
      mood: options.mood,
      prompt: options.prompt || `Fallback music for ${emotion}`,
      timestamp: new Date().toISOString(),
    },
  };
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
    description: result.trackInfo.prompt || '',
    duration: result.audioDuration,
    url: result.audioUrl,
    audioUrl: result.audioUrl,
    category: 'generated',
    mood: result.trackInfo.mood || result.trackInfo.emotion,
    tags: ['generated', result.trackInfo.emotion || '', result.trackInfo.genre || ''].filter(Boolean).join(','),
    artist: 'EmotionsCare AI',
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
