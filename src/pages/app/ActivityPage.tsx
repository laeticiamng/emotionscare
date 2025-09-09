import React, { useState, useEffect } from 'react';
import { Calendar, Clock, TrendingUp, Filter, Search, Activity, Zap, Music, Heart, Brain, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

interface ActivityEntry {
  id: string;
  module: string;
  action: string;
  timestamp: Date;
  duration?: number;
  outcome?: string;
  category: 'scan' | 'music' | 'breathing' | 'journal' | 'mood' | 'flash-glow' | 'other';
  mood?: 'positive' | 'neutral' | 'improving';
}

const ActivityPage = () => {
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('7j');
  const [selectedCategory, setSelectedCategory] = useState('tous');

  const moduleIcons = {
    scan: { icon: Brain, color: 'from-blue-500 to-cyan-500', label: 'Scan Émotionnel' },
    music: { icon: Music, color: 'from-purple-500 to-pink-500', label: 'Musicothérapie' },
    breathing: { icon: Activity, color: 'from-green-500 to-emerald-500', label: 'Respiration' },
    journal: { icon: Heart, color: 'from-orange-500 to-red-500', label: 'Journal' },
    mood: { icon: Zap, color: 'from-yellow-500 to-amber-500', label: 'Mood Mixer' },
    'flash-glow': { icon: Target, color: 'from-indigo-500 to-purple-500', label: 'Flash Glow' },
    other: { icon: Activity, color: 'from-gray-500 to-slate-500', label: 'Autre' }
  };

  const periods = {
    '1j': 'Aujourd\'hui',
    '7j': '7 derniers jours', 
    '30j': '30 derniers jours',
    '90j': '3 derniers mois',
    'tout': 'Toute l\'activité'
  };

  // Générer des activités d'exemple
  useEffect(() => {
    const generateSampleActivities = () => {
      const sampleActivities: ActivityEntry[] = [];
      const now = new Date();
      
      const actions = [
        { module: 'scan', action: 'Scan émotionnel complété', category: 'scan' as const, outcome: 'Sentiment de calme identifié' },
        { module: 'music', action: 'Session musicothérapie', category: 'music' as const, outcome: 'Ambiance apaisante trouvée' },
        { module: 'breathing', action: 'Respiration guidée pratiquée', category: 'breathing' as const, duration: 300, outcome: 'Détente profonde atteinte' },
        { module: 'journal', action: 'Entrée journal créée', category: 'journal' as const, outcome: 'Pensées clarifiées' },
        { module: 'mood-mixer', action: 'Vibe personnalisée générée', category: 'mood' as const, outcome: 'Énergie équilibrée' },
        { module: 'flash-glow', action: 'Flash Glow terminé', category: 'flash-glow' as const, duration: 120, outcome: 'Boost énergétique ressenti' }
      ];

      for (let i = 0; i < 20; i++) {
        const action = actions[Math.floor(Math.random() * actions.length)];
        const daysBack = Math.floor(Math.random() * 30);
        const timestamp = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
        
        sampleActivities.push({
          id: `activity-${i}`,
          module: action.module,
          action: action.action,
          timestamp,
          duration: action.duration,
          outcome: action.outcome,
          category: action.category,
          mood: ['positive', 'neutral', 'improving'][Math.floor(Math.random() * 3)] as any
        });
      }

      return sampleActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    };

    // Charger depuis localStorage ou générer
    const savedActivities = localStorage.getItem('user-activities');
    if (savedActivities) {
      const parsed = JSON.parse(savedActivities).map((act: any) => ({
        ...act,
        timestamp: new Date(act.timestamp)
      }));
      setActivities(parsed);
    } else {
      const generated = generateSampleActivities();
      setActivities(generated);
      localStorage.setItem('user-activities', JSON.stringify(generated));
    }
  }, []);

  // Filtrer les activités
  useEffect(() => {
    let filtered = activities;

    // Filtre par période
    if (selectedPeriod !== 'tout') {
      const days = parseInt(selectedPeriod);
      const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(act => act.timestamp >= cutoff);
    }

    // Filtre par catégorie
    if (selectedCategory !== 'tous') {
      filtered = filtered.filter(act => act.category === selectedCategory);
    }

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(act => 
        act.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        act.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
        act.outcome?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredActivities(filtered);
  }, [activities, selectedPeriod, selectedCategory, searchTerm]);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Aujourd'hui à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Hier à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jours`;
    } else {
      return date.toLocaleDateString('fr-FR', { 
        day: 'numeric',
        month: 'short',
        year: diffDays > 365 ? 'numeric' : undefined
      });
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const getMoodColor = (mood?: string) => {
    switch (mood) {
      case 'positive': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'improving': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300';
    }
  };

  const getMoodLabel = (mood?: string) => {
    switch (mood) {
      case 'positive': return 'Positif';
      case 'improving': return 'En amélioration';
      default: return 'Neutre';
    }
  };

  // Statistiques rapides
  const stats = {
    totalSessions: filteredActivities.length,
    totalTime: filteredActivities.reduce((acc, act) => acc + (act.duration || 0), 0),
    favoriteModule: Object.entries(
      filteredActivities.reduce((acc, act) => {
        acc[act.category] = (acc[act.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).sort(([,a], [,b]) => b - a)[0]?.[0],
    positiveOutcomes: filteredActivities.filter(act => act.mood === 'positive').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
            Mon Activité
          </h1>
          <p className="text-muted-foreground">
            Votre parcours personnel de bien-être et développement
          </p>
        </motion.div>

        {/* Statistiques rapides */}
        {stats.totalSessions > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-4 gap-4 mb-6"
          >
            <Card className="p-4 text-center bg-card/50 backdrop-blur-sm">
              <div className="text-2xl font-bold text-primary">{stats.totalSessions}</div>
              <div className="text-sm text-muted-foreground">Sessions totales</div>
            </Card>
            <Card className="p-4 text-center bg-card/50 backdrop-blur-sm">
              <div className="text-2xl font-bold text-primary">{formatDuration(stats.totalTime) || '0 min'}</div>
              <div className="text-sm text-muted-foreground">Temps total</div>
            </Card>
            <Card className="p-4 text-center bg-card/50 backdrop-blur-sm">
              <div className="text-2xl font-bold text-primary">
                {stats.favoriteModule ? moduleIcons[stats.favoriteModule as keyof typeof moduleIcons]?.label.split(' ')[0] : '-'}
              </div>
              <div className="text-sm text-muted-foreground">Module préféré</div>
            </Card>
            <Card className="p-4 text-center bg-card/50 backdrop-blur-sm">
              <div className="text-2xl font-bold text-primary">{stats.positiveOutcomes}</div>
              <div className="text-sm text-muted-foreground">Résultats positifs</div>
            </Card>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filtres */}
          <div className="space-y-4">
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-muted">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filtres
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Période</label>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(periods).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Module</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous les modules</SelectItem>
                      {Object.entries(moduleIcons).filter(([key]) => key !== 'other').map(([key, config]) => (
                        <SelectItem key={key} value={key}>{config.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Recherche</label>
                  <Input
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>
            </Card>

            {/* Navigation rapide */}
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-muted">
              <h3 className="font-semibold mb-3">Navigation rapide</h3>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedPeriod('1j')}
                  className="w-full justify-start text-sm"
                  size="sm"
                >
                  <Calendar className="w-3 h-3 mr-2" />
                  Aujourd'hui
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedPeriod('7j')}
                  className="w-full justify-start text-sm"
                  size="sm"
                >
                  <TrendingUp className="w-3 h-3 mr-2" />
                  Cette semaine
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => { setSelectedCategory('tous'); setSearchTerm(''); }}
                  className="w-full justify-start text-sm"
                  size="sm"
                >
                  <Search className="w-3 h-3 mr-2" />
                  Tout voir
                </Button>
              </div>
            </Card>
          </div>

          {/* Timeline des activités */}
          <div className="lg:col-span-3">
            {filteredActivities.length === 0 ? (
              <Card className="p-12 text-center bg-card/30 backdrop-blur-sm border-muted">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Activity className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucune activité trouvée</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || selectedCategory !== 'tous' || selectedPeriod !== 'tout'
                      ? 'Essayez de modifier vos filtres pour voir plus d\'activités.'
                      : 'Commencez à utiliser les modules pour voir votre activité ici.'}
                  </p>
                </motion.div>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    Timeline d'activité
                  </h2>
                  <Badge variant="outline">
                    {filteredActivities.length} session{filteredActivities.length > 1 ? 's' : ''}
                  </Badge>
                </div>

                <AnimatePresence>
                  {filteredActivities.map((activity, index) => {
                    const moduleConfig = moduleIcons[activity.category];
                    const Icon = moduleConfig.icon;
                    
                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="p-6 bg-card/30 backdrop-blur-sm border-muted hover:border-muted/80 transition-colors">
                          <div className="flex gap-4">
                            <div className={`w-12 h-12 bg-gradient-to-r ${moduleConfig.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            
                            <div className="flex-1 space-y-2">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-medium">{activity.action}</h3>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    <span>{formatDate(activity.timestamp)}</span>
                                    {activity.duration && (
                                      <>
                                        <span>•</span>
                                        <span>{formatDuration(activity.duration)}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                                
                                {activity.mood && (
                                  <Badge className={getMoodColor(activity.mood)}>
                                    {getMoodLabel(activity.mood)}
                                  </Badge>
                                )}
                              </div>
                              
                              {activity.outcome && (
                                <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                                  <span className="font-medium">Résultat :</span> {activity.outcome}
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Bouton charger plus (simulation) */}
                {filteredActivities.length >= 10 && (
                  <Card className="p-4 text-center bg-card/20 backdrop-blur-sm border-muted">
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      Voir plus d'activités
                    </Button>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;