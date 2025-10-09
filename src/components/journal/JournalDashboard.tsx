// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { 
  Book, 
  Mic, 
  PenLine, 
  TrendingUp, 
  Calendar,
  Trash2,
  Play,
  Pause
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const emotions = [
  { value: 'joy', label: 'Joie', color: 'bg-yellow-500' },
  { value: 'sadness', label: 'Tristesse', color: 'bg-blue-500' },
  { value: 'anger', label: 'Colère', color: 'bg-red-500' },
  { value: 'fear', label: 'Peur', color: 'bg-purple-500' },
  { value: 'calm', label: 'Calme', color: 'bg-green-500' },
  { value: 'anxiety', label: 'Anxiété', color: 'bg-orange-500' },
];

export default function JournalDashboard() {
  const { toast } = useToast();
  const [entries, setEntries] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [textContent, setTextContent] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('calm');
  const [intensity, setIntensity] = useState([0.5]);
  const [moodScore, setMoodScore] = useState([5]);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    loadEntries();
    loadInsights();
  }, []);

  const loadEntries = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('journal', {
        body: { action: 'get_entries', payload: { limit: 50 } }
      });

      if (error) throw error;
      setEntries(data.data.entries);
    } catch (error) {
      console.error('Erreur chargement entrées:', error);
    }
  };

  const loadInsights = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('journal', {
        body: { action: 'get_insights', payload: { days: 30 } }
      });

      if (error) throw error;
      setInsights(data.data);
    } catch (error) {
      console.error('Erreur chargement insights:', error);
    }
  };

  const handleSaveTextEntry = async () => {
    if (!textContent.trim()) {
      toast({
        title: "Contenu manquant",
        description: "Veuillez écrire quelque chose dans votre journal.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('journal', {
        body: {
          action: 'save_text_entry',
          payload: {
            content: textContent,
            emotion: selectedEmotion,
            intensity: intensity[0],
            mood_score: moodScore[0],
            tags: []
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Entrée enregistrée",
        description: "Votre journal a été mis à jour avec succès.",
      });

      setTextContent('');
      setIntensity([0.5]);
      setMoodScore([5]);
      loadEntries();
      loadInsights();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer l'entrée.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = async (entryId: string, entryType: string) => {
    try {
      const { error } = await supabase.functions.invoke('journal', {
        body: {
          action: 'delete_entry',
          payload: { entry_id: entryId, entry_type: entryType }
        }
      });

      if (error) throw error;

      toast({
        title: "Entrée supprimée",
        description: "L'entrée a été supprimée avec succès.",
      });

      loadEntries();
      loadInsights();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'entrée.",
        variant: "destructive"
      });
    }
  };

  const getEmotionColor = (emotion: string) => {
    return emotions.find(e => e.value === emotion)?.color || 'bg-gray-500';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Book className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Journal Émotionnel</h1>
      </div>

      {/* Insights Card */}
      {insights && (
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Insights des 30 derniers jours</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{insights.total_entries}</p>
              <p className="text-sm text-muted-foreground">Entrées totales</p>
            </div>
            <div className="text-center">
              <Badge className={`${getEmotionColor(insights.dominant_emotion)} text-white`}>
                {emotions.find(e => e.value === insights.dominant_emotion)?.label || insights.dominant_emotion}
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">Émotion dominante</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{insights.avg_mood}/10</p>
              <p className="text-sm text-muted-foreground">Humeur moyenne</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{Math.round(insights.entries_by_day * 10) / 10}</p>
              <p className="text-sm text-muted-foreground">Entrées/jour</p>
            </div>
          </div>
        </Card>
      )}

      <Tabs defaultValue="write" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="write">
            <PenLine className="h-4 w-4 mr-2" />
            Écrire
          </TabsTrigger>
          <TabsTrigger value="voice">
            <Mic className="h-4 w-4 mr-2" />
            Vocal
          </TabsTrigger>
          <TabsTrigger value="history">
            <Calendar className="h-4 w-4 mr-2" />
            Historique
          </TabsTrigger>
        </TabsList>

        <TabsContent value="write" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Nouvelle entrée texte</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Émotion ressentie</label>
                <div className="flex flex-wrap gap-2">
                  {emotions.map((emotion) => (
                    <Badge
                      key={emotion.value}
                      className={`cursor-pointer ${
                        selectedEmotion === emotion.value
                          ? emotion.color + ' text-white'
                          : 'bg-secondary'
                      }`}
                      onClick={() => setSelectedEmotion(emotion.value)}
                    >
                      {emotion.label}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Intensité émotionnelle: {Math.round(intensity[0] * 100)}%
                </label>
                <Slider
                  value={intensity}
                  onValueChange={setIntensity}
                  min={0}
                  max={1}
                  step={0.1}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Humeur générale: {moodScore[0]}/10
                </label>
                <Slider
                  value={moodScore}
                  onValueChange={setMoodScore}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Votre journal</label>
                <Textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Écrivez librement vos pensées et émotions..."
                  rows={8}
                  className="resize-none"
                />
              </div>

              <Button 
                onClick={handleSaveTextEntry} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Enregistrement...' : 'Enregistrer l\'entrée'}
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="voice">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Enregistrement vocal</h3>
            <div className="text-center py-12">
              <Button
                size="lg"
                variant={isRecording ? "destructive" : "default"}
                onClick={() => setIsRecording(!isRecording)}
                className="rounded-full h-24 w-24"
              >
                {isRecording ? <Pause className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
              </Button>
              <p className="mt-4 text-sm text-muted-foreground">
                {isRecording ? 'Enregistrement en cours...' : 'Appuyez pour commencer'}
              </p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {entries.length === 0 ? (
            <Card className="p-12 text-center">
              <Book className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucune entrée pour le moment</p>
            </Card>
          ) : (
            entries.map((entry) => (
              <Card key={entry.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${getEmotionColor(entry.emotion_type)} text-white`}>
                        {emotions.find(e => e.value === entry.emotion_type)?.label || entry.emotion_type}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(entry.created_at), 'PPP', { locale: fr })}
                      </span>
                      {entry.type === 'voice' && <Mic className="h-4 w-4 text-muted-foreground" />}
                      {entry.type === 'text' && <PenLine className="h-4 w-4 text-muted-foreground" />}
                    </div>
                    <p className="text-sm">
                      {entry.type === 'text' ? entry.content : entry.transcription || 'Enregistrement vocal'}
                    </p>
                    {entry.mood_score && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Humeur: {entry.mood_score}/10
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteEntry(entry.id, entry.type)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
