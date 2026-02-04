/**
 * FeedbackCollector - Système de collecte de feedback utilisateur
 * Permet de recueillir des retours détaillés avec catégorisation
 */

import React, { useState, memo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  MessageSquare, Star, ThumbsUp, ThumbsDown, 
  Bug, Lightbulb, Heart, Send, CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface FeedbackType {
  id: string;
  label: string;
  icon: typeof Bug;
  color: string;
}

const FEEDBACK_TYPES: FeedbackType[] = [
  { id: 'bug', label: 'Signaler un bug', icon: Bug, color: 'bg-red-500' },
  { id: 'feature', label: 'Suggestion', icon: Lightbulb, color: 'bg-yellow-500' },
  { id: 'praise', label: 'Compliment', icon: Heart, color: 'bg-pink-500' },
  { id: 'other', label: 'Autre', icon: MessageSquare, color: 'bg-blue-500' },
];

const FeedbackCollector: React.FC = memo(() => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!selectedType || !message.trim()) {
      toast({
        title: 'Informations manquantes',
        description: 'Veuillez sélectionner un type et écrire un message',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('user_feedback')
        .insert({
          user_id: user?.id || null,
          feedback_type: selectedType,
          rating: rating || null,
          message: message.trim(),
          page_url: window.location.href,
          user_agent: navigator.userAgent,
        });

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: 'Merci pour votre feedback !',
        description: 'Votre retour nous aide à améliorer EmotionsCare'
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'envoyer le feedback. Réessayez.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedType, rating, message, user?.id, toast]);

  const resetForm = useCallback(() => {
    setSelectedType(null);
    setRating(0);
    setMessage('');
    setIsSubmitted(false);
  }, []);

  if (isSubmitted) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="inline-flex p-4 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Merci !</h3>
            <p className="text-muted-foreground mb-6">
              Votre feedback a été envoyé avec succès.
            </p>
            <Button variant="outline" onClick={resetForm}>
              Envoyer un autre feedback
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Donnez votre avis
        </CardTitle>
        <CardDescription>
          Aidez-nous à améliorer EmotionsCare
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Feedback Type Selection */}
        <div>
          <Label className="mb-3 block">Type de feedback</Label>
          <div className="grid grid-cols-2 gap-2">
            {FEEDBACK_TYPES.map(type => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    isSelected 
                      ? 'border-primary bg-primary/10' 
                      : 'border-muted hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded ${type.color}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">{type.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Rating */}
        <div>
          <Label className="mb-3 block">Note globale (optionnel)</Label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="p-1 transition-transform hover:scale-110"
                aria-label={`Note ${star} sur 5`}
              >
                <Star 
                  className={`h-8 w-8 ${
                    star <= rating 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-muted-foreground'
                  }`} 
                />
              </button>
            ))}
          </div>
        </div>

        {/* Quick Reactions */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Réaction rapide :</span>
          <div className="flex gap-2">
            <Button
              variant={rating >= 4 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRating(5)}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              J'aime
            </Button>
            <Button
              variant={rating <= 2 && rating > 0 ? 'destructive' : 'outline'}
              size="sm"
              onClick={() => setRating(2)}
            >
              <ThumbsDown className="h-4 w-4 mr-1" />
              À améliorer
            </Button>
          </div>
        </div>

        {/* Message */}
        <div>
          <Label htmlFor="feedback-message" className="mb-2 block">
            Votre message
          </Label>
          <Textarea
            id="feedback-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Décrivez votre feedback en détail..."
            rows={4}
            maxLength={1000}
          />
          <div className="text-xs text-muted-foreground text-right mt-1">
            {message.length}/1000
          </div>
        </div>

        {/* Context Info */}
        <div className="p-3 bg-muted/30 rounded-lg text-xs text-muted-foreground">
          <p>Informations collectées : page actuelle, navigateur</p>
          <p>Aucune donnée personnelle sensible n'est partagée.</p>
        </div>

        {/* Submit */}
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting || !selectedType || !message.trim()}
          className="w-full"
        >
          {isSubmitting ? (
            'Envoi en cours...'
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Envoyer le feedback
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
});

FeedbackCollector.displayName = 'FeedbackCollector';

export default FeedbackCollector;
