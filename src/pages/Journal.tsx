
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar, Sparkles, Loader2, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface JournalEntry {
  id: string;
  content: string;
  date: string;
  ai_feedback?: string;
  mood?: string;
  tags?: string[];
}

const Journal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const { user } = useAuth();

  const moods = ['Joyeux', 'Calme', 'Stressé', 'Motivé', 'Fatigué', 'Créatif', 'Pensif'];

  useEffect(() => {
    if (user) {
      loadEntries();
    }
  }, [user]);

  const loadEntries = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Erreur chargement journal:', error);
      toast.error('Erreur lors du chargement du journal');
    } finally {
      setIsLoading(false);
    }
  };

  const saveEntry = async () => {
    if (!newEntry.trim() || !user) {
      toast.error('Veuillez saisir du contenu');
      return;
    }

    setIsAnalyzing(true);
    try {
      const entryData = {
        user_id: user.id,
        content: newEntry,
        date: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('journal_entries')
        .insert([entryData])
        .select()
        .single();

      if (error) throw error;

      // Analyser avec l'IA
      try {
        const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-journal', {
          body: { content: newEntry }
        });

        if (!analysisError && analysisData) {
          // Mettre à jour l'entrée avec l'analyse IA
          const { error: updateError } = await supabase
            .from('journal_entries')
            .update({ 
              ai_feedback: analysisData.feedback,
              mood: analysisData.mood 
            })
            .eq('id', data.id);

          if (!updateError) {
            data.ai_feedback = analysisData.feedback;
            data.mood = analysisData.mood;
          }
        }
      } catch (analysisError) {
        console.error('Erreur analyse IA:', analysisError);
      }

      setEntries(prev => [data, ...prev]);
      setNewEntry('');
      toast.success('Entrée ajoutée avec succès !');
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMood = !selectedMood || entry.mood === selectedMood;
    return matchesSearch && matchesMood;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
          <BookOpen className="h-8 w-8 text-amber-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Mon Journal</h1>
          <p className="text-muted-foreground">Exprimez vos pensées et recevez des insights IA</p>
        </div>
      </div>

      {/* Nouvelle entrée */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Nouvelle entrée
          </CardTitle>
          <CardDescription>
            Partagez vos pensées, sentiments ou expériences du jour
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Écrivez vos pensées ici... Comment vous sentez-vous aujourd'hui ? Qu'avez-vous vécu de marquant ?"
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            className="min-h-[120px]"
          />
          <Button 
            onClick={saveEntry} 
            disabled={!newEntry.trim() || isAnalyzing}
            className="w-full"
          >
            {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isAnalyzing ? 'Analyse en cours...' : 'Ajouter l\'entrée'}
          </Button>
        </CardContent>
      </Card>

      {/* Filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher dans vos entrées..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedMood === '' ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedMood('')}
              >
                Toutes
              </Badge>
              {moods.map((mood) => (
                <Badge
                  key={mood}
                  variant={selectedMood === mood ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedMood(selectedMood === mood ? '' : mood)}
                >
                  {mood}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des entrées */}
      {isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Chargement de votre journal...</span>
          </CardContent>
        </Card>
      ) : filteredEntries.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {entries.length === 0 ? 'Votre journal est vide' : 'Aucune entrée trouvée'}
            </h3>
            <p className="text-muted-foreground">
              {entries.length === 0 
                ? 'Commencez par écrire votre première entrée ci-dessus'
                : 'Essayez de modifier vos filtres de recherche'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(entry.date)}</span>
                    {entry.mood && (
                      <Badge variant="secondary" className="text-xs">
                        {entry.mood}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="prose prose-sm max-w-none mb-4">
                  <p className="whitespace-pre-wrap text-foreground">{entry.content}</p>
                </div>

                {entry.ai_feedback && (
                  <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Analyse IA</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{entry.ai_feedback}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Journal;
