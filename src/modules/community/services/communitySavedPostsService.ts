/**
 * Service pour la gestion des posts sauvegardés
 */

import { supabase } from '@/integrations/supabase/client';

export interface SavedPost {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}

export class CommunitySavedPostsService {
  /**
   * Sauvegarder un post
   */
  static async savePost(postId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('community_saved_posts')
      .insert({
        user_id: user.id,
        post_id: postId
      });

    if (error) throw error;
  }

  /**
   * Retirer un post des favoris
   */
  static async unsavePost(postId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('community_saved_posts')
      .delete()
      .eq('user_id', user.id)
      .eq('post_id', postId);

    if (error) throw error;
  }

  /**
   * Vérifier si un post est sauvegardé
   */
  static async isPostSaved(postId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('community_saved_posts')
      .select('id')
      .eq('user_id', user.id)
      .eq('post_id', postId)
      .maybeSingle();

    if (error) return false;
    return !!data;
  }

  /**
   * Récupérer tous les posts sauvegardés
   */
  static async getSavedPosts(): Promise<string[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('community_saved_posts')
      .select('post_id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(item => item.post_id);
  }

  /**
   * Toggle sauvegarde d'un post
   */
  static async toggleSavePost(postId: string): Promise<boolean> {
    const isSaved = await this.isPostSaved(postId);
    
    if (isSaved) {
      await this.unsavePost(postId);
      return false;
    } else {
      await this.savePost(postId);
      return true;
    }
  }
}
