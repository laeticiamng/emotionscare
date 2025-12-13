// @ts-nocheck
import { supabase } from '@/integrations/supabase/client';
import { ChatResponse, Message } from '@/types/support';
import { logger } from '@/lib/logger';

/** Type de conversation */
export type ConversationType = 'support' | 'coach' | 'therapy' | 'general' | 'crisis';

/** Configuration de chat */
export interface ChatConfig {
  maxHistoryLength: number;
  enableEmotionDetection: boolean;
  enableSuggestions: boolean;
  language: string;
  tone: 'professional' | 'friendly' | 'empathetic';
  autoArchiveAfterDays: number;
}

/** Conversation complète */
export interface Conversation {
  id: string;
  userId: string;
  type: ConversationType;
  title: string;
  messages: Message[];
  status: 'active' | 'archived' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, unknown>;
}

/** Résumé de conversation */
export interface ConversationSummary {
  id: string;
  title: string;
  type: ConversationType;
  messageCount: number;
  lastMessage?: string;
  lastMessageAt?: Date;
  status: 'active' | 'archived' | 'resolved';
  unreadCount: number;
}

/** Ticket de support */
export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed';
  assignedTo?: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  satisfactionRating?: number;
}

/** Article FAQ */
export interface FAQArticle {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  helpful: number;
  notHelpful: number;
  views: number;
  relatedArticles: string[];
  lastUpdated: Date;
}

/** Statistiques de chat */
export interface ChatStats {
  totalConversations: number;
  activeConversations: number;
  resolvedTickets: number;
  averageResponseTime: number;
  satisfactionRate: number;
  topCategories: { category: string; count: number }[];
}

/** Réponse rapide */
export interface QuickResponse {
  id: string;
  trigger: string;
  response: string;
  category: string;
  useCount: number;
}

const DEFAULT_CONFIG: ChatConfig = {
  maxHistoryLength: 50,
  enableEmotionDetection: true,
  enableSuggestions: true,
  language: 'fr',
  tone: 'empathetic',
  autoArchiveAfterDays: 30
};

export class ChatService {
  private static config: ChatConfig = DEFAULT_CONFIG;

