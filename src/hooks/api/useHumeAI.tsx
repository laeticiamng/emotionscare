// @ts-nocheck

import { useState } from 'react';
import { EmotionResult } from '@/types/emotion';
import { toast } from 'sonner';

interface EmotionResponse {
  emotion: string;
  intensity: number;
  score: number;
  ai_feedback?: string;
}

export function useHumeAI() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<EmotionResponse | null>(null);
  
  /**
   * Analyser l'émotion dans un texte
   */
  const analyzeTextEmotion = async (text: string): Promise<EmotionResult | null> => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // En production, appel à l'API Hume AI via Edge Function
      // const { data, error } = await supabase.functions.invoke('hume-text-analysis', {
      //   body: { text }
      // });
      
      // Simuler un délai pour la démo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Analyse simulée intelligente basée sur le contenu
      const lowerText = text.toLowerCase();
      let emotion = 'neutral';
      let intensity = 0.5;
      let feedback = '';
      
      // Analyse des mots-clés émotionnels
      if (lowerText.includes('heureux') || lowerText.includes('joie') || lowerText.includes('content') || lowerText.includes('sourire')) {
        emotion = 'joy';
        intensity = 0.8;
        feedback = 'Votre message exprime de la joie et de la positivité. C\'est merveilleux ! Continuez à cultiver ces moments de bonheur et n\'hésitez pas à les partager avec vos proches.';
      } else if (lowerText.includes('triste') || lowerText.includes('déprim') || lowerText.includes('mal') || lowerText.includes('pleurer')) {
        emotion = 'sadness';
        intensity = 0.7;
        feedback = 'Je perçois de la tristesse dans vos mots. C\'est une émotion naturelle et importante. Prenez le temps de l\'accueillir avec bienveillance. Considérez parler à quelqu\'un de confiance ou pratiquer des activités apaisantes.';
      } else if (lowerText.includes('stress') || lowerText.includes('anxieux') || lowerText.includes('inquiet') || lowerText.includes('peur')) {
        emotion = 'anxiety';
        intensity = 0.6;
        feedback = 'Votre texte révèle du stress ou de l\'anxiété. Essayez la respiration profonde : inspirez 4 secondes, retenez 4 secondes, expirez 6 secondes. Répétez plusieurs fois pour calmer votre système nerveux.';
      } else if (lowerText.includes('colère') || lowerText.includes('énervé') || lowerText.includes('frustré') || lowerText.includes('fâché')) {
        emotion = 'anger';
        intensity = 0.65;
        feedback = 'Je détecte de la colère ou de la frustration. C\'est une émotion qui signale que quelque chose d\'important pour vous n\'est pas respecté. Prenez quelques respirations profondes avant de réagir.';
      } else if (lowerText.includes('calme') || lowerText.includes('serein') || lowerText.includes('paisible') || lowerText.includes('détendu')) {
        emotion = 'calm';
        intensity = 0.75;
        feedback = 'Votre message transpire le calme et la sérénité. C\'est un état précieux qui favorise la clarté mentale et le bien-être. Profitez de ce moment de paix intérieure.';
      }
      
      const score = Math.round(intensity * 100);
      
      const mockResult: EmotionResponse = {
        emotion,
        intensity,
        score,
        ai_feedback: feedback
      };
      
      setResult(mockResult);
      
      const emotionResult: EmotionResult = {
        emotion: mockResult.emotion,
        intensity: mockResult.intensity,
        source: 'text',
        score: mockResult.score,
        text,
        ai_feedback: mockResult.ai_feedback,
        date: new Date().toISOString()
      };
      
      return emotionResult;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Une erreur inconnue est survenue');
      setError(error);
      toast.error(`Erreur lors de l'analyse: ${error.message}`);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  /**
   * Analyser l'émotion dans une image faciale
   */
  const analyzeFacialEmotion = async (imageData: string): Promise<EmotionResult | null> => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // En production, appel à l'API Hume AI
      // const { data, error } = await supabase.functions.invoke('hume-face-analysis', {
      //   body: { imageData }
      // });
      
      // Simuler un délai pour la démo
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Analyse faciale simulée
      const emotions = ['joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust', 'calm'];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const randomIntensity = Math.random() * 0.6 + 0.3; // Entre 0.3 et 0.9
      const score = Math.round(randomIntensity * 100);
      
      let feedback = '';
      switch (randomEmotion) {
        case 'joy':
          feedback = 'Votre expression faciale rayonne de joie ! Votre sourire est contagieux et reflète un état de bien-être positif.';
          break;
        case 'sadness':
          feedback = 'Votre visage exprime de la tristesse. Prenez soin de vous et n\'hésitez pas à chercher du soutien si nécessaire.';
          break;
        case 'anger':
          feedback = 'Je perçois des signes de tension sur votre visage. Quelques exercices de relaxation faciale pourraient vous aider.';
          break;
        case 'fear':
          feedback = 'Votre expression suggère de l\'inquiétude. Respirez profondément et rappelez-vous que vous êtes en sécurité.';
          break;
        case 'surprise':
          feedback = 'Votre expression montre de la surprise ! Cette émotion peut être positive ou négative selon le contexte.';
          break;
        case 'calm':
          feedback = 'Votre visage exprime un bel état de calme et de sérénité. C\'est exactement ce qu\'il faut pour un bien-être optimal.';
          break;
        default:
          feedback = 'Votre expression faciale a été analysée. Prenez un moment pour vous connecter à vos émotions actuelles.';
      }
      
      const emotionResult: EmotionResult = {
        emotion: randomEmotion,
        intensity: randomIntensity,
        source: 'facial',
        score,
        image_url: imageData,
        ai_feedback: feedback,
        date: new Date().toISOString()
      };
      
      return emotionResult;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Une erreur inconnue est survenue');
      setError(error);
      toast.error(`Erreur lors de l'analyse faciale: ${error.message}`);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  /**
   * Analyser l'émotion dans un audio
   */
  const analyzeVoiceEmotion = async (audioBlob: Blob): Promise<EmotionResult | null> => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // En production, appel à l'API Hume AI
      // const formData = new FormData();
      // formData.append('audio', audioBlob);
      // const { data, error } = await supabase.functions.invoke('hume-voice-analysis', {
      //   body: formData
      // });
      
      // Simuler un délai pour la démo
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Analyse vocale simulée
      const emotions = ['joy', 'sadness', 'anger', 'fear', 'calm', 'excitement', 'frustration'];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const randomIntensity = Math.random() * 0.7 + 0.2; // Entre 0.2 et 0.9
      const score = Math.round(randomIntensity * 100);
      
      let feedback = '';
      switch (randomEmotion) {
        case 'joy':
          feedback = 'Votre voix exprime de la joie et de l\'enthousiasme. Votre ton est léger et positif.';
          break;
        case 'sadness':
          feedback = 'Je perçois de la mélancolie dans votre voix. Votre ton semble plus bas et moins énergique que d\'habitude.';
          break;
        case 'anger':
          feedback = 'Votre voix traduit de la tension ou de la frustration. Votre débit et votre intensité sont élevés.';
          break;
        case 'calm':
          feedback = 'Votre voix est calme et posée. Vous semblez dans un état de sérénité et de contrôle.';
          break;
        default:
          feedback = 'Votre analyse vocale révèle votre état émotionnel actuel. Prenez conscience de ces signaux.';
      }
      
      // Créer une URL pour l'audio (simulée)
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const emotionResult: EmotionResult = {
        emotion: randomEmotion,
        intensity: randomIntensity,
        source: 'voice',
        score,
        audio_url: audioUrl,
        ai_feedback: feedback,
        date: new Date().toISOString()
      };
      
      return emotionResult;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Une erreur inconnue est survenue');
      setError(error);
      toast.error(`Erreur lors de l'analyse vocale: ${error.message}`);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return {
    analyzeTextEmotion,
    analyzeFacialEmotion,
    analyzeVoiceEmotion,
    result,
    isAnalyzing,
    error
  };
}

export default useHumeAI;
