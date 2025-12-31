/**
 * PostCommentSection - Section de commentaires pour un post
 * Intègre useCommunityComments avec affichage et formulaire
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Heart, Trash2, Loader, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MentionTextarea } from './MentionTextarea';
import { useCommunityComments, Comment } from '@/hooks/community/useCommunityComments';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';

interface PostCommentSectionProps {
  postId: string;
  initialCount?: number;
  onCommentCountChange?: (count: number) => void;
}

export function PostCommentSection({
  postId,
  initialCount = 0,
  onCommentCountChange
}: PostCommentSectionProps) {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [mentionedUsers, setMentionedUsers] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const {
    comments,
    loading,
    loadComments,
    addComment,
    deleteComment,
    likeComment
  } = useCommunityComments();

  // Load comments when expanded
  useEffect(() => {
    if (isExpanded && comments.length === 0) {
      loadComments(postId);
    }
  }, [isExpanded, postId, loadComments, comments.length]);

  // Notify parent of comment count changes
  useEffect(() => {
    if (onCommentCountChange) {
      onCommentCountChange(comments.length || initialCount);
    }
  }, [comments.length, initialCount, onCommentCountChange]);

  const handleSubmit = async () => {
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    try {
      await addComment(postId, newComment);
      setNewComment('');
      setMentionedUsers([]);
    } finally {
      setSubmitting(false);
    }
  };

  const handleMention = (userId: string) => {
    if (!mentionedUsers.includes(userId)) {
      setMentionedUsers(prev => [...prev, userId]);
    }
  };

  const handleDelete = async (commentId: string) => {
    await deleteComment(commentId, postId);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  };

  const displayCount = comments.length || initialCount;

  return (
    <div className="border-t border-border/50 pt-3 mt-3">
      {/* Toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        aria-expanded={isExpanded}
        aria-label={`${displayCount} commentaires, cliquer pour ${isExpanded ? 'masquer' : 'afficher'}`}
      >
        <MessageCircle className="h-4 w-4" />
        <span>
          {displayCount > 0 
            ? `${displayCount} commentaire${displayCount > 1 ? 's' : ''}`
            : 'Commenter'
          }
        </span>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 pt-4">
              {/* Comment list */}
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : comments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-2">
                  Aucun commentaire pour le moment
                </p>
              ) : (
                <ul className="space-y-3" aria-label="Liste des commentaires">
                  {comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      currentUserId={user?.id}
                      onLike={() => likeComment(comment.id)}
                      onDelete={() => handleDelete(comment.id)}
                    />
                  ))}
                </ul>
              )}

              {/* New comment form */}
              {user && (
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback>
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <MentionTextarea
                      value={newComment}
                      onChange={setNewComment}
                      placeholder="Ajouter un commentaire bienveillant..."
                      onMention={handleMention}
                      minRows={2}
                      className="text-sm"
                    />
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        onClick={handleSubmit}
                        disabled={!newComment.trim() || submitting}
                      >
                        {submitting ? (
                          <Loader className="h-4 w-4 animate-spin mr-1" />
                        ) : (
                          <Send className="h-4 w-4 mr-1" />
                        )}
                        Envoyer
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Comment item component
interface CommentItemProps {
  comment: Comment;
  currentUserId?: string;
  onLike: () => void;
  onDelete: () => void;
}

function CommentItem({ comment, currentUserId, onLike, onDelete }: CommentItemProps) {
  const isOwner = currentUserId === comment.author_id;

  return (
    <motion.li
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 group"
    >
      <Avatar className="h-7 w-7 shrink-0">
        <AvatarImage src={comment.author?.avatar_url} />
        <AvatarFallback className="text-xs">
          {comment.author?.full_name?.charAt(0) || 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="bg-muted/50 rounded-lg px-3 py-2">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-medium">
              {comment.author?.full_name || 'Utilisateur'}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.created_at), {
                addSuffix: true,
                locale: fr
              })}
            </span>
          </div>
          <p className="text-sm whitespace-pre-wrap break-words">
            {comment.content}
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-3 mt-1 ml-1">
          <button
            onClick={onLike}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            aria-label="Aimer ce commentaire"
          >
            <Heart className="h-3 w-3" />
            {comment.likes_count > 0 && <span>{comment.likes_count}</span>}
          </button>
          
          {isOwner && (
            <button
              onClick={onDelete}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Supprimer ce commentaire"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </motion.li>
  );
}

export default PostCommentSection;
