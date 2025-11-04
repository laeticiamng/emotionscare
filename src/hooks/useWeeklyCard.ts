// @ts-nocheck
/**
 * Hook pour gérer le tirage de carte hebdomadaire
 */

import { useState, useEffect } from 'react';
import { useAssessment } from '@/hooks/useAssessment';
import { WeeklyCard, CardCollection } from '@/types/card';
import { generateCard, canDrawCard, getWeekNumber } from '@/lib/cardSystem';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export function useWeeklyCard() {
  const [currentCard, setCurrentCard] = useState<WeeklyCard | null>(null);
  const [collection, setCollection] = useState<CardCollection | null>(null);
  const [canDraw, setCanDraw] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const { startSession, submitResponses } = useAssessment();

  // Charger la carte actuelle et la collection
  useEffect(() => {
    loadCurrentCard();
    loadCollection();
  }, []);

  async function loadCurrentCard() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Récupérer la dernière carte de la semaine en cours
      const { data, error } = await supabase
        .from('clinical_responses')
        .select('*')
        .eq('user_id', user.id)
        .eq('instrument_code', 'WHO5')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        setCanDraw(true);
        return;
      }

      // Vérifier si on peut tirer une nouvelle carte
      const lastPull = new Date(data.created_at);
      const canDrawNow = canDrawCard(lastPull);
      setCanDraw(canDrawNow);

      if (!canDrawNow) {
        // Reconstruire la carte depuis les données
        const card = reconstructCard(data);
        setCurrentCard(card);
      }
    } catch (err) {
      logger.error('Erreur chargement carte', err as Error, 'SYSTEM');
      setCanDraw(true);
    }
  }

  async function loadCollection() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('clinical_responses')
        .select('*')
        .eq('user_id', user.id)
        .eq('instrument_code', 'WHO5')
        .order('created_at', { ascending: true });

      if (error || !data) return;

      const cards = data.map(reconstructCard);
      const rareCount = cards.filter(c => c.rarity !== 'common').length;

      setCollection({
        cards,
        totalWeeks: cards.length,
        rareCount,
        currentStreak: calculateStreak(cards)
      });
    } catch (err) {
      logger.error('Erreur chargement collection', err as Error, 'SYSTEM');
    }
  }

  async function drawCard(): Promise<WeeklyCard | null> {
    if (!canDraw || isDrawing) return null;
    
    setIsDrawing(true);
    
    try {
      // 1. Démarrer une session WHO-5 (implicite)
      const session = await startSession('WHO5', { context: 'weekly' });
      if (!session) throw new Error('Impossible de démarrer la session');

      // 2. Générer des réponses aléatoires simulées (WHO-5 implicite)
      // En production, ces réponses viendraient des interactions utilisateur
      const implicitResponses = generateImplicitResponses();
      
      // 3. Soumettre les réponses
      const result = await submitResponses(session.session_id, implicitResponses);
      if (!result?.orchestration) throw new Error('Échec soumission');

      // 4. Générer la carte depuis le niveau
      const level = result.orchestration.hints?.[0] === 'low' ? 0 : 
                    result.orchestration.hints?.[0] === 'high' ? 4 : 2;
      
      const weekNumber = getWeekNumber();
      const card = generateCard(level, weekNumber, session.session_id);
      
      setCurrentCard(card);
      setCanDraw(false);
      
      // Recharger la collection
      await loadCollection();
      
      return card;
    } catch (err) {
      logger.error('Erreur tirage carte', err as Error, 'SYSTEM');
      return null;
    } finally {
      setIsDrawing(false);
    }
  }

  return {
    currentCard,
    collection,
    canDraw,
    isDrawing,
    drawCard,
    refreshCard: loadCurrentCard
  };
}

/**
 * Reconstruit une carte depuis les données Supabase
 */
function reconstructCard(data: any): WeeklyCard {
  const level = data.internal_level ?? 2;
  const weekNumber = getWeekNumber(new Date(data.created_at));
  return generateCard(level, weekNumber, data.id);
}

/**
 * Génère des réponses WHO-5 implicites (simulées)
 * En production, ces valeurs proviennent des interactions utilisateur
 */
function generateImplicitResponses(): Record<string, number> {
  return {
    '1': Math.floor(Math.random() * 6), // 0-5
    '2': Math.floor(Math.random() * 6),
    '3': Math.floor(Math.random() * 6),
    '4': Math.floor(Math.random() * 6),
    '5': Math.floor(Math.random() * 6)
  };
}

/**
 * Calcule le streak (nombre de semaines consécutives)
 */
function calculateStreak(cards: WeeklyCard[]): number {
  if (cards.length === 0) return 0;
  
  let streak = 1;
  const sortedCards = [...cards].sort((a, b) => 
    b.pulledAt.getTime() - a.pulledAt.getTime()
  );
  
  for (let i = 0; i < sortedCards.length - 1; i++) {
    const current = sortedCards[i].weekNumber;
    const next = sortedCards[i + 1].weekNumber;
    
    if (current - next === 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}
