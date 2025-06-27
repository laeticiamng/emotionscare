
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Activity, Music, Brain, Heart, Eye, Download, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ActivityHistoryPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState('week');

  const activities = [
    {
      id: 1,
      type: 'scan',
      title: 'Analyse émotionnelle',
      description: 'Session de scan vocal - Humeur détectée: Calme',
      date: '2024-03-15T10:30:00',
      duration: '5 min',
      score: 8.5,
      icon: Brain,
      color: 'bg-blue-500'
    },
    {
      id: 2,
      type: 'music',
      title: 'Musicothérapie',
      description: 'Playlist "Relaxation matinale" - 8 titres écoutés',
      date: '2024-03-15T09:15:00',
      duration: '25 min',
      score: 9.2,
      icon: Music,
      color: 'bg-purple-500'
    },
    {
      id: 3,
      type: 'vr',
      title: 'Session VR',
      description: 'Méditation guidée en forêt virtuelle',
      date: '2024-03-14T18:45:00',
      duration: '15 min',
      score: 8.8,
      icon: Eye,
      color: 'bg-green-500'
    },
    {
      id: 4,
      type: 'breathwork',
      title: 'Exercices de respiration',
      description: 'Cohérence cardiaque - 3 cycles complets',
      date: '2024-03-14T12:20:00',
      duration: '10 min',
      score: 7.9,
      icon: Heart,
      color: 'bg-red-500'
    },
    {
      id: 5,
      type: 'scan',
      title: 'Analyse émotionnelle',
      description: 'Session de scan textuel - Sentiment: Optimiste',
      date: '2024-03-13T16:10:00',
      duration: '3 min',
      score: 9.1,
      icon: Brain,
      color: 'bg-blue-500'
    },
    {
      id: 6,
      type: 'music',
      title: 'Musicothérapie adaptative',
      description: 'Génération automatique basée sur l\'humeur',
      date: '2024-03-13T14:30:00',
      duration: '30 min',
      score: 8.7,
      icon: Music,
      color: 'bg-purple-500'
    }
  ];

  const activityTypes = [
    { value: 'all', label: 'Toutes les activités' },
    { value: 'scan', label: 'Analyses émotionnelles' },
    { value: 'music', label: 'Musicothérapie' },
    { value: 'vr', label: 'Réalité virtuelle' },
    { value: 'breathwork', label: 'Exercices de respiration' }
  ];

  const dateRanges = [
    { value: 'week', label: 'Cette semaine' },
    { value: 'month', label: 'Ce mois' },
    { value: '3months', label: '3 derniers mois' },
    { value: 'year', label: 'Cette année' }
  ];

  const filteredActivities = activities.filter(activity => {
    if (filterType === 'all') return true;
    return activity.type === filterType;
  });

  const stats = {
    totalSessions: filteredActivities.length,
    totalDuration: filteredActivities.reduce((sum, activity) => {
      const duration = parseInt(activity.duration);
      return sum + duration;
    }, 0),
    averageScore: filteredActivities.reduce((sum, activity) => sum + activity.score, 0) / filteredActivities.length,
    streak: 5
  };

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'text-green-600';
    if (score >= 7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 9) return 'Excellent';
    if (score >= 7) return 'Bon';
    return 'À améliorer';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Historique d'Activité
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Suivez votre parcours bien-être et vos progrès au fil du temps
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.totalSessions}</div>
              <div className="text-sm text-gray-600">Sessions Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-green-600">{stats.totalDuration}min</div>
              <div className="text-sm text-gray-600">Temps Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-purple-600">{stats.averageScore.toFixed(1)}/10</div>
              <div className="text-sm text-gray-600">Score Moyen</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-orange-600">{stats.streak}</div>
              <div className="text-sm text-gray-600">Jours Consécutifs</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtres
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Type d'activité</label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {activityTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Période</label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dateRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Date spécifique</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP", { locale: fr }) : "Choisir une date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Activities List */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Activités Récentes</CardTitle>
                  <Badge variant="outline">
                    {filteredActivities.length} résultat{filteredActivities.length > 1 ? 's' : ''}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredActivities.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-4">
                                <div className={`p-3 ${activity.color} rounded-full`}>
                                  <Icon className="h-5 w-5 text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold">{activity.title}</h3>
                                    <Badge variant="secondary" className="text-xs">
                                      {activity.type}
                                    </Badge>
                                  </div>
                                  <p className="text-gray-600 text-sm mb-2">{activity.description}</p>
                                  <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span>📅 {format(new Date(activity.date), "PPP à HH:mm", { locale: fr })}</span>
                                    <span>⏱️ {activity.duration}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={`text-2xl font-bold ${getScoreColor(activity.score)}`}>
                                  {activity.score}/10
                                </div>
                                <Badge 
                                  variant={activity.score >= 9 ? "default" : activity.score >= 7 ? "secondary" : "outline"}
                                  className="text-xs"
                                >
                                  {getScoreBadge(activity.score)}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                {filteredActivities.length === 0 && (
                  <div className="text-center py-12">
                    <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">Aucune activité trouvée</h3>
                    <p className="text-gray-500">Essayez de modifier vos filtres ou commencez une nouvelle session.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityHistoryPage;
