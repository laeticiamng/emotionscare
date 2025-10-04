// @ts-nocheck
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Heart, Smile, Meh, Frown, AngryIcon, Send, Sparkles } from 'lucide-react';
import { logger } from '@/lib/logger';

interface EmotionalCheckinProps {
  onSubmit?: (data: { mood: string; intensity: number; note: string }) => void;
  className?: string;
}

const EmotionalCheckin: React.FC<EmotionalCheckinProps> = ({ 
  onSubmit,
  className 
}) => {
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [intensity, setIntensity] = useState<number>(3);
  const [note, setNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const moods = [
    { name: 'Excellent', icon: Heart, color: 'text-destructive', gradient: 'from-destructive to-accent' },
    { name: 'Bien', icon: Smile, color: 'text-success', gradient: 'from-success to-success/70' },
    { name: 'Neutre', icon: Meh, color: 'text-warning', gradient: 'from-warning to-warning/70' },
    { name: 'Difficile', icon: Frown, color: 'text-warning', gradient: 'from-warning to-destructive' },
    { name: 'Très difficile', icon: AngryIcon, color: 'text-destructive', gradient: 'from-destructive to-destructive/80' }
  ];

  const handleSubmit = useCallback(async () => {
    if (!selectedMood) return;
    
    setIsSubmitting(true);
    
    try {
      await onSubmit?.({
        mood: selectedMood,
        intensity,
        note
      });
      
      // Reset form
      setSelectedMood('');
      setIntensity(3);
      setNote('');
    } catch (error) {
      logger.error('Erreur lors de l\'envoi:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedMood, intensity, note, onSubmit]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Check-in Émotionnel
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Comment vous sentez-vous en ce moment ?
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sélection d'humeur */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Votre humeur</h4>
          <div className="grid grid-cols-5 gap-2">
            {moods.map((mood, index) => {
              const Icon = mood.icon;
              const isSelected = selectedMood === mood.name;
              
              return (
                <motion.button
                  key={mood.name}
                  onClick={() => setSelectedMood(mood.name)}
                  className={`
                    relative p-3 rounded-xl border-2 transition-all duration-300
                    ${isSelected 
                      ? 'border-primary shadow-lg scale-105' 
                      : 'border-border hover:border-primary/50 hover:scale-102'
                    }
                  `}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: isSelected ? 1.05 : 1.02 }}
                >
                  <Icon className={`h-6 w-6 mx-auto ${mood.color}`} />
                  <span className="text-xs mt-1 block">{mood.name}</span>
                  
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`absolute inset-0 bg-gradient-to-br ${mood.gradient} opacity-10 rounded-xl`}
                      />
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Intensité */}
        {selectedMood && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <h4 className="text-sm font-medium">Intensité (1-5)</h4>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => setIntensity(level)}
                  className={`
                    w-8 h-8 rounded-full border-2 font-medium transition-all
                    ${intensity >= level
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border hover:border-primary/50'
                    }
                  `}
                >
                  {level}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Faible</span>
              <span>Intense</span>
            </div>
          </motion.div>
        )}

        {/* Note optionnelle */}
        {selectedMood && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <h4 className="text-sm font-medium">Note (optionnel)</h4>
            <Textarea
              placeholder="Qu'est-ce qui influence votre humeur aujourd'hui ?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[80px]"
            />
          </motion.div>
        )}

        {/* Bouton de soumission */}
        {selectedMood && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Enregistrement...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Enregistrer mon état
                </div>
              )}
            </Button>
          </motion.div>
        )}

        {/* Résumé */}
        {selectedMood && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 bg-muted/30 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">Résumé</Badge>
            </div>
            <p className="text-sm">
              <strong>Humeur:</strong> {selectedMood} 
              <span className="text-muted-foreground"> (intensité {intensity}/5)</span>
            </p>
            {note && (
              <p className="text-sm mt-1">
                <strong>Note:</strong> {note.substring(0, 50)}
                {note.length > 50 && '...'}
              </p>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionalCheckin;