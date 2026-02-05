/**
 * EmotionalJournalEntryForm - Formulaire de création d'entrée journal émotionnel
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Loader2, Save, X } from 'lucide-react';
import { EmotionalJournalSelector, EmotionalType, getEmotionalById } from './EmotionalJournalSelector';
import { cn } from '@/lib/utils';

const AVAILABLE_TAGS = [
  { id: 'work', label: 'Travail', emoji: '💼' },
  { id: 'family', label: 'Famille', emoji: '👨‍👩‍👧' },
  { id: 'health', label: 'Santé', emoji: '🏥' },
  { id: 'relationships', label: 'Relations', emoji: '❤️' },
  { id: 'sleep', label: 'Sommeil', emoji: '😴' },
  { id: 'sport', label: 'Sport', emoji: '🏃' },
  { id: 'money', label: 'Finances', emoji: '💰' },
  { id: 'leisure', label: 'Loisirs', emoji: '🎮' },
];

export interface EmotionalJournalEntryData {
  emotion: EmotionalType;
  intensity: number;
  content: string;
  tags: string[];
}

interface EmotionalJournalEntryFormProps {
  onSubmit: (data: EmotionalJournalEntryData) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export const EmotionalJournalEntryForm: React.FC<EmotionalJournalEntryFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [emotion, setEmotion] = useState<EmotionalType | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const selectedEmotion = getEmotionalById(emotion);
  const isValid = emotion && content.trim().length >= 10;
  const charCount = content.length;

  const toggleTag = (tagId: string) => {
    setTags(prev =>
      prev.includes(tagId)
        ? prev.filter(t => t !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSubmit = async () => {
    if (!emotion || !isValid) return;
    
    await onSubmit({
      emotion,
      intensity,
      content: content.trim(),
      tags,
    });
    
    // Reset form
    setEmotion(null);
    setIntensity(5);
    setContent('');
    setTags([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Nouvelle entrée</span>
          {onCancel && (
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Sélection émotion */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">
            Comment te sens-tu ?
          </Label>
          <EmotionalJournalSelector selected={emotion} onSelect={setEmotion} />
        </div>

        {/* Intensité */}
        {emotion && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-3"
          >
            <Label className="text-base font-semibold">
              Intensité : {intensity}/10
              {selectedEmotion && (
                <span className="ml-2 text-2xl">{selectedEmotion.emoji}</span>
              )}
            </Label>
            <Slider
              value={[intensity]}
              onValueChange={(v) => setIntensity(v[0])}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Légère</span>
              <span>Intense</span>
            </div>
          </motion.div>
        )}

        {/* Contenu texte */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">
            Exprime-toi librement
          </Label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Qu'est-ce qui t'a fait ressentir cela ? Prends le temps de décrire ton expérience..."
            className="min-h-[150px] resize-none"
            maxLength={2000}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className={charCount < 10 ? 'text-destructive' : ''}>
              {charCount < 10 ? `Minimum 10 caractères (${charCount}/10)` : '✓ Texte valide'}
            </span>
            <span>{charCount}/2000</span>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">
            Tags (optionnel)
          </Label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_TAGS.map((tag) => {
              const isSelected = tags.includes(tag.id);
              return (
                <Badge
                  key={tag.id}
                  variant={isSelected ? 'default' : 'outline'}
                  className={cn(
                    'cursor-pointer transition-all',
                    isSelected && 'bg-primary'
                  )}
                  onClick={() => toggleTag(tag.id)}
                >
                  {tag.emoji} {tag.label}
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionalJournalEntryForm;