  /** Configure le service */
  static configure(newConfig: Partial<ChatConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  /** Obtient une réponse du support IA */
  static async getSupportResponse(content: string, conversationHistory?: Message[]): Promise<ChatResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('support-chat', {
        body: {
          message: content,
          history: (conversationHistory || []).slice(-this.config.maxHistoryLength),
          context: 'support',
          config: {
            detectEmotion: this.config.enableEmotionDetection,
            includeSuggestions: this.config.enableSuggestions,
            language: this.config.language,
            tone: this.config.tone
          }
        }
      });

      if (error) throw error;

      return {
        id: data.id,
        content: data.response,
        emotion: data.detectedEmotion,
        timestamp: new Date().toISOString(),
        suggestions: data.suggestions,
        confidence: data.confidence
      };
    } catch (error) {
      logger.error('Error getting support response', error as Error, 'API');

      return {
        id: crypto.randomUUID(),
        content: "Je suis désolé, je rencontre actuellement des difficultés techniques. Un membre de notre équipe vous contactera bientôt.",
        timestamp: new Date().toISOString(),
        suggestions: [
          "Essayer de reformuler votre question",
          "Consulter notre FAQ",
          "Contacter le support technique"
        ]
      };
    }
  }

  /** Crée un ticket de support */
  static async createSupportTicket(
    subject: string,
    message: string,
    priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium',
    category: string = 'general'
  ): Promise<SupportTicket | null> {
    try {
      const { data: userData } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: userData.user?.id,
          subject,
          priority,
          category,
          status: 'open',
          first_message: message
        })
        .select()
        .single();

      if (error) throw error;

      logger.info('Support ticket created', { ticketId: data.id, subject }, 'SUPPORT');

      return {
        id: data.id,
        userId: data.user_id,
        subject: data.subject,
        category: data.category,
        priority: data.priority,
        status: data.status,
        messages: [],
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      logger.error('Error creating support ticket', error as Error, 'SUPPORT');
      return null;
    }
  }

  /** Récupère les tickets de l'utilisateur */
  static async getUserTickets(): Promise<SupportTicket[]> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.id) return [];

      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(t => ({
        id: t.id,
        userId: t.user_id,
        subject: t.subject,
        category: t.category,
        priority: t.priority,
        status: t.status,
        assignedTo: t.assigned_to,
        messages: [],
        createdAt: new Date(t.created_at),
        updatedAt: new Date(t.updated_at),
        resolvedAt: t.resolved_at ? new Date(t.resolved_at) : undefined,
        satisfactionRating: t.satisfaction_rating
      }));
    } catch (error) {
      logger.error('Error fetching user tickets', error as Error, 'SUPPORT');
      return [];
    }
  }

  /** Ajoute un message à un ticket */
  static async addTicketMessage(ticketId: string, content: string): Promise<boolean> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.id) return false;

      await supabase.from('ticket_messages').insert({
        ticket_id: ticketId,
        user_id: userData.user.id,
        content,
        is_staff: false
      });

      await supabase
        .from('support_tickets')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', ticketId);

      return true;
    } catch (error) {
      return false;
    }
  }

  /** Évalue la satisfaction d'un ticket */
  static async rateTicket(ticketId: string, rating: number, feedback?: string): Promise<boolean> {
    try {
      await supabase
        .from('support_tickets')
        .update({
          satisfaction_rating: rating,
          satisfaction_feedback: feedback
        })
        .eq('id', ticketId);

      return true;
    } catch (error) {
      return false;
    }
  }

  /** Récupère la FAQ */
  static async getFAQ(category?: string): Promise<FAQArticle[]> {
    try {
      let query = supabase.from('faq').select('*');

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query.order('helpful', { ascending: false });

      if (error) throw error;

      return (data || []).map(f => ({
        id: f.id,
        question: f.question,
        answer: f.answer,
        category: f.category,
        tags: f.tags || [],
        helpful: f.helpful || 0,
        notHelpful: f.not_helpful || 0,
        views: f.views || 0,
        relatedArticles: f.related_articles || [],
        lastUpdated: new Date(f.updated_at)
      }));
    } catch (error) {
      return [];
    }
  }

  /** Recherche dans la FAQ */
  static async searchFAQ(query: string): Promise<FAQArticle[]> {
    try {
      const { data, error } = await supabase
        .from('faq')
        .select('*')
        .or(`question.ilike.%${query}%,answer.ilike.%${query}%,tags.cs.{${query}}`)
        .limit(10);

      if (error) throw error;

      return (data || []).map(f => ({
        id: f.id,
        question: f.question,
        answer: f.answer,
        category: f.category,
        tags: f.tags || [],
        helpful: f.helpful || 0,
        notHelpful: f.not_helpful || 0,
        views: f.views || 0,
        relatedArticles: f.related_articles || [],
        lastUpdated: new Date(f.updated_at)
      }));
    } catch (error) {
      return [];
    }
  }

  /** Marque un article FAQ comme utile ou non */
  static async rateFAQ(articleId: string, helpful: boolean): Promise<boolean> {
    try {
      const column = helpful ? 'helpful' : 'not_helpful';
      await supabase.rpc('increment_faq_rating', {
        p_article_id: articleId,
        p_column: column
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /** Incrémente les vues d'un article FAQ */
  static async viewFAQ(articleId: string): Promise<void> {
    try {
      await supabase.rpc('increment_faq_views', { p_article_id: articleId });
    } catch (error) {
      // Silently fail
    }
  }

  /** Crée une nouvelle conversation */
  static async createConversation(
    type: ConversationType,
    title?: string
  ): Promise<Conversation | null> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.id) return null;

      const { data, error } = await supabase
        .from('conversations')
        .insert({
          user_id: userData.user.id,
          type,
          title: title || `Conversation ${new Date().toLocaleDateString()}`,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        userId: data.user_id,
        type: data.type,
        title: data.title,
        messages: [],
        status: data.status,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      logger.error('Error creating conversation', error as Error, 'CHAT');
      return null;
    }
  }

  /** Récupère les conversations de l'utilisateur */
  static async getConversations(): Promise<ConversationSummary[]> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.id) return [];

      const { data, error } = await supabase
        .from('conversations')
        .select('*, messages:conversation_messages(content, created_at)')
        .eq('user_id', userData.user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(c => {
        const messages = c.messages || [];
        const lastMsg = messages[messages.length - 1];

        return {
          id: c.id,
          title: c.title,
          type: c.type,
          messageCount: messages.length,
          lastMessage: lastMsg?.content,
          lastMessageAt: lastMsg?.created_at ? new Date(lastMsg.created_at) : undefined,
          status: c.status,
          unreadCount: c.unread_count || 0
        };
      });
    } catch (error) {
      return [];
    }
  }

  /** Récupère une conversation avec ses messages */
  static async getConversation(conversationId: string): Promise<Conversation | null> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*, messages:conversation_messages(*)')
        .eq('id', conversationId)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        userId: data.user_id,
        type: data.type,
        title: data.title,
        messages: (data.messages || []).map((m: any) => ({
          id: m.id,
          content: m.content,
          role: m.role,
          timestamp: m.created_at
        })),
        status: data.status,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        metadata: data.metadata
      };
    } catch (error) {
      return null;
    }
  }

  /** Envoie un message dans une conversation */
  static async sendMessage(
    conversationId: string,
    content: string,
    role: 'user' | 'assistant' = 'user'
  ): Promise<Message | null> {
    try {
      const { data, error } = await supabase
        .from('conversation_messages')
        .insert({
          conversation_id: conversationId,
          content,
          role
        })
        .select()
        .single();

      if (error) throw error;

      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      return {
        id: data.id,
        content: data.content,
        role: data.role,
        timestamp: data.created_at
      };
    } catch (error) {
      return null;
    }
  }

  /** Archive une conversation */
  static async archiveConversation(conversationId: string): Promise<boolean> {
    try {
      await supabase
        .from('conversations')
        .update({ status: 'archived' })
        .eq('id', conversationId);

      return true;
    } catch (error) {
      return false;
    }
  }

  /** Supprime une conversation */
  static async deleteConversation(conversationId: string): Promise<boolean> {
    try {
      await supabase
        .from('conversation_messages')
        .delete()
        .eq('conversation_id', conversationId);

      await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId);

      return true;
    } catch (error) {
      return false;
    }
  }

  /** Récupère les statistiques de chat */
  static async getChatStats(): Promise<ChatStats> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.id) {
        return {
          totalConversations: 0,
          activeConversations: 0,
          resolvedTickets: 0,
          averageResponseTime: 0,
          satisfactionRate: 0,
          topCategories: []
        };
      }

      const [conversations, tickets] = await Promise.all([
        this.getConversations(),
        this.getUserTickets()
      ]);

      const resolvedTickets = tickets.filter(t => t.status === 'resolved');
      const ratedTickets = resolvedTickets.filter(t => t.satisfactionRating);
      const avgSatisfaction = ratedTickets.length > 0
        ? ratedTickets.reduce((sum, t) => sum + (t.satisfactionRating || 0), 0) / ratedTickets.length
        : 0;

      // Catégories les plus fréquentes
      const categoryCount: Record<string, number> = {};
      for (const ticket of tickets) {
        categoryCount[ticket.category] = (categoryCount[ticket.category] || 0) + 1;
      }
      const topCategories = Object.entries(categoryCount)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return {
        totalConversations: conversations.length,
        activeConversations: conversations.filter(c => c.status === 'active').length,
        resolvedTickets: resolvedTickets.length,
        averageResponseTime: 0, // À calculer depuis les logs
        satisfactionRate: Math.round(avgSatisfaction * 20), // Convertir en pourcentage
        topCategories
      };
    } catch (error) {
      return {
        totalConversations: 0,
        activeConversations: 0,
        resolvedTickets: 0,
        averageResponseTime: 0,
        satisfactionRate: 0,
        topCategories: []
      };
    }
  }

  /** Récupère les réponses rapides */
  static async getQuickResponses(): Promise<QuickResponse[]> {
    try {
      const { data, error } = await supabase
        .from('quick_responses')
        .select('*')
        .order('use_count', { ascending: false });

      if (error) throw error;

      return (data || []).map(r => ({
        id: r.id,
        trigger: r.trigger,
        response: r.response,
        category: r.category,
        useCount: r.use_count || 0
      }));
    } catch (error) {
      return [];
    }
  }

  /** Exporte l'historique des conversations */
  static async exportConversationHistory(): Promise<string> {
    const conversations = await this.getConversations();
    let csv = 'ID,Type,Title,Messages,Status,Created\n';

    for (const conv of conversations) {
      csv += `${conv.id},${conv.type},"${conv.title}",${conv.messageCount},${conv.status},${conv.lastMessageAt?.toISOString() || ''}\n`;
    }

    return csv;
  }
}

export const getSupportResponse = ChatService.getSupportResponse.bind(ChatService);
export const createSupportTicket = ChatService.createSupportTicket.bind(ChatService);
export const getFAQ = ChatService.getFAQ.bind(ChatService);