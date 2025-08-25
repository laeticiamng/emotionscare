import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, Plus, Calendar, Heart, Brain, Sparkles,
  MessageCircle, TrendingUp, Target
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface JournalEntry {
  id: string;
  content: string;
  emotion: string;
  mood_score: number;
  ai_feedback?: string;
  created_at: string;
  tags: string[];
}

interface EmotionOption {
  emoji: string;
  label: string;
  value: string;
  score: number;
  color: string;
}

const emotionOptions: EmotionOption[] = [
  { emoji: '😊', label: 'Joyeux', value: 'joy', score: 8, color: 'bg-yellow-500' },
  { emoji: '😌', label: 'Serein', value: 'serene', score: 7, color: 'bg-blue-500' },
  { emoji: '😐', label: 'Neutre', value: 'neutral', score: 5, color: 'bg-gray-500' },
  { emoji: '😟', label: 'Inquiet', value: 'worried', score: 3, color: 'bg-orange-500' },
  { emoji: '😢', label: 'Triste', value: 'sad', score: 2, color: 'bg-blue-700' },
  { emoji: '😠', label: 'En colère', value: 'angry', score: 2, color: 'bg-red-500' },
  { emoji: '😰', label: 'Anxieux', value: 'anxious', score: 3, color: 'bg-purple-500' },
  { emoji: '🤗', label: 'Reconnaissant', value: 'grateful', score: 8, color: 'bg-green-500' },
];

const JournalPage: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [newEntry, setNewEntry] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionOption | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const saveEntry = async () => {
    if (!newEntry.trim() || !selectedEmotion || !user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-coach', {
        body: {
          message: newEntry,
          type: 'journal_analysis',
          emotion: selectedEmotion.value
        }
      });

      const aiFeedback = data?.response || "Merci d'avoir partagé vos pensées.";

      const { data: entryData, error: saveError } = await supabase
        .from('emotions')
        .insert({
          user_id: user.id,
          text: newEntry,
          emojis: selectedEmotion.emoji,
          score: selectedEmotion.score,
          ai_feedback: aiFeedback,
          date: new Date().toISOString()
        })
        .select()
        .single();

      if (saveError) throw saveError;

      const newJournalEntry: JournalEntry = {
        id: entryData.id,
        content: newEntry,
        emotion: selectedEmotion.value,
        mood_score: selectedEmotion.score,
        ai_feedback: aiFeedback,
        created_at: entryData.date,
        tags: []
      };

      setEntries(prev => [newJournalEntry, ...prev]);
      setNewEntry('');
      setSelectedEmotion(null);
      setIsWriting(false);

      toast({
        title: "Entrée sauvegardée",
        description: "Votre réflexion a été ajoutée à votre journal",
      });
    } catch (error) {
      console.error('Error saving entry:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'entrée",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isWriting) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Nouvelle Entrée de Journal
            </h1>
            <p className="text-muted-foreground">
              Exprimez vos pensées et émotions du moment
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Comment vous sentez-vous ?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-3 mb-6">
                {emotionOptions.map((emotion) => (
                  <button
                    key={emotion.value}
                    onClick={() => setSelectedEmotion(emotion)}
                    className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                      selectedEmotion?.value === emotion.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="text-2xl mb-1">{emotion.emoji}</div>
                    <div className="text-xs font-medium">{emotion.label}</div>
                  </button>
                ))}
              </div>

              <Textarea
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                placeholder="Décrivez vos pensées, sentiments, ou événements de la journée..."
                className="min-h-[200px] mb-4"
              />

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsWriting(false);
                    setNewEntry('');
                    setSelectedEmotion(null);
                  }}
                >
                  Annuler
                </Button>
                <Button
                  onClick={saveEntry}
                  disabled={isLoading || !newEntry.trim() || !selectedEmotion}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Sauvegarder & Analyser
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Journal Émotionnel
          </h1>
          <p className="text-muted-foreground">
            Suivez votre bien-être émotionnel et recevez des insights personnalisés
          </p>
        </div>
        <Button onClick={() => setIsWriting(true)} size="lg">
          <Plus className="w-5 h-5 mr-2" />
          Nouvelle Entrée
        </Button>
      </div>

      <Card>
        <CardContent className="text-center py-12">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Commencez votre journal</h3>
          <p className="text-muted-foreground mb-6">
            Exprimez vos pensées et recevez des insights IA personnalisés
          </p>
          <Button onClick={() => setIsWriting(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Créer ma première entrée
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default JournalPage;