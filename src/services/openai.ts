// @ts-nocheck

/**
 * Service OpenAI - VERSION SÉCURISÉE
 * 
 * Ce service centralise toutes les interactions avec l'API OpenAI (GPT, DALL-E, etc.)
 * via Supabase Edge Functions pour éviter d'exposer les clés API côté client.
 */
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage } from '@/types/chat';
import { logger } from '@/lib/logger';

// Types
export interface OpenAITextGenerationOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number; 
  frequencyPenalty?: number;
  presencePenalty?: number;
  stream?: boolean;
  systemPrompt?: string;
}

export interface OpenAIImageGenerationOptions {
  size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792';
  quality?: 'standard' | 'hd';
  n?: number;
  style?: 'vivid' | 'natural';
  format?: 'url' | 'b64_json';
}

const DEFAULT_MODEL = 'gpt-4o-mini';

/**
 * Appelle l'Edge Function openai-chat de manière sécurisée
 */
async function callOpenAIChat(messages: Array<{role: string, content: string}>): Promise<string> {
  const { data, error } = await supabase.functions.invoke('openai-chat', {
    body: { messages }
  });

  if (error) {
    logger.error('OpenAI Edge Function Error', error, 'API');
    throw new Error(error.message || 'Erreur lors de la communication avec le service IA');
  }

  return data?.response || data?.content || '';
}

/**
 * Génère du texte via l'Edge Function OpenAI
 * @param prompt Le prompt utilisateur
 * @param options Options de génération
 * @returns Le texte généré
 */
export async function generateText(prompt: string, options: OpenAITextGenerationOptions = {}): Promise<string> {
  const {
    systemPrompt = 'You are a helpful assistant.'
  } = options;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: prompt }
  ];

  return callOpenAIChat(messages);
}

/**
 * Traite une conversation complète via l'Edge Function OpenAI
 * @param messages Les messages de la conversation
 * @param options Options de génération
 * @returns La réponse générée
 */
export async function chatCompletion(
  messages: ChatMessage[],
  options: OpenAITextGenerationOptions = {}
): Promise<string> {
  // Conversion des messages au format attendu
  const formattedMessages = messages.map(msg => ({
    role: msg.role as 'system' | 'user' | 'assistant',
    content: msg.content || msg.text || ''
  }));

  return callOpenAIChat(formattedMessages);
}

/**
 * Génère une image via Edge Function (à implémenter si nécessaire)
 * @param prompt Description de l'image à générer
 * @param options Options de génération
 * @returns URL ou données base64 de l'image générée
 */
export async function generateImage(
  prompt: string, 
  options: OpenAIImageGenerationOptions = {}
): Promise<string> {
  // Pour la génération d'images, on peut utiliser une Edge Function dédiée
  // ou utiliser openai-chat avec un modèle vision si disponible
  logger.warn('generateImage: Cette fonctionnalité nécessite une Edge Function dédiée', {}, 'API');
  throw new Error('Génération d\'images non disponible. Utilisez une Edge Function dédiée.');
}

/**
 * Modère un contenu via l'Edge Function de modération
 * @param content Le contenu à modérer
 * @returns Résultat de la modération
 */
export async function moderateContent(content: string): Promise<{
  flagged: boolean;
  categories: Record<string, boolean>;
  categoryScores: Record<string, number>;
}> {
  const { data, error } = await supabase.functions.invoke('openai-moderate', {
    body: { input: content }
  });

  if (error) {
    logger.error('OpenAI Moderation Error', error, 'API');
    throw new Error(error.message || 'Erreur lors de la modération');
  }

  return {
    flagged: data?.flagged || false,
    categories: data?.categories || {},
    categoryScores: data?.category_scores || data?.categoryScores || {}
  };
}

/**
 * Analyse émotionnelle d'un texte via Edge Function
 * @param text Le texte à analyser
 * @returns L'analyse émotionnelle
 */
export async function analyzeEmotion(text: string): Promise<{
  primaryEmotion: string;
  intensity: number;
  analysis: string;
  suggestions: string[];
}> {
  const systemPrompt = `
    Analyze the emotional content of the following text.
    Identify the primary emotion, its intensity on a scale of 1-10,
    provide a brief analysis, and suggest 2-3 helpful ways to address or enhance this emotion.
    Format your response as JSON with the following keys: 
    primaryEmotion, intensity, analysis, suggestions.
  `;
  
  try {
    const response = await generateText(text, { systemPrompt });
    
    // Tentative d'extraction JSON de la réponse
    try {
      // Nettoyer la réponse pour extraire le JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(response);
    } catch (e) {
      logger.error("Failed to parse OpenAI emotion analysis as JSON", e as Error, 'API');
      // Valeurs par défaut si le parsing échoue
      return {
        primaryEmotion: "neutral",
        intensity: 5,
        analysis: response.substring(0, 100),
        suggestions: ["Practice mindfulness", "Reflect on your emotions"]
      };
    }
  } catch (error) {
    logger.error("Error analyzing emotion", error as Error, 'API');
    throw error;
  }
}

/**
 * Vérifie la connectivité avec l'API OpenAI via Edge Function
 * @returns true si la connexion est établie, false sinon
 */
export async function checkApiConnection(): Promise<boolean> {
  try {
    await generateText("Test de connexion", {
      systemPrompt: "Réponds simplement 'OK'."
    });
    return true;
  } catch (error) {
    logger.error("OpenAI connection check failed", error as Error, 'API');
    return false;
  }
}

export default {
  generateText,
  chatCompletion,
  generateImage,
  moderateContent,
  analyzeEmotion,
  checkApiConnection
};
