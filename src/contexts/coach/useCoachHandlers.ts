
import { useState } from 'react';

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
  // Mock AI responses
  const sendMessageHandler = async (message: string, conversationHistory: any[]): Promise<string> => {
    setIsTyping(true);
    setLoadingMessage('Réflexion en cours...');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Simple keyword-based responses
    let response = '';
    const messageLower = message.toLowerCase();

    if (messageLower.includes('bonjour') || messageLower.includes('salut')) {
      response = `Bonjour ! Comment puis-je vous aider aujourd'hui ?`;
    } else if (messageLower.includes('merci')) {
      response = `Je vous en prie ! N'hésitez pas à me contacter si vous avez d'autres questions.`;
    } else if (messageLower.includes('stress') || messageLower.includes('anxiété') || messageLower.includes('anxieux')) {
      response = `Je comprends que vous ressentiez du stress. Avez-vous essayé des exercices de respiration profonde ? Inspirez pendant 4 secondes, retenez pendant 4 secondes, puis expirez pendant 6 secondes. Cela peut aider à réduire rapidement votre niveau d'anxiété.`;
    } else if (messageLower.includes('triste') || messageLower.includes('déprimé')) {
      response = `Je suis désolé d'apprendre que vous vous sentez ainsi. Parfois, parler à un proche ou pratiquer une activité qui vous plaît peut aider à améliorer votre humeur. Souhaitez-vous que je vous suggère quelques activités qui pourraient vous faire du bien ?`;
    } else if (messageLower.includes('fatigué') || messageLower.includes('épuisé')) {
      response = `La fatigue peut être difficile à gérer. Assurez-vous de bien dormir, de maintenir une alimentation équilibrée et de prendre des pauses régulières. Avez-vous identifié ce qui pourrait causer cette fatigue ?`;
    } else if (messageLower.includes('méditation') || messageLower.includes('relaxation')) {
      response = `La méditation est une excellente pratique pour la santé mentale. Je vous recommande de commencer par des sessions courtes de 5 minutes et d'augmenter progressivement. Souhaitez-vous que je vous guide à travers un exercice simple ?`;
    } else {
      response = `Merci pour votre message. Je suis ${coachCharacter.name}, spécialisé en ${coachCharacter.expertise.join(', ')}. Comment puis-je vous aider davantage sur ce sujet ?`;
    }

    setIsTyping(false);
    setLoadingMessage(null);

    return response;
  };

  // Mock emotion analysis
  const analyzeEmotionHandler = async (text: string): Promise<{ emotion: string; score: number }> => {
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 500));

    const textLower = text.toLowerCase();
    let emotion = 'neutral';
    let score = 0.5;

    // Simple keyword matching for demo purposes
    if (textLower.includes('heureux') || textLower.includes('content') || textLower.includes('joie')) {
      emotion = 'happy';
      score = 0.8;
    } else if (textLower.includes('triste') || textLower.includes('déprimé')) {
      emotion = 'sad';
      score = 0.7;
    } else if (textLower.includes('colère') || textLower.includes('énervé') || textLower.includes('frustré')) {
      emotion = 'angry';
      score = 0.75;
    } else if (textLower.includes('peur') || textLower.includes('anxieux') || textLower.includes('stress')) {
      emotion = 'anxious';
      score = 0.65;
    } else if (textLower.includes('calme') || textLower.includes('serein') || textLower.includes('paisible')) {
      emotion = 'calm';
      score = 0.9;
    }

    return { emotion, score };
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
