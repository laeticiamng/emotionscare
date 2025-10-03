import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { createComment } from '@/lib/communityService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CommentFormProps {
  postId: string;
  onCommentAdded?: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour commenter",
        variant: "destructive"
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Erreur",
        description: "Le commentaire ne peut pas être vide",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await createComment({
        content: content.trim(),
        postId,
        userId: user.id
      });

      toast({
        title: "Succès",
        description: "Votre commentaire a été ajouté"
      });

      setContent('');
      
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      // Comment posting error
      toast({
        title: "Erreur",
        description: "Impossible de poster votre commentaire",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Partagez votre réaction..."
        className="mb-2 min-h-[80px]"
        disabled={isSubmitting || !user}
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting || !content.trim() || !user}
          size="sm"
        >
          {isSubmitting ? 'Envoi...' : 'Commenter'}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
