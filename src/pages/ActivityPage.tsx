import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Activity, Calendar, Clock, TrendingUp, Target, 
         Heart, Brain, Music, Zap, Eye, Users, Search, Filter, 
         Trophy, Flame, Star, Share2, MoreHorizontal } from 'lucide-react';
import { usePageMetadata } from '@/hooks/usePageMetadata';

interface ActivityEntry {
  id: string;
  type: 'scan' | 'music' | 'journal' | 'vr' | 'breathwork' | 'glow' | 'challenge';
  title: string;
  description: string;
  timestamp: string;
  duration: number;
  score?: number;
  mood?: string;
  tags: string[];
  benefits: string[];
}

interface DailyGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  category: string;
  icon: React.ComponentType<any>;
}

const ActivityPage: React.FC = () => {
  usePageMetadata('Activité', 'Suivez votre progression et vos activités', '/app/activity', 'confident');
  
  const navigate = useNavigate();
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [streak, setStreak] = useState(7);

  useEffect(() => {
    loadActivities();
    loadDailyGoals();
  }, []);

  const loadActivities = () => {
    const mockActivities: ActivityEntry[] = [
      {
        id: '1',
        type: 'scan',
        title: 'Scan émotionnel matinal',
        description: 'Analyse faciale de 30 secondes',
        timestamp: new Date().toISOString(),
        duration: 2,
        score: 85,
        mood: 'positive',
        tags: ['matin', 'énergie', 'positif'],
        benefits: ['Conscience émotionnelle', 'Bien-être']
      },
      {
        id: '2',
        type: 'music',
        title: 'Session musicothérapie',
        description: 'Playlist énergisante - 3 morceaux',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        duration: 15,
        score: 92,
        mood: 'energetic',
        tags: ['motivation', 'énergie', 'focus'],
        benefits: ['Boost énergie', 'Motivation']
      },
      {
        id: '3',
        type: 'journal',
        title: 'Écriture réflexive',
        description: 'Entrée de journal - Gratitude du jour',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        duration: 12,
        mood: 'grateful',
        tags: ['gratitude', 'réflexion', 'bien-être'],
        benefits: ['Clarté mentale', 'Gratitude']
      },
      {
        id: '4',
        type: 'vr',
        title: 'Expérience VR - Plage zen',
        description: 'Immersion relaxante de 15 minutes',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        duration: 15,
        score: 88,
        mood: 'calm',
        tags: ['relaxation', 'vr', 'détente'],
        benefits: ['Relaxation profonde', 'Réduction stress']
      },
      {
        id: '5',
        type: 'breathwork',
        title: 'Exercice de respiration',
        description: 'Technique 4-7-8 pour la détente',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        duration: 8,
        score: 76,
        mood: 'peaceful',
        tags: ['respiration', 'calme', 'méditation'],
        benefits: ['Relaxation', 'Contrôle stress']
      }
    ];
    setActivities(mockActivities);
  };

  const loadDailyGoals = () => {
    const goals: DailyGoal[] = [
      {
        id: '1',
        title: 'Scans émotionnels',
        target: 3,
        current: 1,
        unit: 'scans',
        category: 'awareness',
        icon: Eye
      },
      {
        id: '2',
        title: 'Temps de méditation',
        target: 20,
        current: 15,
        unit: 'min',
        category: 'mindfulness',
        icon: Brain
      },
      {
        id: '3',
        title: 'Sessions musicales',
        target: 2,
        current: 1,
        unit: 'sessions',
        category: 'therapy',
        icon: Music
      },
      {
        id: '4',
        title: 'Activité physique',
        target: 30,
        current: 0,
        unit: 'min',
        category: 'physical',
        icon: Heart
      }
    ];
    setDailyGoals(goals);
  };

  const getActivityIcon = (type: ActivityEntry['type']) => {
    switch (type) {
      case 'scan': return Eye;
      case 'music': return Music;
      case 'journal': return Target;
      case 'vr': return Zap;
      case 'breathwork': return Heart;
      case 'glow': return Star;
      case 'challenge': return Trophy;
      default: return Activity;
    }
  };

  const getActivityColor = (type: ActivityEntry['type']) => {
    switch (type) {
      case 'scan': return 'bg-blue-500';
      case 'music': return 'bg-purple-500';
      case 'journal': return 'bg-green-500';
      case 'vr': return 'bg-cyan-500';
      case 'breathwork': return 'bg-orange-500';
      case 'glow': return 'bg-yellow-500';
      case 'challenge': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'positive': return '😊';
      case 'energetic': return '⚡';
      case 'grateful': return '🙏';
      case 'calm': return '😌';
      case 'peaceful': return '☮️';
      default: return '😐';
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filterCategory === 'all' || activity.type === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;
    if (diffMinutes < 24 * 60) return `Il y a ${Math.floor(diffMinutes / 60)} h`;
    return `Il y a ${Math.floor(diffMinutes / (24 * 60))} j`;
  };

  const getTotalActivityTime = () => {
    return activities.reduce((total, activity) => total + activity.duration, 0);
  };

  const getWeeklyStats = () => {
    const today = new Date();
    const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklyActivities = activities.filter(activity => 
      new Date(activity.timestamp) >= weekStart
    );
    
    return {
      totalSessions: weeklyActivities.length,
      totalTime: weeklyActivities.reduce((total, activity) => total + activity.duration, 0),
      averageScore: weeklyActivities.filter(a => a.score).reduce((sum, a) => sum + (a.score || 0), 0) / weeklyActivities.filter(a => a.score).length || 0,
      favoriteActivity: 'Musicothérapie'
    };
  };

  const weeklyStats = getWeeklyStats();

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
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
              <h1 className="text-3xl font-bold text-gray-900">Mon Activité</h1>
              <p className="text-gray-600">Suivez votre progression et vos habitudes bien-être</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-orange-100 px-3 py-2 rounded-lg">
              <Flame className="w-4 h-4 text-orange-600" />
              <span className="font-semibold text-orange-600">{streak} jours</span>
              <span className="text-sm text-orange-600">de suite</span>
            </div>
            <Button variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Partager
            </Button>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{activities.length}</div>
              <div className="text-sm text-gray-600">Activités aujourd'hui</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{getTotalActivityTime()} min</div>
              <div className="text-sm text-gray-600">Temps actif</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{Math.round(weeklyStats.averageScore)}</div>
              <div className="text-sm text-gray-600">Score moyen</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{streak}</div>
              <div className="text-sm text-gray-600">Jours consécutifs</div>
            </CardContent>
          </Card>
        </div>

        {/* Objectifs du jour */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Objectifs du jour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {dailyGoals.map((goal) => {
                const IconComponent = goal.icon;
                const progress = Math.min((goal.current / goal.target) * 100, 100);
                
                return (
                  <div key={goal.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-white rounded-lg">
                        <IconComponent className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{goal.title}</div>
                        <div className="text-xs text-gray-600">
                          {goal.current} / {goal.target} {goal.unit}
                        </div>
                      </div>
                    </div>
                    <Progress value={progress} className="h-2" />
                    {progress >= 100 && (
                      <div className="mt-2 text-xs text-green-600 font-medium">
                        ✓ Objectif atteint !
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Interface avec onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
            <TabsTrigger value="goals">Objectifs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Filtres */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4 items-center flex-wrap">
                  <div className="flex-1 min-w-64">
                    <Input
                      placeholder="Rechercher dans vos activités..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                      icon={<Search className="w-4 h-4" />}
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <select 
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="px-3 py-2 border rounded-md"
                    >
                      <option value="all">Toutes les activités</option>
                      <option value="scan">Scans émotionnels</option>
                      <option value="music">Musicothérapie</option>
                      <option value="journal">Journal</option>
                      <option value="vr">Expériences VR</option>
                      <option value="breathwork">Respiration</option>
                      <option value="glow">Flash Glow</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activités récentes */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Activités récentes</h2>
              {filteredActivities.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Activity className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">Aucune activité trouvée</h3>
                    <p className="text-gray-600 mb-4">
                      {searchTerm || filterCategory !== 'all' 
                        ? 'Essayez de modifier vos critères de recherche'
                        : 'Commencez votre première activité bien-être'
                      }
                    </p>
                    <Button onClick={() => navigate('/app/scan')}>
                      Commencer un scan émotionnel
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredActivities.map((activity) => {
                    const IconComponent = getActivityIcon(activity.type);
                    
                    return (
                      <Card key={activity.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-lg ${getActivityColor(activity.type)} text-white`}>
                              <IconComponent className="w-6 h-6" />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold">{activity.title}</h3>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
                              
                              <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {activity.duration} min
                                </div>
                                <span>{formatTimeAgo(activity.timestamp)}</span>
                                {activity.mood && (
                                  <div className="flex items-center gap-1">
                                    <span>{getMoodEmoji(activity.mood)}</span>
                                    <span className="capitalize">{activity.mood}</span>
                                  </div>
                                )}
                              </div>

                              {activity.score && (
                                <div className="mb-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium">Score:</span>
                                    <span className="text-lg font-bold text-green-600">{activity.score}/100</span>
                                  </div>
                                  <Progress value={activity.score} className="h-2" />
                                </div>
                              )}

                              <div className="flex flex-wrap gap-1 mb-3">
                                {activity.tags.map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>

                              <div className="flex flex-wrap gap-1">
                                {activity.benefits.map((benefit, index) => (
                                  <span key={index} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                    {benefit}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Timeline des activités</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredActivities.map((activity, index) => {
                    const IconComponent = getActivityIcon(activity.type);
                    
                    return (
                      <div key={activity.id} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`p-2 rounded-full ${getActivityColor(activity.type)} text-white`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          {index < filteredActivities.length - 1 && (
                            <div className="w-px h-8 bg-gray-200 mt-2"></div>
                          )}
                        </div>
                        
                        <div className="flex-1 pb-6">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{activity.title}</h3>
                            <span className="text-sm text-gray-500">{formatTimeAgo(activity.timestamp)}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>{activity.duration} min</span>
                            {activity.score && <span>Score: {activity.score}/100</span>}
                            {activity.mood && <span>{getMoodEmoji(activity.mood)} {activity.mood}</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            {/* Statistiques hebdomadaires */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Statistiques de la semaine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">{weeklyStats.totalSessions}</div>
                    <div className="text-sm text-gray-600">Sessions totales</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">{weeklyStats.totalTime} min</div>
                    <div className="text-sm text-gray-600">Temps d'activité</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-1">{Math.round(weeklyStats.averageScore)}</div>
                    <div className="text-sm text-gray-600">Score moyen</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-1">{weeklyStats.favoriteActivity}</div>
                    <div className="text-sm text-gray-600">Activité favorite</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Répartition par type d'activité */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition des activités</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['scan', 'music', 'journal', 'vr', 'breathwork'].map((type) => {
                    const typeActivities = activities.filter(a => a.type === type);
                    const percentage = activities.length > 0 ? (typeActivities.length / activities.length) * 100 : 0;
                    const IconComponent = getActivityIcon(type as ActivityEntry['type']);
                    
                    return (
                      <div key={type} className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${getActivityColor(type as ActivityEntry['type'])} text-white`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="capitalize font-medium">{type}</span>
                            <span className="text-sm text-gray-600">{typeActivities.length} sessions</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                        <span className="text-sm font-medium">{Math.round(percentage)}%</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            {/* Objectifs détaillés */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Gestion des objectifs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {dailyGoals.map((goal) => {
                    const IconComponent = goal.icon;
                    const progress = Math.min((goal.current / goal.target) * 100, 100);
                    
                    return (
                      <div key={goal.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-gray-100 rounded-lg">
                              <IconComponent className="w-6 h-6 text-gray-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{goal.title}</h3>
                              <p className="text-sm text-gray-600">Catégorie: {goal.category}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Modifier
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Progression</span>
                            <span className="text-sm text-gray-600">
                              {goal.current} / {goal.target} {goal.unit}
                            </span>
                          </div>
                          <Progress value={progress} className="h-3" />
                          <div className="text-xs text-gray-500">
                            {progress >= 100 ? 'Objectif atteint !' : `${Math.round(progress)}% complété`}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <Button className="w-full">
                    <Target className="w-4 h-4 mr-2" />
                    Ajouter un nouvel objectif
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ActivityPage;