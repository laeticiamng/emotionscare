
import { useState, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { EmotionResult } from '@/types/emotions';

interface HumeAIResponse {
  // Type de réponse d'API Hume (simplifié)
  emotions: {
    name: string;
    score: number;
  }[];
  success: boolean;
  error?: string;
}

interface UseHumeAIProps {
  apiKey?: string;
  onResult?: (result: EmotionResult) => void;
}

export const useHumeAI = ({ apiKey, onResult }: UseHumeAIProps = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<EmotionResult | null>(null);

  // Fonction pour traiter les résultats bruts de l'API Hume
  const processEmotionResults = (humeResponse: HumeAIResponse): EmotionResult | null => {
    if (!humeResponse.success || !humeResponse.emotions || humeResponse.emotions.length === 0) {
      return null;
    }

    // Trier les émotions par score et prendre la plus forte
    const sortedEmotions = [...humeResponse.emotions].sort((a, b) => b.score - a.score);
    const primaryEmotion = sortedEmotions[0];

    return {
      id: uuid(), // Générer un ID unique
      emotion: primaryEmotion.name.toLowerCase(),
      confidence: primaryEmotion.score,
      timestamp: new Date().toISOString(),
      emotions: sortedEmotions.reduce((acc, emotion) => {
        acc[emotion.name.toLowerCase()] = emotion.score;
        return acc;
      }, {} as Record<string, number>)
    };
  };

  // Analyse de texte
  const analyzeText = useCallback(async (text: string) => {
    if (!text.trim()) {
      setError('Texte vide, impossible d\'analyser');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulation d'appel API (à remplacer par un vrai appel à Hume API)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Résultat simulé
      const mockResult: EmotionResult = {
        id: uuid(), // Ajout d'un ID unique
        emotion: text.includes('heureux') ? 'joy' : 
                 text.includes('triste') ? 'sadness' : 
                 text.includes('énervé') ? 'anger' : 'neutral',
        confidence: 0.85,
        timestamp: new Date().toISOString(),
        source: 'text',
        textInput: text
      };
      
      setLastResult(mockResult);
      
      if (onResult) {
        onResult(mockResult);
      }
      
      return mockResult;
    } catch (err) {
      console.error('Error analyzing text with HumeAI:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'analyse du texte');
      return null;
    } finally {
      setLoading(false);
    }
  }, [onResult]);

  // Analyse audio
  const analyzeAudio = useCallback(async (audioBlob: Blob) => {
    setLoading(true);
    setError(null);

    try {
      // Simulation d'appel API (à remplacer par un vrai appel à Hume API)
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Résultat simulé
      const mockResult: EmotionResult = {
        id: uuid(), // Ajout d'un ID unique
        emotion: Math.random() > 0.5 ? 'calm' : 'joy',
        confidence: 0.78,
        timestamp: new Date().toISOString(),
        source: 'audio',
        audioUrl: URL.createObjectURL(audioBlob)
      };
      
      setLastResult(mockResult);
      
      if (onResult) {
        onResult(mockResult);
      }
      
      return mockResult;
    } catch (err) {
      console.error('Error analyzing audio with HumeAI:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'analyse audio');
      return null;
    } finally {
      setLoading(false);
    }
  }, [onResult]);

  // Analyse d'expression faciale
  const analyzeFacial = useCallback(async (imageBlob: Blob) => {
    setLoading(true);
    setError(null);

    try {
      // Simulation d'appel API (à remplacer par un vrai appel à Hume API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Résultat simulé
      const mockResult: EmotionResult = {
        id: uuid(), // Ajout d'un ID unique
        emotion: Math.random() > 0.6 ? 'joy' : 
                 Math.random() > 0.3 ? 'neutral' : 'surprise',
        confidence: 0.82,
        timestamp: new Date().toISOString(),
        source: 'facial',
        facialExpression: 'smile'
      };
      
      setLastResult(mockResult);
      
      if (onResult) {
        onResult(mockResult);
      }
      
      return mockResult;
    } catch (err) {
      console.error('Error analyzing facial expression with HumeAI:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'analyse de l\'expression faciale');
      return null;
    } finally {
      setLoading(false);
    }
  }, [onResult]);

  return {
    analyzeText,
    analyzeAudio,
    analyzeFacial,
    loading,
    error,
    lastResult
  };
};

export default useHumeAI;
