
// Service client Suno pour EmotionsCare
export type SunoModel = "V3_5" | "V4" | "V4_5";

export interface SunoGenerateRequest {
  prompt: string;
  style?: string;
  title?: string;
  customMode?: boolean;
  instrumental?: boolean;
  model?: SunoModel;
  callBackUrl?: string;
}

export interface SunoLyricsRequest {
  prompt: string;
  callBackUrl?: string;
}

export interface SunoTaskResponse {
  taskId: string;
  status: string;
}

export class SunoApiClient {
  private apiKey: string;
  private baseUrl = 'https://api.suno.ai';
  
  constructor(apiKey?: string) {
    this.apiKey = apiKey || '';
    if (!this.apiKey) {
      throw new Error("Missing SUNO_API_KEY");
    }
  }

  async generateLyrics(request: SunoLyricsRequest): Promise<SunoTaskResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/lyrics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          prompt: request.prompt,
          callback_url: request.callBackUrl,
        }),
      });

      if (!response.ok) {
        throw new Error(`Suno Lyrics API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ EmotionsCare Suno Lyrics Error:', error);
      throw error;
    }
  }

  async generateMusic(request: SunoGenerateRequest): Promise<SunoTaskResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/music`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          prompt: request.prompt,
          style: request.style,
          title: request.title,
          custom_mode: request.customMode || false,
          instrumental: request.instrumental || false,
          model: request.model || 'V4_5',
          callback_url: request.callBackUrl,
        }),
      });

      if (!response.ok) {
        throw new Error(`Suno Music API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ EmotionsCare Suno Music Error:', error);
      throw error;
    }
  }

  async getTaskStatus(taskId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/tasks/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Suno Task Status Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ EmotionsCare Suno Task Status Error:', error);
      throw error;
    }
  }
}
