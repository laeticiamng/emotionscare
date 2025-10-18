// @ts-nocheck
import { supabase } from '@/integrations/supabase/client';
import type { ApiResponse, EmotionData } from './types';
import { logger } from '@/lib/logger';

class HumeService {
  private wsConnection: WebSocket | null = null;
  private listeners: Set<(emotions: EmotionData[]) => void> = new Set();

  private async callEdgeFunction(functionName: string, payload: any): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: payload
      });

      if (error) {
        logger.error(`Hume ${functionName} error`, error as Error, 'API');
        return {
          success: false,
          error: error.message,
          timestamp: new Date()
        };
      }

      return {
        success: true,
        data,
        timestamp: new Date()
      };
    } catch (error: any) {
      logger.error(`Hume ${functionName} error`, error as Error, 'API');
      return {
        success: false,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  async analyzeImage(
    imageData: string | File,
    type: 'base64' | 'file' = 'base64'
  ): Promise<ApiResponse<{ emotions: EmotionData[]; confidence: number }>> {
    let payload: any;

    if (type === 'file' && imageData instanceof File) {
      // Convert file to base64
      const base64 = await this.fileToBase64(imageData);
      payload = { image: base64, type: 'base64' };
    } else {
      payload = { image: imageData, type };
    }

    return this.callEdgeFunction('hume-face', payload);
  }

  async analyzeText(text: string): Promise<ApiResponse<{ 
    emotions: EmotionData[]; 
    sentiment: { polarity: number; intensity: number };
  }>> {
    return this.callEdgeFunction('analyze-emotion-text', {
      text,
      return_emotions: true,
      return_sentiment: true
    });
  }

  async analyzeVoice(audioFile: File): Promise<ApiResponse<{ 
    emotions: EmotionData[];
    transcription?: string;
    confidence: number;
  }>> {
    const formData = new FormData();
    formData.append('audio', audioFile);

    try {
      const { data, error } = await supabase.functions.invoke('hume-analysis', {
        body: formData
      });

      if (error) {
        return {
          success: false,
          error: error.message,
          timestamp: new Date()
        };
      }

      return {
        success: true,
        data,
        timestamp: new Date()
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  async startRealTimeAnalysis(
    mediaStream: MediaStream,
    options: {
      includeVoice?: boolean;
      includeFace?: boolean;
      sampleRate?: number;
    } = {}
  ): Promise<{ sessionId: string; wsUrl: string }> {
    const { data, error } = await supabase.functions.invoke('face-filter-start', {
      body: {
        deviceId: 'default',
        options
      }
    });

    if (error) {
      throw new Error(`Failed to start real-time analysis: ${error.message}`);
    }

    return data;
  }

  connectWebSocket(wsUrl: string): void {
    if (this.wsConnection) {
      this.wsConnection.close();
    }

    this.wsConnection = new WebSocket(wsUrl);

    this.wsConnection.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'emotion_analysis' && data.emotions) {
          const emotions: EmotionData[] = data.emotions.map((emotion: any) => ({
            emotion: emotion.name,
            confidence: emotion.score,
            intensity: emotion.intensity || emotion.score,
            timestamp: new Date(),
            metadata: emotion.metadata
          }));

          this.listeners.forEach(listener => listener(emotions));
        }
      } catch (error) {
        logger.error('Error parsing WebSocket message', error as Error, 'API');
      }
    };

    this.wsConnection.onerror = (error) => {
      logger.error('WebSocket error', error as Error, 'API');
    };

    this.wsConnection.onclose = () => {
      logger.info('WebSocket connection closed', undefined, 'API');
    };
  }

  onEmotionUpdate(callback: (emotions: EmotionData[]) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  sendFrame(frameData: string | ArrayBuffer): void {
    if (this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN) {
      this.wsConnection.send(frameData);
    }
  }

  disconnect(): void {
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }
    this.listeners.clear();
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Remove data:image/... prefix
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async getEmotionInsights(
    emotions: EmotionData[],
    timeRange: 'hour' | 'day' | 'week' = 'day'
  ): Promise<ApiResponse<{
    dominantEmotions: string[];
    emotionalStability: number;
    trends: Array<{ emotion: string; trend: 'up' | 'down' | 'stable' }>;
    recommendations: string[];
  }>> {
    return this.callEdgeFunction('emotion-analytics', {
      emotions,
      timeRange,
      includeRecommendations: true
    });
  }
}

export default new HumeService();