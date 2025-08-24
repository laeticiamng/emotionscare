import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Edit3, 
  Calendar, 
  TrendingUp, 
  Heart, 
  Search,
  Filter,
  Download,
  Plus,
  Smile,
  Meh,
  Frown,
  Tag,
  Clock,
  BarChart3,
  Moon,
  Sun,
  Coffee,
  Target,
  Zap,
  Archive,
  Star,
  MessageCircle,
  PieChart,
  Eye
} from 'lucide-react';

interface JournalEntry {
  id: string;
  date: string;
  time: string;
  title: string;
  content: string;
  mood: 'positive' | 'neutral' | 'negative';
  moodScore: number; // 1-10
  tags: string[];
  category: string;
  isPrivate: boolean;
  weatherMood?: string;
  gratitude?: string[];
  goals?: string[];
  reflection?: string;
}

interface MoodStats {
  averageScore: number;
  totalEntries: number;
  streakDays: number;
  positivePercentage: number;
  topTags: string[];
  moodTrend: 'up' | 'down' | 'stable';
}

const JournalPage: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('week');
  const [activeTab, setActiveTab] = useState('entries');

  // Données simulées
  useEffect(() => {
    const mockEntries: JournalEntry[] = [
      {
        id: '1',
        date: '2024-01-20',
        time: '09:30',
        title: 'Nouvelle journée, nouvelles opportunités',
        content: 'Je me réveille avec une énergie positive aujourd\'hui. La méditation matinale a vraiment aidé à clarifier mes pensées. J\'ai hâte de commencer cette nouvelle semaine avec des objectifs clairs.',
        mood: 'positive',
        moodScore: 8,
        tags: ['motivation', 'méditation', 'objectifs'],
        category: 'personnel',
        isPrivate: false,
        gratitude: ['Santé', 'Famille', 'Nouvelle opportunité'],
        goals: ['Terminer le projet', 'Faire du sport', 'Appeler maman'],
        reflection: 'Je réalise que ma routine matinale a un impact énorme sur ma journée.'
      },
      {
        id: '2',
        date: '2024-01-19',
        time: '18:45',
        title: 'Réflexions sur le stress au travail',
        content: 'Journée difficile au bureau. Beaucoup de pression avec les deadlines qui approchent. J\'ai besoin de mieux gérer mon stress et peut-être prendre plus de pauses.',
        mood: 'negative',
        moodScore: 4,
        tags: ['travail', 'stress', 'gestion'],
        category: 'professionnel',
        isPrivate: true,
        goals: ['Prendre des pauses régulières', 'Organiser mes priorités'],
        reflection: 'Le stress vient souvent d\'un manque d\'organisation.'
      },
      {
        id: '3',
        date: '2024-01-18',
        time: '20:15',
        title: 'Soirée créative',
        content: 'Passé la soirée à peindre. C\'est incroyable comme l\'art peut être thérapeutique. Je me sens apaisé et centré.',
        mood: 'positive',
        moodScore: 9,
        tags: ['créativité', 'art', 'détente'],
        category: 'loisir',
        isPrivate: false,
        gratitude: ['Temps libre', 'Créativité', 'Paix intérieure']
      }
    ];
    setEntries(mockEntries);
  }, []);

  const stats: MoodStats = {
    averageScore: 7.0,
    totalEntries: entries.length,
    streakDays: 5,
    positivePercentage: 67,
    topTags: ['motivation', 'créativité', 'travail', 'méditation'],
    moodTrend: 'up'
  };

  const getMoodIcon = (mood: string, score?: number) => {
    if (score) {
      if (score >= 7) return <Smile className="h-5 w-5 text-green-500" />;
      if (score >= 4) return <Meh className="h-5 w-5 text-yellow-500" />;
      return <Frown className="h-5 w-5 text-red-500" />;
    }
    
    switch (mood) {
      case 'positive': return <Smile className="h-5 w-5 text-green-500" />;
      case 'neutral': return <Meh className="h-5 w-5 text-yellow-500" />;
      case 'negative': return <Frown className="h-5 w-5 text-red-500" />;
      default: return <Meh className="h-5 w-5 text-gray-500" />;
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'positive': return 'from-green-500 to-emerald-600';
      case 'neutral': return 'from-yellow-500 to-orange-500';
      case 'negative': return 'from-red-500 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesMood = selectedMoodFilter === 'all' || entry.mood === selectedMoodFilter;
    
    return matchesSearch && matchesMood;
  });

  const JournalEntryCard = ({ entry }: { entry: JournalEntry }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
            onClick={() => setSelectedEntry(entry)}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {getMoodIcon(entry.mood, entry.moodScore)}
              <div>
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {entry.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{entry.date}</span>
                  <Clock className="h-4 w-4 ml-2" />
                  <span>{entry.time}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{entry.category}</Badge>
              {entry.isPrivate && <Eye className="h-4 w-4 text-muted-foreground" />}
            </div>
          </div>
          
          <p className="text-muted-foreground mb-4 line-clamp-2">
            {entry.content}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {entry.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
              {entry.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{entry.tags.length - 3}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">{entry.moodScore}/10</span>
              <Progress value={entry.moodScore * 10} className="w-12 h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const EntryCreationModal = () => {
    const [newEntry, setNewEntry] = useState<Partial<JournalEntry>>({
      title: '',
      content: '',
      mood: 'neutral',
      moodScore: 5,
      tags: [],
      category: 'personnel',
      isPrivate: false,
      gratitude: ['', '', ''],
      goals: ['', '', ''],
      reflection: ''
    });
    
    const [newTag, setNewTag] = useState('');

    const handleSubmit = () => {
      if (!newEntry.title || !newEntry.content) return;
      
      const entry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        title: newEntry.title!,
        content: newEntry.content!,
        mood: newEntry.mood as any,
        moodScore: newEntry.moodScore!,
        tags: newEntry.tags!,
        category: newEntry.category!,
        isPrivate: newEntry.isPrivate!,
        gratitude: newEntry.gratitude?.filter(g => g.trim() !== ''),
        goals: newEntry.goals?.filter(g => g.trim() !== ''),
        reflection: newEntry.reflection
      };
      
      setEntries(prev => [entry, ...prev]);
      setIsCreateModalOpen(false);
      
      // Reset form
      setNewEntry({
        title: '',
        content: '',
        mood: 'neutral',
        moodScore: 5,
        tags: [],
        category: 'personnel',
        isPrivate: false,
        gratitude: ['', '', ''],
        goals: ['', '', ''],
        reflection: ''
      });
    };

    const addTag = () => {
      if (newTag.trim() && !newEntry.tags?.includes(newTag.trim())) {
        setNewEntry(prev => ({
          ...prev,
          tags: [...(prev.tags || []), newTag.trim()]
        }));
        setNewTag('');
      }
    };

    const removeTag = (tagToRemove: string) => {
      setNewEntry(prev => ({
        ...prev,
        tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
      }));
    };

    return (
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5" />
              Nouvelle entrée de journal
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre de l'entrée</Label>
                <Input
                  id="title"
                  value={newEntry.title}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Comment s'est passée votre journée ?"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select value={newEntry.category} onValueChange={(value) => setNewEntry(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personnel">Personnel</SelectItem>
                    <SelectItem value="professionnel">Professionnel</SelectItem>
                    <SelectItem value="loisir">Loisir</SelectItem>
                    <SelectItem value="famille">Famille</SelectItem>
                    <SelectItem value="santé">Santé</SelectItem>
                    <SelectItem value="voyage">Voyage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Votre réflexion</Label>
              <Textarea
                id="content"
                value={newEntry.content}
                onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Exprimez vos pensées, sentiments et réflexions..."
                className="min-h-[120px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Humeur générale</Label>
                  <div className="flex gap-2">
                    {[
                      { value: 'positive', icon: Smile, color: 'text-green-500' },
                      { value: 'neutral', icon: Meh, color: 'text-yellow-500' },
                      { value: 'negative', icon: Frown, color: 'text-red-500' }
                    ].map(({ value, icon: Icon, color }) => (
                      <Button
                        key={value}
                        type="button"
                        variant={newEntry.mood === value ? "default" : "outline"}
                        onClick={() => setNewEntry(prev => ({ ...prev, mood: value as any }))}
                        className="flex-1"
                      >
                        <Icon className={`h-4 w-4 mr-2 ${color}`} />
                        {value === 'positive' ? 'Positive' : value === 'neutral' ? 'Neutre' : 'Négative'}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Score d'humeur: {newEntry.moodScore}/10</Label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newEntry.moodScore}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, moodScore: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Ajouter un tag"
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {newEntry.tags?.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Tabs defaultValue="gratitude" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="gratitude">Gratitude</TabsTrigger>
                <TabsTrigger value="goals">Objectifs</TabsTrigger>
                <TabsTrigger value="reflection">Réflexion</TabsTrigger>
              </TabsList>
              
              <TabsContent value="gratitude" className="space-y-2">
                <Label>3 choses pour lesquelles vous êtes reconnaissant(e)</Label>
                {newEntry.gratitude?.map((item, index) => (
                  <Input
                    key={index}
                    value={item}
                    onChange={(e) => {
                      const newGratitude = [...(newEntry.gratitude || [])];
                      newGratitude[index] = e.target.value;
                      setNewEntry(prev => ({ ...prev, gratitude: newGratitude }));
                    }}
                    placeholder={`Gratitude ${index + 1}`}
                  />
                ))}
              </TabsContent>
              
              <TabsContent value="goals" className="space-y-2">
                <Label>Objectifs pour demain</Label>
                {newEntry.goals?.map((goal, index) => (
                  <Input
                    key={index}
                    value={goal}
                    onChange={(e) => {
                      const newGoals = [...(newEntry.goals || [])];
                      newGoals[index] = e.target.value;
                      setNewEntry(prev => ({ ...prev, goals: newGoals }));
                    }}
                    placeholder={`Objectif ${index + 1}`}
                  />
                ))}
              </TabsContent>
              
              <TabsContent value="reflection" className="space-y-2">
                <Label>Réflexion du jour</Label>
                <Textarea
                  value={newEntry.reflection}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, reflection: e.target.value }))}
                  placeholder="Qu'avez-vous appris aujourd'hui ?"
                  className="min-h-[80px]"
                />
              </TabsContent>
            </Tabs>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="private"
                  checked={newEntry.isPrivate}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, isPrivate: e.target.checked }))}
                />
                <Label htmlFor="private">Entrée privée</Label>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleSubmit}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Enregistrer
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl" data-testid="page-root">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            📔 Journal Émotionnel
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Suivez votre parcours émotionnel, vos réflexions et votre croissance personnelle
          </p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{stats.averageScore}</div>
              <p className="text-sm text-muted-foreground">Score moyen</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{stats.totalEntries}</div>
              <p className="text-sm text-muted-foreground">Entrées totales</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <div className="text-2xl font-bold">{stats.streakDays}</div>
              <p className="text-sm text-muted-foreground">Jours consécutifs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Heart className="h-8 w-8 mx-auto mb-2 text-pink-500" />
              <div className="text-2xl font-bold">{stats.positivePercentage}%</div>
              <p className="text-sm text-muted-foreground">Humeur positive</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="entries" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Mes Entrées
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Calendrier
              </TabsTrigger>
            </TabsList>

            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary to-purple-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle entrée
                </Button>
              </DialogTrigger>
              <EntryCreationModal />
            </Dialog>
          </div>

          <TabsContent value="entries" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher dans vos entrées..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <Select value={selectedMoodFilter} onValueChange={setSelectedMoodFilter}>
                    <SelectTrigger className="w-[140px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      <SelectItem value="positive">Positive</SelectItem>
                      <SelectItem value="neutral">Neutre</SelectItem>
                      <SelectItem value="negative">Négative</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Entries List */}
            <div className="space-y-4">
              <AnimatePresence>
                {filteredEntries.map((entry) => (
                  <JournalEntryCard key={entry.id} entry={entry} />
                ))}
              </AnimatePresence>
              
              {filteredEntries.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Aucune entrée trouvée</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm ? 'Essayez un autre terme de recherche' : 'Commencez votre journal dès aujourd\'hui'}
                    </p>
                    <Button onClick={() => setIsCreateModalOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Créer votre première entrée
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tendance de l'humeur</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Humeur positive</span>
                      <div className="flex items-center gap-2">
                        <Progress value={stats.positivePercentage} className="w-20" />
                        <span className="text-sm font-medium">{stats.positivePercentage}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Humeur neutre</span>
                      <div className="flex items-center gap-2">
                        <Progress value={23} className="w-20" />
                        <span className="text-sm font-medium">23%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Humeur négative</span>
                      <div className="flex items-center gap-2">
                        <Progress value={10} className="w-20" />
                        <span className="text-sm font-medium">10%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tags populaires</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {stats.topTags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Insights personnalisés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Meilleur moment</h4>
                      <p className="text-sm text-blue-700">Vos entrées matinales sont généralement plus positives</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">Progression</h4>
                      <p className="text-sm text-green-700">Votre bien-être s'améliore de 12% ce mois-ci</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2">Recommandation</h4>
                      <p className="text-sm text-purple-700">Continuez vos sessions de méditation</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vue calendrier - Janvier 2024</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                    <div key={day} className="text-center font-semibold p-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                    const hasEntry = entries.some(entry => 
                      new Date(entry.date).getDate() === day
                    );
                    const entryForDay = entries.find(entry => 
                      new Date(entry.date).getDate() === day
                    );
                    
                    return (
                      <div
                        key={day}
                        className={`
                          aspect-square p-2 rounded-lg text-center cursor-pointer transition-colors
                          ${hasEntry 
                            ? `bg-gradient-to-br ${getMoodColor(entryForDay?.mood || 'neutral')} text-white` 
                            : 'bg-gray-50 hover:bg-gray-100'
                          }
                        `}
                      >
                        <div className="text-sm font-medium">{day}</div>
                        {hasEntry && (
                          <div className="text-xs mt-1">
                            {getMoodIcon(entryForDay?.mood || 'neutral')}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Entry Detail Modal */}
        {selectedEntry && (
          <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getMoodIcon(selectedEntry.mood, selectedEntry.moodScore)}
                  {selectedEntry.title}
                </DialogTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{selectedEntry.date} à {selectedEntry.time}</span>
                  <Badge variant="outline">{selectedEntry.category}</Badge>
                  <span>Score: {selectedEntry.moodScore}/10</span>
                </div>
              </DialogHeader>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Contenu</h4>
                  <p className="text-muted-foreground leading-relaxed">{selectedEntry.content}</p>
                </div>

                {selectedEntry.gratitude && selectedEntry.gratitude.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Gratitude</h4>
                    <ul className="space-y-1">
                      {selectedEntry.gratitude.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedEntry.goals && selectedEntry.goals.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Objectifs</h4>
                    <ul className="space-y-1">
                      {selectedEntry.goals.map((goal, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-blue-500" />
                          <span>{goal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedEntry.reflection && (
                  <div>
                    <h4 className="font-semibold mb-2">Réflexion</h4>
                    <p className="text-muted-foreground italic">{selectedEntry.reflection}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-1">
                  {selectedEntry.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </motion.div>
    </div>
  );
};

export default JournalPage;