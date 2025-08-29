import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { ArrowLeft, Plus, BookOpen, Calendar as CalendarIcon, Search, Filter, 
         Heart, Smile, Meh, Frown, Zap, Cloud, Save, Trash2, Edit, 
         TrendingUp, BarChart3, Target, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: 'happy' | 'neutral' | 'sad' | 'excited' | 'calm';
  date: string;
  tags: string[];
  gratitude?: string[];
  goals?: string[];
}

interface MoodStat {
  mood: string;
  count: number;
  percentage: number;
}

interface JournalChallenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: string;
}

const B2CJournalPage: React.FC = () => {
  const navigate = useNavigate();
  const [isWriting, setIsWriting] = useState(false);
  const [newEntry, setNewEntry] = useState({ 
    title: '', 
    content: '', 
    mood: 'neutral' as const, 
    tags: '',
    gratitude: ['', '', ''],
    goals: ['']
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState('entries');

  const [entries] = useState<JournalEntry[]>([
    {
      id: '1',
      title: 'Ma journée parfaite',
      content: 'Aujourd\'hui a été une journée exceptionnelle. J\'ai commencé par une méditation matinale qui m\'a donné beaucoup d\'énergie positive. Le scan émotionnel de ce matin m\'a aidé à identifier mes priorités...',
      mood: 'happy',
      date: '2024-01-15T10:30:00',
      tags: ['méditation', 'énergie', 'positivité'],
      gratitude: ['Ma famille', 'Ma santé', 'Ce beau temps'],
      goals: ['Méditer 20 minutes', 'Appeler maman']
    },
    {
      id: '2',
      title: 'Réflexions sur le stress au travail',
      content: 'Cette semaine a été intense au bureau. J\'ai remarqué que je me sens plus stressé quand les deadlines s\'accumulent. Le coach IA m\'a donné de bons conseils pour gérer la pression...',
      mood: 'neutral',
      date: '2024-01-14T18:45:00',
      tags: ['travail', 'stress', 'réflexion'],
      gratitude: ['Mon équipe', 'Mes compétences', 'La stabilité financière'],
      goals: ['Prendre des pauses régulières', 'Organiser mes priorités']
    },
    {
      id: '3',
      title: 'Moment de gratitude',
      content: 'Je voulais prendre un moment pour noter tout ce pour quoi je suis reconnaissant aujourd\'hui. La session VR de ce matin m\'a vraiment aidé à me reconnecter avec l\'essentiel...',
      mood: 'happy',
      date: '2024-01-13T20:15:00',
      tags: ['gratitude', 'famille', 'bonheur'],
      gratitude: ['Les rires de mes enfants', 'Un toit au-dessus de ma tête', 'Mes amis fidèles'],
      goals: ['Passer plus de temps en famille', 'Organiser un dîner entre amis']
    }
  ]);

  const challenges: JournalChallenge[] = [
    {
      id: '1',
      title: 'Gratitude quotidienne',
      description: 'Noter 3 choses pour lesquelles vous êtes reconnaissant chaque jour',
      progress: 18,
      target: 30,
      reward: 'Badge Cœur reconnaissant'
    },
    {
      id: '2',
      title: 'Écrivain régulier',
      description: 'Écrire dans votre journal 5 jours par semaine',
      progress: 12,
      target: 20,
      reward: 'Badge Plume d\'or'
    },
    {
      id: '3',
      title: 'Objectifs atteints',
      description: 'Compléter 50 objectifs personnels définis dans le journal',
      progress: 23,
      target: 50,
      reward: 'Badge Conquérant'
    }
  ];

  const moodConfig = {
    happy: { icon: Smile, color: 'bg-green-500', label: 'Heureux', emoji: '😊' },
    excited: { icon: Zap, color: 'bg-yellow-500', label: 'Excité', emoji: '🤩' },
    neutral: { icon: Meh, color: 'bg-blue-500', label: 'Neutre', emoji: '😐' },
    calm: { icon: Cloud, color: 'bg-purple-500', label: 'Calme', emoji: '😌' },
    sad: { icon: Frown, color: 'bg-gray-500', label: 'Triste', emoji: '😢' }
  };

  const moodStats: MoodStat[] = [
    { mood: 'happy', count: 12, percentage: 40 },
    { mood: 'calm', count: 9, percentage: 30 },
    { mood: 'neutral', count: 6, percentage: 20 },
    { mood: 'excited', count: 2, percentage: 7 },
    { mood: 'sad', count: 1, percentage: 3 }
  ];

  const handleSaveEntry = () => {
    if (newEntry.title && newEntry.content) {
      // Ici on sauvegarderait en base de données
      console.log('Nouvelle entrée:', {
        ...newEntry,
        tags: newEntry.tags.split(',').map(tag => tag.trim()),
        date: new Date().toISOString(),
        gratitude: newEntry.gratitude.filter(g => g.trim()),
        goals: newEntry.goals.filter(g => g.trim())
      });
      
      setNewEntry({ 
        title: '', 
        content: '', 
        mood: 'neutral', 
        tags: '',
        gratitude: ['', '', ''],
        goals: ['']
      });
      setIsWriting(false);
    }
  };

  const addGratitudeField = () => {
    setNewEntry(prev => ({
      ...prev,
      gratitude: [...prev.gratitude, '']
    }));
  };

  const addGoalField = () => {
    setNewEntry(prev => ({
      ...prev,
      goals: [...prev.goals, '']
    }));
  };

  const updateGratitude = (index: number, value: string) => {
    setNewEntry(prev => ({
      ...prev,
      gratitude: prev.gratitude.map((g, i) => i === index ? value : g)
    }));
  };

  const updateGoal = (index: number, value: string) => {
    setNewEntry(prev => ({
      ...prev,
      goals: prev.goals.map((g, i) => i === index ? value : g)
    }));
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesMood = selectedMoodFilter === 'all' || entry.mood === selectedMoodFilter;
    
    return matchesSearch && matchesMood;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isWriting) {
    return (
      <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => setIsWriting(false)}
                className="hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Nouvelle entrée</h1>
                <p className="text-gray-600">Partagez vos pensées et réflexions</p>
              </div>
            </div>
            <Button onClick={handleSaveEntry} className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
          </div>

          <Card className="shadow-lg">
            <CardContent className="p-8 space-y-6">
              {/* Titre et humeur */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre de l'entrée</label>
                  <Input
                    value={newEntry.title}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Comment résumer cette journée..."
                    className="text-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Humeur du moment</label>
                  <div className="flex gap-2">
                    {Object.entries(moodConfig).map(([key, config]) => {
                      const IconComponent = config.icon;
                      return (
                        <Button
                          key={key}
                          variant={newEntry.mood === key ? "default" : "outline"}
                          onClick={() => setNewEntry(prev => ({ ...prev, mood: key as any }))}
                          className="flex flex-col items-center p-3 h-auto"
                        >
                          <span className="text-lg mb-1">{config.emoji}</span>
                          <span className="text-xs">{config.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Contenu principal */}
              <div>
                <label className="block text-sm font-medium mb-2">Vos pensées</label>
                <Textarea
                  value={newEntry.content}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Décrivez votre journée, vos émotions, vos réflexions..."
                  rows={8}
                  className="resize-none"
                />
              </div>

              {/* Section gratitude */}
              <div>
                <label className="block text-sm font-medium mb-2">3 choses pour lesquelles vous êtes reconnaissant</label>
                <div className="space-y-2">
                  {newEntry.gratitude.map((gratitude, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-yellow-500">⭐</span>
                      <Input
                        value={gratitude}
                        onChange={(e) => updateGratitude(index, e.target.value)}
                        placeholder={`Gratitude ${index + 1}...`}
                      />
                    </div>
                  ))}
                  <Button 
                    variant="ghost" 
                    onClick={addGratitudeField}
                    className="text-sm text-gray-600"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Ajouter une gratitude
                  </Button>
                </div>
              </div>

              {/* Section objectifs */}
              <div>
                <label className="block text-sm font-medium mb-2">Objectifs pour demain</label>
                <div className="space-y-2">
                  {newEntry.goals.map((goal, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-blue-500">🎯</span>
                      <Input
                        value={goal}
                        onChange={(e) => updateGoal(index, e.target.value)}
                        placeholder={`Objectif ${index + 1}...`}
                      />
                    </div>
                  ))}
                  <Button 
                    variant="ghost" 
                    onClick={addGoalField}
                    className="text-sm text-gray-600"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Ajouter un objectif
                  </Button>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-2">Tags (séparés par des virgules)</label>
                <Input
                  value={newEntry.tags}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="travail, famille, stress, bonheur..."
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/app/home')}
              className="hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Journal Personnel</h1>
              <p className="text-gray-600">Votre espace de réflexion et de croissance</p>
            </div>
          </div>
          
          <Button onClick={() => setIsWriting(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle entrée
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="entries" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Entrées
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analyses
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Défis
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Calendrier
            </TabsTrigger>
          </TabsList>

          {/* Entries Tab */}
          <TabsContent value="entries" className="space-y-4">
            {/* Filtres */}
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher dans vos entrées..."
                  className="max-w-md"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={selectedMoodFilter === 'all' ? "default" : "outline"}
                  onClick={() => setSelectedMoodFilter('all')}
                  size="sm"
                >
                  Toutes
                </Button>
                {Object.entries(moodConfig).map(([key, config]) => (
                  <Button
                    key={key}
                    variant={selectedMoodFilter === key ? "default" : "outline"}
                    onClick={() => setSelectedMoodFilter(key)}
                    size="sm"
                  >
                    {config.emoji}
                  </Button>
                ))}
              </div>
            </div>

            {/* Liste des entrées */}
            <div className="space-y-4">
              <AnimatePresence>
                {filteredEntries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold">{entry.title}</h3>
                              <Badge className={`${moodConfig[entry.mood].color} text-white`}>
                                {moodConfig[entry.mood].emoji} {moodConfig[entry.mood].label}
                              </Badge>
                            </div>
                            <p className="text-gray-600 text-sm mb-3">
                              {formatDate(entry.date)}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-gray-800 mb-4 line-clamp-3">
                          {entry.content}
                        </p>
                        
                        {entry.gratitude && entry.gratitude.length > 0 && (
                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Gratitudes:</h5>
                            <div className="flex flex-wrap gap-1">
                              {entry.gratitude.map((gratitude, i) => (
                                <span key={i} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                  ⭐ {gratitude}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {entry.goals && entry.goals.length > 0 && (
                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Objectifs:</h5>
                            <div className="flex flex-wrap gap-1">
                              {entry.goals.map((goal, i) => (
                                <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  🎯 {goal}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-1">
                          {entry.tags.map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
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
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Statistiques humeur */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Humeur cette semaine
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {moodStats.map((stat) => (
                    <div key={stat.mood} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{moodConfig[stat.mood as keyof typeof moodConfig].emoji}</span>
                        <span className="text-sm">{moodConfig[stat.mood as keyof typeof moodConfig].label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${moodConfig[stat.mood as keyof typeof moodConfig].color}`}
                            style={{ width: `${stat.percentage}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">{stat.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Statistiques d'écriture */}
              <Card>
                <CardHeader>
                  <CardTitle>Habitudes d'écriture</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">18</div>
                    <div className="text-sm text-gray-600">Entrées ce mois</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">5</div>
                    <div className="text-sm text-gray-600">Jours consécutifs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">247</div>
                    <div className="text-sm text-gray-600">Mots en moyenne</div>
                  </div>
                </CardContent>
              </Card>

              {/* Tags populaires */}
              <Card>
                <CardHeader>
                  <CardTitle>Tags les plus utilisés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {['travail', 'famille', 'stress', 'bonheur', 'méditation', 'gratitude'].map((tag, index) => (
                      <Badge key={tag} variant="outline" className="text-sm">
                        #{tag} ({Math.floor(Math.random() * 10 + 1)})
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map((challenge) => (
                <Card key={challenge.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {challenge.title}
                      <Award className="w-5 h-5 text-yellow-500" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{challenge.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progression</span>
                        <span>{challenge.progress}/{challenge.target}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <div className="text-xs font-medium text-yellow-800 mb-1">Récompense:</div>
                      <div className="text-sm text-yellow-700">{challenge.reward}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Calendrier des entrées</CardTitle>
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
              
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Entrées du {selectedDate.toLocaleDateString('fr-FR')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Entrées pour la date sélectionnée */}
                    <div className="space-y-3">
                      {entries.filter(entry => {
                        const entryDate = new Date(entry.date).toDateString();
                        return entryDate === selectedDate.toDateString();
                      }).map((entry) => (
                        <div key={entry.id} className="border-l-4 border-blue-500 pl-4">
                          <h4 className="font-medium">{entry.title}</h4>
                          <p className="text-sm text-gray-600 line-clamp-2">{entry.content}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span>{moodConfig[entry.mood].emoji}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(entry.date).toLocaleTimeString('fr-FR', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>
                        </div>
                      ))}
                      {entries.filter(entry => {
                        const entryDate = new Date(entry.date).toDateString();
                        return entryDate === selectedDate.toDateString();
                      }).length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>Aucune entrée pour cette date</p>
                          <Button 
                            onClick={() => setIsWriting(true)} 
                            className="mt-4"
                            size="sm"
                          >
                            Créer une entrée
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default B2CJournalPage;