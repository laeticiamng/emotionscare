/**
 * Support Chatbot Service - Phase 4.4
 * Gestion du chatbot support IA autonome avec détection d'intent
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

      // Générer une réponse avec OpenAI
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

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: 100,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const analysisText = data.choices[0].message.content;

      // Parse JSON response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return {
          intent: 'general',
          confidence: 0.5,
          sentiment: 'neutral',
        };
      }

      const analysis = JSON.parse(jsonMatch[0]);
      return {
        intent: analysis.intent || 'general',
        confidence: Math.min(1, Math.max(0, analysis.confidence || 0.5)),
        sentiment: analysis.sentiment || 'neutral',
      };
    } catch (error) {
      logger.warn('Message analysis failed, using defaults', error as Error, 'CHATBOT');
      return {
        intent: 'general',
        confidence: 0.5,
        sentiment: 'neutral',
      };
    }
  }

  /**
   * Générer une réponse avec OpenAI
   */
  private async generateChatbotResponse(
    userMessage: string,
    intent: Intent,
    context: string
  ): Promise<{ content: string; suggestedActions: string[] }> {
    try {
      const systemPrompt = this.buildSystemPrompt(intent);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: `${context}\n\nUtilisateur: ${userMessage}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 300,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      const suggestedActions = this.extractSuggestedActions(intent);

      return {
        content,
        suggestedActions,
      };
    } catch (error) {
      logger.error('Failed to generate response with OpenAI', error as Error, 'CHATBOT');
      throw error;
    }
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

      let context = `Contexte de la conversation:\n`;

      if (messages && messages.length > 0) {
        (messages as any[]).forEach((msg) => {
          const sender = msg.sender === 'user' ? 'Utilisateur' : 'Chatbot';
          context += `${sender}: ${msg.content}\n`;
        });
      }

      return context;
    } catch (error) {
      logger.warn('Failed to build context', error as Error, 'CHATBOT');
      return 'Contexte: Nouvelle conversation.\n';
    }
  }

  /**
   * Créer un ticket de support
   */
  async createSupportTicket(
    conversationId: string,
    userId: string,
    description: string
  ): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .insert({
          conversation_id: conversationId,
          user_id: userId,
          title: `Support request - ${new Date().toLocaleDateString('fr-FR')}`,
          description: description.substring(0, 500),
          category: 'technical',
          priority: 'normal',
          status: 'open',
        })
        .select()
        .single();

      if (error) throw error;

      logger.info(
        `Support ticket created: ${data.ticket_number}`,
        { userId, conversationId },
        'CHATBOT'
      );

      return data;
    } catch (error) {
      logger.error('Failed to create support ticket', error as Error, 'CHATBOT');
      return null;
    }
  }

  /**
   * Clôturer une conversation
   */
  async closeConversation(
    conversationId: string,
    userId: string,
    satisfaction?: number,
    feedback?: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('support_conversations')
        .update({
          status: 'closed',
          closed_at: new Date().toISOString(),
          user_satisfaction: satisfaction,
          satisfaction_feedback: feedback,
        })
        .eq('id', conversationId)
        .eq('user_id', userId);

      if (error) throw error;

      logger.info(
        `Conversation closed: ${conversationId}`,
        { satisfaction },
        'CHATBOT'
      );

      return true;
    } catch (error) {
      logger.error('Failed to close conversation', error as Error, 'CHATBOT');
      return false;
    }
  }

  /**
   * Récupérer le nombre de messages
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
      logger.warn('Failed to get message count', error as Error, 'CHATBOT');
      return 0;
    }
  }

  /**
   * Récupérer les messages d'une conversation
   */
  async getConversationMessages(conversationId: string): Promise<SupportMessage[]> {
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
