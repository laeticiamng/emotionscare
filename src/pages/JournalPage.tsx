
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, BookOpen, Plus, Heart, Brain, Sun } from 'lucide-react';

interface JournalEntry {
  id: number;
  date: Date;
  mood: string;
  title: string;
  content: string;
  emotions: string[];
}

const JournalPage: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: 1,
      date: new Date(),
      mood: 'positive',
      title: 'Bonne journée au travail',
      content: 'Aujourd\'hui s\'est très bien passé. J\'ai réussi à terminer mes projets et je me sens accompli.',
      emotions: ['Joie', 'Satisfaction', 'Énergie']
    }
  ]);
  
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: 'neutral',
    emotions: [] as string[]
  });

  const moodColors = {
    positive: 'bg-green-100 text-green-800',
    neutral: 'bg-yellow-100 text-yellow-800',
    negative: 'bg-red-100 text-red-800'
  };

  const addEntry = () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) return;

    const entry: JournalEntry = {
      id: entries.length + 1,
      date: new Date(),
      mood: newEntry.mood,
      title: newEntry.title,
      content: newEntry.content,
      emotions: newEntry.emotions
    };

    setEntries([entry, ...entries]);
    setNewEntry({ title: '', content: '', mood: 'neutral', emotions: [] });
    setShowNewEntry(false);
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Journal Émotionnel</h1>
            <p className="text-gray-600">
              Suivez votre parcours bien-être au quotidien
            </p>
          </div>
          <Button onClick={() => setShowNewEntry(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle entrée
          </Button>
        </div>

        {/* New Entry Form */}
        {showNewEntry && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Nouvelle entrée</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Titre</label>
                <Input
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                  placeholder="Donnez un titre à votre journée..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Comment vous sentez-vous ?</label>
                <div className="flex gap-2">
                  <Button
                    variant={newEntry.mood === 'positive' ? 'default' : 'outline'}
                    onClick={() => setNewEntry({ ...newEntry, mood: 'positive' })}
                    className="flex items-center gap-2"
                  >
                    <Sun className="h-4 w-4" />
                    Positif
                  </Button>
                  <Button
                    variant={newEntry.mood === 'neutral' ? 'default' : 'outline'}
                    onClick={() => setNewEntry({ ...newEntry, mood: 'neutral' })}
                    className="flex items-center gap-2"
                  >
                    <Brain className="h-4 w-4" />
                    Neutre
                  </Button>
                  <Button
                    variant={newEntry.mood === 'negative' ? 'default' : 'outline'}
                    onClick={() => setNewEntry({ ...newEntry, mood: 'negative' })}
                    className="flex items-center gap-2"
                  >
                    <Heart className="h-4 w-4" />
                    Difficile
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Votre ressenti</label>
                <Textarea
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                  placeholder="Décrivez votre journée, vos émotions, vos pensées..."
                  rows={4}
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={addEntry}>Sauvegarder</Button>
                <Button variant="outline" onClick={() => setShowNewEntry(false)}>
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Journal Entries */}
        <div className="space-y-6">
          {entries.map((entry) => (
            <Card key={entry.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      {entry.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {entry.date.toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <Badge className={moodColors[entry.mood as keyof typeof moodColors]}>
                    {entry.mood === 'positive' ? 'Positif' : 
                     entry.mood === 'neutral' ? 'Neutre' : 'Difficile'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{entry.content}</p>
                {entry.emotions.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {entry.emotions.map((emotion, index) => (
                      <Badge key={index} variant="secondary">
                        {emotion}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {entries.length === 0 && !showNewEntry && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-500 mb-2">
              Votre journal est vide
            </h3>
            <p className="text-gray-400 mb-4">
              Commencez par écrire votre première entrée
            </p>
            <Button onClick={() => setShowNewEntry(true)}>
              Écrire ma première entrée
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalPage;
