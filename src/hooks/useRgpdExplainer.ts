
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { 
  getSimplifiedGDPRExplanation,
  getGDPRQuestionResponse,
  generateGDPRRequestTemplate 
} from '@/lib/ai/gdpr-service';

export type GdprExplanation = {
  explanation: string;
  simplifiedPoints: string[];
  nextSteps?: string[];
};

export type GdprResponse = {
  answer: string;
  relatedArticles?: Array<{title: string, id: string}>;
  sources?: string[];
};

export type GdprRequestTemplate = {
  template: string;
  instructions: string[];
  estimatedProcessingTime: string;
};

export type GdprRequestType = 'access' | 'rectification' | 'deletion' | 'portability' | 'objection' | 'restriction';

export function useRgpdExplainer() {
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState<GdprExplanation | null>(null);
  const [questionResponse, setQuestionResponse] = useState<GdprResponse | null>(null);
  const [requestTemplate, setRequestTemplate] = useState<GdprRequestTemplate | null>(null);
  const [previousQuestions, setPreviousQuestions] = useState<Array<{question: string, answer: string}>>([]);

  /**
   * Obtenir une explication simplifiée d'un article ou concept RGPD
   */
  const getExplanation = async (
    article: string,
    options?: {
      language?: string;
      readingLevel?: 'simple' | 'standard' | 'detailed';
      sector?: string;
    }
  ) => {
    setIsLoading(true);
    try {
      const result = await getSimplifiedGDPRExplanation(article, options);
      setExplanation(result);
      return result;
    } catch (error) {
      console.error('Erreur explication RGPD:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'obtenir l'explication RGPD",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Poser une question sur un sujet RGPD et obtenir une réponse
   */
  const askQuestion = async (
    question: string,
    options?: {
      language?: string;
    }
  ) => {
    setIsLoading(true);
    try {
      const result = await getGDPRQuestionResponse(question, {
        ...options,
        previousInteractions: previousQuestions
      });
      setQuestionResponse(result);
      
      // Ajouter à l'historique des questions
      setPreviousQuestions(prev => [
        ...prev,
        { question, answer: result.answer }
      ]);
      
      return result;
    } catch (error) {
      console.error('Erreur question RGPD:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'obtenir une réponse à votre question",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Générer un modèle de demande RGPD
   */
  const getRequestTemplate = async (
    requestType: GdprRequestType,
    details?: {
      name?: string;
      email?: string;
      company?: string;
      details?: string;
    }
  ) => {
    setIsLoading(true);
    try {
      const result = await generateGDPRRequestTemplate(requestType, details);
      setRequestTemplate(result);
      return result;
    } catch (error) {
      console.error('Erreur modèle RGPD:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le modèle de demande",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Réinitialiser l'historique des questions
   */
  const resetConversation = () => {
    setPreviousQuestions([]);
    setQuestionResponse(null);
  };

  return {
    isLoading,
    explanation,
    questionResponse,
    requestTemplate,
    previousQuestions,
    getExplanation,
    askQuestion,
    getRequestTemplate,
    resetConversation
  };
}
