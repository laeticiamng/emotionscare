import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, TrendingUp, Calendar, Heart, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { logger } from '@/lib/logger';

interface JournalEntry {
  id: string;
  content: string;
  emotion_tags: string[];
  intensity: number;
  gratitude_items?: string[];
  created_at: string;
}

interface Insights {
  totalEntries: number;
  avgIntensity: number;
  topEmotions: Array<{ emotion: string; count: number }>;
  weeklyFrequency: number;
}

const EMOTION_OPTIONS = [
  { label: 'Joie', value: 'joy', color: 'bg-yellow-500/20 text-yellow-700' },
  { label: 'Tristesse', value: 'sadness', color: 'bg-blue-500/20 text-blue-700' },
  { label: 'Colère', value: 'anger', color: 'bg-red-500/20 text-red-700' },
  { label: 'Peur', value: 'fear', color: 'bg-purple-500/20 text-purple-700' },
  { label: 'Gratitude', value: 'gratitude', color: 'bg-green-500/20 text-green-700' },
  { label: 'Anxiété', value: 'anxiety', color: 'bg-orange-500/20 text-orange-700' },
  { label: 'Sérénité', value: 'serenity', color: 'bg-teal-500/20 text-teal-700' },
];

export const EmotionalJournalDashboard: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showNewEntry, setShowNewEntry] = useState(false);
  
  // New entry state
  const [content, setContent] = useState('');
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [intensity, setIntensity] = useState(5);
  const [gratitude, setGratitude] = useState('');
  
  const { toast } = useToast();

  useEffect(() => {
    loadEntries();
    loadInsights();
  }, []);

  const loadEntries = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('emotional-journal', {
        body: { action: 'get_entries' }
      });

      if (error) throw error;
      if (data.success) {
        setEntries(data.entries);
      }
    } catch (error) {
      logger.error('Erreur chargement entrées', error as Error, 'UI');
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les entrées',
        variant: 'destructive'
      });
    }
  };

  const loadInsights = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('emotional-journal', {
        body: { action: 'get_insights' }
      });

      if (error) throw error;
      if (data.success) {
        setInsights(data.insights);
      }
    } catch (error) {
      logger.error('Erreur chargement insights', error as Error, 'UI');
    }
  };

  const createEntry = async () => {
    if (!content.trim() || selectedEmotions.length === 0) {
      toast({
        title: 'Information manquante',
        description: 'Veuillez remplir le contenu et sélectionner au moins une émotion',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('emotional-journal', {
        body: {
          action: 'create',
          entryData: {
            content,
            emotions: selectedEmotions,
            intensity,
            gratitude: gratitude.trim() ? [gratitude.trim()] : []
          }
        }
      });

      if (error) throw error;
      
      toast({
        title: 'Succès',
        description: 'Entrée de journal créée avec succès'
      });

      // Reset form
      setContent('');
      setSelectedEmotions([]);
      setIntensity(5);
      setGratitude('');
      setShowNewEntry(false);

      // Reload data
      loadEntries();
      loadInsights();
    } catch (error) {
      logger.error('Erreur création entrée', error as Error, 'UI');
      toast({
        title: 'Erreur',
        description: 'Impossible de créer l\'entrée',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEntry = async (entryId: string) => {
    try {
      const { error } = await supabase.functions.invoke('emotional-journal', {
        body: { action: 'delete', entryId }
      });

      if (error) throw error;
      
      toast({
        title: 'Succès',
        description: 'Entrée supprimée'
      });

      loadEntries();
      loadInsights();
    } catch (error) {
      logger.error('Erreur suppression', error as Error, 'UI');
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer l\'entrée',
        variant: 'destructive'
      });
    }
  };

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions(prev =>
      prev.includes(emotion)
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Journal Émotionnel</h1>
        </div>
        <Button onClick={() => setShowNewEntry(!showNewEntry)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle entrée
        </Button>
      </div>

      {/* Insights */}
      {insights && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total d'entrées</p>
                  <p className="text-2xl font-bold">{insights.totalEntries}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Intensité moyenne</p>
                  <p className="text-2xl font-bold">{insights.avgIntensity}/10</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Par semaine</p>
                  <p className="text-2xl font-bold">{insights.weeklyFrequency}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-2">Émotions fréquentes</p>
              <div className="flex flex-wrap gap-1">
                {insights.topEmotions.slice(0, 3).map(({ emotion }) => {
                  const emotionConfig = EMOTION_OPTIONS.find(e => e.value === emotion);
                  return (
                    <Badge key={emotion} variant="secondary" className="text-xs">
                      {emotionConfig?.label || emotion}
                    </Badge>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* New Entry Form */}
      {showNewEntry && (
        <Card>
          <CardHeader>
            <CardTitle>Nouvelle entrée</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Comment vous sentez-vous ?</label>
              <Textarea
                placeholder="Décrivez vos émotions et pensées..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Émotions ressenties</label>
              <div className="flex flex-wrap gap-2">
                {EMOTION_OPTIONS.map(emotion => (
                  <Badge
                    key={emotion.value}
                    className={`cursor-pointer transition-all ${
                      selectedEmotions.includes(emotion.value)
                        ? emotion.color
                        : 'bg-muted text-muted-foreground'
                    }`}
                    onClick={() => toggleEmotion(emotion.value)}
                  >
                    {emotion.label}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Intensité émotionnelle: {intensity}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Gratitude (optionnel)</label>
              <Textarea
                placeholder="Pour quoi êtes-vous reconnaissant aujourd'hui ?"
                value={gratitude}
                onChange={(e) => setGratitude(e.target.value)}
                rows={2}
                className="resize-none"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowNewEntry(false)}>
                Annuler
              </Button>
              <Button onClick={createEntry} disabled={isLoading}>
                {isLoading ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Entries List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Mes entrées</h2>
        {entries.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              Aucune entrée pour le moment. Commencez votre journal !
            </CardContent>
          </Card>
        ) : (
          entries.map(entry => (
            <Card key={entry.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(entry.created_at), 'PPP', { locale: fr })}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {entry.emotion_tags.map(emotion => {
                        const emotionConfig = EMOTION_OPTIONS.find(e => e.value === emotion);
                        return (
                          <Badge key={emotion} className={emotionConfig?.color}>
                            {emotionConfig?.label || emotion}
                          </Badge>
                        );
                      })}
                      <Badge variant="outline">Intensité: {entry.intensity}/10</Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteEntry(entry.id)}
                    aria-label="Supprimer l'entrée"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{entry.content}</p>
                {entry.gratitude_items && entry.gratitude_items.length > 0 && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-1">💚 Gratitude</p>
                    <p className="text-sm">{entry.gratitude_items.join(', ')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default EmotionalJournalDashboard;
