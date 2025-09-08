import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, Heart, Sparkles, BookOpen, TrendingUp } from 'lucide-react';
import { EmotionResult } from '@/types/emotion';
import { toast } from 'sonner';

interface JournalEntry {
  id: string;
  date: string;
  content: string;
  emotion?: string;
  mood: number;
  tags: string[];
  emotionAnalysis?: EmotionResult;
  insights?: string[];
}

const B2CJournalPageEnhanced: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeEntry = useCallback(async (content: string) => {
    if (!content.trim()) return null;
    
    setIsAnalyzing(true);
    try {
      // Simuler l'analyse émotionnelle du texte
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const emotions = ['happy', 'sad', 'anxious', 'calm', 'excited', 'thoughtful'];
      const emotion = emotions[Math.floor(Math.random() * emotions.length)];
      const mood = Math.floor(Math.random() * 10) + 1;
      
      const insights = [
        'Vous semblez avoir une perspective positive aujourd\'hui',
        'Il pourrait être bénéfique de pratiquer la méditation',
        'Votre niveau d\'énergie paraît équilibré',
        'Considérez partager vos sentiments avec un proche'
      ];
      
      return {
        emotion,
        mood,
        insights: insights.slice(0, Math.floor(Math.random() * 3) + 1)
      };
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const saveEntry = useCallback(async () => {
    if (!currentEntry.trim()) {
      toast.error('Veuillez écrire quelque chose avant de sauvegarder');
      return;
    }

    const analysis = await analyzeEntry(currentEntry);
    
    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      content: currentEntry,
      emotion: analysis?.emotion,
      mood: analysis?.mood || 5,
      tags: extractTags(currentEntry),
      insights: analysis?.insights
    };

    setEntries(prev => [entry, ...prev]);
    setCurrentEntry('');
    toast.success('Entrée sauvegardée avec succès');
  }, [currentEntry, analyzeEntry]);

  const extractTags = (content: string): string[] => {
    const words = content.toLowerCase().split(/\s+/);
    const emotionWords = words.filter(word => 
      ['heureux', 'triste', 'anxieux', 'calme', 'excité', 'fatigué', 'motivé'].includes(word)
    );
    return [...new Set(emotionWords)];
  };

  const getEmotionColor = (emotion?: string) => {
    const colors: Record<string, string> = {
      happy: 'bg-yellow-100 text-yellow-800',
      sad: 'bg-blue-100 text-blue-800',
      anxious: 'bg-purple-100 text-purple-800',
      calm: 'bg-green-100 text-green-800',
      excited: 'bg-orange-100 text-orange-800',
      thoughtful: 'bg-gray-100 text-gray-800'
    };
    return colors[emotion || 'thoughtful'] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl" data-testid="page-root">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <BookOpen className="w-8 h-8" />
          Journal Émotionnel
        </h1>
        <p className="text-muted-foreground">
          Explorez vos pensées et émotions avec notre journal intelligent
        </p>
      </div>

      {/* Nouvelle entrée */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Nouvelle entrée
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Comment vous sentez-vous aujourd'hui ? Que s'est-il passé dans votre journée ?"
            value={currentEntry}
            onChange={(e) => setCurrentEntry(e.target.value)}
            className="min-h-32"
          />
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {currentEntry.length} caractères
            </p>
            <Button 
              onClick={saveEntry}
              disabled={!currentEntry.trim() || isAnalyzing}
              className="flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4" />
                  Sauvegarder
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques rapides */}
      {entries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{entries.length}</div>
              <div className="text-sm text-muted-foreground">Entrées totales</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">
                {Math.round(entries.reduce((sum, entry) => sum + entry.mood, 0) / entries.length) || 0}
              </div>
              <div className="text-sm text-muted-foreground">Humeur moyenne</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">
                {Math.max(...entries.map(e => e.mood), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Meilleure humeur</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Liste des entrées */}
      <div className="space-y-4">
        {entries.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Aucune entrée pour le moment</h3>
              <p className="text-muted-foreground">
                Commencez à écrire pour suivre votre parcours émotionnel
              </p>
            </CardContent>
          </Card>
        ) : (
          entries.map((entry) => (
            <Card key={entry.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {entry.emotion && (
                      <Badge className={getEmotionColor(entry.emotion)}>
                        {entry.emotion}
                      </Badge>
                    )}
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-medium">{entry.mood}/10</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed mb-4">
                  {entry.content}
                </p>
                
                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {entry.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {entry.insights && entry.insights.length > 0 && (
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                      <Sparkles className="w-4 h-4" />
                      Insights IA
                    </h4>
                    <ul className="text-sm space-y-1">
                      {entry.insights.map((insight, index) => (
                        <li key={index} className="text-muted-foreground">
                          • {insight}
                        </li>
                      ))}
                    </ul>
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

export default B2CJournalPageEnhanced;