/**
 * Perplexity AI Search Service
 * Recherche contextuelle intelligente pour le bien-être
 */

import { supabase } from '@/integrations/supabase/client';

export type SearchContext = 
  | 'wellness' 
  | 'meditation' 
  | 'stress' 
  | 'emotional' 
  | 'general';

export interface SearchOptions {
  context?: SearchContext;
  language?: 'fr' | 'en';
  maxTokens?: number;
}

export interface Citation {
  url: string;
  title?: string;
}

export interface SearchResult {
  answer: string;
  citations: (string | Citation)[];
  model: string;
}

/**
 * Effectue une recherche IA contextuelle avec Perplexity
 */
export async function searchWithAI(
  query: string,
  options: SearchOptions = {}
): Promise<SearchResult> {
  const {
    context = 'general',
    language = 'fr',
    maxTokens = 1024,
  } = options;

  const { data, error } = await supabase.functions.invoke('perplexity-search', {
    body: {
      query,
      context,
      language,
      max_tokens: maxTokens,
    },
  });

  if (error) {
    throw new Error(`Perplexity Search error: ${error.message}`);
  }

  return {
    answer: data.answer,
    citations: data.citations || [],
    model: data.model,
  };
}

/**
 * Recherche des techniques de gestion du stress
 */
export async function searchStressTechniques(
  symptoms: string[]
): Promise<SearchResult> {
  const query = `Techniques de gestion du stress pour les symptômes suivants: ${symptoms.join(', ')}. 
    Donne des conseils pratiques et immédiatement applicables pour les professionnels de santé.`;
  
  return searchWithAI(query, { context: 'stress' });
}

/**
 * Recherche des ressources de méditation
 */
export async function searchMeditationResources(
  goal: 'relaxation' | 'focus' | 'sleep' | 'anxiety'
): Promise<SearchResult> {
  const goals: Record<typeof goal, string> = {
    relaxation: 'relaxation profonde et détente musculaire',
    focus: 'concentration et clarté mentale',
    sleep: 'améliorer la qualité du sommeil',
    anxiety: 'réduire l\'anxiété et les pensées négatives',
  };

  const query = `Meilleures pratiques de méditation pour ${goals[goal]}. 
    Inclure des techniques guidées et des exercices de respiration.`;
  
  return searchWithAI(query, { context: 'meditation' });
}

/**
 * Recherche des informations sur les émotions
 */
export async function searchEmotionInfo(
  emotion: string
): Promise<SearchResult> {
  const query = `Comment comprendre et réguler l'émotion "${emotion}"? 
    Explique les causes, les manifestations physiques et les techniques de régulation émotionnelle.`;
  
  return searchWithAI(query, { context: 'emotional' });
}

/**
 * Recherche d'aide contextuelle pour le bien-être
 */
export async function searchWellnessHelp(
  topic: string
): Promise<SearchResult> {
  return searchWithAI(topic, { context: 'wellness' });
}

export const perplexityService = {
  searchWithAI,
  searchStressTechniques,
  searchMeditationResources,
  searchEmotionInfo,
  searchWellnessHelp,
};
