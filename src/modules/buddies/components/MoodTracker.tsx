/**
 * Composant pour l'enregistrement du mood avant/après une activité
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { Smile, Heart, Zap, Brain } from 'lucide-react';

interface MoodTrackerProps {
  type: 'before' | 'after';
  currentUserId: string;
  buddyName: string;
  onSubmit: (mood: Record<string, number>, notes?: string) => void;
  onSkip?: () => void;
}

const MOOD_DIMENSIONS = [
  { key: 'happiness', label: 'Bonheur', icon: Smile, color: 'text-yellow-500' },
  { key: 'energy', label: 'Énergie', icon: Zap, color: 'text-amber-500' },
  { key: 'calm', label: 'Calme', icon: Heart, color: 'text-pink-500' },
  { key: 'focus', label: 'Concentration', icon: Brain, color: 'text-blue-500' }
];

export const MoodTracker: React.FC<MoodTrackerProps> = ({
  type,
  currentUserId,
  buddyName,
  onSubmit,
  onSkip
}) => {
  const [mood, setMood] = useState<Record<string, number>>({
    happiness: 5,
    energy: 5,
    calm: 5,
    focus: 5
  });
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    const moodWithUserId = { [currentUserId]: Object.values(mood).reduce((a, b) => a + b, 0) / 4 };
    onSubmit(moodWithUserId, notes || undefined);
  };

  const getMoodEmoji = (value: number) => {
    if (value >= 8) return '😊';
    if (value >= 6) return '🙂';
    if (value >= 4) return '😐';
    if (value >= 2) return '😕';
    return '😢';
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-lg">
          {type === 'before' 
            ? `Comment vous sentez-vous avant l'activité ?` 
            : `Comment vous sentez-vous après l'activité ?`}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Activité avec {buddyName}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {MOOD_DIMENSIONS.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${color}`} />
                {label}
              </Label>
              <span className="text-2xl">{getMoodEmoji(mood[key])}</span>
            </div>
            <Slider
              value={[mood[key]]}
              onValueChange={([value]) => setMood(prev => ({ ...prev, [key]: value }))}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Bas</span>
              <span>{mood[key]}/10</span>
              <span>Haut</span>
            </div>
          </div>
        ))}

        {type === 'after' && (
          <div className="space-y-2">
            <Label>Notes (optionnel)</Label>
            <Textarea
              placeholder="Comment s'est passée l'activité ?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>
        )}

        {/* Score global */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-r from-primary/10 to-pink-500/10 rounded-lg p-4 text-center"
        >
          <p className="text-sm text-muted-foreground mb-1">Score global</p>
          <p className="text-3xl font-bold">
            {(Object.values(mood).reduce((a, b) => a + b, 0) / 4).toFixed(1)}
            <span className="text-lg font-normal text-muted-foreground">/10</span>
          </p>
        </motion.div>

        <div className="flex gap-2">
          {onSkip && (
            <Button variant="outline" onClick={onSkip} className="flex-1">
              Passer
            </Button>
          )}
          <Button onClick={handleSubmit} className="flex-1">
            {type === 'before' ? 'Commencer' : 'Terminer'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodTracker;
