
import { useState } from 'react';
import { chatCompletion, analyzeEmotion } from '@/services/openai';

interface CoachHandlersOptions {
  coachCharacter: {
    name: string;
    avatar: string;
    personality: string;
    expertise: string[];
  };
  setIsTyping: (typing: boolean) => void;
  setLoadingMessage: (message: string | null) => void;
}

export const useCoachHandlers = ({
  coachCharacter,
  setIsTyping,
  setLoadingMessage
}: CoachHandlersOptions) => {
  // AI-powered response generation
  const sendMessageHandler = async (
    message: string,
    conversationHistory: any[]
  ): Promise<string> => {
    setIsTyping(true);
    setLoadingMessage('Réflexion en cours...');

    try {
      const formatted = conversationHistory.map((m: any) => ({
        id: m.id,
        text: m.content || m.text,
        sender: m.sender === 'coach' ? 'assistant' : 'user'
      }));
      formatted.push({ id: 'new', text: message, sender: 'user' });

      const reply = await chatCompletion(formatted, {
        model: 'gpt-4o-mini',
        temperature: 0.7
      });

      return reply;
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      // Basic fallback response
      return `Merci pour votre message. Je suis ${coachCharacter.name}.`;
    } finally {
      setIsTyping(false);
      setLoadingMessage(null);
    }
  };

  // Emotion analysis using OpenAI with fallback
  const analyzeEmotionHandler = async (
    text: string
  ): Promise<{ emotion: string; score: number }> => {
    try {
      const res = await analyzeEmotion(text);
      return { emotion: res.primaryEmotion, score: res.intensity };
    } catch (error) {
      console.error('Error analyzing emotion with OpenAI:', error);

      // Fallback basic detection
      const lower = text.toLowerCase();
      if (lower.includes('heureux') || lower.includes('content') || lower.includes('joie')) {
        return { emotion: 'happy', score: 0.8 };
      }
      if (lower.includes('triste') || lower.includes('déprimé')) {
        return { emotion: 'sad', score: 0.7 };
      }
      if (lower.includes('colère') || lower.includes('énervé') || lower.includes('frustré')) {
        return { emotion: 'angry', score: 0.75 };
      }
      if (lower.includes('peur') || lower.includes('anxieux') || lower.includes('stress')) {
        return { emotion: 'anxious', score: 0.65 };
      }
      if (lower.includes('calme') || lower.includes('serein') || lower.includes('paisible')) {
        return { emotion: 'calm', score: 0.9 };
      }
      return { emotion: 'neutral', score: 0.5 };
    }
  };

  // Get recommendations based on category
  const getRecommendationsHandler = (category: string): string[] => {
    switch (category.toLowerCase()) {
      case 'stress':
        return [
          'Pratiquez la respiration profonde pendant 5 minutes',
          'Faites une courte marche à l\'extérieur',
          'Écoutez une musique relaxante',
          'Prenez une pause sans écran'
        ];
      case 'mood':
      case 'humeur':
        return [
          'Notez trois choses positives de votre journée',
          'Appelez un proche qui vous fait sourire',
          'Regardez une comédie ou vidéo amusante',
          'Offrez-vous une petite récompense'
        ];
      case 'sleep':
      case 'sommeil':
        return [
          'Évitez les écrans une heure avant le coucher',
          'Créez une routine de relaxation avant de dormir',
          'Maintenez une température fraîche dans votre chambre',
          'Essayez une méditation guidée pour l\'endormissement'
        ];
      case 'focus':
      case 'concentration':
        return [
          'Utilisez la technique Pomodoro (25min travail, 5min pause)',
          'Éliminez les distractions de votre environnement',
          'Établissez des objectifs clairs pour votre session de travail',
          'Hydratez-vous et mangez un en-cas nutritif'
        ];
      default:
        return [
          'Prenez un moment pour vous aujourd\'hui',
          'Pratiquez la pleine conscience pendant quelques minutes',
          'Faites une activité qui vous apporte de la joie',
          'Connectez-vous avec un être cher'
        ];
    }
  };

  return {
    sendMessageHandler,
    analyzeEmotionHandler,
    getRecommendationsHandler
  };
};
