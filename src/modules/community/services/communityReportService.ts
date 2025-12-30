/**
 * Service pour la gestion des signalements
 */

import { supabase } from '@/integrations/supabase/client';

export interface CommunityReport {
  id: string;
  reporter_id: string;
  reported_user_id?: string;
  post_id?: string;
  comment_id?: string;
  reason: string;
  description?: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
  resolved_by?: string;
  resolved_at?: string;
  resolution_notes?: string;
  created_at: string;
}

export type ReportReason = 
  | 'spam' 
  | 'harassment' 
  | 'hate_speech' 
  | 'misinformation' 
  | 'inappropriate_content'
  | 'privacy_violation'
  | 'self_harm'
  | 'other';

export const REPORT_REASONS: { value: ReportReason; label: string }[] = [
  { value: 'spam', label: 'Spam ou publicité' },
  { value: 'harassment', label: 'Harcèlement ou intimidation' },
  { value: 'hate_speech', label: 'Discours haineux' },
  { value: 'misinformation', label: 'Information trompeuse' },
  { value: 'inappropriate_content', label: 'Contenu inapproprié' },
  { value: 'privacy_violation', label: 'Atteinte à la vie privée' },
  { value: 'self_harm', label: 'Contenu auto-destructeur' },
  { value: 'other', label: 'Autre raison' }
];

export class CommunityReportService {
  /**
   * Signaler un post
   */
  static async reportPost(postId: string, reason: ReportReason, description?: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('community_reports')
      .insert({
        reporter_id: user.id,
        post_id: postId,
        reason,
        description
      });

    if (error) throw error;
  }

  /**
   * Signaler un commentaire
   */
  static async reportComment(commentId: string, reason: ReportReason, description?: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('community_reports')
      .insert({
        reporter_id: user.id,
        comment_id: commentId,
        reason,
        description
      });

    if (error) throw error;
  }

  /**
   * Signaler un utilisateur
   */
  static async reportUser(userId: string, reason: ReportReason, description?: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('community_reports')
      .insert({
        reporter_id: user.id,
        reported_user_id: userId,
        reason,
        description
      });

    if (error) throw error;
  }

  /**
   * Récupérer mes signalements
   */
  static async getMyReports(): Promise<CommunityReport[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('community_reports')
      .select('*')
      .eq('reporter_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}
