// @ts-nocheck
// Service client Suno pour EmotionsCare - Optimisé pour sunoapi.org
export type SunoModel = "V3_5" | "V4" | "V4_5";

export interface SunoGenerateRequest {
  prompt: string;
  style?: string;
  title?: string;
  customMode?: boolean;
  instrumental?: boolean;
  model?: SunoModel;
  duration?: number;
  callBackUrl?: string;
}

export interface SunoLyricsRequest {
  prompt: string;
  language?: string;
  callBackUrl?: string;
}

export interface SunoTaskResponse {
  taskId: string;
  status: string;
}

export class SunoApiClient {
  private apiKey: string;
  private baseUrl = 'https://api.sunoapi.org/api'; // API stable recommandée par sunoapi.org
  
  constructor(apiKey?: string) {
    this.apiKey = apiKey || '';
    if (!this.apiKey) {
      throw new Error("Missing SUNO_API_KEY");
    }
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      'Accept': 'application/json'
    };
  }

  async generateLyrics(request: SunoLyricsRequest): Promise<SunoTaskResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/lyrics`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          prompt: request.prompt,
          language: request.language || 'fr',
          custom_mode: true, // Utilisation du mode V4 recommandé
          wait_audio: false // Streaming pour réponse rapide
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Suno Lyrics API Error: ${response.status} - ${errorData}`);
      }

      return await response.json();
    } catch (error) {
      // Silent: Suno lyrics generation error logged internally
      throw error;
    }
  }

  async generateMusic(request: SunoGenerateRequest): Promise<SunoTaskResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/music`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          prompt: request.prompt,
          style: request.style,
          title: request.title,
          custom_mode: true, // Mode V4 pour qualité optimale
          instrumental: request.instrumental || false,
          duration: request.duration || 120,
          wait_audio: false, // Streaming activé pour réponse en 20s
          make_instrumental: request.instrumental || false,
          tags: request.style, // Optimisation des tags pour meilleure génération
          model: request.model || 'V4_5'
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Suno Music API Error: ${response.status} - ${errorData}`);
      }

      return await response.json();
    } catch (error) {
      // Silent: Suno music generation error logged internally
      throw error;
    }
  }

  async getTaskStatus(taskId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/tasks/${taskId}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Suno Task Status Error: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      
      // Gestion du streaming - réponse rapide en moins de 20s
      if (result.status === 'completed' && result.audio_url) {
        return {
          ...result,
          ready: true,
          audio_url: result.audio_url,
          video_url: result.video_url || null
        };
      }
      
      return result;
    } catch (error) {
      // Silent: Suno task status check error logged internally
      throw error;
    }
  }
}