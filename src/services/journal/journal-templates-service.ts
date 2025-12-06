/**
 * Service de templates de journal - Templates pré-configurés et personnalisés
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { journalService } from '@/modules/journal/journalService';

export interface JournalPrompt {
  id: string;
  question: string;
  type: 'text' | 'textarea' | 'number' | 'slider' | 'mood_scale' | 'yes_no' | 'select' | 'multi_choice' | 'checklist';
  scale?: number;
  min?: number;
  max?: number;
  options?: string[];
}

export interface JournalTemplate {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category: 'gratitude' | 'mood' | 'goals' | 'reflection' | 'wellness' | 'custom';
  icon?: string;
  color?: string;
  prompts: JournalPrompt[];
  tags: string[];
  isSystem: boolean;
  userId?: string;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface JournalTemplateEntry {
  id: string;
  userId: string;
  templateId?: string;
  journalNoteId?: string;
  responses: Record<string, any>;
  completionPercentage: number;
  moodScore?: number;
  createdAt: string;
  updatedAt: string;
  template?: JournalTemplate;
}

export interface JournalHabit {
  id: string;
  userId: string;
  templateId: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  preferredTime?: string;
  reminderEnabled: boolean;
  lastEntryAt?: string;
  currentStreak: number;
  longestStreak: number;
  totalEntries: number;
  createdAt: string;
  template?: JournalTemplate;
}

class JournalTemplatesService {
  // ============================================
  // TEMPLATES
  // ============================================

  /**
   * Récupérer tous les templates disponibles
   */
  async getTemplates(category?: JournalTemplate['category']): Promise<JournalTemplate[]> {
    let query = supabase
      .from('journal_templates')
      .select('*')
      .eq('is_active', true)
      .order('usage_count', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      logger.error('Failed to get journal templates', error, 'JOURNAL');
      return [];
    }

    return (data || []).map(this.mapToTemplate);
  }

  /**
   * Récupérer un template par slug
   */
  async getTemplateBySlug(slug: string): Promise<JournalTemplate | null> {
    const { data, error } = await supabase
      .from('journal_templates')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) return null;

    return this.mapToTemplate(data);
  }

  /**
   * Créer un template personnalisé
   */
  async createCustomTemplate(
    name: string,
    category: JournalTemplate['category'],
    prompts: JournalPrompt[],
    options: {
      description?: string;
      icon?: string;
      color?: string;
      tags?: string[];
    } = {}
  ): Promise<JournalTemplate> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const slug = `custom-${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

    const { data, error } = await supabase
      .from('journal_templates')
      .insert({
        name,
        slug,
        description: options.description,
        category,
        icon: options.icon,
        color: options.color,
        prompts,
        tags: options.tags || [],
        is_system: false,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;

    logger.info('Custom template created', { templateId: data.id }, 'JOURNAL');
    return this.mapToTemplate(data);
  }

  /**
   * Mettre à jour un template personnalisé
   */
  async updateTemplate(
    templateId: string,
    updates: Partial<JournalTemplate>
  ): Promise<JournalTemplate> {
    const { data, error } = await supabase
      .from('journal_templates')
      .update({
        name: updates.name,
        description: updates.description,
        icon: updates.icon,
        color: updates.color,
        prompts: updates.prompts,
        tags: updates.tags,
        is_active: updates.isActive,
        updated_at: new Date().toISOString()
      })
      .eq('id', templateId)
      .select()
      .single();

    if (error) throw error;

    return this.mapToTemplate(data);
  }

  /**
   * Supprimer un template personnalisé
   */
  async deleteTemplate(templateId: string): Promise<void> {
    const { error } = await supabase
      .from('journal_templates')
      .delete()
      .eq('id', templateId);

    if (error) throw error;

    logger.info('Template deleted', { templateId }, 'JOURNAL');
  }

  // ============================================
  // ENTRÉES BASÉES SUR TEMPLATES
  // ============================================

  /**
   * Créer une entrée basée sur un template
   */
  async createTemplateEntry(
    templateId: string,
    responses: Record<string, any>,
    moodScore?: number
  ): Promise<JournalTemplateEntry> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Calculer le pourcentage de complétion
    const template = await this.getTemplateById(templateId);
    const completionPercentage = template
      ? this.calculateCompletionPercentage(template, responses)
      : 0;

    // Créer également une note de journal standard
    const journalNote = await journalService.createTextEntry({
      text: this.formatResponsesToText(responses),
      tags: template?.tags || []
    });

    const { data, error } = await supabase
      .from('journal_template_entries')
      .insert({
        user_id: user.id,
        template_id: templateId,
        journal_note_id: journalNote?.id || null,
        responses,
        completion_percentage: completionPercentage,
        mood_score: moodScore
      })
      .select()
      .single();

    if (error) throw error;

    logger.info('Template entry created', { entryId: data.id }, 'JOURNAL');
    return this.mapToTemplateEntry(data);
  }

  /**
   * Mettre à jour une entrée template
   */
  async updateTemplateEntry(
    entryId: string,
    responses: Record<string, any>,
    moodScore?: number
  ): Promise<JournalTemplateEntry> {
    const { data: entry } = await supabase
      .from('journal_template_entries')
      .select('template_id')
      .eq('id', entryId)
      .single();

    const template = entry?.template_id
      ? await this.getTemplateById(entry.template_id)
      : null;

    const completionPercentage = template
      ? this.calculateCompletionPercentage(template, responses)
      : 0;

    const { data, error } = await supabase
      .from('journal_template_entries')
      .update({
        responses,
        completion_percentage: completionPercentage,
        mood_score: moodScore,
        updated_at: new Date().toISOString()
      })
      .eq('id', entryId)
      .select()
      .single();

    if (error) throw error;

    return this.mapToTemplateEntry(data);
  }

  /**
   * Récupérer les entrées d'un template
   */
  async getTemplateEntries(
    templateId?: string,
    limit = 50
  ): Promise<JournalTemplateEntry[]> {
    let query = supabase
      .from('journal_template_entries')
      .select('*, journal_templates(*)')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (templateId) {
      query = query.eq('template_id', templateId);
    }

    const { data, error } = await query;

    if (error) {
      logger.error('Failed to get template entries', error, 'JOURNAL');
      return [];
    }

    return (data || []).map(entry => ({
      ...this.mapToTemplateEntry(entry),
      template: entry.journal_templates ? this.mapToTemplate(entry.journal_templates) : undefined
    }));
  }

  /**
   * Récupérer une entrée par ID
   */
  async getTemplateEntry(entryId: string): Promise<JournalTemplateEntry | null> {
    const { data, error } = await supabase
      .from('journal_template_entries')
      .select('*, journal_templates(*)')
      .eq('id', entryId)
      .single();

    if (error) return null;

    return {
      ...this.mapToTemplateEntry(data),
      template: data.journal_templates ? this.mapToTemplate(data.journal_templates) : undefined
    };
  }

  // ============================================
  // HABITUDES
  // ============================================

  /**
   * Créer une habitude de journal
   */
  async createHabit(
    templateId: string,
    frequency: JournalHabit['frequency'],
    options: {
      preferredTime?: string;
      reminderEnabled?: boolean;
    } = {}
  ): Promise<JournalHabit> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('journal_habits')
      .insert({
        user_id: user.id,
        template_id: templateId,
        frequency,
        preferred_time: options.preferredTime,
        reminder_enabled: options.reminderEnabled || false
      })
      .select()
      .single();

    if (error) throw error;

    logger.info('Journal habit created', { habitId: data.id }, 'JOURNAL');
    return this.mapToHabit(data);
  }

  /**
   * Récupérer les habitudes de l'utilisateur
   */
  async getHabits(): Promise<JournalHabit[]> {
    const { data, error } = await supabase
      .from('journal_habits')
      .select('*, journal_templates(*)')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Failed to get journal habits', error, 'JOURNAL');
      return [];
    }

    return (data || []).map(habit => ({
      ...this.mapToHabit(habit),
      template: habit.journal_templates ? this.mapToTemplate(habit.journal_templates) : undefined
    }));
  }

  /**
   * Mettre à jour une habitude
   */
  async updateHabit(
    habitId: string,
    updates: Partial<JournalHabit>
  ): Promise<JournalHabit> {
    const { data, error } = await supabase
      .from('journal_habits')
      .update({
        frequency: updates.frequency,
        preferred_time: updates.preferredTime,
        reminder_enabled: updates.reminderEnabled
      })
      .eq('id', habitId)
      .select()
      .single();

    if (error) throw error;

    return this.mapToHabit(data);
  }

  /**
   * Supprimer une habitude
   */
  async deleteHabit(habitId: string): Promise<void> {
    const { error } = await supabase
      .from('journal_habits')
      .delete()
      .eq('id', habitId);

    if (error) throw error;

    logger.info('Journal habit deleted', { habitId }, 'JOURNAL');
  }

  // ============================================
  // STATISTIQUES
  // ============================================

  /**
   * Récupérer les statistiques de journaling
   */
  async getJournalingStats(): Promise<{
    totalEntries: number;
    currentStreak: number;
    longestStreak: number;
    favoriteTemplate?: JournalTemplate;
    completionRate: number;
  }> {
    const habits = await this.getHabits();
    const entries = await this.getTemplateEntries(undefined, 100);

    const totalEntries = habits.reduce((sum, h) => sum + h.totalEntries, 0);
    const currentStreak = Math.max(...habits.map(h => h.currentStreak), 0);
    const longestStreak = Math.max(...habits.map(h => h.longestStreak), 0);

    // Trouver le template favori
    const templateUsage = new Map<string, number>();
    entries.forEach(entry => {
      if (entry.templateId) {
        templateUsage.set(entry.templateId, (templateUsage.get(entry.templateId) || 0) + 1);
      }
    });

    let favoriteTemplateId: string | undefined;
    let maxUsage = 0;
    templateUsage.forEach((count, templateId) => {
      if (count > maxUsage) {
        maxUsage = count;
        favoriteTemplateId = templateId;
      }
    });

    const favoriteTemplate = favoriteTemplateId
      ? await this.getTemplateById(favoriteTemplateId)
      : undefined;

    const avgCompletion = entries.length > 0
      ? entries.reduce((sum, e) => sum + e.completionPercentage, 0) / entries.length
      : 0;

    return {
      totalEntries,
      currentStreak,
      longestStreak,
      favoriteTemplate: favoriteTemplate || undefined,
      completionRate: avgCompletion
    };
  }

  // ============================================
  // HELPERS
  // ============================================

  private async getTemplateById(id: string): Promise<JournalTemplate | null> {
    const { data, error } = await supabase
      .from('journal_templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;

    return this.mapToTemplate(data);
  }

  private calculateCompletionPercentage(
    template: JournalTemplate,
    responses: Record<string, any>
  ): number {
    const totalPrompts = template.prompts.length;
    if (totalPrompts === 0) return 100;

    const answeredPrompts = template.prompts.filter(prompt => {
      const answer = responses[prompt.id];
      return answer !== undefined && answer !== null && answer !== '';
    }).length;

    return Math.round((answeredPrompts / totalPrompts) * 100);
  }

  private formatResponsesToText(responses: Record<string, any>): string {
    return Object.entries(responses)
      .map(([key, value]) => {
        if (typeof value === 'object') {
          return `${key}: ${JSON.stringify(value)}`;
        }
        return `${key}: ${value}`;
      })
      .join('\n');
  }

  private mapToTemplate(data: any): JournalTemplate {
    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      category: data.category,
      icon: data.icon,
      color: data.color,
      prompts: data.prompts || [],
      tags: data.tags || [],
      isSystem: data.is_system,
      userId: data.user_id,
      isActive: data.is_active,
      usageCount: data.usage_count,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  private mapToTemplateEntry(data: any): JournalTemplateEntry {
    return {
      id: data.id,
      userId: data.user_id,
      templateId: data.template_id,
      journalNoteId: data.journal_note_id,
      responses: data.responses || {},
      completionPercentage: data.completion_percentage,
      moodScore: data.mood_score,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  private mapToHabit(data: any): JournalHabit {
    return {
      id: data.id,
      userId: data.user_id,
      templateId: data.template_id,
      frequency: data.frequency,
      preferredTime: data.preferred_time,
      reminderEnabled: data.reminder_enabled,
      lastEntryAt: data.last_entry_at,
      currentStreak: data.current_streak,
      longestStreak: data.longest_streak,
      totalEntries: data.total_entries,
      createdAt: data.created_at
    };
  }
}

export const journalTemplatesService = new JournalTemplatesService();
