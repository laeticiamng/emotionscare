
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Calendar as CalendarIcon,
  Heart,
  Smile,
  Frown,
  Meh,
  Edit3,
  Trash2,
  Save,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: 'happy' | 'neutral' | 'sad' | 'excited' | 'anxious';
  date: Date;
  tags: string[];
  gratitude?: string[];
}

const JournalPage: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      title: 'Une belle journée',
      content: 'Aujourd\'hui j\'ai eu une réunion productive et j\'ai pu avancer sur mes projets. Je me sens accompli et motivé pour la suite.',
      mood: 'happy',
      date: new Date(),
      tags: ['travail', 'productivité', 'motivation'],
      gratitude: ['Mon équipe supportive', 'Un bon café ce matin', 'Le soleil aujourd\'hui']
    },
    {
      id: '2',
      title: 'Réflexions du soir',
      content: 'Journée un peu difficile émotionnellement. J\'ai appris l\'importance de prendre des pauses et de ne pas tout porter sur mes épaules.',
      mood: 'neutral',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      tags: ['réflexion', 'apprentissage', 'émotions']
    }
  ]);

  const [isWriting, setIsWriting] = useState(false);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: 'neutral' as const,
    tags: '',
    gratitude: ['', '', '']
  });

  const moodIcons = {
    happy: { icon: Smile, color: 'text-green-500', bg: 'bg-green-100' },
    neutral: { icon: Meh, color: 'text-gray-500', bg: 'bg-gray-100' },
    sad: { icon: Frown, color: 'text-blue-500', bg: 'bg-blue-100' },
    excited: { icon: Heart, color: 'text-pink-500', bg: 'bg-pink-100' },
    anxious: { icon: Heart, color: 'text-orange-500', bg: 'bg-orange-100' }
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDate = !selectedDate || 
                       format(entry.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');

    return matchesSearch && matchesDate;
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
      tags: newEntry.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      gratitude: newEntry.gratitude.filter(g => g.trim())
    };

    setEntries(prev => [entry, ...prev]);
    setNewEntry({
      title: '',
      content: '',
      mood: 'neutral',
      tags: '',
      gratitude: ['', '', '']
    });
    setIsWriting(false);
    toast.success('Entrée ajoutée avec succès !');
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
    toast.success('Entrée supprimée');
  };

  const getMoodStats = () => {
    const moodCounts = entries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(moodCounts).map(([mood, count]) => ({
      mood,
      count,
      percentage: Math.round((count / entries.length) * 100)
    }));
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-amber-100 rounded-full">
              <BookOpen className="h-8 w-8 text-amber-600" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Journal Émotionnel
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Notez vos pensées, émotions et moments de gratitude. 
            Un espace personnel pour votre développement émotionnel.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Controls */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="flex gap-4 flex-1">
                      <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Rechercher dans vos entrées..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            {selectedDate ? format(selectedDate, 'dd MMM yyyy', { locale: fr }) : 'Date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            locale={fr}
                          />
                          {selectedDate && (
                            <div className="p-3 border-t">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedDate(undefined)}
                                className="w-full"
                              >
                                Effacer le filtre
                              </Button>
                            </div>
                          )}
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Button onClick={() => setIsWriting(true)} className="bg-amber-500 hover:bg-amber-600">
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvelle entrée
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* New Entry Form */}
              <AnimatePresence>
                {isWriting && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Card className="shadow-xl border-0 bg-white">
                      <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                        <CardTitle className="flex items-center justify-between">
                          <span>Nouvelle entrée</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsWriting(false)}
                            className="text-white hover:bg-white/20"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4">
                        <Input
                          placeholder="Titre de votre entrée..."
                          value={newEntry.title}
                          onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                          className="text-lg font-medium"
                        />
                        
                        <Textarea
                          placeholder="Exprimez vos pensées et émotions..."
                          value={newEntry.content}
                          onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                          className="min-h-[200px] resize-none"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Humeur</label>
                            <div className="flex gap-2">
                              {Object.entries(moodIcons).map(([mood, { icon: Icon, color, bg }]) => (
                                <Button
                                  key={mood}
                                  variant={newEntry.mood === mood ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setNewEntry(prev => ({ ...prev, mood: mood as any }))}
                                  className={newEntry.mood === mood ? `${bg} ${color}` : ''}
                                >
                                  <Icon className="h-4 w-4" />
                                </Button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Tags (séparés par des virgules)</label>
                            <Input
                              placeholder="travail, famille, sport..."
                              value={newEntry.tags}
                              onChange={(e) => setNewEntry(prev => ({ ...prev, tags: e.target.value }))}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Gratitude (3 choses pour lesquelles vous êtes reconnaissant)</label>
                          <div className="space-y-2">
                            {newEntry.gratitude.map((item, index) => (
                              <Input
                                key={index}
                                placeholder={`Gratitude ${index + 1}...`}
                                value={item}
                                onChange={(e) => setNewEntry(prev => ({
                                  ...prev,
                                  gratitude: prev.gratitude.map((g, i) => i === index ? e.target.value : g)
                                }))}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsWriting(false)}>
                            Annuler
                          </Button>
                          <Button onClick={handleSaveEntry} className="bg-amber-500 hover:bg-amber-600">
                            <Save className="h-4 w-4 mr-2" />
                            Sauvegarder
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Entries */}
              <div className="space-y-4">
                <AnimatePresence>
                  {filteredEntries.map((entry) => {
                    const MoodIcon = moodIcons[entry.mood].icon;
                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        layout
                      >
                        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow">
                          <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${moodIcons[entry.mood].bg}`}>
                                  <MoodIcon className={`h-5 w-5 ${moodIcons[entry.mood].color}`} />
                                </div>
                                <div>
                                  <CardTitle className="text-xl">{entry.title}</CardTitle>
                                  <p className="text-sm text-gray-500">
                                    {format(entry.date, 'dd MMMM yyyy à HH:mm', { locale: fr })}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm">
                                  <Edit3 className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleDeleteEntry(entry.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-700 mb-4 leading-relaxed">{entry.content}</p>
                            
                            {entry.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {entry.tags.map((tag, index) => (
                                  <Badge key={index} variant="secondary">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {entry.gratitude && entry.gratitude.length > 0 && (
                              <div className="bg-amber-50 rounded-lg p-4">
                                <h4 className="font-medium text-amber-800 mb-2">Gratitude</h4>
                                <ul className="space-y-1">
                                  {entry.gratitude.map((item, index) => (
                                    <li key={index} className="text-amber-700 text-sm flex items-center gap-2">
                                      <Heart className="h-3 w-3 text-amber-500" />
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {filteredEntries.length === 0 && (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-500 mb-2">Aucune entrée trouvée</h3>
                    <p className="text-gray-400">
                      {searchTerm || selectedDate 
                        ? 'Essayez de modifier vos filtres de recherche'
                        : 'Commencez votre journal en créant votre première entrée'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Mood Statistics */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Analyse des Humeurs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {getMoodStats().map(({ mood, count, percentage }) => {
                    const MoodIcon = moodIcons[mood as keyof typeof moodIcons].icon;
                    return (
                      <div key={mood} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MoodIcon className={`h-4 w-4 ${moodIcons[mood as keyof typeof moodIcons].color}`} />
                          <span className="text-sm capitalize">{mood}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">{count}</span>
                          <Badge variant="secondary">{percentage}%</Badge>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Statistiques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total d'entrées</span>
                    <Badge variant="secondary">{entries.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Cette semaine</span>
                    <Badge variant="secondary">
                      {entries.filter(e => {
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return e.date >= weekAgo;
                      }).length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Streak actuel</span>
                    <Badge variant="secondary">3 jours</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Conseils</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-gray-600">
                    <p>✨ Écrivez régulièrement, même quelques lignes</p>
                    <p>🎯 Soyez honnête avec vos émotions</p>
                    <p>🙏 Notez au moins une gratitude par jour</p>
                    <p>📊 Observez vos patterns émotionnels</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalPage;
