/**
 * Service pour la gestion des tags tendance
 */

import { supabase } from '@/integrations/supabase/client';

export interface TrendingTag {
  id: string;
  tag: string;
  usage_count: number;
  last_used_at: string;
  created_at: string;
}

export class CommunityTrendingService {
  /**
   * Récupérer les tags tendance
   */
  static async getTrendingTags(limit: number = 10): Promise<TrendingTag[]> {
    const { data, error } = await supabase
      .from('community_trending_tags')
      .select('*')
      .order('usage_count', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Incrémenter l'usage d'un tag
   */
  static async incrementTagUsage(tag: string): Promise<void> {
    // Check if tag exists
    const { data: existing } = await supabase
      .from('community_trending_tags')
      .select('id, usage_count')
      .eq('tag', tag.toLowerCase())
      .maybeSingle();

    if (existing) {
      // Update existing tag
      await supabase
        .from('community_trending_tags')
        .update({
          usage_count: existing.usage_count + 1,
          last_used_at: new Date().toISOString()
        })
        .eq('id', existing.id);
    } else {
      // Create new tag
      await supabase
        .from('community_trending_tags')
        .insert({
          tag: tag.toLowerCase(),
          usage_count: 1,
          last_used_at: new Date().toISOString()
        });
    }
  }

  /**
   * Batch update tags from a post
   */
  static async updateTagsFromPost(tags: string[]): Promise<void> {
    for (const tag of tags) {
      await this.incrementTagUsage(tag);
    }
  }
}
