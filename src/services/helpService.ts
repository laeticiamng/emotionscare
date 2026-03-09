
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface HelpSection {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  articleCount?: number;
  order?: number;
}

export interface HelpArticle {
  id: string;
  sectionId: string;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  tags?: string[];
  views?: number;
  helpful?: number;
  notHelpful?: number;
  createdAt: string;
  updatedAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  slug: string;
  category?: string;
}

// Default sections when database is not available
const DEFAULT_SECTIONS: HelpSection[] = [
  { id: '1', name: 'Modules', slug: 'modules', icon: '🧩', description: 'Guide des modules de bien-être', articleCount: 8 },
  { id: '2', name: 'Compte', slug: 'account', icon: '👤', description: 'Gestion de votre compte', articleCount: 5 },
  { id: '3', name: 'RGPD & Données', slug: 'rgpd', icon: '🔒', description: 'Confidentialité et droits', articleCount: 6 },
  { id: '4', name: 'Technique', slug: 'technical', icon: '⚙️', description: 'Questions techniques', articleCount: 4 },
  { id: '5', name: 'Abonnement', slug: 'subscription', icon: '💳', description: 'Facturation et plans', articleCount: 3 },
  { id: '6', name: 'Accessibilité', slug: 'accessibility', icon: '♿', description: 'Fonctions d\'accessibilité', articleCount: 4 }
];

// Default FAQs
const DEFAULT_FAQS: FAQ[] = [
  {
    id: 'faq-1',
    question: 'Comment exporter mes données ?',
    answer: 'Rendez-vous dans Paramètres > Confidentialité > Exporter mes données. Un fichier ZIP contenant toutes vos données vous sera envoyé par e-mail sous 48h.',
    slug: 'export-donnees',
    category: 'rgpd'
  },
  {
    id: 'faq-2',
    question: 'Mes données sont-elles sécurisées ?',
    answer: 'Oui, toutes vos données sont chiffrées en transit (TLS 1.3) et au repos (AES-256). Nous sommes conformes au RGPD et ne partageons jamais vos informations personnelles.',
    slug: 'securite-donnees',
    category: 'rgpd'
  },
  {
    id: 'faq-3',
    question: 'Comment supprimer mon compte ?',
    answer: 'Dans Paramètres > Compte, cliquez sur "Supprimer mon compte". Un délai de 30 jours vous permet d\'annuler si vous changez d\'avis. Toutes vos données seront définitivement effacées après ce délai.',
    slug: 'supprimer-compte',
    category: 'account'
  },
  {
    id: 'faq-4',
    question: 'Les modules VR nécessitent-ils un casque ?',
    answer: 'Non ! Nos expériences VR fonctionnent parfaitement sur ordinateur et mobile, avec des modes d\'immersion adaptés. Un casque VR améliore l\'expérience mais n\'est pas requis.',
    slug: 'vr-sans-casque',
    category: 'modules'
  },
  {
    id: 'faq-5',
    question: 'Comment activer les notifications ?',
    answer: 'Dans Paramètres > Notifications, activez les rappels souhaités. Vous pouvez personnaliser les créneaux horaires et choisir quels types de notifications recevoir.',
    slug: 'activer-notifications',
    category: 'account'
  },
  {
    id: 'faq-6',
    question: 'Le Coach IA est-il un professionnel de santé ?',
    answer: 'Non, le Coach IA est un outil de soutien émotionnel basé sur l\'IA. Il ne remplace pas un professionnel de santé mentale. En cas de détresse, consultez un professionnel.',
    slug: 'coach-ia-limites',
    category: 'modules'
  }
];

class HelpService {
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private cacheTTL = 5 * 60 * 1000; // 5 minutes

