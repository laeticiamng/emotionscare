/**
 * Hook React pour le scan émotionnel
 * Wrapper autour du EmotionScanService pour une utilisation facile dans les composants
 */

import { useState, useCallback } from 'react';
import { EmotionScanService } from './emotionScanService';
import type {
  EmotionResult,
  FacialAnalysisResult,
  ScanMode
} from './types';

interface UseEmotionScanOptions {
  userId: string;
  autoSave?: boolean;
}

export const useEmotionScan = (options: UseEmotionScanOptions) => {
  const { userId } = options;

  const [isScanning, setIsScanning] = useState(false);
  const [lastResult, setLastResult] = useState<EmotionResult | null>(null);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Scanner une émotion depuis du texte
   */
  const scanText = useCallback(
    async (text: string, language = 'fr'): Promise<EmotionResult> => {
      setIsScanning(true);
      setError(null);

      try {
        const result = await EmotionScanService.analyzeText(userId, text, {
          language
        });
        setLastResult(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        throw error;
      } finally {
        setIsScanning(false);
      }
    },
    [userId]
  );

  /**
   * Scanner une émotion depuis un enregistrement vocal
   */
  const scanVoice = useCallback(
    async (audioData: Blob, language = 'fr'): Promise<EmotionResult> => {
      setIsScanning(true);
      setError(null);

      try {
        const result = await EmotionScanService.analyzeVoice(userId, audioData, {
          language
        });
        setLastResult(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        throw error;
      } finally {
        setIsScanning(false);
      }
    },
    [userId]
  );

  /**
   * Scanner une émotion depuis une image (facial analysis)
   */
  const scanFacial = useCallback(
    async (
      imageData: string | Blob,
      includeLandmarks = false
    ): Promise<FacialAnalysisResult> => {
      setIsScanning(true);
      setError(null);

      try {
        const result = await EmotionScanService.analyzeFacial(
          userId,
          imageData,
          { includeLandmarks }
        );
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        throw error;
      } finally {
        setIsScanning(false);
      }
    },
    [userId]
  );

  /**
   * Scanner une émotion (mode générique)
   */
  const scan = useCallback(
    async (
      mode: ScanMode,
      data: string | Blob
    ): Promise<EmotionResult | FacialAnalysisResult> => {
      switch (mode) {
        case 'text':
          if (typeof data !== 'string') {
            throw new Error('Text mode requires string data');
          }
          return scanText(data);

        case 'voice':
          if (!(data instanceof Blob)) {
            throw new Error('Voice mode requires Blob data');
          }
          return scanVoice(data);

        case 'facial':
        case 'image':
          return scanFacial(data);

        case 'realtime':
          throw new Error(
            'Realtime mode is not supported in this hook. Use useRealtimeEmotionScan instead.'
          );

        default:
          throw new Error(`Unsupported scan mode: ${mode}`);
      }
    },
    [scanText, scanVoice, scanFacial]
  );

  return {
    scan,
    scanText,
    scanVoice,
    scanFacial,
    isScanning,
    lastResult,
    error
  };
};
