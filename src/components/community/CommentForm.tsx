
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { createComment } from '@/lib/communityService';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface CommentFormProps {
  postId: string;
  commentText: string;
  setCommentText: (text: string) => void;
  onCommentAdded: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ 
  postId, 
  commentText, 
  setCommentText,
  onCommentAdded 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleComment = async () => {
    if (!user) {
      toast({
        title: "Non connecté",
        description: "Vous devez être connecté pour commenter",
        variant: "destructive"
      });
      return;
    }
    
    if (!commentText?.trim()) {
      toast({
        title: "Commentaire vide",
        description: "Veuillez écrire quelque chose avant de commenter",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await createComment(postId, user.id, commentText, false);
      setCommentText('');
      onCommentAdded();
      toast({
        title: "Succès",
        description: "Votre commentaire a été publié"
      });
    } catch (error) {
      console.error('Error commenting on post:', error);
      toast({
        title: "Erreur",
        description: "Impossible de publier votre commentaire",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-full flex space-x-2">
      <Textarea
        rows={1}
        placeholder="Écrivez un commentaire positif…"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        className="text-sm resize-none"
      />
      <Button
        onClick={handleComment}
        size="sm"
      >
        Commenter
      </Button>
    </div>
  );
};

export default CommentForm;
