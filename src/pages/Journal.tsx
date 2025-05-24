
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, BookOpen, Plus, Search, Filter, Heart, Brain, Smile, Frown, Meh } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: 'positive' | 'neutral' | 'negative';
  tags: string[];
  created_at: string;
  analysis?: {
    emotions: Array<{ name: string; intensity: number }>;
    sentiment: string;
    suggestions: string[];
  };
}

const Journal: React.FC = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState({ title: '', content: '', mood: 'neutral' as const });
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('all');

  const moodIcons = {
    positive: <Smile className="h-4 w-4 text-green-600" />,
    neutral: <Meh className="h-4 w-4 text-gray-600" />,
    negative: <Frown className="h-4 w-4 text-red-600" />
  };

  const moodColors = {
    positive: 'bg-green-100 text-green-800 border-green-200',
    neutral: 'bg-gray-100 text-gray-800 border-gray-200',
    negative: 'bg-red-100 text-red-800 border-red-200'
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    // Simulation - In real app, load from Supabase
    const mockEntries: JournalEntry[] = [
      {
        id: '1',
        title: 'Journée productive',
        content: 'Aujourd\'hui j\'ai réussi à terminer plusieurs tâches importantes. Je me sens accompli et motivé pour la suite.',
        mood: 'positive',
        tags: ['travail', 'productivité', 'motivation'],
        created_at: new Date(Date.now() - 86400000).toISOString(),
        analysis: {
          emotions: [
            { name: 'joie', intensity: 0.8 },
            { name: 'satisfaction', intensity: 0.9 },
            { name: 'motivation', intensity: 0.7 }
          ],
          sentiment: 'positif',
          suggestions: ['Continuez sur cette lancée', 'Prenez le temps de célébrer vos réussites']
        }
      },
      {
        id: '2',
        title: 'Réflexions du soir',
        content: 'Journée mitigée. Quelques difficultés mais aussi de bons moments avec mes proches.',
        mood: 'neutral',
        tags: ['famille', 'réflexion'],
        created_at: new Date(Date.now() - 172800000).toISOString()
      }
    ];
    setEntries(mockEntries);
  };

  const saveEntry = async () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) {
      toast.error('Veuillez remplir le titre et le contenu');
      return;
    }

    setIsSaving(true);
    try {
      // Analyze the entry content
      let analysis = null;
      try {
        const { data } = await supabase.functions.invoke('analyze-emotion-text', {
          body: { text: newEntry.content }
        });
        if (data?.success) {
          analysis = data.analysis;
        }
      } catch (error) {
        console.log('Analysis failed, continuing without it');
      }

      const entry: JournalEntry = {
        id: Date.now().toString(),
        title: newEntry.title,
        content: newEntry.content,
        mood: newEntry.mood,
        tags: extractTags(newEntry.content),
        created_at: new Date().toISOString(),
        analysis
      };

      setEntries(prev => [entry, ...prev]);
      setNewEntry({ title: '', content: '', mood: 'neutral' });
      setIsAdding(false);
      toast.success('Entrée sauvegardée !');

      if (analysis) {
        toast.success('Analyse émotionnelle ajoutée !');
      }
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const extractTags = (content: string): string[] => {
    // Simple tag extraction based on keywords
    const keywords = ['travail', 'famille', 'amis', 'stress', 'joie', 'tristesse', 'motivation', 'fatigue', 'sport', 'loisir'];
    return keywords.filter(keyword => 
      content.toLowerCase().includes(keyword)
    ).slice(0, 3);
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMood = selectedMood === 'all' || entry.mood === selectedMood;
    return matchesSearch && matchesMood;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <BookOpen className="h-8 w-8 text-orange-600" />
          Journal Personnel
        </h1>
        <p className="text-muted-foreground">
          Exprimez vos pensées et suivez votre évolution émotionnelle
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher dans vos entrées..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedMood === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedMood('all')}
                size="sm"
              >
                Toutes
              </Button>
              <Button
                variant={selectedMood === 'positive' ? 'default' : 'outline'}
                onClick={() => setSelectedMood('positive')}
                size="sm"
              >
                {moodIcons.positive} Positives
              </Button>
              <Button
                variant={selectedMood === 'neutral' ? 'default' : 'outline'}
                onClick={() => setSelectedMood('neutral')}
                size="sm"
              >
                {moodIcons.neutral} Neutres
              </Button>
              <Button
                variant={selectedMood === 'negative' ? 'default' : 'outline'}
                onClick={() => setSelectedMood('negative')}
                size="sm"
              >
                {moodIcons.negative} Difficiles
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Entry Button */}
      {!isAdding && (
        <Button onClick={() => setIsAdding(true)} className="w-full" size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle entrée
        </Button>
      )}

      {/* New Entry Form */}
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Nouvelle entrée</CardTitle>
            <CardDescription>
              Exprimez vos pensées et émotions du moment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Titre de votre entrée..."
              value={newEntry.title}
              onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
            />
            
            <Textarea
              placeholder="Que ressentez-vous aujourd'hui ? Partagez vos pensées, vos expériences, vos émotions..."
              value={newEntry.content}
              onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
              className="min-h-32"
            />

            <div>
              <label className="text-sm font-medium mb-2 block">Humeur générale</label>
              <div className="flex gap-2">
                {Object.entries(moodIcons).map(([mood, icon]) => (
                  <Button
                    key={mood}
                    variant={newEntry.mood === mood ? 'default' : 'outline'}
                    onClick={() => setNewEntry(prev => ({ ...prev, mood: mood as any }))}
                    className="flex items-center gap-2"
                  >
                    {icon}
                    {mood === 'positive' ? 'Positive' : mood === 'neutral' ? 'Neutre' : 'Difficile'}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={saveEntry} disabled={isSaving} className="flex-1">
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAdding(false);
                  setNewEntry({ title: '', content: '', mood: 'neutral' });
                }}
              >
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Entries List */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-600 mb-2">
                {searchTerm || selectedMood !== 'all' ? 'Aucune entrée trouvée' : 'Aucune entrée'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm || selectedMood !== 'all' 
                  ? 'Essayez de modifier vos critères de recherche'
                  : 'Commencez votre journal en créant votre première entrée'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredEntries.map((entry) => (
            <Card key={entry.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      {moodIcons[entry.mood]}
                      {entry.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(entry.created_at)}
                    </CardDescription>
                  </div>
                  <Badge className={moodColors[entry.mood]}>
                    {entry.mood === 'positive' ? 'Positive' : 
                     entry.mood === 'neutral' ? 'Neutre' : 'Difficile'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {entry.content}
                </p>

                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {entry.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {entry.analysis && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      Analyse émotionnelle
                    </h4>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {entry.analysis.emotions.map((emotion, index) => (
                          <span key={index} className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                            {emotion.name} ({Math.round(emotion.intensity * 100)}%)
                          </span>
                        ))}
                      </div>
                      {entry.analysis.suggestions.length > 0 && (
                        <div className="text-sm text-blue-700 dark:text-blue-300">
                          <strong>Suggestions:</strong> {entry.analysis.suggestions.join(', ')}
                        </div>
                      )}
                    </div>
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

export default Journal;
