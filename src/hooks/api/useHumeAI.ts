
import { useState, useCallback } from 'react';
import humeAIService from '@/services/humeai';
import type { HumeAIOptions } from '@/services/humeai';

interface EmotionAnalysisResult {
  primary: string;
  confidence: number;
  secondary?: string;
  secondaryConfidence?: number;
}

interface EmotionAnalysisResponse {
  emotion: EmotionAnalysisResult;
  prosody?: {
    pace: string;
    pitch: string;
    variation: string;
  };
  facialFeatures?: {
    eyeOpenness: number;
    smileIntensity: number;
    attentionFocus: number;
  };
}

interface HumeAIResult {
  result: EmotionAnalysisResponse | null;
  loading: boolean;
  error: string | null;
}

interface UseHumeAIReturn extends HumeAIResult {
  analyzeAudio: (audioData: Blob, options?: HumeAIOptions) => Promise<EmotionAnalysisResponse | null>;
  analyzeImage: (imageData: Blob, options?: HumeAIOptions) => Promise<EmotionAnalysisResponse | null>;
  checkApiConnection: () => Promise<{ status: boolean; message: string }>;
  reset: () => void;
}

export const useHumeAI = (): UseHumeAIReturn => {
  const [result, setResult] = useState<EmotionAnalysisResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  const analyzeAudio = useCallback(async (audioData: Blob, options?: HumeAIOptions): Promise<EmotionAnalysisResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await humeAIService.analyzeEmotion(audioData, options);
      setResult(response);
      setLoading(false);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Failed to analyze audio: ${errorMessage}`);
      setLoading(false);
      return null;
    }
  }, []);

  const analyzeImage = useCallback(async (imageData: Blob, options?: HumeAIOptions): Promise<EmotionAnalysisResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await humeAIService.analyzeFacialExpression(imageData, options);
      setResult(response);
      setLoading(false);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Failed to analyze image: ${errorMessage}`);
      setLoading(false);
      return null;
    }
  }, []);

  const checkApiConnection = useCallback(async () => {
    return humeAIService.checkApiConnection();
  }, []);

  return {
    result,
    loading,
    error,
    analyzeAudio,
    analyzeImage,
    checkApiConnection,
    reset
  };
};

export default useHumeAI;
