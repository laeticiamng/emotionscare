
import { OpenAIModelParams, AI_MODEL_CONFIG, AIModule } from './openai-config';
import { budgetMonitor } from './budgetMonitor';

interface ModelSelectionCriteria {
  textLength?: number;
  isStreaming?: boolean;
  isComplex?: boolean;
  isFrequentRequest?: boolean;
  isBatchOperation?: boolean;
  isPremiumSupport?: boolean;
  moduleType: AIModule;
}

/**
 * Sélecteur de modèle intelligent basé sur les critères de la requête
 */
export async function selectAIModel(criteria: ModelSelectionCriteria): Promise<OpenAIModelParams> {
  // Cloner la configuration par défaut pour le module
  const config = { ...AI_MODEL_CONFIG[criteria.moduleType] };
  
  // Vérifier les contraintes budgétaires
  const budgetExceeded = await budgetMonitor.hasExceededBudget(config.model);
  
  // Garde-fou budgétaire - toujours utiliser un modèle moins cher si le budget est dépassé
  if (budgetExceeded && criteria.moduleType !== 'scan') {
    console.log(`Budget dépassé pour ${config.model}, passage à gpt-4o-mini`);
    config.model = "gpt-4o-mini";
  }
  
  // Support premium - toujours utiliser le meilleur modèle disponible
  if (criteria.isPremiumSupport && !budgetExceeded) {
    return {
      model: "gpt-4o",
      temperature: 0.5,
      max_tokens: 1024,
      top_p: 1.0,
      stream: true,
      cacheEnabled: false
    };
  }
  
  // Pour les sessions de coach initiales, utiliser le modèle plus puissant
  if (criteria.moduleType === 'coach' && criteria.isComplex) {
    return {
      model: budgetExceeded ? "gpt-4o-mini" : "gpt-4o",
      temperature: 0.4,
      max_tokens: 512,
      top_p: 1.0,
      stream: true,
      cacheEnabled: false
    };
  }
  
  // Pour les opérations batch du journal, utiliser un modèle plus capable
  if (criteria.moduleType === 'journal' && criteria.isBatchOperation) {
    return {
      model: budgetExceeded ? "gpt-4o-mini" : "gpt-4o",
      temperature: 0.3,
      max_tokens: 1024,
      top_p: 1.0,
      stream: false,
      cacheEnabled: false
    };
  }
  
  // Pour les questions fréquemment posées avec mise en cache
  if (criteria.isFrequentRequest && criteria.moduleType === 'chat') {
    return {
      model: "gpt-4o-mini",
      temperature: 0.2,
      max_tokens: 256,
      top_p: 1.0,
      stream: false,
      cacheEnabled: true,
      cacheTTL: 86400 // 24 heures
    };
  }
  
  // Retourner la configuration par défaut pour le module
  return config;
}

/**
 * Vérifier si une requête doit être mise en cache (pour 24h)
 */
export function shouldCacheResponse(moduleType: AIModule): boolean {
  // Ne mettre en cache que les réponses FAQ et Scan
  return ['chat', 'scan'].includes(moduleType);
}

/**
 * Générer une clé de cache pour les réponses AI
 */
export function generateCacheKey(model: string, prompt: string): string {
  return `${model}:${prompt.substring(0, 100)}`;
}
