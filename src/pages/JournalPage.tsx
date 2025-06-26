
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Calendar,
  Heart,
  Smile,
  Frown,
  Meh,
  Filter,
  Edit,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import JournalTabNavigation from '@/components/journal/JournalTabNavigation';
import BackgroundAnimation from '@/components/journal/BackgroundAnimation';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: 'happy' | 'neutral' | 'sad';
  date: Date;
  tags: string[];
}

const JournalPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'mood'>('list');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: 'neutral' as 'happy' | 'neutral' | 'sad',
    tags: [] as string[]
  });

  // Données de démonstration
  useEffect(() => {
    const mockEntries: JournalEntry[] = [
      {
        id: '1',
        title: 'Une journée productive',
        content: 'Aujourd\'hui j\'ai réussi à accomplir plusieurs tâches importantes. Je me sens fier de mes progrès et motivé pour continuer.',
        mood: 'happy',
        date: new Date(2024, 0, 15),
        tags: ['productivité', 'motivation', 'travail']
      },
      {
        id: '2',
        title: 'Réflexions du soir',
        content: 'Parfois il est important de prendre du recul et de réfléchir à ses émotions. La méditation m\'aide beaucoup.',
        mood: 'neutral',
        date: new Date(2024, 0, 14),
        tags: ['méditation', 'réflexion', 'calme']
      },
      {
        id: '3',
        title: 'Journée difficile',
        content: 'Aujourd\'hui a été compliqué, mais j\'ai appris que c\'est normal d\'avoir des hauts et des bas. Demain sera un nouveau jour.',
        mood: 'sad',
        date: new Date(2024, 0, 13),
        tags: ['difficultés', 'apprentissage', 'espoir']
      }
    ];
    setEntries(mockEntries);
  }, []);

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'happy': return <Smile className="h-5 w-5 text-green-500" />;
      case 'sad': return <Frown className="h-5 w-5 text-red-500" />;
      default: return <Meh className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'happy': return 'bg-green-100 text-green-800';
      case 'sad': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const addEntry = () => {
    if (newEntry.title && newEntry.content) {
      const entry: JournalEntry = {
        id: Date.now().toString(),
        title: newEntry.title,
        content: newEntry.content,
        mood: newEntry.mood,
        date: new Date(),
        tags: newEntry.tags
      };
      setEntries([entry, ...entries]);
      setNewEntry({ title: '', content: '', mood: 'neutral', tags: [] });
      setShowNewEntry(false);
    }
  };

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const moodStats = {
    happy: entries.filter(e => e.mood === 'happy').length,
    neutral: entries.filter(e => e.mood === 'neutral').length,
    sad: entries.filter(e => e.mood === 'sad').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 relative overflow-hidden" data-testid="page-root">
      <BackgroundAnimation musicEnabled={false} emotion="calm" />
      
      <div className="container mx-auto p-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Journal Émotionnel
          </h1>
          <p className="text-gray-600 text-lg">
            Exprimez vos pensées et suivez votre parcours émotionnel
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher dans vos entrées..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button
            onClick={() => setShowNewEntry(!showNewEntry)}
            className="bg-purple-500 hover:bg-purple-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle entrée
          </Button>
        </div>

        {showNewEntry && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6"
          >
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Nouvelle entrée
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Titre de votre entrée..."
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                />
                <Textarea
                  placeholder="Exprimez vos pensées et émotions..."
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
                  rows={4}
                />
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Humeur :</span>
                  <div className="flex gap-2">
                    {(['happy', 'neutral', 'sad'] as const).map((mood) => (
                      <Button
                        key={mood}
                        variant={newEntry.mood === mood ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setNewEntry({...newEntry, mood})}
                        className="flex items-center gap-1"
                      >
                        {getMoodIcon(mood)}
                        {mood === 'happy' ? 'Joyeux' : mood === 'sad' ? 'Triste' : 'Neutre'}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowNewEntry(false)}>
                    Annuler
                  </Button>
                  <Button onClick={addEntry} className="bg-purple-500 hover:bg-purple-600">
                    Enregistrer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <JournalTabNavigation viewMode={viewMode} onViewChange={setViewMode}>
          {viewMode === 'list' && (
            <div className="space-y-4">
              {filteredEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{entry.title}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            {format(entry.date, 'dd MMMM yyyy', { locale: fr })}
                            {getMoodIcon(entry.mood)}
                          </div>
                        </div>
                        <Badge className={getMoodColor(entry.mood)}>
                          {entry.mood === 'happy' ? 'Joyeux' : entry.mood === 'sad' ? 'Triste' : 'Neutre'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-3">{entry.content}</p>
                      <div className="flex flex-wrap gap-1">
                        {entry.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {viewMode === 'mood' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-green-50 border-green-200">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <Smile className="h-5 w-5" />
                    Moments Joyeux
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2">{moodStats.happy}</div>
                  <p className="text-sm text-green-600">entrées positives</p>
                </CardContent>
              </Card>

              <Card className="bg-yellow-50 border-yellow-200">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-yellow-700">
                    <Meh className="h-5 w-5" />
                    Moments Neutres
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600 mb-2">{moodStats.neutral}</div>
                  <p className="text-sm text-yellow-600">entrées neutres</p>
                </CardContent>
              </Card>

              <Card className="bg-red-50 border-red-200">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <Frown className="h-5 w-5" />
                    Moments Difficiles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600 mb-2">{moodStats.sad}</div>
                  <p className="text-sm text-red-600">entrées difficiles</p>
                </CardContent>
              </Card>
            </div>
          )}
        </JournalTabNavigation>
      </div>
    </div>
  );
};

export default JournalPage;
