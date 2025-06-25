
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { BookOpen, Plus, Search, Heart, Brain, Star, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface JournalEntry {
  id: number;
  date: string;
  title: string;
  content: string;
  mood: string;
  tags: string[];
  moodScore: number;
}

const JournalPage: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState({ title: '', content: '', mood: 'Neutre', tags: '' });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [isWriting, setIsWriting] = useState(false);

  const moodOptions = [
    { name: 'Excellent', color: 'bg-green-500', score: 5 },
    { name: 'Bien', color: 'bg-blue-500', score: 4 },
    { name: 'Neutre', color: 'bg-gray-500', score: 3 },
    { name: 'Difficile', color: 'bg-orange-500', score: 2 },
    { name: 'Très difficile', color: 'bg-red-500', score: 1 }
  ];

  const mockEntries: JournalEntry[] = [
    {
      id: 1,
      date: '2024-01-15',
      title: 'Journée productive au travail',
      content: 'Aujourd\'hui j\'ai réussi à terminer tous mes projets en cours. Je me sens accompli et satisfait de mes résultats.',
      mood: 'Bien',
      tags: ['travail', 'productivité', 'satisfaction'],
      moodScore: 4
    },
    {
      id: 2,
      date: '2024-01-14',
      title: 'Moment de stress',
      content: 'J\'ai ressenti beaucoup de pression aujourd\'hui. Heureusement, les exercices de respiration m\'ont aidé.',
      mood: 'Difficile',
      tags: ['stress', 'respiration', 'gestion'],
      moodScore: 2
    },
    {
      id: 3,
      date: '2024-01-13',
      title: 'Belle soirée en famille',
      content: 'Nous avons passé une merveilleuse soirée ensemble. Ces moments sont précieux.',
      mood: 'Excellent',
      tags: ['famille', 'bonheur', 'gratitude'],
      moodScore: 5
    }
  ];

  useEffect(() => {
    setEntries(mockEntries);
  }, []);

  const handleSaveEntry = () => {
    if (!newEntry.title || !newEntry.content) {
      toast.error('Veuillez remplir le titre et le contenu');
      return;
    }

    const mood = moodOptions.find(m => m.name === newEntry.mood) || moodOptions[2];
    const entry: JournalEntry = {
      id: Date.now(),
      date: selectedDate.toISOString().split('T')[0],
      title: newEntry.title,
      content: newEntry.content,
      mood: newEntry.mood,
      tags: newEntry.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      moodScore: mood.score
    };

    setEntries([entry, ...entries]);
    setNewEntry({ title: '', content: '', mood: 'Neutre', tags: '' });
    setIsWriting(false);
    toast.success('Entrée sauvegardée avec succès !');
  };

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const averageMood = entries.length > 0 
    ? entries.reduce((sum, entry) => sum + entry.moodScore, 0) / entries.length 
    : 0;

  const getMoodTrend = () => {
    if (entries.length < 2) return 'stable';
    const recent = entries.slice(0, 3).reduce((sum, entry) => sum + entry.moodScore, 0) / 3;
    const older = entries.slice(3, 6).reduce((sum, entry) => sum + entry.moodScore, 0) / 3;
    if (recent > older) return 'up';
    if (recent < older) return 'down';
    return 'stable';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4" data-testid="journal-page">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Journal Émotionnel</h1>
          <p className="text-xl text-gray-600">Suivez votre parcours émotionnel au quotidien</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Statistiques */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Aperçu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-1">
                    {averageMood.toFixed(1)}/5
                  </div>
                  <p className="text-sm text-gray-600">Humeur moyenne</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Entrées totales</span>
                    <span className="font-medium">{entries.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Cette semaine</span>
                    <span className="font-medium">5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tendance</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className={`h-4 w-4 ${
                        getMoodTrend() === 'up' ? 'text-green-500' : 
                        getMoodTrend() === 'down' ? 'text-red-500' : 'text-gray-500'
                      }`} />
                      <span className="text-sm font-medium">
                        {getMoodTrend() === 'up' ? 'Amélioration' : 
                         getMoodTrend() === 'down' ? 'En baisse' : 'Stable'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Calendrier</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
          </div>

          {/* Contenu Principal */}
          <div className="lg:col-span-3 space-y-6">
            <Tabs defaultValue="entries" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="entries">Mes Entrées</TabsTrigger>
                <TabsTrigger value="write">Écrire</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="entries" className="space-y-4">
                {/* Barre de recherche */}
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Rechercher dans vos entrées..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button onClick={() => setIsWriting(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nouvelle entrée
                  </Button>
                </div>

                {/* Liste des entrées */}
                <div className="space-y-4">
                  <AnimatePresence>
                    {filteredEntries.map((entry) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <Card className="hover:shadow-md transition-shadow">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-lg">{entry.title}</CardTitle>
                                <p className="text-sm text-gray-600">{entry.date}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge 
                                  className={`${moodOptions.find(m => m.name === entry.mood)?.color || 'bg-gray-500'} text-white`}
                                >
                                  {entry.mood}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-700 mb-4">{entry.content}</p>
                            <div className="flex flex-wrap gap-2">
                              {entry.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {filteredEntries.length === 0 && (
                  <Card>
                    <CardContent className="text-center py-12">
                      <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        {searchTerm ? 'Aucune entrée trouvée pour cette recherche.' : 'Aucune entrée pour le moment. Commencez à écrire !'}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="write" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Nouvelle Entrée
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Titre</label>
                      <Input
                        placeholder="Donnez un titre à votre entrée..."
                        value={newEntry.title}
                        onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Comment vous sentez-vous ?</label>
                      <div className="flex flex-wrap gap-2">
                        {moodOptions.map((mood) => (
                          <Button
                            key={mood.name}
                            variant={newEntry.mood === mood.name ? "default" : "outline"}
                            size="sm"
                            onClick={() => setNewEntry({...newEntry, mood: mood.name})}
                            className={newEntry.mood === mood.name ? `${mood.color} text-white` : ''}
                          >
                            {mood.name}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Votre réflexion</label>
                      <Textarea
                        placeholder="Exprimez vos pensées, sentiments et expériences..."
                        rows={8}
                        value={newEntry.content}
                        onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Tags (séparés par des virgules)</label>
                      <Input
                        placeholder="travail, famille, stress, bonheur..."
                        value={newEntry.tags}
                        onChange={(e) => setNewEntry({...newEntry, tags: e.target.value})}
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button onClick={handleSaveEntry} className="bg-orange-600 hover:bg-orange-700">
                        <Heart className="mr-2 h-4 w-4" />
                        Sauvegarder
                      </Button>
                      <Button variant="outline" onClick={() => setNewEntry({ title: '', content: '', mood: 'Neutre', tags: '' })}>
                        Effacer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="insights" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5" />
                        Patterns Émotionnels
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Émotions les plus fréquentes</p>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Bien</span>
                              <span className="font-medium">40%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Neutre</span>
                              <span className="font-medium">30%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Excellent</span>
                              <span className="font-medium">20%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Difficile</span>
                              <span className="font-medium">10%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5" />
                        Recommandations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm font-medium text-blue-800">Continuez à écrire !</p>
                          <p className="text-xs text-blue-600">Une pratique régulière améliore votre bien-être</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <p className="text-sm font-medium text-green-800">Explorez vos émotions</p>
                          <p className="text-xs text-green-600">Identifiez les déclencheurs positifs</p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <p className="text-sm font-medium text-purple-800">Partagez avec un proche</p>
                          <p className="text-xs text-purple-600">Le partage renforce les liens sociaux</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalPage;
