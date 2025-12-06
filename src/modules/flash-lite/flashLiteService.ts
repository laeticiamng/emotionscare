/**
 * Service pour flash-lite avec Supabase
 */

import { supabase } from '@/integrations/supabase/client';
import type { FlashLiteSession, FlashCard, FlashLiteMode } from './types';

export class FlashLiteService {
  /**
   * Créer une nouvelle session
   */
  static async createSession(
    userId: string,
    mode: FlashLiteMode,
    category?: string,
    cardsTotal: number = 10
  ): Promise<FlashLiteSession> {
    const { data, error } = await supabase
      .from('flash_lite_sessions')
      .insert({
        user_id: userId,
        mode,
        category,
        cards_total: cardsTotal
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Ajouter une carte à la session
   */
  static async addCard(
    sessionId: string,
    question: string,
    answer: string,
    difficulty?: string
  ): Promise<FlashCard> {
    const { data, error } = await supabase
      .from('flash_lite_cards')
      .insert({
        session_id: sessionId,
        question,
        answer,
        difficulty
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Mettre à jour la réponse utilisateur
   */
  static async updateCardAnswer(
    cardId: string,
    userAnswer: string,
    isCorrect: boolean,
    responseTimeMs: number
  ): Promise<FlashCard> {
    const { data, error } = await supabase
      .from('flash_lite_cards')
      .update({
        user_answer: userAnswer,
        is_correct: isCorrect,
        response_time_ms: responseTimeMs
      })
      .eq('id', cardId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Compléter une session
   */
  static async completeSession(
    sessionId: string,
    data: {
      cards_completed: number;
      cards_correct: number;
      duration_seconds: number;
      average_response_time: number;
      accuracy_percentage: number;
      notes?: string;
    }
  ): Promise<FlashLiteSession> {
    const { data: session, error } = await supabase
      .from('flash_lite_sessions')
      .update({
        ...data,
        completed_at: new Date().toISOString()
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw error;
    return session;
  }

  /**
   * Récupérer les sessions d'un utilisateur
   */
  static async getUserSessions(userId: string, limit: number = 10): Promise<FlashLiteSession[]> {
    const { data, error } = await supabase
      .from('flash_lite_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Récupérer les cartes d'une session
   */
  static async getSessionCards(sessionId: string): Promise<FlashCard[]> {
    const { data, error } = await supabase
      .from('flash_lite_cards')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  /**
   * Récupérer les statistiques
   */
  static async getUserStats(userId: string): Promise<{
    totalSessions: number;
    totalCards: number;
    averageAccuracy: number;
    averageTime: number;
  }> {
    const { data, error } = await supabase
      .from('flash_lite_sessions')
      .select('cards_total, cards_correct, duration_seconds, average_response_time')
      .eq('user_id', userId)
      .not('completed_at', 'is', null);

    if (error) throw error;

    const sessions = data || [];
    const totalSessions = sessions.length;
    const totalCards = sessions.reduce((sum, s) => sum + s.cards_total, 0);
    const totalCorrect = sessions.reduce((sum, s) => sum + s.cards_correct, 0);
    const totalTime = sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0);
    const totalResponseTime = sessions.reduce((sum, s) => sum + (s.average_response_time || 0), 0);

    return {
      totalSessions,
      totalCards,
      averageAccuracy: totalCards > 0 ? (totalCorrect / totalCards) * 100 : 0,
      averageTime: totalSessions > 0 ? totalTime / totalSessions : 0
    };
  }
}
