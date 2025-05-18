import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FeedbackService } from '@/lib/feedback-service';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface FeedbackFormProps {
  module?: string;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ module = 'general' }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({ title: 'Merci de sélectionner une note' });
      return;
    }
    setSubmitting(true);
    try {
      await FeedbackService.addFeedback({
        module,
        rating,
        comment: comment.trim() || undefined,
        userId: user?.id
      });
      setComment('');
      setRating(0);
      toast({ title: 'Feedback enregistré', description: "Merci pour votre retour" });
    } catch (error) {
      toast({ title: 'Erreur', description: 'Impossible denvoyer le feedback', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 cursor-pointer ${i < rating ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`}
            onClick={() => setRating(i + 1)}
          />
        ))}
      </div>
      <Textarea
        placeholder="Votre commentaire"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Button onClick={handleSubmit} disabled={submitting} className="flex items-center gap-2">
        <Send className="h-4 w-4" /> Envoyer
      </Button>
    </div>
  );
};

export default FeedbackForm;
