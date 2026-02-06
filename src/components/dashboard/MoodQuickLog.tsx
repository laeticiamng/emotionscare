import React, { useState } from 'react';
import { logger } from '@/lib/logger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const MOODS = [
  { value: 'happy', label: 'Joyeux', emoji: '😊', level: 9 },
  { value: 'calm', label: 'Calme', emoji: '😌', level: 7 },
  { value: 'neutral', label: 'Neutre', emoji: '😐', level: 5 },
  { value: 'sad', label: 'Triste', emoji: '😢', level: 3 },
  { value: 'anxious', label: 'Anxieux', emoji: '😰', level: 2 },
  { value: 'angry', label: 'En colère', emoji: '😠', level: 2 },
];

interface MoodQuickLogProps {
  onMoodLogged?: (mood: string, level: number) => void;
  className?: string;
}

export const MoodQuickLog: React.FC<MoodQuickLogProps> = ({ onMoodLogged, className }) => {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justLogged, setJustLogged] = useState(false);

  const handleMoodSelect = async (mood: typeof MOODS[0]) => {
    if (!user || isSubmitting) return;

    setSelectedMood(mood.value);
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('mood_entries')
        .insert({
          user_id: user.id,
          mood_level: mood.level,
          emotions: [mood.value],
        });

      if (error) throw error;

      setJustLogged(true);
      toast.success(`Humeur "${mood.label}" enregistrée !`);
      onMoodLogged?.(mood.value, mood.level);

      // Reset après 3 secondes
      setTimeout(() => {
        setJustLogged(false);
        setSelectedMood(null);
      }, 3000);
    } catch (error) {
      logger.error('Error logging mood:', error, 'SYSTEM');
      toast.error('Erreur lors de l\'enregistrement');
      setSelectedMood(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          🌡️ Humeur du jour
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {justLogged ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center py-4 text-center"
            >
              <div className="h-12 w-12 rounded-full bg-success/20 flex items-center justify-center mb-3">
                <Check className="h-6 w-6 text-success" />
              </div>
              <p className="font-medium">Enregistré !</p>
              <p className="text-sm text-muted-foreground">
                Continue demain pour maintenir ta série
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="selector"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-sm text-muted-foreground mb-3">
                Comment te sens-tu en ce moment ?
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {MOODS.map((mood) => (
                  <Button
                    key={mood.value}
                    variant={selectedMood === mood.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleMoodSelect(mood)}
                    disabled={isSubmitting}
                    className="flex flex-col h-auto py-2 px-3 min-w-[60px]"
                    aria-label={`Je me sens ${mood.label}`}
                  >
                    {isSubmitting && selectedMood === mood.value ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <span className="text-2xl">{mood.emoji}</span>
                    )}
                    <span className="text-xs mt-1">{mood.label}</span>
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default MoodQuickLog;
