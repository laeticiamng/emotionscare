
import { useState, useRef, useCallback } from 'react';
import { EmotionResult } from '@/types/emotion';

export const useHumeAI = () => {
  const [cameraActive, setCameraActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async (videoRef: React.RefObject<HTMLVideoElement>) => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setCameraActive(true);
      return true;
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Impossible d\'accéder à la caméra. Veuillez vérifier les permissions.');
      setCameraActive(false);
      return false;
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const processFaceEmotion = useCallback(async (
    videoElement: HTMLVideoElement,
    canvasElement: HTMLCanvasElement
  ): Promise<EmotionResult> => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Draw the current video frame to the canvas
      const context = canvasElement.getContext('2d');
      if (!context) {
        throw new Error('Cannot get canvas context');
      }
      
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;
      context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
      
      // Normally here we would send the image data to HumAI API
      // For now, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock emotion detection result
      const emotions = [
        { name: 'joy', confidence: 0.85 },
        { name: 'calm', confidence: 0.75 },
        { name: 'focus', confidence: 0.65 },
        { name: 'surprise', confidence: 0.45 },
        { name: 'anger', confidence: 0.15 },
        { name: 'sadness', confidence: 0.1 }
      ];
      
      // Randomly select one emotion with higher probability for positive emotions
      const randomIndex = Math.floor(Math.pow(Math.random(), 2) * emotions.length);
      const primaryEmotion = emotions[randomIndex];
      
      return {
        emotion: primaryEmotion.name,
        confidence: primaryEmotion.confidence,
        primaryEmotion: {
          name: primaryEmotion.name,
          confidence: primaryEmotion.confidence,
          description: `Vous semblez éprouver de ${primaryEmotion.name === 'joy' ? 'la joie' : 
            primaryEmotion.name === 'calm' ? 'la sérénité' :
            primaryEmotion.name === 'focus' ? 'la concentration' :
            primaryEmotion.name === 'surprise' ? 'la surprise' :
            primaryEmotion.name === 'anger' ? 'la colère' : 'la tristesse'}`
        },
        faceDetected: true,
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      console.error('Error processing face emotion:', err);
      setError('Erreur lors de l\'analyse des émotions. Veuillez réessayer.');
      return {
        emotion: 'unknown',
        confidence: 0,
        error: 'Erreur de traitement',
        faceDetected: false
      };
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Set up HumeAI with API key
  const setupHumeAI = useCallback((apiKey: string) => {
    console.log('Setting up HumeAI with API key:', apiKey);
    // In a real implementation, this would initialize the HumeAI client
    localStorage.setItem('humeai_api_key', apiKey);
  }, []);

  return {
    cameraActive,
    isProcessing,
    error,
    startCamera,
    stopCamera,
    processFaceEmotion,
    setupHumeAI
  };
};
