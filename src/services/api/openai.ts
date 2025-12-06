// @ts-nocheck
/**
 * Service OpenAI optimisé - Architecture minimale EmotionsCare
 * Couvre: chat, ASR Whisper, TTS, embeddings, moderation
 */

import { supabase } from '@/integrations/supabase/client';

export interface OpenAIError {
  error: string;
  details?: string;
}

export interface OpenAIChatResponse {
  response: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface OpenAITranscriptionResponse {
  text: string;
  language?: string;
}

export interface OpenAITTSResponse {
  audioContent: string; // base64 encoded
}

export interface OpenAIEmbeddingResponse {
  embedding: number[];
  usage?: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

export interface OpenAIModerationResponse {
  flagged: boolean;
  categories: Record<string, boolean>;
  category_scores: Record<string, number>;
}

class OpenAIService {
  /**
   * Chat/Conseils - pour Story Synth Lab, Bounce-Back Battle, Nudges
   */
  async chat(
    messages: { role: string; content: string }[],
    options?: {
      model?: string;
      temperature?: number;
      max_tokens?: number;
    }
  ): Promise<OpenAIChatResponse> {
    const { data, error } = await supabase.functions.invoke('openai-chat', {
      body: {
        messages,
        model: options?.model || 'gpt-4o-mini',
        temperature: options?.temperature || 0.7,
        max_tokens: options?.max_tokens || 1000
      }
    });

    if (error) {
      throw new Error(error.message || 'Erreur lors du chat OpenAI');
    }

    return data;
  }

  /**
   * ASR Whisper - pour Journal voix
   */
  async transcribe(audioBlob: Blob): Promise<OpenAITranscriptionResponse> {
    const formData = new FormData();
    formData.append('audio', audioBlob);

    const { data, error } = await supabase.functions.invoke('openai-transcribe', {
      body: formData
    });

    if (error) {
      throw new Error(error.message || 'Erreur lors de la transcription');
    }

    return data;
  }

  /**
   * TTS - pour Story Synth Lab
   */
  async textToSpeech(
    text: string,
    options?: {
      voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
      model?: 'tts-1' | 'tts-1-hd';
    }
  ): Promise<OpenAITTSResponse> {
    const { data, error } = await supabase.functions.invoke('openai-tts', {
      body: {
        text,
        voice: options?.voice || 'alloy',
        model: options?.model || 'tts-1'
      }
    });

    if (error) {
      throw new Error(error.message || 'Erreur lors de la synthèse vocale');
    }

    return data;
  }

  /**
   * Embeddings - pour FAQ/Help search
   */
  async createEmbedding(text: string): Promise<OpenAIEmbeddingResponse> {
    const { data, error } = await supabase.functions.invoke('openai-embeddings', {
      body: {
        input: text,
        model: 'text-embedding-ada-002'
      }
    });

    if (error) {
      throw new Error(error.message || 'Erreur lors de la création d\'embedding');
    }

    return data;
  }

  /**
   * Modération - pour Journal/feedback UGC
   */
  async moderate(text: string): Promise<OpenAIModerationResponse> {
    const { data, error } = await supabase.functions.invoke('openai-moderate', {
      body: {
        input: text
      }
    });

    if (error) {
      throw new Error(error.message || 'Erreur lors de la modération');
    }

    return data;
  }

  /**
   * Conseil court - pour Quick Nudge (accueil)
   */
  async generateNudge(context: {
    emotion?: string;
    timeOfDay?: string;
    lastActivity?: string;
  }): Promise<{ nudge: string }> {
    const prompt = `Génère un conseil bienveillant de 1-2 phrases pour une personne qui se sent ${context.emotion || 'neutre'} ${context.timeOfDay || 'aujourd\'hui'}. ${context.lastActivity ? `Dernière activité: ${context.lastActivity}` : ''}. Reste positif et actionnable.`;

    const response = await this.chat([
      { role: 'system', content: 'Tu es un coach bienveillant qui donne des conseils courts et positifs.' },
      { role: 'user', content: prompt }
    ], {
      max_tokens: 100,
      temperature: 0.8
    });

    return { nudge: response.response };
  }
}

export const openAIService = new OpenAIService();