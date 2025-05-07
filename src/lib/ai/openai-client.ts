
/**
 * OpenAI API Client
 * 
 * Secure client for interacting with OpenAI APIs with built-in
 * error handling, retry logic, and response validation.
 */
import { toast } from "@/hooks/use-toast";
import { AI_MODEL_CONFIG, AIModule, OpenAIModelParams } from "./openai-config";

const OPENAI_API_BASE_URL = "https://api.openai.com/v1";

// Cache implementation for API responses
const responseCache = new Map<string, {
  data: any,
  timestamp: number
}>();

/**
 * Make a request to OpenAI API with automatic retries and error handling
 */
export async function callOpenAI<T>(
  endpoint: string,
  body: any,
  apiKey?: string,
  cacheOptions?: { enabled: boolean, ttl: number }
): Promise<T> {
  // Use API key from environment or from parameter
  const key = apiKey || process.env.OPENAI_API_KEY;
  
  if (!key) {
    console.error("OpenAI API key is missing");
    throw new Error("API key is required to use this feature");
  }
  
  // Generate cache key from the request if caching is enabled
  let cacheKey = "";
  if (cacheOptions?.enabled) {
    cacheKey = `${endpoint}:${JSON.stringify(body)}`;
    const cachedResponse = responseCache.get(cacheKey);
    
    if (cachedResponse && 
        (Date.now() - cachedResponse.timestamp) < (cacheOptions.ttl * 1000)) {
      console.log("Using cached response for:", endpoint);
      return cachedResponse.data as T;
    }
  }

  // API request configuration
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
      console.error("OpenAI API Error:", errorData);
      
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
    
    // Store in cache if enabled
    if (cacheOptions?.enabled && cacheKey) {
      responseCache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
    }
    
    return data as T;
  } catch (error) {
    console.error("Failed to call OpenAI:", error);
    throw error;
  }
}

/**
 * Fetch with automatic retry for transient errors
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
      console.warn(`Retry attempt ${attempt + 1}/${maxRetries} failed:`, error);
      
      // Wait before next retry with exponential backoff
      await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
    }
  }
  
  throw lastError || new Error(`Failed after ${maxRetries} attempts`);
}

/**
 * Send a chat request to OpenAI
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
 * Moderate content via OpenAI's moderation endpoint
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
    { enabled: true, ttl: 60 } // Cache moderation results for a minute
  );
}

/**
 * Check if the OpenAI API is accessible
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
    console.error("API connection check failed:", error);
    return false;
  }
}
