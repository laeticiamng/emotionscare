
/**
 * Service Whisper
 * 
 * Ce service gère l'intégration avec l'API Whisper d'OpenAI pour la reconnaissance vocale.
 * Il permet de transcrire de l'audio en texte.
 */
import { API_URL } from '@/lib/env';

// Types pour les options de transcription
export interface WhisperOptions {
  model?: string; // Modèle Whisper à utiliser
  language?: string; // Code langue ISO (fr, en, etc.)
  prompt?: string; // Prompt pour guider la transcription
  temperature?: number; // Température (créativité)
  responseFormat?: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt';
}

// Types pour les résultats
export interface WhisperTranscription {
  text: string;
  segments?: Array<{
    id: number;
    start: number;
    end: number;
    text: string;
  }>;
  language?: string;
}

/**
 * Transcrit un fichier audio en texte
 * @param audioFile Le fichier audio à transcrire
 * @param options Options de transcription
 * @returns Le texte transcrit
 */
export async function transcribeAudio(
  audioFile: File | Blob,
  options: WhisperOptions = {}
): Promise<WhisperTranscription> {
  const {
    model = 'whisper-1',
    language,
    prompt,
    temperature = 0,
    responseFormat = 'json'
  } = options;
  
  try {
    // Vérification de la clé API
    // NOTE: En production, utiliser Supabase Edge Functions
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key is not set. Use Supabase Edge Functions in production.');
    }

    // Préparation du FormData pour l'upload
    const formData = new FormData();
    formData.append('file', audioFile);
    formData.append('model', model);
    
    if (language) {
      formData.append('language', language);
    }
    if (prompt) {
      formData.append('prompt', prompt);
    }
    
    formData.append('temperature', temperature.toString());
    formData.append('response_format', responseFormat);

    // Appel à l'API Whisper
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error?.error?.message || 'Failed to transcribe audio');
    }

    return await response.json();
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
}

/**
 * Transcrit un enregistrement vocal depuis un microphone
 * @param options Options de transcription
 * @returns Promise avec le texte transcrit
 */
export async function recordAndTranscribe(options: WhisperOptions = {}): Promise<string> {
  try {
    // Demande d'accès au microphone
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    // Création de l'enregistreur
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks: BlobPart[] = [];
    
    // Collecte des morceaux audio
    mediaRecorder.addEventListener('dataavailable', (event) => {
      audioChunks.push(event.data);
    });
    
    // Lance l'enregistrement
    mediaRecorder.start();
    
    // Attend que l'utilisateur arrête l'enregistrement
    return new Promise((resolve, reject) => {
      // Fonction pour arrêter l'enregistrement
      const stopRecording = () => {
        return new Promise<Blob>((resolveBlob) => {
          mediaRecorder.addEventListener('stop', () => {
            // Combine les chunks en un seul blob
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            resolveBlob(audioBlob);
          });
          
          // Arrête l'enregistrement
          mediaRecorder.stop();
          
          // Arrête les flux audio
          stream.getTracks().forEach(track => track.stop());
        });
      };
      
      // Timer pour arrêter automatiquement après 30 secondes
      const timer = setTimeout(async () => {
        try {
          const audioBlob = await stopRecording();
          const transcription = await transcribeAudio(audioBlob, options);
          resolve(transcription.text);
        } catch (error) {
          reject(error);
        }
      }, 30000);
      
      // Méthode pour arrêter manuellement
      (window as any).stopWhisperRecording = async () => {
        clearTimeout(timer);
        delete (window as any).stopWhisperRecording;
        
        try {
          const audioBlob = await stopRecording();
          const transcription = await transcribeAudio(audioBlob, options);
          resolve(transcription.text);
        } catch (error) {
          reject(error);
        }
      };
    });
  } catch (error) {
    console.error('Error recording audio:', error);
    throw error;
  }
}

/**
 * Vérifie l'accès au microphone
 * @returns true si l'accès est disponible, false sinon
 */
export async function checkMicrophoneAccess(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    console.error('Microphone access check failed:', error);
    return false;
  }
}

export default {
  transcribeAudio,
  recordAndTranscribe,
  checkMicrophoneAccess
};
