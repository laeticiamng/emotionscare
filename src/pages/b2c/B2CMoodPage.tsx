// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { moodService, type Mood } from '@/services/b2c/moodService';
import { toast } from '@/hooks/use-toast';
import { Heart, Smile, Meh, Frown, TrendingUp } from 'lucide-react';

const B2CMoodPage: React.FC = () => {
  const [valence, setValence] = useState<number>(0);
  const [arousal, setArousal] = useState<number>(0);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [recentMoods, setRecentMoods] = useState<Mood[]>([]);

  useEffect(() => {
    loadRecentMoods();
  }, []);

  const loadRecentMoods = async () => {
    try {
      const moods = await moodService.getUserMoods(10);
      setRecentMoods(moods);
    } catch (error) {
      logger.error('Error loading moods', error as Error, 'UI');
    }
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      await moodService.createMood({
        valence,
        arousal,
        note: note.trim() || undefined,
      });

      toast({
        title: 'Humeur enregistrée',
        description: 'Votre état émotionnel a été sauvegardé',
      });

      setNote('');
      setValence(0);
      setArousal(0);
      loadRecentMoods();
    } catch (error) {
      logger.error('Error saving mood', error as Error, 'UI');
      toast({
        title: 'Erreur',
        description: 'Impossible d\'enregistrer votre humeur',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const getMoodIcon = (valenceValue: number) => {
    if (valenceValue > 0.3) return <Smile className="h-6 w-6 text-green-500" />;
    if (valenceValue < -0.3) return <Frown className="h-6 w-6 text-red-500" />;
    return <Meh className="h-6 w-6 text-yellow-500" />;
  };

  const getMoodLabel = (valenceValue: number) => {
    if (valenceValue > 0.5) return 'Très positif';
    if (valenceValue > 0) return 'Positif';
    if (valenceValue > -0.5) return 'Neutre';
    return 'Négatif';
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Mon Humeur</h1>
        </div>
        <p className="text-muted-foreground">
          Enregistrez votre état émotionnel du moment
        </p>
      </div>

      {/* Main Mood Input */}
      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              {getMoodIcon(valence)}
              <span className="text-2xl font-semibold">{getMoodLabel(valence)}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Valence émotionnelle
                <span className="text-muted-foreground ml-2">(Négatif ← → Positif)</span>
              </label>
              <Slider
                value={[valence]}
                onValueChange={(values) => setValence(values[0])}
                min={-1}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Niveau d'éveil
                <span className="text-muted-foreground ml-2">(Calme ← → Énergique)</span>
              </label>
              <Slider
                value={[arousal]}
                onValueChange={(values) => setArousal(values[0])}
                min={-1}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Note personnelle (optionnel)
              </label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Qu'est-ce qui influence votre humeur aujourd'hui ?"
                rows={4}
              />
            </div>
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={saving}
            className="w-full"
            size="lg"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer mon humeur'}
          </Button>
        </div>
      </Card>

      {/* Recent Moods */}
      {recentMoods.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Historique récent</h2>
          </div>
          
          <div className="space-y-3">
            {recentMoods.map((mood) => (
              <div 
                key={mood.id}
                className="flex items-start justify-between p-4 rounded-lg bg-muted/50"
              >
                <div className="flex items-start gap-3 flex-1">
                  {getMoodIcon(mood.valence)}
                  <div className="flex-1">
                    <p className="font-medium">{getMoodLabel(mood.valence)}</p>
                    {mood.note && (
                      <p className="text-sm text-muted-foreground mt-1">{mood.note}</p>
                    )}
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(mood.ts).toLocaleString('fr-FR', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default B2CMoodPage;
