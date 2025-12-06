
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AI_MODEL_CONFIG } from '@/config/ai-models';

/**
 * Service de génération d'explications RGPD empathiques
 */
export const getSimplifiedGDPRExplanation = async (
  article: string,
  userContext?: {
    language?: string;
    readingLevel?: 'simple' | 'standard' | 'detailed';
    sector?: string;
  }
): Promise<{ 
  explanation: string; 
  simplifiedPoints: string[];
  nextSteps?: string[];
}> => {
  try {
    // Construit le contexte pour la requête
    const context = userContext || {};
    const language = context.language || 'french';
    const readingLevel = context.readingLevel || 'simple';
    const sector = context.sector || 'general';
    
    // Utilise l'Edge Function Supabase pour communiquer avec OpenAI
    const { data, error } = await supabase.functions.invoke('explain-gdpr', {
      body: {
        article,
        language,
        readingLevel,
        sector,
        model: AI_MODEL_CONFIG.coach.model,
        temperature: 0.3
      }
    });

    if (error) {
      console.error('Erreur API RGPD:', error);
      toast({
        title: "Erreur de communication",
        description: "Impossible de générer l'explication simplifiée",
        variant: "destructive"
      });
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Erreur Service GDPR:', error);
    return {
      explanation: "Nous rencontrons des difficultés techniques pour simplifier cette information. Veuillez consulter les termes officiels ou réessayer ultérieurement.",
      simplifiedPoints: ["Consultez le texte original pour plus d'informations."]
    };
  }
};

/**
 * Générer une réponse personnalisée aux questions RGPD
 */
export const getGDPRQuestionResponse = async (
  question: string,
  userContext?: {
    language?: string;
    previousInteractions?: Array<{question: string, answer: string}>;
  }
): Promise<{
  answer: string;
  relatedArticles?: Array<{title: string, id: string}>;
  sources?: string[];
}> => {
  try {
    const { data, error } = await supabase.functions.invoke('gdpr-assistant', {
      body: {
        question,
        language: userContext?.language || 'french',
        previousInteractions: userContext?.previousInteractions || [],
        model: AI_MODEL_CONFIG.coach.model,
        temperature: 0.4
      }
    });

    if (error) throw new Error(error.message);

    return data;
  } catch (error) {
    console.error('Erreur assistant RGPD:', error);
    
    return {
      answer: "Je suis désolé, mais je rencontre actuellement des difficultés techniques. Pour obtenir des informations précises concernant le RGPD et vos droits, veuillez réessayer plus tard ou contacter notre DPO à dpo@emotioncare.com.",
      relatedArticles: []
    };
  }
};

/**
 * Générer un modèle de demande RGPD personnalisé
 */
export const generateGDPRRequestTemplate = async (
  requestType: 'access' | 'rectification' | 'deletion' | 'portability' | 'objection' | 'restriction',
  userContext?: {
    name?: string;
    email?: string;
    company?: string;
    details?: string;
  }
): Promise<{
  template: string;
  instructions: string[];
  estimatedProcessingTime: string;
}> => {
  try {
    const { data, error } = await supabase.functions.invoke('gdpr-request-template', {
      body: {
        requestType,
        userContext,
        model: AI_MODEL_CONFIG.coach.model,
        temperature: 0.2
      }
    });

    if (error) throw new Error(error.message);

    return data;
  } catch (error) {
    console.error('Erreur génération modèle RGPD:', error);
    
    return {
      template: `Demande de ${requestType} conformément au RGPD\n\nJe souhaite exercer mon droit de ${requestType} conformément au Règlement Général sur la Protection des Données.\n\nCordialement,\n[Votre nom]`,
      instructions: ["Complétez les champs manquants", "Envoyez cette demande à notre DPO"],
      estimatedProcessingTime: "30 jours"
    };
  }
};
