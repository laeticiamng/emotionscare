
// import { Configuration, OpenAIApi } from 'openai'; - This will be mocked
import { Emotion, EmotionResult } from '@/types';
import { mockAnalysis } from '@/mocks/aiFallback';
import { supabase } from '@/lib/supabase-client';
import { getEmotionEmoji } from './emotionUtilService';

const useMocks = true; // Always use mocks until OpenAI is properly configured
const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

// Mock OpenAI client instead of actual initialization
const openai = {
  createChatCompletion: async () => {
    return {
      data: {
        choices: [
          {
            message: {
              content: JSON.stringify(mockAnalysis)
            }
          }
        ]
      }
    };
  }
};

interface AnalyzeEmotionParams {
  user_id: string;
  emojis?: string;
  text?: string;
  audio_url?: string;
  is_confidential?: boolean;
  share_with_coach?: boolean;
}

export const analyzeEmotion = async (params: AnalyzeEmotionParams): Promise<EmotionResult> => {
  if (useMocks) {
    console.log('Mocks activés: Analyse émotionnelle simulée.');
    return mockAnalysis;
  }

  try {
    let transcript = '';
    if (params.audio_url) {
      transcript = await transcribeAudio(params.audio_url);
    }

    const prompt = constructPrompt({
      emojis: params.emojis,
      text: params.text,
      transcript: transcript
    });

    // Use the mock openai client
    const response = await openai.createChatCompletion();

    const analysis = parseAnalysis(response.data.choices[0].message?.content);
    const emotionEntry = await saveEmotionEntry({
      ...params,
      ...analysis,
      transcript: transcript
    });

    return {
      ...analysis,
      transcript: transcript,
      id: emotionEntry.id
    };

  } catch (error: any) {
    console.error('Erreur lors de l\'analyse émotionnelle:', error);
    throw new Error(handleError(error));
  }
};

// Added to be used by scanService.ts
export const analyzeAudioStream = async (audioData: Uint8Array[]): Promise<EmotionResult> => {
  console.log('Analyse audio simulée avec mocks');
  return {
    ...mockAnalysis,
    transcript: "Transcription audio simulée",
    id: `audio-${Date.now()}`
  };
};

// Added to be used by scanService.ts
export const saveRealtimeEmotionScan = async (result: EmotionResult, userId: string): Promise<void> => {
  console.log('Sauvegarde de scan en temps réel simulée pour utilisateur:', userId);
  // Simulation of saving - no actual implementation needed for mock
};

const constructPrompt = (input: { emojis?: string; text?: string; transcript?: string }): string => {
  let prompt = "Analyse l'état émotionnel de l'utilisateur basé sur les informations suivantes.\n";

  if (input.emojis) {
    prompt += `Émojis: ${input.emojis}\n`;
  }
  if (input.text) {
    prompt += `Texte: ${input.text}\n`;
  }
  if (input.transcript) {
    prompt += `Transcription audio: ${input.transcript}\n`;
  }

  prompt += `\nFournis une réponse JSON structurée avec les clés suivantes:
   - emotion (string): L'émotion principale ressentie par l'utilisateur.
   - confidence (number): Un score de confiance de 0 à 1 indiquant la certitude de l'analyse.
   - feedback (string): Un court paragraphe donnant du feedback sur l'état émotionnel de l'utilisateur.
   - recommendations (string[]): Une liste de recommandations pour aider l'utilisateur à gérer son état émotionnel.

   Exemple de réponse:
   \`\`\`json
   {
     "emotion": "joyeux",
     "confidence": 0.85,
     "feedback": "Vous semblez être de bonne humeur. Continuez à profiter de votre journée!",
     "recommendations": ["Écoutez de la musique entraînante", "Passez du temps avec des amis"]
   }
   \`\`\`
   `;

  return prompt;
};

const parseAnalysis = (rawAnalysis: string | undefined): {
  emotion: string;
  confidence: number;
  feedback: string;
  recommendations: string[];
} => {
  if (!rawAnalysis) {
    console.warn('Aucune analyse brute à parser.');
    return mockAnalysis;
  }

  try {
    const analysis = JSON.parse(rawAnalysis);
    return {
      emotion: analysis.emotion || mockAnalysis.emotion,
      confidence: analysis.confidence !== undefined ? parseFloat(analysis.confidence) : mockAnalysis.confidence,
      feedback: analysis.feedback || mockAnalysis.feedback,
      recommendations: analysis.recommendations || mockAnalysis.recommendations,
    };
  } catch (error) {
    console.error('Erreur lors du parsing de l\'analyse JSON:', error);
    return mockAnalysis;
  }
};

const transcribeAudio = async (audioUrl: string): Promise<string> => {
  try {
    // Simuler la transcription audio pour le moment
    console.log('Début de la transcription audio simulée...');
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simuler un délai de traitement

    const transcription = "Ceci est une transcription simulée de l'audio.";
    console.log('Transcription simulée réussie.');
    return transcription;
  } catch (error) {
    console.error('Erreur lors de la transcription audio:', error);
    return '';
  }
};

const saveEmotionEntry = async (params: AnalyzeEmotionParams & {
  emotion: string;
  confidence: number;
  feedback: string;
  recommendations: string[];
  transcript: string;
}): Promise<Emotion> => {
  try {
    const emotionEntry = {
      user_id: params.user_id,
      date: new Date().toISOString(),
      emotion: params.emotion,
      score: Math.round(params.confidence * 100),
      text: params.text,
      emojis: params.emojis || getEmotionEmoji(params.emotion),
      ai_feedback: params.feedback,
      confidence: params.confidence,
      source: 'scan',
      is_confidential: params.is_confidential,
    };

    const { data, error } = await supabase
      .from('emotions')
      .insert([emotionEntry])
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return data as Emotion;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de l\'entrée émotionnelle:', error);
    throw error;
  }
};

export const handleError = (error: unknown): string => {
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as Error).message;
  }
  return 'An unknown error occurred';
};
