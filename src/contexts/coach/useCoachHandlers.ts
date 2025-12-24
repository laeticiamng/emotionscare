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
      const { supabase } = await import('@/integrations/supabase/client');

      // Call AI coach edge function
      const { data, error } = await supabase.functions.invoke('ai-coach', {
        body: {
          message: content,
          personality: coachCharacter.personality || 'empathetic',
          history: previousMessages.slice(-6).map(m => ({
            role: m.role,
            content: m.content
          })),
          coachName: coachCharacter.name,
          expertise: coachCharacter.expertise
        }
      });

      if (error) throw error;

      if (data?.response) {
        return data.response;
      }

      // Fallback response based on coach personality
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
      const { supabase } = await import('@/integrations/supabase/client');

      // Try AI emotion analysis first
      const { data, error } = await supabase.functions.invoke('analyze-emotion', {
        body: { text }
      });

      if (!error && data?.emotion) {
        return { emotion: data.emotion, score: data.confidence || 0.75 };
      }

      // Fallback to keyword-based analysis
      const emotions = {
        happy: ['heureux', 'content', 'joie', 'bien', 'super', 'génial'],
        sad: ['triste', 'déprimé', 'mal', 'mauvais', 'dommage'],
        angry: ['fâché', 'colère', 'énervé', 'frustré', 'agacé'],
        neutral: ['normal', 'ok', 'moyen']
      };

      const textLower = text.toLowerCase();
      let detectedEmotion = 'neutral';
      let highestScore = 0.5;

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

  const getRecommendationsHandler = useCallback(async (category: string) => {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data: { user } } = await supabase.auth.getUser();

      // Fetch personalized recommendations from Supabase
      if (user) {
        const { data: recsData } = await supabase
          .from('ai_recommendations')
          .select('content')
          .eq('user_id', user.id)
          .eq('category', category)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(3);

        if (recsData && recsData.length > 0) {
          return recsData.map(r => r.content);
        }
      }

      // Fallback to default recommendations
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
    } catch (error) {
      logger.error('Error fetching recommendations', error as Error, 'UI');
      return ["Prenez une courte pause", "Hydratez-vous", "Faites quelques étirements"];
    }
  }, []);

  return {
    sendMessageHandler,
    analyzeEmotionHandler,
    getRecommendationsHandler
  };
};