  private getCached<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data as T;
    }
    return null;
  }

  private setCache(key: string, data: unknown): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async getSections(): Promise<HelpSection[]> {
    const cached = this.getCached<HelpSection[]>('sections');
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from('help_sections')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        const sections: HelpSection[] = data.map(row => ({
          id: row.id,
          name: row.name,
          slug: row.slug,
          icon: row.icon || '📄',
          description: row.description,
          articleCount: row.article_count,
          order: row.order
        }));
        
        this.setCache('sections', sections);
        return sections;
      }

      return DEFAULT_SECTIONS;
    } catch (err) {
      logger.warn('Failed to fetch help sections, using defaults', { error: err }, 'HELP');
      return DEFAULT_SECTIONS;
    }
  }

  async getArticles(sectionSlug: string, limit = 20): Promise<HelpArticle[]> {
    const cacheKey = `articles:${sectionSlug}`;
    const cached = this.getCached<HelpArticle[]>(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from('help_articles')
        .select('*, help_sections!inner(slug)')
        .eq('help_sections.slug', sectionSlug)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      if (data && data.length > 0) {
        const articles: HelpArticle[] = data.map(row => ({
          id: row.id,
          sectionId: row.section_id,
          title: row.title,
          slug: row.slug,
          content: row.content,
          summary: row.summary,
          tags: row.tags,
          views: row.views,
          helpful: row.helpful,
          notHelpful: row.not_helpful,
          createdAt: row.created_at,
          updatedAt: row.updated_at
        }));
        
        this.setCache(cacheKey, articles);
        return articles;
      }

      return [];
    } catch (err) {
      logger.warn('Failed to fetch help articles', { error: err, section: sectionSlug }, 'HELP');
      return [];
    }
  }

  async getArticle(slug: string): Promise<HelpArticle | null> {
    const cacheKey = `article:${slug}`;
    const cached = this.getCached<HelpArticle>(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from('help_articles')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;

      if (data) {
        // Increment view count
        await supabase
          .from('help_articles')
          .update({ views: (data.views || 0) + 1 })
          .eq('id', data.id);

        const article: HelpArticle = {
          id: data.id,
          sectionId: data.section_id,
          title: data.title,
          slug: data.slug,
          content: data.content,
          summary: data.summary,
          tags: data.tags,
          views: data.views,
          helpful: data.helpful,
          notHelpful: data.not_helpful,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };
        
        this.setCache(cacheKey, article);
        return article;
      }

      return null;
    } catch (err) {
      logger.warn('Failed to fetch help article', { error: err, slug }, 'HELP');
      return null;
    }
  }

  async search(query: string): Promise<HelpArticle[]> {
    if (!query.trim()) return [];

    try {
      const { data, error } = await supabase
        .from('help_articles')
        .select('*')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%,tags.cs.{${query}}`)
        .limit(10);

      if (error) throw error;

      if (data && data.length > 0) {
        return data.map(row => ({
          id: row.id,
          sectionId: row.section_id,
          title: row.title,
          slug: row.slug,
          content: row.content,
          summary: row.summary,
          tags: row.tags,
          views: row.views,
          helpful: row.helpful,
          notHelpful: row.not_helpful,
          createdAt: row.created_at,
          updatedAt: row.updated_at
        }));
      }

      return [];
    } catch (err) {
      logger.warn('Help search failed', { error: err, query }, 'HELP');
      return [];
    }
  }

  async submitFeedback(articleId: string, helpful: boolean): Promise<boolean> {
    try {
      const column = helpful ? 'helpful' : 'not_helpful';
      
      const { data: article } = await supabase
        .from('help_articles')
        .select(column)
        .eq('id', articleId)
        .single();

      if (article) {
        await supabase
          .from('help_articles')
          .update({ [column]: (article[column] || 0) + 1 })
          .eq('id', articleId);
      }

      logger.info('Help feedback submitted', { articleId, helpful }, 'HELP');
      return true;
    } catch (err) {
      logger.error('Failed to submit help feedback', err, 'HELP');
      return false;
    }
  }

  getFAQs(): FAQ[] {
    return DEFAULT_FAQS;
  }

  getTopFAQs(limit = 5): FAQ[] {
    return DEFAULT_FAQS.slice(0, limit);
  }

  clearCache(): void {
    this.cache.clear();
  }

  // ========== MÉTHODES ENRICHIES ==========

  async getPopularArticles(limit: number = 10): Promise<HelpArticle[]> {
    try {
      const { data, error } = await supabase
        .from('help_articles')
        .select('*')
        .order('views', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return ((data as any[]) || []).map(row => ({
        id: row.id,
        sectionId: row.section_id,
        title: row.title,
        slug: row.slug,
        content: row.content,
        summary: row.summary,
        tags: row.tags,
        views: row.views,
        helpful: row.helpful,
        notHelpful: row.not_helpful,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    } catch (err) {
      logger.warn('Failed to fetch popular articles', { error: err }, 'HELP');
      return [];
    }
  }

  getFAQsByCategory(category: string): FAQ[] {
    return DEFAULT_FAQS.filter(faq => faq.category === category);
  }

  async submitSupportTicket(ticket: {
    subject: string;
    description: string;
    category: string;
    priority?: 'low' | 'medium' | 'high';
  }): Promise<{ success: boolean; ticketId?: string; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { success: false, error: 'Non authentifié' };

      const { data, error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user.id,
          subject: ticket.subject,
          description: ticket.description,
          category: ticket.category,
          priority: ticket.priority || 'medium',
          status: 'open',
          created_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (error) throw error;

      logger.info('Support ticket created', { ticketId: (data as any).id }, 'HELP');
      return { success: true, ticketId: (data as any).id };
    } catch (err) {
      logger.error('Failed to submit support ticket', err, 'HELP');
      return { success: false, error: 'Erreur lors de la création du ticket' };
    }
  }

  async getRelatedArticles(articleId: string, limit: number = 5): Promise<HelpArticle[]> {
    try {
      const { data: currentArticle } = await supabase
        .from('help_articles')
        .select('tags, section_id')
        .eq('id', articleId)
        .single();

      if (!currentArticle) return [];

      const { data, error } = await supabase
        .from('help_articles')
        .select('*')
        .neq('id', articleId)
        .eq('section_id', (currentArticle as any).section_id)
        .limit(limit);

      if (error) throw error;

      return ((data as any[]) || []).map(row => ({
        id: row.id,
        sectionId: row.section_id,
        title: row.title,
        slug: row.slug,
        content: row.content,
        summary: row.summary,
        tags: row.tags,
        views: row.views,
        helpful: row.helpful,
        notHelpful: row.not_helpful,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    } catch (err) {
      logger.warn('Failed to fetch related articles', { error: err, articleId }, 'HELP');
      return [];
    }
  }

  async getUserTickets(): Promise<Array<{
    id: string;
    subject: string;
    status: string;
    priority: string;
    createdAt: string;
    updatedAt: string;
  }>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return ((data as any[]) || []).map(ticket => ({
        id: ticket.id,
        subject: ticket.subject,
        status: ticket.status,
        priority: ticket.priority,
        createdAt: ticket.created_at,
        updatedAt: ticket.updated_at
      }));
    } catch (err) {
      logger.warn('Failed to fetch user tickets', { error: err }, 'HELP');
      return [];
    }
  }

  async getHelpStats(): Promise<{
    totalArticles: number;
    totalSections: number;
    totalViews: number;
    avgHelpfulRate: number;
  }> {
    try {
      const { data: articles } = await supabase
        .from('help_articles')
        .select('views, helpful, not_helpful');

      const { count: sectionsCount } = await supabase
        .from('help_sections')
        .select('id', { count: 'exact', head: true });

      if (!articles) {
        return {
          totalArticles: 0,
          totalSections: sectionsCount || DEFAULT_SECTIONS.length,
          totalViews: 0,
          avgHelpfulRate: 0
        };
      }

      const articlesTyped = articles as any[];
      const totalViews = articlesTyped.reduce((sum, a) => sum + (a.views || 0), 0);
      const totalHelpful = articlesTyped.reduce((sum, a) => sum + (a.helpful || 0), 0);
      const totalNotHelpful = articlesTyped.reduce((sum, a) => sum + (a.not_helpful || 0), 0);
      const avgHelpfulRate = totalHelpful + totalNotHelpful > 0
        ? Math.round((totalHelpful / (totalHelpful + totalNotHelpful)) * 100)
        : 0;

      return {
        totalArticles: articlesTyped.length,
        totalSections: sectionsCount || DEFAULT_SECTIONS.length,
        totalViews,
        avgHelpfulRate
      };
    } catch (err) {
      logger.warn('Failed to get help stats', { error: err }, 'HELP');
      return {
        totalArticles: 0,
        totalSections: DEFAULT_SECTIONS.length,
        totalViews: 0,
        avgHelpfulRate: 0
      };
    }
  }

  searchFAQs(query: string): FAQ[] {
    const lowerQuery = query.toLowerCase();
    return DEFAULT_FAQS.filter(faq =>
      faq.question.toLowerCase().includes(lowerQuery) ||
      faq.answer.toLowerCase().includes(lowerQuery)
    );
  }

  async getRecentArticles(limit: number = 5): Promise<HelpArticle[]> {
    try {
      const { data, error } = await supabase
        .from('help_articles')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return ((data as any[]) || []).map(row => ({
        id: row.id,
        sectionId: row.section_id,
        title: row.title,
        slug: row.slug,
        content: row.content,
        summary: row.summary,
        tags: row.tags,
        views: row.views,
        helpful: row.helpful,
        notHelpful: row.not_helpful,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    } catch (err) {
      logger.warn('Failed to fetch recent articles', { error: err }, 'HELP');
      return [];
    }
  }

  getAllFAQCategories(): string[] {
    const categories = new Set<string>();
    DEFAULT_FAQS.forEach(faq => {
      if (faq.category) categories.add(faq.category);
    });
    return Array.from(categories);
  }
}

export const helpService = new HelpService();
export default helpService;
