// @ts-nocheck

/**
 * OpenAI API Client - VERSION SÉCURISÉE
 * 
 * Client qui route toutes les requêtes via Supabase Edge Functions
 * pour éviter d'exposer la clé API côté client.
 */
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AI_MODEL_CONFIG, AIModule, OpenAIModelParams } from "./openai-config";
import { logger } from "@/lib/logger";

// Implémentation de cache pour les réponses API
const responseCache = new Map<string, {
  data: any,
  timestamp: number
}>();

/**
 * Effectuer une requête à l'API OpenAI via Edge Function sécurisée
 */
export async function callOpenAI<T>(
  endpoint: string,
  body: any,
  _apiKey?: string, // Paramètre ignoré - clé gérée côté serveur
  cacheOptions?: { enabled: boolean, ttl: number }
): Promise<T> {
  // Générer une clé de cache à partir de la requête si le cache est activé
  let cacheKey = "";
  if (cacheOptions?.enabled) {
    cacheKey = `${endpoint}:${JSON.stringify(body)}`;
    const cachedResponse = responseCache.get(cacheKey);
    
    if (cachedResponse && 
        (Date.now() - cachedResponse.timestamp) < (cacheOptions.ttl * 1000)) {
      return cachedResponse.data as T;
    }
  }

  try {
    // Route vers l'Edge Function appropriée selon l'endpoint
    let functionName = 'openai-chat';
    let functionBody = body;

    if (endpoint === '/moderations') {
      functionName = 'openai-moderate';
      functionBody = { input: body.input };
    } else if (endpoint === '/chat/completions') {
      functionName = 'openai-chat';
      functionBody = { messages: body.messages };
    } else if (endpoint === '/embeddings') {
      functionName = 'openai-embeddings';
      functionBody = body;
    }

    const { data, error } = await supabase.functions.invoke(functionName, {
      body: functionBody
    });

    if (error) {
      logger.error(`Edge Function ${functionName} error`, error, 'API');
      
      if (error.message?.includes('Rate limit') || error.message?.includes('429')) {
        toast({
          title: "Limite d'utilisation atteinte",
          description: "Veuillez réessayer dans quelques instants",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Erreur de communication",
          description: "Impossible de contacter le service IA pour le moment",
          variant: "destructive"
        });
      }
      
      throw new Error(error.message || "Erreur lors de l'appel à l'API");
    }

    // Transformer la réponse pour correspondre au format attendu
    let transformedData: any;
    
    if (endpoint === '/chat/completions') {
      // L'Edge Function retourne { response: string }
      // On le transforme en format OpenAI standard
      transformedData = {
        choices: [{
          message: {
            role: 'assistant',
            content: data.response || data.content || ''
          }
        }]
      };
    } else if (endpoint === '/moderations') {
      transformedData = {
        results: [data]
      };
    } else {
      transformedData = data;
    }
    
    // Stocker en cache si activé
    if (cacheOptions?.enabled && cacheKey) {
      responseCache.set(cacheKey, {
        data: transformedData,
        timestamp: Date.now()
      });
    }
    
    return transformedData as T;
  } catch (error) {
    logger.error('OpenAI call via Edge Function failed', error, 'API');
    throw error;
  }
}

/**
 * Envoyer une requête de chat à OpenAI via Edge Function
 */
export async function chatCompletion(
  messages: Array<{role: string, content: string}>,
  module: AIModule = 'chat',
  _apiKey?: string // Paramètre ignoré - clé gérée côté serveur
) {
  const modelConfig = AI_MODEL_CONFIG[module];
  
  return callOpenAI<{
    choices: Array<{message: {role: string, content: string}}>
  }>(
    "/chat/completions",
    {
      model: modelConfig.model,
      messages,
      temperature: modelConfig.temperature,
      max_tokens: modelConfig.max_tokens,
      top_p: modelConfig.top_p,
      stream: modelConfig.stream
    },
    undefined,
    modelConfig.cacheEnabled ? 
      { enabled: true, ttl: modelConfig.cacheTTL || 3600 } : 
      undefined
  );
}

/**
 * Modérer du contenu via l'Edge Function de modération
 */
export async function moderateContent(
  content: string,
  _apiKey?: string // Paramètre ignoré
) {
  return callOpenAI<{
    results: Array<{
      flagged: boolean,
      categories: Record<string, boolean>,
      category_scores: Record<string, number>
    }>
  }>(
    "/moderations",
    {
      input: content
    },
    undefined,
    { enabled: true, ttl: 60 }
  );
}

/**
 * Vérifier si l'API OpenAI est accessible via Edge Function
 */
export async function checkApiConnection(_apiKey?: string): Promise<boolean> {
  try {
    const response = await chatCompletion(
      [
        { role: "system", content: "You are a test assistant." },
        { role: "user", content: "Test connection" }
      ],
      'chat'
    );
    
    return !!response.choices.length;
  } catch (error) {
    logger.error('API connection check failed', error, 'API');
    return false;
  }
}
