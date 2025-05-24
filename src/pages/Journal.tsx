
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { BookOpen, Plus, Calendar, Heart, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: number;
  emotions: string[];
  date: Date;
  ai_feedback?: string;
}

const Journal: React.FC = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: 5
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<number | null>(null);

  useEffect(() => {
    loadEntries();
  }, []);

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

      setEntries(data?.map(entry => ({
        ...entry,
        date: new Date(entry.date),
        emotions: Array.isArray(entry.emotions) ? entry.emotions : []
      })) || []);
    } catch (error) {
      console.error('Erreur chargement journal:', error);
      toast.error('Erreur lors du chargement du journal');
    } finally {
      setIsLoading(false);
    }
  };

  const saveEntry = async () => {
    if (!user || !newEntry.content.trim()) {
      toast.error('Veuillez écrire quelque chose');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          title: newEntry.title || format(new Date(), 'dd MMMM yyyy', { locale: fr }),
          content: newEntry.content,
          mood: newEntry.mood,
          emotions: [],
          date: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Obtenir un feedback IA
      try {
        const { data: aiData } = await supabase.functions.invoke('journal-analysis', {
          body: { content: newEntry.content }
        });

        if (aiData?.feedback) {
          await supabase
            .from('journal_entries')
            .update({ ai_feedback: aiData.feedback })
            .eq('id', data.id);
          
          data.ai_feedback = aiData.feedback;
        }
      } catch (aiError) {
        console.error('Erreur analyse IA:', aiError);
        // L'erreur IA ne doit pas empêcher la sauvegarde
      }

      const entryToAdd: JournalEntry = {
        ...data,
        date: new Date(data.date),
        emotions: []
      };

      setEntries(prev => [entryToAdd, ...prev]);
      setNewEntry({ title: '', content: '', mood: 5 });
      setShowNewEntry(false);
      toast.success('Entrée sauvegardée !');
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMood = selectedMoodFilter === null || Math.round(entry.mood) === selectedMoodFilter;
    return matchesSearch && matchesMood;
  });

  const getMoodEmoji = (mood: number) => {
    if (mood <= 2) return '😢';
    if (mood <= 4) return '😐';
    if (mood <= 6) return '🙂';
    if (mood <= 8) return '😊';
    return '😄';
  };

  const getMoodColor = (mood: number) => {
    if (mood <= 2) return 'text-red-500';
    if (mood <= 4) return 'text-orange-500';
    if (mood <= 6) return 'text-yellow-500';
    if (mood <= 8) return 'text-green-500';
    return 'text-emerald-500';
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-green-500" />
            <div>
              <h1 className="text-3xl font-bold">Journal Émotionnel</h1>
              <p className="text-muted-foreground">
                Explorez vos pensées et émotions avec l'aide de l'IA
              </p>
            </div>
          </div>
          <Button onClick={() => setShowNewEntry(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle entrée
          </Button>
        </div>
      </motion.div>

      {/* Nouvelle entrée */}
      {showNewEntry && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Nouvelle entrée de journal</CardTitle>
              <CardDescription>
                Exprimez vos pensées et ressentis d'aujourd'hui
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Titre (optionnel)"
                value={newEntry.title}
                onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
              />
              
              <Textarea
                placeholder="Comment vous sentez-vous ? Que s'est-il passé aujourd'hui ? Quelles sont vos réflexions ?"
                value={newEntry.content}
                onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                className="min-h-[150px]"
              />
              
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Humeur générale: {getMoodEmoji(newEntry.mood)} ({newEntry.mood}/10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newEntry.mood}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, mood: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowNewEntry(false)}>
                  Annuler
                </Button>
                <Button onClick={saveEntry} disabled={isLoading}>
                  Sauvegarder
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Filtres et recherche */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
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
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(mood => (
                  <Button
                    key={mood}
                    size="sm"
                    variant={selectedMoodFilter === mood ? 'default' : 'outline'}
                    onClick={() => setSelectedMoodFilter(selectedMoodFilter === mood ? null : mood)}
                  >
                    {getMoodEmoji(mood)}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Liste des entrées */}
      <div className="space-y-4">
        {filteredEntries.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{entry.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {format(entry.date, 'EEEE dd MMMM yyyy', { locale: fr })}
                      <span className={`ml-2 ${getMoodColor(entry.mood)}`}>
                        {getMoodEmoji(entry.mood)} {entry.mood}/10
                      </span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {entry.content}
                </p>
                
                {entry.ai_feedback && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="h-4 w-4 text-blue-500" />
                      <span className="font-medium text-blue-700 dark:text-blue-300">
                        Analyse de votre coach IA
                      </span>
                    </div>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      {entry.ai_feedback}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredEntries.length === 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Aucune entrée trouvée</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedMoodFilter ? 
              'Aucune entrée ne correspond à vos critères de recherche.' :
              'Commencez votre journal émotionnel en écrivant votre première entrée.'
            }
          </p>
          {!searchTerm && !selectedMoodFilter && (
            <Button onClick={() => setShowNewEntry(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Écrire ma première entrée
            </Button>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Journal;
