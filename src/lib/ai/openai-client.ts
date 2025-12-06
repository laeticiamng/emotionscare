
/**
 * OpenAI API Client
 * 
 * Client sécurisé pour interagir avec les API OpenAI avec gestion d'erreur
 * intégrée, logique de retry, et validation des réponses.
 */
import { toast } from "@/hooks/use-toast";
import { AI_MODEL_CONFIG, AIModule, OpenAIModelParams } from "./openai-config";

const OPENAI_API_BASE_URL = "https://api.openai.com/v1";

// Implémentation de cache pour les réponses API
const responseCache = new Map<string, {
  data: any,
  timestamp: number
}>();

/**
 * Effectuer une requête à l'API OpenAI avec retry automatique et gestion des erreurs
 */
export async function callOpenAI<T>(
  endpoint: string,
  body: any,
  apiKey?: string,
  cacheOptions?: { enabled: boolean, ttl: number }
): Promise<T> {
  // Utiliser la clé API de l'environnement ou du paramètre
  const key = apiKey || import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!key) {
    console.error("La clé API OpenAI est manquante");
    throw new Error("Une clé API est requise pour utiliser cette fonctionnalité");
  }
  
  // Générer une clé de cache à partir de la requête si le cache est activé
  let cacheKey = "";
  if (cacheOptions?.enabled) {
    cacheKey = `${endpoint}:${JSON.stringify(body)}`;
    const cachedResponse = responseCache.get(cacheKey);
    
    if (cachedResponse && 
        (Date.now() - cachedResponse.timestamp) < (cacheOptions.ttl * 1000)) {
      console.log("Utilisation de la réponse en cache pour:", endpoint);
      return cachedResponse.data as T;
    }
  }

  // Configuration de requête API
  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`
    },
    body: JSON.stringify(body)
  };

  try {
    const response = await fetchWithRetry(`${OPENAI_API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erreur API OpenAI:", errorData);
      
      if (response.status === 429) {
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
      
      throw new Error(errorData.error?.message || "Erreur lors de l'appel à l'API OpenAI");
    }

    const data = await response.json();
    
    // Stocker en cache si activé
    if (cacheOptions?.enabled && cacheKey) {
      responseCache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
    }
    
    return data as T;
  } catch (error) {
    console.error("Échec de l'appel à OpenAI:", error);
    throw error;
  }
}

/**
 * Fetch avec retry automatique pour les erreurs transitoires
 */
async function fetchWithRetry(
  url: string, 
  options: RequestInit, 
  maxRetries = 3,
  retryDelay = 1000
): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fetch(url, options);
    } catch (error) {
      lastError = error as Error;
      console.warn(`Tentative de retry ${attempt + 1}/${maxRetries} échouée:`, error);
      
      // Attendre avant la prochaine tentative avec backoff exponentiel
      await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
    }
  }
  
  throw lastError || new Error(`Échec après ${maxRetries} tentatives`);
}

/**
 * Envoyer une requête de chat à OpenAI
 */
export async function chatCompletion(
  messages: Array<{role: string, content: string}>,
  module: AIModule = 'chat',
  apiKey?: string
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
    apiKey,
    modelConfig.cacheEnabled ? 
      { enabled: true, ttl: modelConfig.cacheTTL || 3600 } : 
      undefined
  );
}

/**
 * Modérer du contenu via l'endpoint de modération d'OpenAI
 */
export async function moderateContent(
  content: string,
  apiKey?: string
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
    apiKey,
    { enabled: true, ttl: 60 } // Mettre en cache les résultats de modération pendant une minute
  );
}

/**
 * Vérifier si l'API OpenAI est accessible
 */
export async function checkApiConnection(apiKey?: string): Promise<boolean> {
  try {
    const response = await chatCompletion(
      [
        { role: "system", content: "You are a test assistant." },
        { role: "user", content: "Test connection" }
      ],
      'chat',
      apiKey
    );
    
    return !!response.choices.length;
  } catch (error) {
    console.error("La vérification de connexion API a échoué:", error);
    return false;
  }
}
