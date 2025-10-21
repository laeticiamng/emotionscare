// @ts-nocheck
import { useState } from 'react';
import useOpenAI from './api/useOpenAI';
import { useMood } from './useMood';
import { logger } from '@/lib/logger';

interface GritChallenge {
  title: string;
  description: string;
  difficulty: 'facile' | 'moyen' | 'difficile';
  duration: string;
  points: number;
  motivationalMessage: string;
}

export const useGritChallenge = () => {
  const [currentChallenge, setCurrentChallenge] = useState<GritChallenge | null>(null);
  const { generateText, isLoading } = useOpenAI();
  const { mood } = useMood();

  const generateChallenge = async (objective?: string): Promise<GritChallenge | null> => {
    const moodContext = mood ? `Humeur actuelle: valence ${mood.valence}, énergie ${mood.arousal}` : '';
    const objectiveContext = objective ? `Objectif: ${objective}` : '';
    
    const prompt = `
Génère un micro-défi motivant pour développer la persévérance.
${moodContext}
${objectiveContext}

Réponds en JSON strict :
{
  "title": "Titre court et motivant",
  "description": "Description concrète en 1-2 phrases",
  "difficulty": "facile|moyen|difficile",
  "duration": "durée estimée (ex: 10 minutes)",
  "points": nombre entre 10 et 50,
  "motivationalMessage": "Message d'encouragement personnalisé"
}

Le défi doit être réalisable immédiatement et adapté à l'humeur.
`;

    const response = await generateText({ prompt });
    
    if (!response) return null;

    try {
      // Extraire le JSON de la réponse
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Format JSON invalide');
      
      const challenge = JSON.parse(jsonMatch[0]) as GritChallenge;
      setCurrentChallenge(challenge);
      return challenge;
    } catch (error) {
      logger.error('Erreur parsing défi', error as Error, 'SYSTEM');
      return null;
    }
  };

  const completeChallenge = () => {
    if (currentChallenge) {
      // Ici on pourrait déclencher useMood().updateMood() avec un boost positif
      setCurrentChallenge(null);
      return currentChallenge.points;
    }
    return 0;
  };

  return {
    currentChallenge,
    generateChallenge,
    completeChallenge,
    isLoading
  };
};
