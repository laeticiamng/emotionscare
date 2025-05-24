
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Calendar,
  Heart,
  Smile,
  Frown,
  Meh,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  Target,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: 'happy' | 'neutral' | 'sad' | 'excited' | 'anxious' | 'calm';
  date: Date;
  tags: string[];
  isPrivate: boolean;
}

const Journal: React.FC = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: 'neutral' as const,
    tags: [] as string[],
    isPrivate: true
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  const isDemoAccount = user?.email?.endsWith('@exemple.fr');

  const demoEntries: JournalEntry[] = isDemoAccount ? [
    {
      id: '1',
      title: 'Première journée de travail',
      content: 'Aujourd\'hui j\'ai commencé mon nouveau travail. Je me sens à la fois excité et un peu nerveux. L\'équipe a l\'air très sympathique et j\'ai hâte d\'apprendre de nouvelles choses.',
      mood: 'excited',
      date: new Date('2024-01-24'),
      tags: ['travail', 'nouveau départ'],
      isPrivate: true
    },
    {
      id: '2',
      title: 'Séance de méditation',
      content: 'J\'ai pris 20 minutes ce matin pour méditer. Cela m\'a vraiment aidé à commencer la journée avec plus de sérénité. Je ressens moins de stress qu\'hier.',
      mood: 'calm',
      date: new Date('2024-01-23'),
      tags: ['méditation', 'bien-être'],
      isPrivate: true
    },
    {
      id: '3',
      title: 'Réunion difficile',
      content: 'La réunion d\'aujourd\'hui ne s\'est pas bien passée. Je me sens un peu découragé mais je sais que demain sera un autre jour. Je vais essayer de voir le positif dans cette situation.',
      mood: 'sad',
      date: new Date('2024-01-22'),
      tags: ['travail', 'défis'],
      isPrivate: true
    }
  ] : [];

  useEffect(() => {
    setEntries(demoEntries);
  }, [isDemoAccount]);

  const moods = [
    { id: 'all', name: 'Toutes', icon: null, color: 'bg-gray-100 text-gray-800' },
    { id: 'happy', name: 'Heureux', icon: <Smile className="h-4 w-4" />, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'excited', name: 'Excité', icon: <Heart className="h-4 w-4" />, color: 'bg-orange-100 text-orange-800' },
    { id: 'calm', name: 'Calme', icon: <Meh className="h-4 w-4" />, color: 'bg-blue-100 text-blue-800' },
    { id: 'neutral', name: 'Neutre', icon: <Meh className="h-4 w-4" />, color: 'bg-gray-100 text-gray-800' },
    { id: 'anxious', name: 'Anxieux', icon: <Frown className="h-4 w-4" />, color: 'bg-red-100 text-red-800' },
    { id: 'sad', name: 'Triste', icon: <Frown className="h-4 w-4" />, color: 'bg-purple-100 text-purple-800' }
  ];

  const filteredEntries = entries.filter(entry => {
    const matchesMood = selectedMood === 'all' || entry.mood === selectedMood;
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesMood && matchesSearch;
  });

  const handleSaveEntry = () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) {
      toast.error('Veuillez remplir le titre et le contenu');
      return;
    }

    const entry: JournalEntry = {
      id: Date.now().toString(),
      title: newEntry.title,
      content: newEntry.content,
      mood: newEntry.mood,
      date: new Date(),
      tags: newEntry.tags,
      isPrivate: newEntry.isPrivate
    };

    setEntries(prev => [entry, ...prev]);
    setNewEntry({
      title: '',
      content: '',
      mood: 'neutral',
      tags: [],
      isPrivate: true
    });
    setShowNewEntry(false);
    toast.success('Entrée sauvegardée dans votre journal');
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
    toast.success('Entrée supprimée');
  };

  const getMoodIcon = (mood: string) => {
    const moodData = moods.find(m => m.id === mood);
    return moodData?.icon || <Meh className="h-4 w-4" />;
  };

  const getMoodColor = (mood: string) => {
    const moodData = moods.find(m => m.id === mood);
    return moodData?.color || 'bg-gray-100 text-gray-800';
  };

  const moodStats = isDemoAccount ? {
    totalEntries: entries.length,
    thisWeek: 3,
    averageMood: 'calm',
    streak: 5
  } : {
    totalEntries: 0,
    thisWeek: 0,
    averageMood: null,
    streak: 0
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Journal personnel</h1>
            <p className="text-muted-foreground mt-1">
              Exprimez vos pensées et suivez votre évolution émotionnelle
            </p>
          </div>
          
          <Button onClick={() => setShowNewEntry(true)} className="mt-4 md:mt-0">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle entrée
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-muted-foreground">Total entrées</span>
            </div>
            <p className="text-2xl font-bold">{moodStats.totalEntries}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-muted-foreground">Cette semaine</span>
            </div>
            <p className="text-2xl font-bold">{moodStats.thisWeek}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-muted-foreground">Humeur moyenne</span>
            </div>
            <p className="text-2xl font-bold">
              {moodStats.averageMood ? 
                moods.find(m => m.id === moodStats.averageMood)?.name || '--' : 
                '--'
              }
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-muted-foreground">Série en cours</span>
            </div>
            <p className="text-2xl font-bold">{moodStats.streak} jours</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* New Entry Modal */}
      {showNewEntry && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
        >
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Nouvelle entrée de journal</CardTitle>
              <CardDescription>
                Exprimez vos pensées et émotions du moment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Titre</label>
                <Input
                  value={newEntry.title}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Donnez un titre à votre entrée..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Comment vous sentez-vous ?</label>
                <div className="flex flex-wrap gap-2">
                  {moods.slice(1).map(mood => (
                    <Button
                      key={mood.id}
                      variant={newEntry.mood === mood.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNewEntry(prev => ({ ...prev, mood: mood.id as any }))}
                      className="flex items-center space-x-1"
                    >
                      {mood.icon}
                      <span>{mood.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Contenu</label>
                <Textarea
                  value={newEntry.content}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Écrivez vos pensées, émotions, événements de la journée..."
                  className="min-h-[200px]"
                />
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setShowNewEntry(false)}>
                  Annuler
                </Button>
                <Button onClick={handleSaveEntry}>
                  Sauvegarder
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher dans vos entrées..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {moods.map(mood => (
                  <Button
                    key={mood.id}
                    variant={selectedMood === mood.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedMood(mood.id)}
                    className="flex items-center space-x-1"
                  >
                    {mood.icon}
                    <span>{mood.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Journal Entries */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Tabs defaultValue="list" className="space-y-6">
          <TabsList>
            <TabsTrigger value="list">Liste</TabsTrigger>
            <TabsTrigger value="calendar">Calendrier</TabsTrigger>
            <TabsTrigger value="analytics">Analyse</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            {filteredEntries.length > 0 ? (
              <div className="space-y-4">
                {filteredEntries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{entry.title}</CardTitle>
                            <CardDescription className="flex items-center space-x-2 mt-1">
                              <Calendar className="h-4 w-4" />
                              <span>{entry.date.toLocaleDateString('fr-FR')}</span>
                              <Badge className={getMoodColor(entry.mood)}>
                                <div className="flex items-center space-x-1">
                                  {getMoodIcon(entry.mood)}
                                  <span>{moods.find(m => m.id === entry.mood)?.name}</span>
                                </div>
                              </Badge>
                            </CardDescription>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => setSelectedEntry(entry)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDeleteEntry(entry.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground line-clamp-3">
                          {entry.content}
                        </p>
                        {entry.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {entry.tags.map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || selectedMood !== 'all' 
                      ? 'Aucune entrée trouvée avec ces critères'
                      : 'Votre journal est vide'
                    }
                  </p>
                  <Button onClick={() => setShowNewEntry(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Créer votre première entrée
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Vue calendrier en cours de développement
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardContent className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Analyse des tendances émotionnelles en cours de développement
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Journal;
