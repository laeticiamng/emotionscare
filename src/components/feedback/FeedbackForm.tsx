
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Camera, Mic, Star, Send, Bug, Lightbulb, Heart, Plus } from 'lucide-react';
import { FeedbackEntry } from '@/types/feedback';
import { toast } from '@/hooks/use-toast';

interface FeedbackFormProps {
  onSubmit: (feedback: Partial<FeedbackEntry>) => void;
  module: string;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmit, module }) => {
  const [feedback, setFeedback] = useState<Partial<FeedbackEntry>>({
    module,
    type: 'suggestion',
    rating: 5,
    title: '',
    description: '',
    priority: 'medium',
    tags: []
  });

  const [isRecording, setIsRecording] = useState(false);
  const [newTag, setNewTag] = useState('');

  const feedbackTypes = [
    { value: 'bug', label: 'Bug Report', icon: Bug, color: 'text-red-500' },
    { value: 'suggestion', label: 'Suggestion', icon: Lightbulb, color: 'text-yellow-500' },
    { value: 'compliment', label: 'Compliment', icon: Heart, color: 'text-green-500' },
    { value: 'feature_request', label: 'Feature Request', icon: Plus, color: 'text-blue-500' }
  ];

  const priorities = [
    { value: 'low', label: 'Basse', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Moyenne', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'Haute', color: 'bg-orange-100 text-orange-800' },
    { value: 'critical', label: 'Critique', color: 'bg-red-100 text-red-800' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.title || !feedback.description) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    onSubmit({
      ...feedback,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'pending'
    });

    toast({
      title: "Feedback envoyé",
      description: "Merci pour votre retour ! Notre équipe va l'examiner.",
    });

    // Reset form
    setFeedback({
      module,
      type: 'suggestion',
      rating: 5,
      title: '',
      description: '',
      priority: 'medium',
      tags: []
    });
  };

  const addTag = () => {
    if (newTag && !feedback.tags?.includes(newTag)) {
      setFeedback(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFeedback(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Ici on pourrait implémenter l'enregistrement audio
    toast({
      title: isRecording ? "Enregistrement arrêté" : "Enregistrement démarré",
      description: isRecording ? "Audio sauvegardé" : "Commencez à parler...",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Partager votre feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type de feedback */}
            <div>
              <label className="text-sm font-medium mb-2 block">Type de feedback</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {feedbackTypes.map((type) => (
                  <motion.button
                    key={type.value}
                    type="button"
                    onClick={() => setFeedback(prev => ({ ...prev, type: type.value as any }))}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      feedback.type === type.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <type.icon className={`h-5 w-5 mx-auto mb-1 ${type.color}`} />
                    <div className="text-xs font-medium">{type.label}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="text-sm font-medium mb-2 block">Note globale</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    onClick={() => setFeedback(prev => ({ ...prev, rating: star }))}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= (feedback.rating || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Titre */}
            <div>
              <label className="text-sm font-medium mb-2 block">Titre *</label>
              <Input
                value={feedback.title}
                onChange={(e) => setFeedback(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Résumé de votre feedback"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium mb-2 block">Description *</label>
              <Textarea
                value={feedback.description}
                onChange={(e) => setFeedback(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Décrivez votre expérience en détail..."
                rows={4}
                required
              />
            </div>

            {/* Priorité */}
            <div>
              <label className="text-sm font-medium mb-2 block">Priorité</label>
              <Select
                value={feedback.priority}
                onValueChange={(value: any) => setFeedback(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      <Badge className={priority.color}>
                        {priority.label}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div>
              <label className="text-sm font-medium mb-2 block">Tags</label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Ajouter un tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {feedback.tags?.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => removeTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            </div>

            {/* Actions multimédias */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={toggleRecording}
                className={isRecording ? 'bg-red-50 border-red-200' : ''}
              >
                <Mic className={`h-4 w-4 mr-2 ${isRecording ? 'text-red-500' : ''}`} />
                {isRecording ? 'Arrêter' : 'Enregistrer'}
              </Button>
              <Button type="button" variant="outline">
                <Camera className="h-4 w-4 mr-2" />
                Capture d'écran
              </Button>
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Envoyer le feedback
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FeedbackForm;
