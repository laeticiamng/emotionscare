
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { BookOpen, Plus, Search, Filter, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface JournalEntry {
  id: string;
  date: Date;
  title: string;
  content: string;
  emotion: string;
  mood: number;
  tags: string[];
}

const B2CJournal: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      date: new Date(),
      title: 'Journée productive au bureau',
      content: 'Aujourd\'hui j\'ai réussi à terminer tous mes projets en cours. Je me sens accompli et satisfait de ma journée.',
      emotion: 'satisfied',
      mood: 8,
      tags: ['travail', 'productivité', 'satisfaction']
    },
    {
      id: '2',
      date: new Date(Date.now() - 86400000), // Hier
      title: 'Moment de stress',
      content: 'Beaucoup de pression aujourd\'hui avec les deadlines. J\'ai pris le temps de faire quelques exercices de respiration.',
      emotion: 'stressed',
      mood: 5,
      tags: ['stress', 'deadline', 'respiration']
    }
  ]);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    emotion: '',
    mood: 5,
    tags: ''
  });
  const [showNewEntry, setShowNewEntry] = useState(false);

  const emotions = [
    { value: 'happy', label: 'Heureux', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'sad', label: 'Triste', color: 'bg-blue-100 text-blue-800' },
    { value: 'stressed', label: 'Stressé', color: 'bg-red-100 text-red-800' },
    { value: 'calm', label: 'Calme', color: 'bg-green-100 text-green-800' },
    { value: 'excited', label: 'Excité', color: 'bg-purple-100 text-purple-800' },
    { value: 'satisfied', label: 'Satisfait', color: 'bg-indigo-100 text-indigo-800' }
  ];

  const handleAddEntry = () => {
    if (newEntry.title && newEntry.content) {
      const entry: JournalEntry = {
        id: Date.now().toString(),
        date: selectedDate,
        title: newEntry.title,
        content: newEntry.content,
        emotion: newEntry.emotion,
        mood: newEntry.mood,
        tags: newEntry.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };
      
      setEntries(prev => [entry, ...prev]);
      setNewEntry({ title: '', content: '', emotion: '', mood: 5, tags: '' });
      setShowNewEntry(false);
    }
  };

  const getEmotionColor = (emotion: string) => {
    const emotionObj = emotions.find(e => e.value === emotion);
    return emotionObj?.color || 'bg-gray-100 text-gray-800';
  };

  const getMoodEmoji = (mood: number) => {
    if (mood >= 8) return '😊';
    if (mood >= 6) return '🙂';
    if (mood >= 4) return '😐';
    if (mood >= 2) return '😕';
    return '😢';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Journal Émotionnel</h1>
          <p className="text-muted-foreground">Suivez vos émotions et réflexions au quotidien</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendrier et actions */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Calendrier</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                locale={fr}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                onClick={() => setShowNewEntry(true)} 
                className="w-full"
                disabled={showNewEntry}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle entrée
              </Button>
              
              <Button variant="outline" className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Rechercher
              </Button>
              
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Filtrer
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Entrées ce mois</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Humeur moyenne</span>
                <span className="font-medium">6.5/10</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Série actuelle</span>
                <span className="font-medium">5 jours</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenu principal */}
        <div className="lg:col-span-3 space-y-4">
          {/* Formulaire nouvelle entrée */}
          {showNewEntry && (
            <Card>
              <CardHeader>
                <CardTitle>Nouvelle Entrée - {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Titre</label>
                  <Input
                    value={newEntry.title}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Donnez un titre à votre entrée"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Comment vous sentez-vous ?</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {emotions.map((emotion) => (
                      <Button
                        key={emotion.value}
                        variant={newEntry.emotion === emotion.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setNewEntry(prev => ({ ...prev, emotion: emotion.value }))}
                      >
                        {emotion.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Humeur (1-10)</label>
                  <div className="flex items-center gap-3 mt-2">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={newEntry.mood}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, mood: parseInt(e.target.value) }))}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-12">
                      {newEntry.mood} {getMoodEmoji(newEntry.mood)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Vos pensées</label>
                  <Textarea
                    value={newEntry.content}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Décrivez votre journée, vos émotions, vos réflexions..."
                    rows={4}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Tags (séparés par des virgules)</label>
                  <Input
                    value={newEntry.tags}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="travail, famille, loisirs..."
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleAddEntry}>
                    Enregistrer l'entrée
                  </Button>
                  <Button variant="outline" onClick={() => setShowNewEntry(false)}>
                    Annuler
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Liste des entrées */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Vos entrées récentes</h2>
            
            {entries.map((entry) => (
              <Card key={entry.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{entry.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {format(entry.date, 'dd MMMM yyyy', { locale: fr })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                      <span className="text-sm font-medium">{entry.mood}/10</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">{entry.content}</p>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    {entry.emotion && (
                      <Badge className={getEmotionColor(entry.emotion)}>
                        {emotions.find(e => e.value === entry.emotion)?.label || entry.emotion}
                      </Badge>
                    )}
                    
                    {entry.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            {entries.length === 0 && !showNewEntry && (
              <Card>
                <CardContent className="py-12 text-center">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucune entrée pour cette date</h3>
                  <p className="text-muted-foreground mb-4">
                    Commencez votre journal en ajoutant votre première entrée
                  </p>
                  <Button onClick={() => setShowNewEntry(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une entrée
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2CJournal;
