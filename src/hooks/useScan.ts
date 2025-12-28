import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

// Declare gtag on window for analytics
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export type ScanMode = 'photo' | 'camera';
export type ScanBucket = 'positif' | 'calme' | 'neutre' | 'tendu';

export interface ScanResult {
  bucket: ScanBucket;
  label: string;
  advice?: string;
  confidence?: number;
}

interface ScanState {
  mode: ScanMode;
  result: ScanResult | null;
  loading: boolean;
}

const compressImage = (file: File, maxWidth = 1280, quality = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Vérification SSR
    if (typeof document === 'undefined' || typeof Image === 'undefined') {
      reject(new Error('Document/Image API not available (SSR)'));
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new window.Image();

    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      const width = img.width * ratio;
      const height = img.height * ratio;

      canvas.width = width;
      canvas.height = height;

      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      const base64 = canvas.toDataURL('image/jpeg', quality);
      resolve(base64);
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

const captureFrameFromVideo = (video: HTMLVideoElement): string => {
  // Vérification SSR
  if (typeof document === 'undefined') {
    throw new Error('Document API not available (SSR)');
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    logger.error('Canvas context not available', new Error('Canvas context unavailable'), 'SCAN');
    throw new Error('Canvas context not available');
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  ctx.drawImage(video, 0, 0);
  return canvas.toDataURL('image/jpeg', 0.7);
};

export const useScan = () => {
  const [state, setState] = useState<ScanState>({
    mode: 'photo',
    result: null,
    loading: false,
  });

  const setMode = useCallback((mode: ScanMode) => {
    setState(prev => ({ ...prev, mode, result: null }));
  }, []);

  const analyzeImage = useCallback(async (imageBase64: string, mode: ScanMode) => {
    setState(prev => ({ ...prev, loading: true }));

    try {
      const { data, error } = await supabase.functions.invoke('hume-analysis', {
        body: {
          mode,
          image_base64: imageBase64,
          context: 'b2c' // or 'b2b' based on user context
        }
      });

      if (error) throw error;

      const result: ScanResult = {
        bucket: data.bucket,
        label: data.label,
        advice: data.advice,
        confidence: data.confidence
      };

      setState(prev => ({ 
        ...prev, 
        result,
        loading: false 
      }));

      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'scan_result_shown', {
          custom_bucket: result.bucket,
          custom_confidence: result.confidence
        });
      }

      toast({
        title: "Analyse terminée",
        description: `État détecté: ${result.label}`,
        duration: 3000
      });

    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      
      toast({
        title: "Analyse impossible",
        description: "Réessayez dans quelques instants",
        variant: "destructive"
      });
    }
  }, []);

  const analyzePhoto = useCallback(async (imageFile: File | string) => {
    try {
      let base64: string;
      
      if (typeof imageFile === 'string') {
        base64 = imageFile;
      } else {
        // Analytics
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'scan_photo_uploaded');
        }
        
        base64 = await compressImage(imageFile);
      }

      await analyzeImage(base64, 'photo');
      
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de traiter l'image",
        variant: "destructive"
      });
    }
  }, [analyzeImage]);

  const analyzeCamera = useCallback(async (video: HTMLVideoElement | string) => {
    try {
      let base64: string;
      
      if (typeof video === 'string') {
        base64 = video;
      } else {
        // Analytics
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'scan_camera_captured');
        }
        
        base64 = captureFrameFromVideo(video);
      }

      await analyzeImage(base64, 'camera');
      
    } catch (error) {
      toast({
        title: "Erreur caméra",
        description: "Impossible de capturer l'image",
        variant: "destructive"
      });
    }
  }, [analyzeImage]);

  return {
    ...state,
    setMode,
    analyzePhoto,
    analyzeCamera
  };
};
