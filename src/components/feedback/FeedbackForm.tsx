
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Star, Camera, Mic, Send, Heart } from 'lucide-react';
import { toast } from 'sonner';

interface FeedbackFormProps {
  module?: string;
  onSubmit?: (feedback: any) => void;
  className?: string;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ 
  module = 'general', 
  onSubmit,
  className = '' 
}) => {
  const [feedback, setFeedback] = useState({
    type: '',
    rating: 0,
    title: '',
    description: '',
    emotion_context: '',
    tags: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feedbackTypes = [
    { value: 'bug', label: 'Signaler un bug', icon: '🐛' },
    { value: 'suggestion', label: 'Suggestion d\'amélioration', icon: '💡' },
    { value: 'compliment', label: 'Compliment', icon: '👏' },
    { value: 'feature_request', label: 'Demande de fonctionnalité', icon: '✨' }
  ];

  const handleRatingClick = (rating: number) => {
    setFeedback(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.type || !feedback.title || feedback.rating === 0) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);
    try {
      const feedbackData = {
        ...feedback,
        module,
        id: crypto.randomUUID(),
        user_id: 'current_user', // À remplacer par l'ID utilisateur réel
        priority: feedback.rating <= 2 ? 'high' : feedback.rating <= 3 ? 'medium' : 'low',
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Simulation d'envoi - à remplacer par un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSubmit?.(feedbackData);
      toast.success('Merci pour votre feedback ! 🙏');
      
      // Réinitialiser le formulaire
      setFeedback({
        type: '',
        rating: 0,
        title: '',
        description: '',
        emotion_context: '',
        tags: []
      });
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Heart className="h-5 w-5" />
            Partagez votre expérience
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Votre feedback nous aide à améliorer continuellement EmotionsCare
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type de feedback */}
            <div className="space-y-2">
              <Label>Type de feedback *</Label>
              <Select 
                value={feedback.type} 
                onValueChange={(value) => setFeedback(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le type..." />
                </SelectTrigger>
                <SelectContent>
                  {feedbackTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <span className="flex items-center gap-2">
                        <span>{type.icon}</span>
                        {type.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Évaluation par étoiles */}
            <div className="space-y-2">
              <Label>Évaluation globale *</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRatingClick(star)}
                    className={`p-1 rounded transition-colors ${
                      star <= feedback.rating 
                        ? 'text-yellow-500' 
                        : 'text-gray-300 hover:text-yellow-400'
                    }`}
                  >
                    <Star className="h-6 w-6 fill-current" />
                  </motion.button>
                ))}
              </div>
              {feedback.rating > 0 && (
                <p className="text-sm text-muted-foreground">
                  {feedback.rating <= 2 && "Nous pouvons mieux faire 😔"}
                  {feedback.rating === 3 && "C'est correct 😐"}
                  {feedback.rating === 4 && "Très bien ! 😊"}
                  {feedback.rating === 5 && "Excellent ! 🎉"}
                </p>
              )}
            </div>

            {/* Titre */}
            <div className="space-y-2">
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={feedback.title}
                onChange={(e) => setFeedback(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Résumez votre feedback en quelques mots..."
                className="border-blue-200 focus:border-blue-400"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description détaillée</Label>
              <Textarea
                id="description"
                value={feedback.description}
                onChange={(e) => setFeedback(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Décrivez votre expérience, ce qui fonctionne bien ou pourrait être amélioré..."
                rows={4}
                className="border-blue-200 focus:border-blue-400"
              />
            </div>

            {/* Contexte émotionnel */}
            <div className="space-y-2">
              <Label htmlFor="emotion">Contexte émotionnel (optionnel)</Label>
              <Input
                id="emotion"
                value={feedback.emotion_context}
                onChange={(e) => setFeedback(prev => ({ ...prev, emotion_context: e.target.value }))}
                placeholder="Comment vous sentiez-vous lors de cette expérience ?"
                className="border-blue-200 focus:border-blue-400"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Camera className="h-4 w-4" />
                Capture d'écran
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Mic className="h-4 w-4" />
                Note vocale
              </Button>
            </div>

            {/* Module info */}
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Module: {module}</Badge>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting || !feedback.type || !feedback.title || feedback.rating === 0}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Envoi en cours...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Envoyer le feedback
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FeedbackForm;
