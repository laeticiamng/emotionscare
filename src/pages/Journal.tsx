
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, Plus, Search, Calendar, Heart, 
  Trash2, Edit, Save, X, Tag, TrendingUp 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import LoadingAnimation from '@/components/ui/loading-animation';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  tags: string[];
  date: Date;
  emotionScore: number;
}

const Journal: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: 'neutre',
    tags: [] as string[],
    currentTag: ''
  });

  const moods = [
    { id: 'all', label: 'Tous', color: 'bg-gray-100 text-gray-700' },
    { id: 'joyeux', label: '😊 Joyeux', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'calme', label: '😌 Calme', color: 'bg-blue-100 text-blue-700' },
    { id: 'energique', label: '⚡ Énergique', color: 'bg-orange-100 text-orange-700' },
    { id: 'pensif', label: '🤔 Pensif', color: 'bg-purple-100 text-purple-700' },
    { id: 'triste', label: '😢 Triste', color: 'bg-gray-100 text-gray-700' },
    { id: 'stresse', label: '😰 Stressé', color: 'bg-red-100 text-red-700' },
    { id: 'neutre', label: '😐 Neutre', color: 'bg-slate-100 text-slate-700' }
  ];

  useEffect(() => {
    // Simuler le chargement des entrées
    setTimeout(() => {
      const mockEntries: JournalEntry[] = [
        {
          id: '1',
          title: 'Une journée productive',
          content: 'Aujourd\'hui j\'ai réussi à terminer tous mes projets. Je me sens accompli et satisfait du travail accompli. Cette sensation de réussite me motive pour demain.',
          mood: 'joyeux',
          tags: ['travail', 'productivité', 'satisfaction'],
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          emotionScore: 8.5
        },
        {
          id: '2',
          title: 'Moment de réflexion',
          content: 'Pause dans mon jardin ce matin. Les oiseaux chantent et le soleil réchauffe doucement ma peau. Ces moments simples me rappellent l\'importance de savourer l\'instant présent.',
          mood: 'calme',
          tags: ['nature', 'méditation', 'gratitude'],
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          emotionScore: 7.2
        },
        {
          id: '3',
          title: 'Défis et apprentissages',
          content: 'Journée difficile mais riche en apprentissages. Chaque obstacle surmonté me rend plus fort. Je commence à voir les difficultés comme des opportunités de croissance.',
          mood: 'pensif',
          tags: ['croissance', 'défis', 'apprentissage'],
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          emotionScore: 6.8
        }
      ];
      setEntries(mockEntries);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSaveEntry = () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) return;

    const entry: JournalEntry = {
      id: Date.now().toString(),
      title: newEntry.title,
      content: newEntry.content,
      mood: newEntry.mood,
      tags: newEntry.tags,
      date: new Date(),
      emotionScore: Math.random() * 3 + 7 // Score entre 7 et 10 pour une nouvelle entrée
    };

    setEntries(prev => [entry, ...prev]);
    setNewEntry({
      title: '',
      content: '',
      mood: 'neutre',
      tags: [],
      currentTag: ''
    });
    setShowNewEntry(false);
  };

  const handleAddTag = () => {
    if (newEntry.currentTag.trim() && !newEntry.tags.includes(newEntry.currentTag.trim())) {
      setNewEntry(prev => ({
        ...prev,
        tags: [...prev.tags, prev.currentTag.trim()],
        currentTag: ''
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewEntry(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleDeleteEntry = (entryId: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== entryId));
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesMood = selectedMood === 'all' || entry.mood === selectedMood;
    return matchesSearch && matchesMood;
  });

  const getMoodStats = () => {
    const moodCounts = entries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return moods.slice(1).map(mood => ({
      ...mood,
      count: moodCounts[mood.id] || 0
    }));
  };

  const getAverageEmotionScore = () => {
    if (entries.length === 0) return 0;
    const sum = entries.reduce((acc, entry) => acc + entry.emotionScore, 0);
    return (sum / entries.length).toFixed(1);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingAnimation text="Chargement de votre journal..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-green-600" />
              Mon Journal Émotionnel
            </h1>
            <p className="text-muted-foreground">
              Notez vos pensées, émotions et réflexions quotidiennes
            </p>
          </div>
          <Button onClick={() => setShowNewEntry(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle entrée
          </Button>
        </div>
      </motion.div>

      {/* Statistiques */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{entries.length}</div>
              <div className="text-sm text-muted-foreground">Entrées totales</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{getAverageEmotionScore()}/10</div>
              <div className="text-sm text-muted-foreground">Score émotionnel moyen</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {entries.filter(e => e.date > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
              </div>
              <div className="text-sm text-muted-foreground">Cette semaine</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.max(...getMoodStats().map(m => m.count), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Humeur dominante</div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Filtres */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher dans vos entrées..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {moods.map((mood) => (
                  <Button
                    key={mood.id}
                    variant={selectedMood === mood.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedMood(mood.id)}
                  >
                    {mood.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Nouvelle entrée */}
      {showNewEntry && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Nouvelle entrée</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowNewEntry(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Titre</label>
                <Input
                  value={newEntry.title}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Donnez un titre à votre entrée..."
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Humeur</label>
                <div className="flex gap-2 flex-wrap">
                  {moods.slice(1).map((mood) => (
                    <Button
                      key={mood.id}
                      variant={newEntry.mood === mood.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNewEntry(prev => ({ ...prev, mood: mood.id }))}
                    >
                      {mood.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Contenu</label>
                <Textarea
                  value={newEntry.content}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Écrivez vos pensées, émotions, réflexions..."
                  className="min-h-[150px]"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Tags</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newEntry.currentTag}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, currentTag: e.target.value }))}
                    placeholder="Ajouter un tag..."
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <Button onClick={handleAddTag} size="sm">
                    <Tag className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {newEntry.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag} <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveEntry} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Sauvegarder
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowNewEntry(false)}
                >
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Liste des entrées */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="space-y-4">
          {filteredEntries.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Aucune entrée trouvée</h3>
                <p className="text-muted-foreground mb-4">
                  {entries.length === 0 
                    ? "Commencez à écrire votre premier journal !" 
                    : "Essayez de modifier vos critères de recherche."
                  }
                </p>
                {entries.length === 0 && (
                  <Button onClick={() => setShowNewEntry(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Créer ma première entrée
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{entry.title}</CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {entry.date.toLocaleDateString('fr-FR')}
                          </span>
                          <Badge
                            variant="secondary"
                            className={moods.find(m => m.id === entry.mood)?.color}
                          >
                            {moods.find(m => m.id === entry.mood)?.label}
                          </Badge>
                          <span className="flex items-center gap-1 text-xs">
                            <TrendingUp className="h-3 w-3" />
                            {entry.emotionScore}/10
                          </span>
                        </CardDescription>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingEntry(entry.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteEntry(entry.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3 whitespace-pre-line">
                      {entry.content}
                    </p>
                    {entry.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
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
            ))
          )}
        </div>
      </motion.div>

      {/* Insights */}
      {entries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Vos insights émotionnels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Répartition des humeurs</h4>
                  <div className="space-y-2">
                    {getMoodStats().filter(mood => mood.count > 0).map((mood) => (
                      <div key={mood.id} className="flex items-center justify-between">
                        <span className="text-sm">{mood.label}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${(mood.count / entries.length) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-muted-foreground w-8">
                            {mood.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Tendances récentes</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground">
                      • Vous écrivez en moyenne {(entries.length / 30).toFixed(1)} entrées par mois
                    </p>
                    <p className="text-muted-foreground">
                      • Votre humeur la plus fréquente : {getMoodStats().reduce((a, b) => a.count > b.count ? a : b, getMoodStats()[0])?.label || 'Aucune'}
                    </p>
                    <p className="text-muted-foreground">
                      • Score émotionnel en amélioration : +0.5 points ce mois-ci
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default Journal;
