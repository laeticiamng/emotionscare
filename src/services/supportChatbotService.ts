/**
 * Support Chatbot Service - Phase 4.4
 * Gestion du chatbot support IA autonome avec détection d'intent
 * Corrigé: Utilise Supabase Edge Function au lieu d'appels API directs
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

// Types
export type MessageSender = 'user' | 'chatbot' | 'admin';
export type ConversationStatus = 'open' | 'closed' | 'escalated' | 'waiting_user';
export type Priority = 'low' | 'normal' | 'high' | 'urgent';
export type Intent = 'diagnostic' | 'onboarding' | 'feature_help' | 'billing' | 'feedback' | 'emotion_support' | 'general';
export type Sentiment = 'positive' | 'neutral' | 'negative';

export interface SupportConversation {
  id: string;
  user_id: string;
  title?: string;
  status: ConversationStatus;
  priority: Priority;
  primary_intent?: Intent;
  secondary_intents?: Intent[];
  message_count: number;
  first_message_at?: string;
  last_message_at?: string;
  user_satisfaction?: number;
  created_at: string;
  updated_at: string;
}

export interface SupportMessage {
  id: string;
  conversation_id: string;
  user_id?: string;
  sender: MessageSender;
  content: string;
  message_type: 'text' | 'file' | 'system' | 'action';
  detected_intent?: Intent;
  intent_confidence?: number;
  sentiment?: Sentiment;
  requires_escalation: boolean;
  suggested_actions?: string[];
  created_at: string;
}

export interface ChatbotIntent {
  id: string;
  intent_name: Intent;
  description?: string;
  keywords: string[];
  patterns: string[];
  requires_escalation: boolean;
  escalation_threshold: number;
  suggested_actions?: string[];
}

export interface MessageResponse {
  message: SupportMessage;
  conversationStatus?: ConversationStatus;
  requiresEscalation?: boolean;
  suggestedActions?: string[];
}

class SupportChatbotService {
  private readonly MAX_CONTEXT_MESSAGES = 10;
  private readonly ESCALATION_CONFIDENCE_THRESHOLD = 0.6;

  /**
   * Créer une nouvelle conversation
   */
  async createConversation(
    userId: string,
    initialIntent?: Intent,
    title?: string
  ): Promise<SupportConversation | null> {
    try {
      const { data, error } = await supabase
        .from('support_conversations')
        .insert({
          user_id: userId,
          title: title || `Conversation ${new Date().toLocaleDateString('fr-FR')}`,
          primary_intent: initialIntent,
          status: 'open',
          priority: 'normal',
          first_message_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      logger.info(`Conversation created: ${data.id}`, { userId, intent: initialIntent }, 'CHATBOT');

      return data as SupportConversation;
    } catch (error) {
      logger.error('Failed to create conversation', error as Error, 'CHATBOT');
      return null;
    }
  }

  /**
   * Récupérer une conversation
   */
  async getConversation(conversationId: string): Promise<SupportConversation | null> {
    try {
      const { data, error } = await supabase
        .from('support_conversations')
        .select('*')
        .eq('id', conversationId)
        .single();

      if (error) throw error;
      return data as SupportConversation;
    } catch (error) {
      logger.error('Failed to fetch conversation', error as Error, 'CHATBOT');
      return null;
    }
  }

  /**
   * Récupérer les conversations de l'utilisateur
   */
  async getUserConversations(userId: string): Promise<SupportConversation[]> {
    try {
      const { data, error } = await supabase
        .from('support_conversations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as SupportConversation[];
    } catch (error) {
      logger.error('Failed to fetch conversations', error as Error, 'CHATBOT');
      return [];
    }
  }

  /**
   * Ajouter un message à la conversation
   */
  async addMessage(
    conversationId: string,
    userId: string,
    content: string,
    sender: MessageSender = 'user'
  ): Promise<SupportMessage | null> {
    try {
      // Détecter l'intent et le sentiment du message utilisateur
      let detectedIntent: Intent | undefined;
      let intentConfidence: number | undefined;
      let sentiment: Sentiment | undefined;

      if (sender === 'user') {
        const analysis = await this.analyzeMessage(content);
        detectedIntent = analysis.intent;
        intentConfidence = analysis.confidence;
        sentiment = analysis.sentiment;
      }

      const { data, error } = await supabase
        .from('support_messages')
        .insert({
          conversation_id: conversationId,
          user_id: sender === 'user' ? userId : null,
          sender,
          content,
          message_type: 'text',
          detected_intent: detectedIntent,
          intent_confidence: intentConfidence,
          sentiment,
          requires_escalation: false,
        })
        .select()
        .single();

      if (error) throw error;

      // Mettre à jour le message_count de la conversation
      await supabase
        .from('support_conversations')
        .update({
          message_count: (await this.getMessageCount(conversationId)) + 1,
          ...(detectedIntent && { primary_intent: detectedIntent }),
        })
        .eq('id', conversationId);

      logger.info(
        `Message added to conversation ${conversationId}`,
        { sender, intent: detectedIntent },
        'CHATBOT'
      );

      return data as SupportMessage;
    } catch (error) {
      logger.error('Failed to add message', error as Error, 'CHATBOT');
      return null;
    }
  }

  /**
   * Générer une réponse du chatbot
   */
  async generateResponse(
    conversationId: string,
    userId: string,
    userMessage: string
  ): Promise<MessageResponse | null> {
    try {
      // Analyser le message utilisateur
      const analysis = await this.analyzeMessage(userMessage);
      const { intent, confidence } = analysis;

      logger.debug(
        'Message analyzed',
        { intent, confidence },
        'CHATBOT'
      );

      // Récupérer le contexte de la conversation
      const context = await this.buildConversationContext(conversationId, userId);

      // Obtenir la conversation actuelle pour mettre à jour l'intent
      const conversation = await this.getConversation(conversationId);
      if (conversation && intent) {
        await supabase
          .from('support_conversations')
          .update({ primary_intent: intent })
          .eq('id', conversationId);
      }

      // Vérifier si escalade requise
      const requiresEscalation =
        confidence < this.ESCALATION_CONFIDENCE_THRESHOLD ||
        userMessage.toLowerCase().includes('parler à un agent');

      if (requiresEscalation) {
        logger.info(
          'Escalation required',
          { intent, confidence },
          'CHATBOT'
        );

        // Créer un ticket de support
        const ticket = await this.createSupportTicket(
          conversationId,
          userId,
          userMessage
        );

        // Ajouter le message du chatbot
        const botMessage = await this.addMessage(
          conversationId,
          userId,
          `Je comprends que vous avez un problème qui nécessite l'aide de notre équipe. Un ticket de support a été créé (${ticket?.ticket_number}). Un agent vous contactera bientôt.`,
          'chatbot'
        );

        // Mettre à jour le statut de la conversation
        await supabase
          .from('support_conversations')
          .update({ status: 'escalated' })
          .eq('id', conversationId);

        return {
          message: botMessage!,
          conversationStatus: 'escalated',
          requiresEscalation: true,
        };
      }

      // Générer une réponse avec Edge Function
      const response = await this.generateChatbotResponse(
        userMessage,
        intent,
        context
      );

      // Ajouter la réponse du chatbot
      const botMessage = await this.addMessage(
        conversationId,
        userId,
        response.content,
        'chatbot'
      );

      if (!botMessage) {
        throw new Error('Failed to save chatbot message');
      }

      return {
        message: botMessage,
        suggestedActions: response.suggestedActions,
        conversationStatus: 'open',
      };
    } catch (error) {
      logger.error('Failed to generate response', error as Error, 'CHATBOT');

      // Fallback: réponse générique
      const fallbackMessage = await this.addMessage(
        conversationId,
        userId,
        `Je suis désolé, j'ai du mal à comprendre votre demande. Pourriez-vous la reformuler ou parler à un agent de support?`,
        'chatbot'
      );

      return fallbackMessage
        ? { message: fallbackMessage, requiresEscalation: true }
        : null;
    }
  }

  /**
   * Analyser un message pour déterminer l'intent et le sentiment
   * Utilise Edge Function openai-chat au lieu d'appel API direct
   */
  private async analyzeMessage(
    content: string
  ): Promise<{ intent: Intent; confidence: number; sentiment: Sentiment }> {
    try {
      const prompt = `Analyze this support message and return JSON with intent and sentiment:
Message: "${content}"

Return ONLY valid JSON (no markdown, no code blocks):
{
  "intent": "diagnostic|onboarding|feature_help|billing|feedback|emotion_support|general",
  "confidence": 0.0-1.0,
  "sentiment": "positive|neutral|negative"
}`;

      // Appel via Edge Function sécurisée
      const { data, error } = await supabase.functions.invoke('openai-chat', {
        body: {
          messages: [{ role: 'user', content: prompt }],
          model: 'gpt-3.5-turbo',
          temperature: 0.3,
          max_tokens: 100,
        },
      });

      if (error) throw error;

      const analysisText = data?.content || data?.message?.content || '';

      // Parse JSON response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return this.analyzeMessageLocally(content);
      }

      const analysis = JSON.parse(jsonMatch[0]);
      return {
        intent: analysis.intent || 'general',
        confidence: Math.min(1, Math.max(0, analysis.confidence || 0.5)),
        sentiment: analysis.sentiment || 'neutral',
      };
    } catch (error) {
      logger.warn('Edge function analysis failed, using local analysis', error as Error, 'CHATBOT');
      return this.analyzeMessageLocally(content);
    }
  }

  /**
   * Analyse locale de fallback basée sur mots-clés
   */
  private analyzeMessageLocally(content: string): { intent: Intent; confidence: number; sentiment: Sentiment } {
    const lowerContent = content.toLowerCase();
    
    // Détection d'intent par mots-clés
    const intentPatterns: Record<Intent, string[]> = {
      diagnostic: ['erreur', 'bug', 'problème', 'ne fonctionne pas', 'crash', 'bloqué'],
      onboarding: ['comment', 'commencer', 'débuter', 'nouveau', 'première fois', 'inscription'],
      feature_help: ['fonctionnalité', 'option', 'paramètre', 'réglage', 'utiliser', 'trouver'],
      billing: ['paiement', 'abonnement', 'facturation', 'prix', 'premium', 'annuler'],
      feedback: ['suggestion', 'amélioration', 'avis', 'retour', 'idée', 'proposer'],
      emotion_support: ['anxieux', 'triste', 'stress', 'déprimé', 'aide', 'soutien', 'mal'],
      general: [],
    };

    let detectedIntent: Intent = 'general';
    let maxMatches = 0;

    for (const [intent, keywords] of Object.entries(intentPatterns)) {
      const matches = keywords.filter(kw => lowerContent.includes(kw)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        detectedIntent = intent as Intent;
      }
    }

    // Détection de sentiment
    const positiveWords = ['merci', 'super', 'génial', 'parfait', 'excellent', 'content'];
    const negativeWords = ['nul', 'horrible', 'mauvais', 'déçu', 'frustré', 'énervé'];
    
    const positiveCount = positiveWords.filter(w => lowerContent.includes(w)).length;
    const negativeCount = negativeWords.filter(w => lowerContent.includes(w)).length;
    
    let sentiment: Sentiment = 'neutral';
    if (positiveCount > negativeCount) sentiment = 'positive';
    else if (negativeCount > positiveCount) sentiment = 'negative';

    return {
      intent: detectedIntent,
      confidence: maxMatches > 0 ? 0.6 + (maxMatches * 0.1) : 0.4,
      sentiment,
    };
  }

  /**
   * Générer une réponse avec Edge Function openai-chat
   */
  private async generateChatbotResponse(
    userMessage: string,
    intent: Intent,
    context: string
  ): Promise<{ content: string; suggestedActions: string[] }> {
    try {
      const systemPrompt = this.buildSystemPrompt(intent);

      // Appel via Edge Function sécurisée
      const { data, error } = await supabase.functions.invoke('openai-chat', {
        body: {
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `${context}\n\nUtilisateur: ${userMessage}` },
          ],
          model: 'gpt-3.5-turbo',
          temperature: 0.7,
          max_tokens: 300,
        },
      });

      if (error) throw error;

      const content = data?.content || data?.message?.content || this.getDefaultResponse(intent);
      const suggestedActions = this.extractSuggestedActions(intent);

      return {
        content,
        suggestedActions,
      };
    } catch (error) {
      logger.error('Failed to generate response with Edge Function', error as Error, 'CHATBOT');
      // Fallback: réponse locale
      return {
        content: this.getDefaultResponse(intent),
        suggestedActions: this.extractSuggestedActions(intent),
      };
    }
  }

  /**
   * Réponse par défaut selon l'intent
   */
  private getDefaultResponse(intent: Intent): string {
    const responses: Record<Intent, string> = {
      diagnostic: "Je comprends que vous rencontrez un problème technique. Pouvez-vous me décrire plus en détail ce qui se passe?",
      onboarding: "Bienvenue sur EmotionsCare! Je suis là pour vous aider à démarrer. Que souhaitez-vous explorer en premier?",
      feature_help: "Je serais ravi de vous expliquer comment utiliser cette fonctionnalité. De quelle fonctionnalité avez-vous besoin d'aide?",
      billing: "Pour les questions de facturation, je peux vous aider. Quelle est votre question concernant votre abonnement?",
      feedback: "Merci pour votre retour! Votre avis est précieux pour nous. Pouvez-vous m'en dire plus?",
      emotion_support: "Je suis là pour vous soutenir. Comment vous sentez-vous en ce moment? N'hésitez pas à vous confier.",
      general: "Comment puis-je vous aider aujourd'hui?",
    };
    return responses[intent];
  }

  /**
   * Construire le prompt système pour OpenAI
   */
  private buildSystemPrompt(intent: Intent): string {
    const basePrompt = `You are EmotionsCare support chatbot. You are helpful, friendly, and professional.
Respond in French. Keep responses concise (2-3 sentences).
Be empathetic when discussing emotions or well-being.`;

    const intentPrompts: Record<Intent, string> = {
      diagnostic:
        basePrompt +
        ` Help diagnose technical issues. Ask clarifying questions if needed.`,
      onboarding:
        basePrompt +
        ` Guide new users through app features step-by-step.`,
      feature_help:
        basePrompt +
        ` Explain how to use specific app features.`,
      billing:
        basePrompt +
        ` Answer questions about subscriptions and billing.`,
      feedback:
        basePrompt +
        ` Listen to feedback and suggest improvements.`,
      emotion_support:
        basePrompt +
        ` Provide emotional support and suggest well-being resources.`,
      general:
        basePrompt +
        ` Answer general questions about EmotionsCare.`,
    };

    return intentPrompts[intent];
  }

  /**
   * Extraire les actions suggérées
   */
  private extractSuggestedActions(intent: Intent): string[] {
    const actions: Record<Intent, string[]> = {
      diagnostic: ['Voir la FAQ', 'Créer un ticket', 'Réinitialiser l\'app'],
      onboarding: ['Consulter le tutoriel', 'Voir les paramètres', 'Explorer les features'],
      feature_help: ['Voir l\'aide détaillée', 'Regarder une vidéo', 'Consulter la doc'],
      billing: ['Gérer l\'abonnement', 'Voir la facture', 'Contacter l\'équipe'],
      feedback: ['Envoyer le feedback', 'Donner une note', 'Suggérer une feature'],
      emotion_support: ['Méditation guidée', 'Ressources bien-être', 'Parler à un coach'],
      general: ['Consulter le FAQ', 'Contacter le support', 'Voir les annonces'],
    };

    return actions[intent];
  }

  /**
   * Construire le contexte de la conversation
   */
  private async buildConversationContext(
    conversationId: string,
    userId: string
  ): Promise<string> {
    try {
      // Récupérer les derniers messages
      const { data: messages, error } = await supabase
        .from('support_messages')
        .select('sender, content')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .limit(this.MAX_CONTEXT_MESSAGES);

      if (error) throw error;

      // Construire le contexte
      const contextMessages = (messages || []).map((m: any) =>
        `${m.sender === 'user' ? 'Utilisateur' : 'Assistant'}: ${m.content}`
      );

      // Ajouter le profil utilisateur si disponible
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, subscription_tier')
        .eq('id', userId)
        .single();

      let userContext = '';
      if (profile) {
        userContext = `[Utilisateur: ${profile.display_name || 'Anonyme'}, Abonnement: ${profile.subscription_tier || 'Gratuit'}]\n`;
      }

      return userContext + contextMessages.join('\n');
    } catch (error) {
      logger.error('Failed to build context', error as Error, 'CHATBOT');
      return '';
    }
  }

  /**
   * Créer un ticket de support
   */
  private async createSupportTicket(
    conversationId: string,
    userId: string,
    message: string
  ): Promise<{ ticket_number: string } | null> {
    try {
      const ticketNumber = `TICK-${Date.now().toString(36).toUpperCase()}`;

 const { error } = await supabase
        .from('support_tickets')
        .insert({
          conversation_id: conversationId,
          user_id: userId,
          ticket_number: ticketNumber,
          subject: message.substring(0, 100),
          description: message,
          status: 'open',
          priority: 'normal',
        })
        .select()
        .single();

      if (error) throw error;

      return { ticket_number: ticketNumber };
    } catch (error) {
      logger.error('Failed to create ticket', error as Error, 'CHATBOT');
      return { ticket_number: 'UNKNOWN' };
    }
  }

  /**
   * Obtenir le nombre de messages d'une conversation
   */
  private async getMessageCount(conversationId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('support_messages')
        .select('*', { count: 'exact', head: true })
        .eq('conversation_id', conversationId);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Mettre à jour la satisfaction utilisateur
   */
  async updateSatisfaction(conversationId: string, rating: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('support_conversations')
        .update({ user_satisfaction: rating })
        .eq('id', conversationId);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Failed to update satisfaction', error as Error, 'CHATBOT');
      return false;
    }
  }

  /**
   * Fermer une conversation
   */
  async closeConversation(conversationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('support_conversations')
        .update({ status: 'closed' })
        .eq('id', conversationId);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Failed to close conversation', error as Error, 'CHATBOT');
      return false;
    }
  }

  /**
   * Récupérer les messages d'une conversation
   */
  async getMessages(conversationId: string): Promise<SupportMessage[]> {
    try {
      const { data, error } = await supabase
        .from('support_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return (data || []) as SupportMessage[];
    } catch (error) {
      logger.error('Failed to fetch messages', error as Error, 'CHATBOT');
      return [];
    }
  }
}

export const supportChatbotService = new SupportChatbotService();
