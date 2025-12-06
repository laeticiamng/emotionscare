import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Camera, Mic, Star, Send, Bug, Lightbulb, Heart, Plus } from 'lucide-react';
import { FeedbackEntry } from '@/types/feedback';
import { toast } from '@/hooks/use-toast';
import { feedbackSchema, type FeedbackInput } from '@/lib/validation/schemas';
import { sanitizeInput } from '@/lib/validation/validator';

interface FeedbackFormProps {
  onSubmit: (feedback: Partial<FeedbackEntry>) => void;
  module: string;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmit, module }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [newTag, setNewTag] = useState('');
  
  const form = useForm<FeedbackInput>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      module,
      type: 'suggestion',
      rating: 5,
      title: '',
      description: '',
      priority: 'medium',
      tags: []
    }
  });

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

  const handleSubmit = (values: FeedbackInput) => {
    // Sanitize text inputs
    const sanitizedData = {
      ...values,
      title: sanitizeInput(values.title),
      description: sanitizeInput(values.description),
      tags: values.tags?.map(tag => sanitizeInput(tag))
    };

    onSubmit({
      ...sanitizedData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'pending'
    });

    toast({
      title: "Feedback envoyé",
      description: "Merci pour votre retour ! Notre équipe va l'examiner.",
    });

    form.reset();
  };

  const addTag = () => {
    const currentTags = form.getValues('tags') || [];
    if (newTag && !currentTags.includes(newTag)) {
      form.setValue('tags', [...currentTags, sanitizeInput(newTag)]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues('tags') || [];
    form.setValue('tags', currentTags.filter(tag => tag !== tagToRemove));
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6" noValidate>
              {/* Type de feedback */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de feedback</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2" role="group" aria-label="Type de feedback">
                      {feedbackTypes.map((type) => (
                        <motion.button
                          key={type.value}
                          type="button"
                          onClick={() => field.onChange(type.value)}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            field.value === type.value
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary/50'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          aria-pressed={field.value === type.value}
                          aria-label={`${type.label}`}
                        >
                          <type.icon className={`h-5 w-5 mx-auto mb-1 ${type.color}`} aria-hidden="true" />
                          <div className="text-xs font-medium">{type.label}</div>
                        </motion.button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Note */}
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note globale</FormLabel>
                    <div className="flex gap-1" role="group" aria-label="Note sur 5 étoiles">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          type="button"
                          onClick={() => field.onChange(star)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          aria-label={`${star} étoile${star > 1 ? 's' : ''}`}
                          aria-pressed={field.value === star}
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= (field.value || 0)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                            aria-hidden="true"
                          />
                        </motion.button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Titre */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="feedback-title">
                      Titre <span className="text-destructive" aria-label="requis">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="feedback-title"
                        placeholder="Résumé de votre feedback"
                        aria-required="true"
                        aria-invalid={!!form.formState.errors.title}
                        aria-describedby={form.formState.errors.title ? "feedback-title-error" : undefined}
                      />
                    </FormControl>
                    <FormMessage id="feedback-title-error" />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="feedback-description">
                      Description <span className="text-destructive" aria-label="requis">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        id="feedback-description"
                        placeholder="Décrivez votre expérience en détail..."
                        rows={4}
                        aria-required="true"
                        aria-invalid={!!form.formState.errors.description}
                        aria-describedby={form.formState.errors.description ? "feedback-description-error" : undefined}
                      />
                    </FormControl>
                    <FormMessage id="feedback-description-error" />
                  </FormItem>
                )}
              />

              {/* Priorité */}
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="feedback-priority">Priorité</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger id="feedback-priority" aria-label="Sélectionner la priorité">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tags */}
              <div>
                <label className="text-sm font-medium mb-2 block">Tags</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Ajouter un tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    aria-label="Nouveau tag"
                  />
                  <Button 
                    type="button" 
                    onClick={addTag} 
                    size="sm"
                    aria-label="Ajouter le tag"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2" role="list" aria-label="Tags sélectionnés">
                  {form.watch('tags')?.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeTag(tag)}
                      role="listitem"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          removeTag(tag);
                        }
                      }}
                      aria-label={`Supprimer le tag ${tag}`}
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
                  aria-label={isRecording ? "Arrêter l'enregistrement" : "Démarrer l'enregistrement"}
                  aria-pressed={isRecording}
                >
                  <Mic className={`h-4 w-4 mr-2 ${isRecording ? 'text-red-500' : ''}`} aria-hidden="true" />
                  {isRecording ? 'Arrêter' : 'Enregistrer'}
                </Button>
                <Button type="button" variant="outline" aria-label="Prendre une capture d'écran">
                  <Camera className="h-4 w-4 mr-2" aria-hidden="true" />
                  Capture d'écran
                </Button>
              </div>

              {/* Submit */}
              <Button 
                type="submit" 
                className="w-full"
                disabled={form.formState.isSubmitting}
                aria-busy={form.formState.isSubmitting}
              >
                <Send className="h-4 w-4 mr-2" aria-hidden="true" />
                {form.formState.isSubmitting ? 'Envoi...' : 'Envoyer le feedback'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FeedbackForm;
