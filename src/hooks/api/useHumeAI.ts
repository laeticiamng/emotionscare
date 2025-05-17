
/**
 * Hook useHumeAI
 * 
 * Ce hook fournit une interface React pour utiliser les services d'analyse émotionnelle Hume AI
 * avec gestion d'état, chargement, et résultats.
 */
import { useState, useCallback, useRef } from 'react';
import { humeAI } from '@/services';
import { HumeAIOptions, EmotionAnalysisResult } from '@/services/humeai';
import { useToast } from '@/hooks/use-toast';

interface UseHumeAIOptions {
  autoDetectWebcam?: boolean;
  onAnalysis?: (result: EmotionAnalysisResult) => void;
  onError?: (error: Error) => void;
}

export function useHumeAI(options: UseHumeAIOptions = {}) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<EmotionAnalysisResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [hasWebcamPermission, setHasWebcamPermission] = useState<boolean | null>(null);
  
  const webcamRef = useRef<HTMLVideoElement | null>(null);
  const { toast } = useToast();
  
  const { 
    autoDetectWebcam = false,
    onAnalysis,
    onError 
  } = options;
  
  /**
   * Analyse émotionnelle d'un texte
   */
  const analyzeText = useCallback(async (text: string, options?: HumeAIOptions) => {
    if (!text.trim()) return null;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Analyse le texte
      const analysis = await humeAI.analyzeText(text, options);
      setResult(analysis);
      
      // Callback utilisateur
      if (onAnalysis) {
        onAnalysis(analysis);
      }
      
      return analysis;
    } catch (err) {
      console.error('Error analyzing text:', err);
      setError(err as Error);
      
      toast({
        title: "Erreur d'analyse",
        description: "Impossible d'analyser le texte. Veuillez réessayer.",
        variant: "destructive",
      });
      
      if (onError) onError(err as Error);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [onAnalysis, onError, toast]);
  
  /**
   * Demande la permission d'accès à la webcam
   */
  const requestWebcamPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      // Arrête immédiatement le flux (on vérifie juste la permission)
      stream.getTracks().forEach(track => track.stop());
      
      setHasWebcamPermission(true);
      return true;
    } catch (err) {
      console.error('Error requesting webcam permission:', err);
      setHasWebcamPermission(false);
      
      toast({
        title: "Accès webcam refusé",
        description: "Pour utiliser l'analyse faciale, veuillez autoriser l'accès à la webcam.",
        variant: "destructive",
      });
      
      return false;
    }
  }, [toast]);
  
  /**
   * Configure la référence à la webcam
   */
  const setWebcamRef = useCallback((ref: HTMLVideoElement | null) => {
    webcamRef.current = ref;
    
    // Demande automatiquement la permission si activée
    if (ref && autoDetectWebcam && hasWebcamPermission === null) {
      requestWebcamPermission();
    }
  }, [autoDetectWebcam, hasWebcamPermission, requestWebcamPermission]);
  
  /**
   * Analyse émotionnelle depuis la webcam
   */
  const analyzeWebcam = useCallback(async (options?: HumeAIOptions) => {
    if (!webcamRef.current) {
      toast({
        title: "Webcam non disponible",
        description: "Veuillez connecter et autoriser l'accès à une webcam.",
        variant: "destructive",
      });
      return null;
    }
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Analyse l'expression faciale
      const analysis = await humeAI.analyzeWebcam(webcamRef.current, options);
      setResult(analysis);
      
      // Callback utilisateur
      if (onAnalysis) {
        onAnalysis(analysis);
      }
      
      return analysis;
    } catch (err) {
      console.error('Error analyzing webcam:', err);
      setError(err as Error);
      
      toast({
        title: "Erreur d'analyse",
        description: "Impossible d'analyser l'expression faciale. Veuillez réessayer.",
        variant: "destructive",
      });
      
      if (onError) onError(err as Error);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [webcamRef, onAnalysis, onError, toast]);
  
  /**
   * Analyse émotionnelle d'un fichier audio
   */
  const analyzeAudioFile = useCallback(async (file: File, options?: HumeAIOptions) => {
    if (!file || !file.type.includes('audio')) {
      toast({
        title: "Format invalide",
        description: "Veuillez sélectionner un fichier audio.",
        variant: "destructive",
      });
      return null;
    }
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Analyse l'audio
      const analysis = await humeAI.analyzeAudio(file, options);
      setResult(analysis);
      
      // Callback utilisateur
      if (onAnalysis) {
        onAnalysis(analysis);
      }
      
      return analysis;
    } catch (err) {
      console.error('Error analyzing audio:', err);
      setError(err as Error);
      
      toast({
        title: "Erreur d'analyse",
        description: "Impossible d'analyser l'audio. Veuillez réessayer.",
        variant: "destructive",
      });
      
      if (onError) onError(err as Error);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [onAnalysis, onError, toast]);
  
  /**
   * Réinitialise l'état du hook
   */
  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);
  
  // Vérifie l'accès à la webcam au premier rendu si nécessaire
  React.useEffect(() => {
    if (autoDetectWebcam && hasWebcamPermission === null) {
      requestWebcamPermission();
    }
  }, [autoDetectWebcam, hasWebcamPermission, requestWebcamPermission]);
  
  return {
    isAnalyzing,
    result,
    error,
    hasWebcamPermission,
    analyzeText,
    analyzeWebcam,
    analyzeAudioFile,
    requestWebcamPermission,
    setWebcamRef,
    reset
  };
}

export default useHumeAI;
