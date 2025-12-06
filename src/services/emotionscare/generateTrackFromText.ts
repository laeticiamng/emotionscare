// @ts-nocheck

// Générateur de piste EmotionsCare à partir de texte
import { HumeClient } from './humeClient';
import { SunoApiClient } from './sunoClient';
import { choosePreset } from './choosePreset';

export interface GenerateTrackRequest {
  text: string;
  language?: "English" | "Français";
  callBackUrl?: string;
  userId?: string;
}

export interface GenerateTrackResponse {
  lyricsTask: string;
  musicTask: string;
  preset: any;
  emotions: any[];
  metadata: {
    originalText: string;
    language: string;
    timestamp: string;
    userId?: string;
  };
}

export async function generateTrackFromText({
  text,
  language = "English",
  callBackUrl,
  userId,
}: GenerateTrackRequest): Promise<GenerateTrackResponse> {
  
  // Silent: starting track generation
  
  try {
    // 1. Analyser les émotions avec Hume AI
    const humeApiKey = process.env.HUME_API_KEY;
    if (!humeApiKey) {
      throw new Error('HUME_API_KEY not configured');
    }
    
    const hume = new HumeClient(humeApiKey);
    const emotions = await hume.detectEmotion(text);
    
    // Silent: emotions detected
    
    // 2. Choisir le preset approprié
    const preset = choosePreset(emotions);
    // Silent: preset selected
    // 3. Assembler le prompt optimisé
    const themeText = text.slice(0, 80).replace(/[^\w\s]/gi, '');
    const prompt = `${language} | ${preset.style} | mood ${preset.tag} | theme: ${themeText}`;
    
    // Silent: prompt generated
    // 4. Générer les paroles et la musique avec Suno
    const sunoApiKey = process.env.SUNO_API_KEY;
    if (!sunoApiKey) {
      throw new Error('SUNO_API_KEY not configured');
    }
    
    const suno = new SunoApiClient(sunoApiKey);
    
    // Génération des paroles
    const lyricsResponse = await suno.generateLyrics({
      prompt: `${preset.prompt} | Theme: ${themeText} | Language: ${language}`,
      callBackUrl,
    });
    
    // Génération de la musique
    const musicResponse = await suno.generateMusic({
      prompt,
      style: preset.style,
      title: text.slice(0, 50),
      customMode: false,
      instrumental: false,
      model: "V4_5",
      callBackUrl,
    });
    
    const response: GenerateTrackResponse = {
      lyricsTask: lyricsResponse.taskId,
      musicTask: musicResponse.taskId,
      preset,
      emotions: emotions.slice(0, 5), // Top 5 emotions
      metadata: {
        originalText: text,
        language,
        timestamp: new Date().toISOString(),
        userId,
      },
    };
    
    // Silent: track generation initiated successfully
    
    return response;
    
  } catch (error) {
    // Silent: track generation error logged internally
    throw new Error(`Track generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Fonction utilitaire pour obtenir le statut des tâches
export async function getTasksStatus(lyricsTaskId: string, musicTaskId: string) {
  const sunoApiKey = process.env.SUNO_API_KEY;
  if (!sunoApiKey) {
    throw new Error('SUNO_API_KEY not configured');
  }
  
  const suno = new SunoApiClient(sunoApiKey);
  
  try {
    const [lyricsStatus, musicStatus] = await Promise.all([
      suno.getTaskStatus(lyricsTaskId),
      suno.getTaskStatus(musicTaskId),
    ]);
    
    return {
      lyrics: lyricsStatus,
      music: musicStatus,
      isComplete: lyricsStatus.status === 'completed' && musicStatus.status === 'completed',
      isProcessing: lyricsStatus.status === 'processing' || musicStatus.status === 'processing',
      hasError: lyricsStatus.status === 'error' || musicStatus.status === 'error',
    };
  } catch (error) {
    // Silent: failed to get tasks status
    throw error;
  }
}
