
/**
 * OpenAI API Models Configuration
 * 
 * Configuration centralisée pour les modèles et paramètres OpenAI.
 */

export type OpenAIModelParams = {
  model: string;
  temperature: number;
  max_tokens: number;
  top_p: number;
  stream: boolean;
  cacheEnabled?: boolean;
  cacheTTL?: number; // en secondes
};

// Types de modules pour différentes parties de l'application
export type AIModule = 'chat' | 'coach' | 'coach_followup' | 'journal' | 'buddy' | 'scan';

// Configuration des modèles par module
export const AI_MODEL_CONFIG: Record<AIModule, OpenAIModelParams> = {
  // Chat général & FAQ - modèle économique avec cache
  chat: {
    model: "gpt-4o-mini", // Remplacement de gpt-4.1-mini par le modèle existant compatible
    temperature: 0.2,
    max_tokens: 256,
    top_p: 1.0,
    stream: false,
    cacheEnabled: true,
    cacheTTL: 86400 // Cache de 24 heures
  },
  
  // Coach session initiale - modèle plus puissant avec streaming
  coach: {
    model: "gpt-4o", // Remplacement par un modèle existant compatible
    temperature: 0.4,
    max_tokens: 512,
    top_p: 1.0,
    stream: true
  },
  
  // Coach sessions de suivi - modèle économique avec streaming
  coach_followup: {
    model: "gpt-4o-mini", // Remplacement par un modèle existant compatible
    temperature: 0.2,
    max_tokens: 512,
    top_p: 1.0,
    stream: true
  },
  
  // Journal & contenu long-form - modèle puissant pour le traitement par lots
  journal: {
    model: "gpt-4o", // Remplacement par un modèle existant compatible
    temperature: 0.3,
    max_tokens: 1024,
    top_p: 1.0,
    stream: false
  },
  
  // Buddy/peer suggestions - ton amical, réponses courtes
  buddy: {
    model: "gpt-4o-mini", // Remplacement par un modèle existant compatible
    temperature: 0.5,
    max_tokens: 256,
    top_p: 1.0,
    stream: false
  },
  
  // Scan/quick check-ups - réponses efficaces et concises
  scan: {
    model: "gpt-4o-mini", // Remplacement par un modèle existant compatible
    temperature: 0.2,
    max_tokens: 128,
    top_p: 1.0,
    stream: false,
    cacheEnabled: true,
    cacheTTL: 86400 // Cache de 24 heures
  }
};

// Seuils budgétaires pour l'utilisation de l'API OpenAI
export const BUDGET_THRESHOLDS = {
  "gpt-4o": 100, // Seuil mensuel de 100$
  "gpt-4o-mini": 20,   // Seuil mensuel de 20$
  "default": 200       // Seuil budgétaire global de 200$
};

// Modèles à utiliser en fallback lorsque les seuils budgétaires sont dépassés
export const BUDGET_FALLBACKS = {
  "gpt-4o": "gpt-4o-mini",
  "default": "gpt-4o-mini"
};

/**
 * Obtenir la configuration de modèle optimale en fonction du module et des contraintes budgétaires
 */
export function getModelConfig(module: AIModule, budgetExceeded = false): OpenAIModelParams {
  const config = { ...AI_MODEL_CONFIG[module] };
  
  // Appliquer les garde-fous budgétaires si nécessaire
  if (budgetExceeded && module !== 'scan') { // Toujours garder la qualité du scan car coût minimal
    config.model = "gpt-4o-mini";
  }
  
  return config;
}

/**
 * En-têtes communs pour les appels à l'API OpenAI
 */
export function getOpenAIHeaders(apiKey: string) {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`
  };
}

/**
 * Générer une clé de cache pour les requêtes OpenAI
 */
export function generateCacheKey(model: string, messages: any[]): string {
  // Trouver le dernier message utilisateur (en remplaçant findLast par une approche plus compatible)
  let lastUserMessage = '';
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'user') {
      lastUserMessage = messages[i].content || '';
      break;
    }
  }
  
  return `${model}:${lastUserMessage.substring(0, 100)}`;
}
