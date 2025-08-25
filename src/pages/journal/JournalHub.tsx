import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, PenTool, Calendar, TrendingUp, Search, 
  Filter, Tag, Star, Lock, Unlock, Download, Share,
  Brain, Heart, Sparkles, Clock, Target, Award,
  Smile, Meh, Frown, AlertCircle, CheckCircle,
  BarChart3, PieChart, Activity, Zap, Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: 'excellent' | 'good' | 'neutral' | 'bad' | 'terrible';
  moodScore: number;
  tags: string[];
  isPrivate: boolean;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  wordCount: number;
  aiInsights?: string[];
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
    disgust: number;
  };
}

interface JournalStats {
  totalEntries: number;
  currentStreak: number;
  longestStreak: number;
  averageMood: number;
  totalWords: number;
  favoriteDay: string;
  mostUsedTags: string[];
  moodTrend: 'improving' | 'stable' | 'declining';
}

interface Template {
  id: string;
  title: string;
  description: string;
  prompts: string[];
  category: 'gratitude' | 'reflection' | 'goals' | 'emotions' | 'creativity';
  icon: React.ElementType;
  color: string;
}

export const JournalHub: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newEntryContent, setNewEntryContent] = useState('');
  const [currentMood, setCurrentMood] = useState<number>(5);

  const [journalStats] = useState<JournalStats>({
    totalEntries: 127,
    currentStreak: 12,
    longestStreak: 28,
    averageMood: 7.2,
    totalWords: 45632,
    favoriteDay: 'Dimanche',
    mostUsedTags: ['gratitude', 'travail', 'famille', 'objectifs'],
    moodTrend: 'improving'
  });

  const recentEntries: JournalEntry[] = [
    {
      id: '1',
      title: 'Une journée productive et enrichissante',
      content: 'Aujourd\'hui a été particulièrement gratifiant. J\'ai terminé mon projet important au travail et j\'ai pu passer du temps de qualité avec ma famille. Je me sens reconnaissant pour ces moments de bonheur simple...',
      mood: 'excellent',
      moodScore: 9,
      tags: ['travail', 'famille', 'gratitude'],
      isPrivate: false,
      isFavorite: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      wordCount: 234,
      aiInsights: [
        'Expression forte de gratitude et de satisfaction',
        'Équilibre positif travail-vie personnelle',
        'Sentiment d\'accomplissement marqué'
      ],
      emotions: {
        joy: 85,
        sadness: 5,
        anger: 2,
        fear: 3,
        surprise: 15,
        disgust: 0
      }
    },
    {
      id: '2',
      title: 'Réflexions sur mes objectifs',
      content: 'Je prends le temps aujourd\'hui de réfléchir à mes objectifs à long terme. Certains défis m\'attendent mais je me sens confiant dans ma capacité à les surmonter...',
      mood: 'good',
      moodScore: 7,
      tags: ['objectifs', 'réflexion', 'développement'],
      isPrivate: true,
      isFavorite: false,
      createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 26 * 60 * 60 * 1000),
      wordCount: 156,
      emotions: {
        joy: 60,
        sadness: 10,
        anger: 5,
        fear: 15,
        surprise: 8,
        disgust: 2
      }
    },
    {
      id: '3',
      title: 'Moment de calme et de méditation',
      content: 'Session de méditation matinale très apaisante. J\'ai pris conscience de l\'importance de ces moments de pause dans ma routine quotidienne...',
      mood: 'good',
      moodScore: 8,
      tags: ['méditation', 'bien-être', 'routine'],
      isPrivate: false,
      isFavorite: true,
      createdAt: new Date(Date.now() - 50 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 50 * 60 * 60 * 1000),
      wordCount: 189,
      emotions: {
        joy: 70,
        sadness: 3,
        anger: 1,
        fear: 2,
        surprise: 5,
        disgust: 0
      }
    }
  ];

  const templates: Template[] = [
    {
      id: '1',
      title: 'Gratitude Quotidienne',
      description: 'Cultivez la reconnaissance avec des questions guidées',
      prompts: [
        'Trois choses pour lesquelles vous êtes reconnaissant aujourd\'hui ?',
        'Qui a eu un impact positif sur votre journée ?',
        'Quel moment vous a apporté de la joie ?'
      ],
      category: 'gratitude',
      icon: Heart,
      color: 'from-pink-500 to-rose-600'
    },
    {
      id: '2',
      title: 'Réflexion du Soir',
      description: 'Faites le bilan de votre journée avec introspection',
      prompts: [
        'Quel a été le point culminant de votre journée ?',
        'Qu\'avez-vous appris sur vous-même aujourd\'hui ?',
        'Comment pourriez-vous améliorer demain ?'
      ],
      category: 'reflection',
      icon: Brain,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: '3',
      title: 'Objectifs & Ambitions',
      description: 'Planifiez et suivez vos aspirations',
      prompts: [
        'Quel objectif voulez-vous atteindre cette semaine ?',
        'Quelles actions concrètes allez-vous entreprendre ?',
        'Quels obstacles anticipez-vous et comment les surmonter ?'
      ],
      category: 'goals',
      icon: Target,
      color: 'from-green-500 to-teal-600'
    },
    {
      id: '4',
      title: 'Exploration Émotionnelle',
      description: 'Comprenez et explorez vos émotions',
      prompts: [
        'Comment vous sentez-vous en ce moment ?',
        'Quelles émotions ont dominé votre journée ?',
        'Que vous disent ces émotions sur vos besoins ?'
      ],
      category: 'emotions',
      icon: Heart,
      color: 'from-purple-500 to-violet-600'
    },
    {
      id: '5',
      title: 'Créativité Libre',
      description: 'Laissez libre cours à votre imagination',
      prompts: [
        'Si vous pouviez créer quelque chose aujourd\'hui, ce serait quoi ?',
        'Décrivez un rêve récent qui vous a marqué',
        'Inventez une histoire courte à partir de votre journée'
      ],
      category: 'creativity',
      icon: Sparkles,
      color: 'from-orange-500 to-red-600'
    }
  ];

  const availableTags = ['gratitude', 'travail', 'famille', 'objectifs', 'méditation', 'bien-être', 'routine', 'réflexion', 'développement', 'créativité', 'relations', 'santé'];

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'excellent': return <Smile className="w-4 h-4 text-green-500" />;
      case 'good': return <Smile className="w-4 h-4 text-blue-500" />;
      case 'neutral': return <Meh className="w-4 h-4 text-yellow-500" />;
      case 'bad': return <Frown className="w-4 h-4 text-orange-500" />;
      case 'terrible': return <Frown className="w-4 h-4 text-red-500" />;
      default: return <Meh className="w-4 h-4 text-gray-500" />;
    }
  };

  const getMoodColor = (score: number) => {
    if (score >= 8) return 'text-green-500';
    if (score >= 6) return 'text-blue-500';
    if (score >= 4) return 'text-yellow-500';
    if (score >= 2) return 'text-orange-500';
    return 'text-red-500';
  };

  const createNewEntry = async () => {
    if (!newEntryContent.trim()) {
      toast({
        title: "Contenu requis",
        description: "Veuillez écrire votre entrée de journal.",
        variant: "destructive"
      });
      return;
    }

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title: newEntryContent.split(' ').slice(0, 6).join(' ') + '...',
      content: newEntryContent,
      mood: currentMood >= 8 ? 'excellent' : currentMood >= 6 ? 'good' : currentMood >= 4 ? 'neutral' : currentMood >= 2 ? 'bad' : 'terrible',
      moodScore: currentMood,
      tags: [],
      isPrivate: false,
      isFavorite: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      wordCount: newEntryContent.trim().split(' ').length,
      emotions: {
        joy: Math.random() * 100,
        sadness: Math.random() * 30,
        anger: Math.random() * 20,
        fear: Math.random() * 25,
        surprise: Math.random() * 40,
        disgust: Math.random() * 15
      }
    };

    setNewEntryContent('');
    setCurrentMood(5);

    toast({
      title: "Entrée créée !",
      description: "Votre entrée de journal a été sauvegardée avec succès.",
    });
  };

  const getStreakIcon = () => {
    if (journalStats.currentStreak >= 30) return '🔥';
    if (journalStats.currentStreak >= 14) return '⚡';
    if (journalStats.currentStreak >= 7) return '✨';
    return '🌱';
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <span className="font-medium text-primary">Journal Personnel</span>
        </div>
        <h1 className="text-4xl font-bold">Mon Carnet de Bord Émotionnel</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Exprimez vos pensées, suivez votre évolution émotionnelle et découvrez des insights personnalisés 
          grâce à l'analyse IA de vos écrits.
        </p>
      </motion.div>

      {/* Stats rapides */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-4 md:grid-cols-5"
      >
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="w-6 h-6 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">{journalStats.totalEntries}</p>
            <p className="text-xs text-muted-foreground">Entrées écrites</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">{getStreakIcon()}</div>
            <p className="text-2xl font-bold">{journalStats.currentStreak}j</p>
            <p className="text-xs text-muted-foreground">Série actuelle</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="w-6 h-6 mx-auto mb-2 text-pink-500" />
            <p className={`text-2xl font-bold ${getMoodColor(journalStats.averageMood)}`}>
              {journalStats.averageMood}/10
            </p>
            <p className="text-xs text-muted-foreground">Humeur moyenne</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <PenTool className="w-6 h-6 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold">{journalStats.totalWords.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Mots écrits</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">
              {journalStats.moodTrend === 'improving' ? '+' : journalStats.moodTrend === 'declining' ? '-' : '='} 
              {Math.abs(12)}%
            </p>
            <p className="text-xs text-muted-foreground">Évolution humeur</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Contenu principal */}
      <Tabs defaultValue="write" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="write">Écrire</TabsTrigger>
          <TabsTrigger value="entries">Mes Entrées</TabsTrigger>
          <TabsTrigger value="templates">Modèles</TabsTrigger>
          <TabsTrigger value="insights">Insights IA</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="write" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Zone d'écriture */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Nouvelle Entrée</span>
                    <Badge variant="secondary">{new Date().toLocaleDateString()}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Comment vous sentez-vous ? (1-10)</label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={currentMood}
                        onChange={(e) => setCurrentMood(Number(e.target.value))}
                        className="flex-1"
                      />
                      <div className="flex items-center space-x-2">
                        <span className={`text-lg font-bold ${getMoodColor(currentMood)}`}>{currentMood}</span>
                        {getMoodIcon(currentMood >= 8 ? 'excellent' : currentMood >= 6 ? 'good' : currentMood >= 4 ? 'neutral' : currentMood >= 2 ? 'bad' : 'terrible')}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Exprimez-vous librement</label>
                    <Textarea
                      value={newEntryContent}
                      onChange={(e) => setNewEntryContent(e.target.value)}
                      placeholder="Que s'est-il passé aujourd'hui ? Comment vous sentez-vous ? Qu'avez-vous appris ?"
                      className="min-h-[300px] resize-none"
                    />
                    <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                      <span>{newEntryContent.trim().split(' ').filter(word => word).length} mots</span>
                      <span>Sauvegarde automatique activée</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button onClick={createNewEntry} className="flex-1">
                      <PenTool className="w-4 h-4 mr-2" />
                      Sauvegarder l'entrée
                    </Button>
                    <Button variant="outline" size="icon">
                      <Lock className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Star className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar d'aide */}
            <div className="space-y-6">
              {/* Conseils d'écriture */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Inspiration du jour
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-primary/5 rounded-lg">
                    <h4 className="font-medium mb-1">Question réflexive</h4>
                    <p className="text-sm text-muted-foreground">
                      "Quelle est la chose la plus significative qui s'est produite aujourd'hui et pourquoi ?"
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h4 className="font-medium mb-1">Exercice de gratitude</h4>
                    <p className="text-sm text-muted-foreground">
                      Listez 3 petites choses qui vous ont fait sourire aujourd'hui.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Calendrier */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Calendrier d'écriture
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border w-full"
                  />
                </CardContent>
              </Card>

              {/* Tags populaires */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Tag className="w-5 h-5 mr-2" />
                    Tags populaires
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {journalStats.mostUsedTags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="entries" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Mes Entrées</h2>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {recentEntries.map((entry) => (
              <Card key={entry.id} className="cursor-pointer hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-lg">{entry.title}</h3>
                        {entry.isFavorite && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                        {entry.isPrivate && <Lock className="w-4 h-4 text-muted-foreground" />}
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {entry.createdAt.toLocaleDateString()} • {entry.wordCount} mots
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getMoodIcon(entry.mood)}
                      <span className={`text-sm font-medium ${getMoodColor(entry.moodScore)}`}>
                        {entry.moodScore}/10
                      </span>
                    </div>
                  </div>

                  <p className="text-sm mb-4 line-clamp-3">{entry.content}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {entry.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm">
                        Lire
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Share className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {entry.aiInsights && entry.aiInsights.length > 0 && (
                    <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                      <h4 className="text-sm font-medium mb-2 flex items-center">
                        <Brain className="w-4 h-4 mr-1" />
                        Insights IA
                      </h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {entry.aiInsights.slice(0, 2).map((insight, index) => (
                          <li key={index} className="flex items-start">
                            <Sparkles className="w-3 h-3 mr-1 mt-0.5 text-primary" />
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button onClick={() => navigate('/journal/entries')} variant="outline">
              Voir toutes les entrées
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Modèles d'écriture guidée</h2>
            <p className="text-muted-foreground">
              Utilisez nos modèles pour explorer différents aspects de votre vie et développer une pratique d'écriture enrichissante.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-all group">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${template.color} flex items-center justify-center mb-4`}>
                    <template.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2">{template.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{template.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <h4 className="text-sm font-medium">Questions guides :</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {template.prompts.map((prompt, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-3 h-3 mr-1 mt-0.5 text-green-500" />
                          {prompt}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Utiliser ce modèle
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  Analyse Émotionnelle IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">Tendance principale</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                    Vos écrits montrent une progression positive constante dans votre bien-être émotionnel. 
                    L'expression de gratitude est devenue plus fréquente.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-medium text-green-900 dark:text-green-100">Thème récurrent</h4>
                  <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                    L'équilibre travail-vie personnelle semble être une préoccupation centrale. 
                    Vous explorez activement des solutions.
                  </p>
                </div>
                
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500">
                  <h4 className="font-medium text-purple-900 dark:text-purple-100">Recommandation</h4>
                  <p className="text-sm text-purple-800 dark:text-purple-200 mt-1">
                    Continuez à documenter vos moments de joie. Cette pratique renforce votre capacité 
                    à reconnaître le positif dans votre quotidien.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="w-5 h-5 mr-2" />
                  Patterns d'écriture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Émotions positives</span>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Réflexions constructives</span>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Orientation solutions</span>
                      <span className="text-sm font-medium">72%</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Conscience de soi</span>
                      <span className="text-sm font-medium">91%</span>
                    </div>
                    <Progress value={91} className="h-2" />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Mots-clés fréquents</h4>
                  <div className="flex flex-wrap gap-2">
                    {['gratitude', 'famille', 'projet', 'détente', 'objectif', 'apprentissage'].map((word) => (
                      <Badge key={word} variant="outline" className="text-xs">
                        {word}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Évolution de l'humeur</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-8 border-2 border-dashed rounded-lg">
                  <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Graphique d'évolution de l'humeur</p>
                  <p className="text-sm text-muted-foreground">
                    Tendances sur les 30 derniers jours
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistiques d'écriture</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{journalStats.longestStreak}</p>
                    <p className="text-xs text-muted-foreground">Plus longue série</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{journalStats.favoriteDay}</p>
                    <p className="text-xs text-muted-foreground">Jour préféré</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Activité par jour de la semaine</h4>
                  {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map((day, index) => (
                    <div key={day} className="flex items-center justify-between">
                      <span className="text-sm">{day}</span>
                      <Progress value={(index + 1) * 12} className="w-24 h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JournalHub;