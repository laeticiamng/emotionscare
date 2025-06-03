
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Plus, BookOpen, TrendingUp, Heart, Smile, Frown } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface JournalEntry {
  id: string;
  content: string;
  date: string;
  ai_feedback?: string;
}

const JournalPage: React.FC = () => {
  const [newEntry, setNewEntry] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('');
  
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['journal-entries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data as JournalEntry[];
    },
  });

  const createEntryMutation = useMutation({
    mutationFn: async (content: string) => {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert([{ content, user_id: (await supabase.auth.getUser()).data.user?.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] });
      toast.success('Entrée de journal ajoutée');
      setNewEntry('');
      setSelectedMood('');
    },
    onError: () => {
      toast.error('Erreur lors de la sauvegarde');
    },
  });

  const moods = [
    { name: 'Excellent', emoji: '😊', color: 'bg-green-500' },
    { name: 'Bien', emoji: '🙂', color: 'bg-blue-500' },
    { name: 'Neutre', emoji: '😐', color: 'bg-gray-500' },
    { name: 'Difficile', emoji: '😔', color: 'bg-orange-500' },
    { name: 'Très difficile', emoji: '😢', color: 'bg-red-500' },
  ];

  const handleSubmit = () => {
    if (newEntry.trim()) {
      const entryWithMood = selectedMood 
        ? `Humeur: ${selectedMood}\n\n${newEntry}` 
        : newEntry;
      createEntryMutation.mutate(entryWithMood);
    }
  };

  const weeklyStats = {
    totalEntries: entries.filter(entry => {
      const entryDate = new Date(entry.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo;
    }).length,
    averageMood: 7.2,
    longestStreak: 5,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Mon Journal</h1>
          <p className="text-muted-foreground">
            Exprimez vos pensées et suivez votre évolution émotionnelle
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Cette semaine</p>
                <p className="text-xl font-bold">{weeklyStats.totalEntries}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Humeur moyenne</p>
                <p className="text-xl font-bold">{weeklyStats.averageMood}/10</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Série en cours</p>
                <p className="text-xl font-bold">{weeklyStats.longestStreak} jours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="write" className="space-y-4">
        <TabsList>
          <TabsTrigger value="write">Nouvelle entrée</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="write" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nouvelle entrée de journal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Comment vous sentez-vous aujourd'hui ?
                </label>
                <div className="flex space-x-2">
                  {moods.map((mood) => (
                    <Button
                      key={mood.name}
                      variant={selectedMood === mood.name ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedMood(mood.name)}
                      className="flex items-center space-x-1"
                    >
                      <span>{mood.emoji}</span>
                      <span className="hidden sm:inline">{mood.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Votre réflexion du jour
                </label>
                <Textarea
                  placeholder="Décrivez votre journée, vos émotions, vos réflexions..."
                  value={newEntry}
                  onChange={(e) => setNewEntry(e.target.value)}
                  rows={6}
                />
              </div>

              <Button 
                onClick={handleSubmit}
                disabled={!newEntry.trim() || createEntryMutation.isPending}
                className="w-full"
              >
                {createEntryMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="space-y-4">
            {entries.map((entry) => (
              <Card key={entry.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">
                      {format(new Date(entry.date), 'EEEE d MMMM yyyy', { locale: fr })}
                    </CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {entry.content}
                  </p>
                  
                  {entry.ai_feedback && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Analyse IA:</strong> {entry.ai_feedback}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            
            {entries.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucune entrée de journal</h3>
                  <p className="text-muted-foreground mb-4">
                    Commencez par écrire votre première réflexion du jour
                  </p>
                  <Button onClick={() => document.querySelector('[value="write"]')?.click()}>
                    Créer ma première entrée
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analyses de votre bien-être</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Découvrez les tendances de votre bien-être émotionnel basées sur vos entrées de journal.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Mots les plus utilisés</h4>
                  <div className="flex flex-wrap gap-2">
                    {['travail', 'famille', 'stress', 'bonheur', 'fatigue'].map((word) => (
                      <Badge key={word} variant="secondary">{word}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Émotions dominantes</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Joie</span>
                      <span>35%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Stress</span>
                      <span>25%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Calme</span>
                      <span>40%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JournalPage;
