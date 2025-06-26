
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BookOpen, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  Heart, 
  Brain,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  Eye
} from 'lucide-react';
import EmotionCircleSelector from '@/components/journal/EmotionCircleSelector';
import { JournalEntry } from '@/types/journal';
import { addJournalEntry, getJournalEntries, deleteJournalEntry } from '@/lib/journalService';

const JournalPage: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentEntry, setCurrentEntry] = useState<Partial<JournalEntry>>({
    title: '',
    content: '',
    mood: '',
    tags: []
  });
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [filterMood, setFilterMood] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isWriting, setIsWriting] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const userEntries = await getJournalEntries('current-user');
      setEntries(userEntries);
    } catch (error) {
      console.error('Erreur lors du chargement des entrées:', error);
    }
  };

  const handleSaveEntry = async () => {
    if (!currentEntry.content || !selectedEmotion) return;

    try {
      const newEntry = await addJournalEntry({
        ...currentEntry,
        mood: selectedEmotion,
        user_id: 'current-user',
        date: selectedDate.toISOString(),
        tags: currentEntry.tags || []
      } as Omit<JournalEntry, 'id'>);

      setEntries([newEntry, ...entries]);
      setCurrentEntry({ title: '', content: '', mood: '', tags: [] });
      setSelectedEmotion(null);
      setIsWriting(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    await deleteJournalEntry(entryId);
    setEntries(entries.filter(entry => entry.id !== entryId));
  };

  const filteredEntries = entries.filter(entry => {
    const matchesMood = filterMood === 'all' || entry.mood === filterMood;
    const matchesSearch = entry.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMood && matchesSearch;
  });

  const moodStats = entries.reduce((acc, entry) => {
    acc[entry.mood || 'unknown'] = (acc[entry.mood || 'unknown'] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="container mx-auto py-6 space-y-6" data-testid="page-root">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Mon Journal Émotionnel</h1>
        </div>
        <Button onClick={() => setIsWriting(true)} className="bg-gradient-to-r from-blue-500 to-purple-500">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Entrée
        </Button>
      </motion.div>

      <Tabs defaultValue="entries" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="entries">Mes Entrées</TabsTrigger>
          <TabsTrigger value="write">Écrire</TabsTrigger>
          <TabsTrigger value="analytics">Analyses</TabsTrigger>
          <TabsTrigger value="calendar">Calendrier</TabsTrigger>
        </TabsList>

        <TabsContent value="entries" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Historique des Entrées</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={filterMood} onValueChange={setFilterMood}>
                    <SelectTrigger className="w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Humeur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      <SelectItem value="joy">Joie</SelectItem>
                      <SelectItem value="calm">Calme</SelectItem>
                      <SelectItem value="sad">Tristesse</SelectItem>
                      <SelectItem value="energetic">Énergique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEntries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 border rounded-lg hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{entry.title || 'Sans titre'}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="capitalize">
                          {entry.mood}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEntry(entry.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm line-clamp-3 mb-2">{entry.content}</p>
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {entry.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
                {filteredEntries.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune entrée trouvée</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="write" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Edit className="h-5 w-5" />
                <span>Nouvelle Entrée</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Titre (optionnel)</label>
                <Input
                  placeholder="Donnez un titre à votre entrée..."
                  value={currentEntry.title || ''}
                  onChange={(e) => setCurrentEntry({...currentEntry, title: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-4 block">Comment vous sentez-vous ?</label>
                <EmotionCircleSelector
                  onSelect={setSelectedEmotion}
                  selected={selectedEmotion}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Vos pensées</label>
                <Textarea
                  placeholder="Décrivez votre journée, vos émotions, vos réflexions..."
                  rows={8}
                  value={currentEntry.content || ''}
                  onChange={(e) => setCurrentEntry({...currentEntry, content: e.target.value})}
                  className="resize-none"
                />
              </div>

              <div className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  {currentEntry.content?.length || 0} caractères
                </div>
                <Button
                  onClick={handleSaveEntry}
                  disabled={!currentEntry.content || !selectedEmotion}
                  className="bg-gradient-to-r from-green-500 to-blue-500"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Sauvegarder
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Statistiques</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total d'entrées</span>
                    <Badge>{entries.length}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Cette semaine</span>
                    <Badge variant="outline">
                      {entries.filter(e => 
                        new Date(e.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                      ).length}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Ce mois</span>
                    <Badge variant="outline">
                      {entries.filter(e => 
                        new Date(e.date).getMonth() === new Date().getMonth()
                      ).length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>Répartition des Humeurs</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(moodStats).map(([mood, count]) => (
                    <div key={mood} className="flex items-center justify-between">
                      <span className="capitalize text-sm">{mood}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${(count / entries.length) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter en PDF
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Rapport mensuel
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5" />
                <span>Calendrier Émotionnel</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
                <div className="space-y-4">
                  <h3 className="font-semibold">
                    Entrées du {selectedDate.toLocaleDateString('fr-FR')}
                  </h3>
                  {entries
                    .filter(entry => 
                      new Date(entry.date).toDateString() === selectedDate.toDateString()
                    )
                    .map(entry => (
                      <Card key={entry.id} className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="capitalize">{entry.mood}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(entry.date).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <h4 className="font-medium">{entry.title || 'Sans titre'}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {entry.content}
                        </p>
                      </Card>
                    ))
                  }
                  {entries.filter(entry => 
                    new Date(entry.date).toDateString() === selectedDate.toDateString()
                  ).length === 0 && (
                    <p className="text-muted-foreground text-center py-4">
                      Aucune entrée pour cette date
                    </p>
                  )}
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
