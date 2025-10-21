// @ts-nocheck

import { useState, useCallback } from 'react';
import { ChatMessage } from '@/types/chat';
import { logger } from '@/lib/logger';

interface CoachHandlerProps {
  coachCharacter: {
    name: string;
    avatar: string;
    personality: string;
    expertise: string[];
  };
  setIsTyping: (isTyping: boolean) => void;
  setLoadingMessage: (message: string | null) => void;
}

export const useCoachHandlers = ({
  coachCharacter,
  setIsTyping,
  setLoadingMessage
}: CoachHandlerProps) => {
  const sendMessageHandler = useCallback(async (content: string, previousMessages: ChatMessage[] = []) => {
    setIsTyping(true);
    setLoadingMessage("Je réfléchis à ma réponse...");
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Example response based on coach personality
      const responses = {
        empathetic: `Je comprends ce que vous ressentez à propos de "${content}". Comment puis-je vous aider davantage ?`,
        analytical: `D'après mon analyse de "${content}", plusieurs facteurs sont à considérer...`,
        motivational: `Excellent point sur "${content}"! Continuons à avancer ensemble.`
      };
      
      const responseType = coachCharacter.personality || 'empathetic';
      return responses[responseType as keyof typeof responses] || responses.empathetic;
    } catch (error) {
      logger.error('Error getting coach response', error as Error, 'UI');
      return "Je suis désolé, je n'ai pas pu traiter votre message.";
    } finally {
      setIsTyping(false);
      setLoadingMessage(null);
    }
  }, [coachCharacter, setIsTyping, setLoadingMessage]);

  const analyzeEmotionHandler = useCallback(async (text: string) => {
    try {
      // Simulate emotion analysis
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simple keyword-based analysis for demo purposes
      const emotions = {
        happy: ['heureux', 'content', 'joie', 'bien', 'super', 'génial'],
        sad: ['triste', 'déprimé', 'mal', 'mauvais', 'dommage'],
        angry: ['fâché', 'colère', 'énervé', 'frustré', 'agacé'],
        neutral: ['normal', 'ok', 'moyen']
      };
      
      const textLower = text.toLowerCase();
      let detectedEmotion = 'neutral';
      let highestScore = 0.5; // Default neutral score
      
      for (const [emotion, keywords] of Object.entries(emotions)) {
        const matches = keywords.filter(keyword => textLower.includes(keyword)).length;
        const score = matches > 0 ? 0.5 + (matches * 0.1) : 0;
        
        if (score > highestScore) {
          highestScore = score;
          detectedEmotion = emotion;
        }
      }
      
      return { emotion: detectedEmotion, score: Math.min(highestScore, 1.0) };
    } catch (error) {
      logger.error('Error analyzing emotion', error as Error, 'UI');
      return { emotion: 'neutral', score: 0.5 };
    }
  }, []);

  const getRecommendationsHandler = useCallback((category: string) => {
    // Mock recommendations based on category
    const recommendations: Record<string, string[]> = {
      relaxation: [
        "Pratiquez la respiration profonde pendant 5 minutes",
        "Écoutez de la musique apaisante",
        "Faites une courte méditation guidée"
      ],
      motivation: [
        "Fixez-vous un petit objectif réalisable aujourd'hui",
        "Visualisez votre réussite pendant quelques minutes",
        "Lisez un témoignage inspirant"
      ],
      focus: [
        "Travaillez avec la technique Pomodoro (25 min travail, 5 min pause)",
        "Éliminez les distractions de votre environnement",
        "Prenez quelques minutes pour clarifier vos objectifs"
      ],
      default: [
        "Prenez une courte pause",
        "Hydratez-vous avec un verre d'eau",
        "Faites quelques étirements"
      ]
    };
    
    return recommendations[category] || recommendations.default;
  }, []);

  return {
    sendMessageHandler,
    analyzeEmotionHandler,
    getRecommendationsHandler
  };
};
