/**
 * Hook pour la gestion des commentaires
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  likes_count: number;
  is_empathy_template?: boolean;
  created_at: string;
  author?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface UseCommunityCommentsReturn {
  comments: Comment[];
  loading: boolean;
  error: Error | null;
  loadComments: (postId: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  deleteComment: (commentId: string, postId: string) => Promise<void>;
  likeComment: (commentId: string) => Promise<void>;
}

export function useCommunityComments(): UseCommunityCommentsReturn {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const loadComments = useCallback(async (postId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from('community_comments')
        .select('*, profiles!community_comments_author_id_fkey(full_name, avatar_url)')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (queryError) throw queryError;

      setComments((data || []).map(c => ({
        ...c,
        author: c.profiles
      })));
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addComment = useCallback(async (postId: string, content: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data, error } = await supabase
        .from('community_comments')
        .insert({
          post_id: postId,
          author_id: user.id,
          content,
          likes_count: 0
        })
        .select()
        .single();

      if (error) throw error;

      // Incrémenter le compteur de commentaires du post
      await supabase.rpc('increment_post_comments', { post_id: postId });

      setComments(prev => [...prev, data]);

      toast({
        title: 'Commentaire ajouté',
        description: 'Votre commentaire a été publié.'
      });
    } catch (err) {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter le commentaire.',
        variant: 'destructive'
      });
    }
  }, [toast]);

  const deleteComment = useCallback(async (commentId: string, postId: string) => {
    try {
      const { error } = await supabase
        .from('community_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      await supabase.rpc('decrement_post_comments', { post_id: postId });

      setComments(prev => prev.filter(c => c.id !== commentId));

      toast({
        title: 'Commentaire supprimé',
        description: 'Le commentaire a été supprimé.'
      });
    } catch (err) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le commentaire.',
        variant: 'destructive'
      });
    }
  }, [toast]);

  const likeComment = useCallback(async (commentId: string) => {
    try {
      await supabase.rpc('increment_comment_likes', { comment_id: commentId });

      setComments(prev => prev.map(c =>
        c.id === commentId ? { ...c, likes_count: c.likes_count + 1 } : c
      ));
    } catch (err) {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter la réaction.',
        variant: 'destructive'
      });
    }
  }, [toast]);

  return {
    comments,
    loading,
    error,
    loadComments,
    addComment,
    deleteComment,
    likeComment
  };
}
