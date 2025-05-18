/**
 * Service OpenAI
 * 
 * Ce service centralise toutes les interactions avec l'API OpenAI (GPT, DALL-E, etc.)
 * pour assurer une mise en œuvre cohérente, sécurisée et maintenable.
 */
import { env } from '@/env.mjs';
import { ChatMessage } from '@/types/chat';
import { getCache, setCache } from '@/utils/cache';

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

const API_BASE_URL = 'https://api.openai.com/v1';
const DEFAULT_MODEL = 'gpt-4o-mini';
const DEFAULT_IMAGE_MODEL = 'dall-e-3';
const TEXT_CACHE_TTL = 1000 * 60 * 5; // 5 minutes
const MODERATION_CACHE_TTL = 1000 * 60; // 1 minute

/**
 * Récupère la clé API OpenAI depuis les variables d'environnement
 * @returns La clé API ou lance une erreur
 */
function getApiKey(): string {
  const key = env.NEXT_PUBLIC_OPENAI_API_KEY;
  if (!key) {
    throw new Error('OpenAI API key is not set in environment variables');
  }
  return key;
}

/**
 * Envoie une requête à l'API OpenAI avec gestion des erreurs
 * @param endpoint L'endpoint API à appeler
 * @param body Le corps de la requête
 * @returns La réponse de l'API
 */
async function callOpenAI<T>(endpoint: string, body: any): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getApiKey()}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API Error:', error);
      throw new Error(error?.error?.message || 'Unknown error from OpenAI API');
    }

    return await response.json() as T;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
}

/**
 * Génère du texte via l'API OpenAI (ChatGPT)
 * @param prompt Le prompt utilisateur
 * @param options Options de génération
 * @returns Le texte généré
 */
export async function generateText(prompt: string, options: OpenAITextGenerationOptions = {}): Promise<string> {
  const {
    model = DEFAULT_MODEL,
    temperature = 0.7,
    maxTokens = 500,
    topP = 1,
    frequencyPenalty = 0,
    presencePenalty = 0,
    systemPrompt = 'You are a helpful assistant.'
  } = options;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: prompt }
  ];

  const cacheKey = `text:${model}:${temperature}:${maxTokens}:${prompt}`;
  const cached = getCache<string>(cacheKey, TEXT_CACHE_TTL);
  if (cached) {
    return cached;
  }

  const response = await callOpenAI<{
    choices: Array<{
      message: {
        role: string;
        content: string;
      };
    }>;
  }>('/chat/completions', {
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
    top_p: topP,
    frequency_penalty: frequencyPenalty,
    presence_penalty: presencePenalty
  });
  const result = response.choices[0]?.message.content || '';
  setCache(cacheKey, result);
  return result;
}

/**
 * Traite une conversation complète via l'API OpenAI
 * @param messages Les messages de la conversation
 * @param options Options de génération
 * @returns La réponse générée
 */
export async function chatCompletion(
  messages: ChatMessage[],
  options: OpenAITextGenerationOptions = {}
): Promise<string> {
  const {
    model = DEFAULT_MODEL,
    temperature = 0.7,
    maxTokens = 800,
    topP = 1,
    frequencyPenalty = 0,
    presencePenalty = 0
  } = options;

  // Conversion des messages au format attendu par OpenAI
  const formattedMessages = messages.map(msg => ({
    role: msg.role as 'system' | 'user' | 'assistant',
    content: msg.content || msg.text || ''
  }));

  const response = await callOpenAI<{
    choices: Array<{
      message: {
        role: string;
        content: string;
      };
    }>;
  }>('/chat/completions', {
    model,
    messages: formattedMessages,
    temperature,
    max_tokens: maxTokens,
    top_p: topP,
    frequency_penalty: frequencyPenalty,
    presence_penalty: presencePenalty
  });

  return response.choices[0]?.message.content || '';
}

/**
 * Génère une image via DALL-E
 * @param prompt Description de l'image à générer
 * @param options Options de génération
 * @returns URL ou données base64 de l'image générée
 */
export async function generateImage(
  prompt: string, 
  options: OpenAIImageGenerationOptions = {}
): Promise<string> {
  const {
    size = '1024x1024',
    quality = 'standard',
    n = 1,
    style = 'vivid',
    format = 'url'
  } = options;

  const response = await callOpenAI<{
    data: Array<{
      url?: string;
      b64_json?: string;
    }>;
  }>('/images/generations', {
    model: DEFAULT_IMAGE_MODEL,
    prompt,
    n,
    size,
    quality,
    response_format: format,
    style
  });

  // Renvoie l'URL ou les données base64 selon l'option choisie
  if (format === 'url') {
    return response.data[0]?.url || '';
  } else {
    return response.data[0]?.b64_json || '';
  }
}

/**
 * Modère un contenu via l'API OpenAI
 * @param content Le contenu à modérer
 * @returns Résultat de la modération
 */
export async function moderateContent(content: string): Promise<{
  flagged: boolean;
  categories: Record<string, boolean>;
  categoryScores: Record<string, number>;
}> {
  const cacheKey = `moderation:${content}`;
  const cached = getCache<{
    flagged: boolean;
    categories: Record<string, boolean>;
    categoryScores: Record<string, number>;
  }>(cacheKey, MODERATION_CACHE_TTL);
  if (cached) return cached;
  const response = await callOpenAI<{
    results: Array<{
      flagged: boolean;
      categories: Record<string, boolean>;
      category_scores: Record<string, number>;
    }>;
  }>('/moderations', {
    input: content
  });

  const result = response.results[0];
  const formatted = {
    flagged: result.flagged,
    categories: result.categories,
    categoryScores: result.category_scores
  };
  setCache(cacheKey, formatted);
  return formatted;
}

/**
 * Analyse émotionnelle d'un texte via GPT
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
    const response = await generateText(text, {
      systemPrompt,
      temperature: 0.3,
      model: "gpt-4o-mini",
    });
    
    // Tentative d'extraction JSON de la réponse
    try {
      return JSON.parse(response);
    } catch (e) {
      console.error("Failed to parse OpenAI emotion analysis as JSON:", e);
      // Valeurs par défaut si le parsing échoue
      return {
        primaryEmotion: "neutral",
        intensity: 5,
        analysis: response.substring(0, 100),
        suggestions: ["Practice mindfulness", "Reflect on your emotions"]
      };
    }
  } catch (error) {
    console.error("Error analyzing emotion:", error);
    throw error;
  }
}

/**
 * Vérifie la connectivité avec l'API OpenAI
 * @returns true si la connexion est établie, false sinon
 */
export async function checkApiConnection(): Promise<boolean> {
  try {
    await generateText("Connection test", {
      maxTokens: 5,
    });
    return true;
  } catch (error) {
    console.error("OpenAI connection check failed:", error);
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
