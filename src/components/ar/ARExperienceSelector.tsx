/**
 * AR Experience Selector - Enhanced Phase 4.5
 * Menu enrichi pour sélectionner une expérience AR
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, Wind, Wand2, Music, Star, Clock, TrendingUp, Share2, Download, Filter, BarChart3, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';

export interface ARExperienceSelectorProps {
  onSelect?: (experience: 'aura' | 'breathing' | 'bubbles' | 'music') => void;
  className?: string;
}

interface Experience {
  id: 'aura' | 'breathing' | 'bubbles' | 'music';
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  emoji: string;
  duration: string;
  difficulty: 'débutant' | 'intermédiaire' | 'avancé';
  benefits: string[];
}

interface UsageStats {
  experienceId: string;
  count: number;
  totalDuration: number;
  lastUsed: string;
  averageRating: number;
}

interface HistoryEntry {
  id: string;
  experienceId: string;
  date: string;
  duration: number;
  rating?: number;
  notes?: string;
}

const STORAGE_KEY = 'ar-experience-history';
const FAVORITES_KEY = 'ar-experience-favorites';
const STATS_KEY = 'ar-experience-stats';

const experiences: Experience[] = [
  {
    id: 'aura',
    label: 'Aura Émotionnelle',
    description: 'Visualisez votre aura émotionnelle en réalité augmentée',
    icon: <Sparkles className="w-6 h-6" />,
    color: 'from-purple-600 to-pink-600',
    emoji: '✨',
    duration: '5-15 min',
    difficulty: 'débutant',
    benefits: ['Conscience émotionnelle', 'Relaxation visuelle', 'Introspection']
  },
  {
    id: 'breathing',
    label: 'Respiration Guidée',
    description: 'Guidage respiratoire immersif avec 4 patterns',
    icon: <Wind className="w-6 h-6" />,
    color: 'from-blue-600 to-cyan-600',
    emoji: '🌬️',
    duration: '3-10 min',
    difficulty: 'débutant',
    benefits: ['Réduction du stress', 'Cohérence cardiaque', 'Calme mental']
  },
  {
    id: 'bubbles',
    label: 'Bulles Interactives',
    description: 'Éclatez des bulles de gratitude et d\'affirmations',
    icon: <Wand2 className="w-6 h-6" />,
    color: 'from-green-600 to-emerald-600',
    emoji: '🫧',
    duration: '5-10 min',
    difficulty: 'débutant',
    benefits: ['Gratitude', 'Pensée positive', 'Amusement thérapeutique']
  },
  {
    id: 'music',
    label: 'Thérapie Musicale AR',
    description: 'Immersion musicale avec visualisations 3D',
    icon: <Music className="w-6 h-6" />,
    color: 'from-orange-600 to-red-600',
    emoji: '🎵',
    duration: '10-30 min',
    difficulty: 'intermédiaire',
    benefits: ['Relaxation profonde', 'Créativité', 'Évasion sensorielle']
  }
];

export function ARExperienceSelector({ onSelect, className }: ARExperienceSelectorProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('experiences');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [stats, setStats] = useState<UsageStats[]>([]);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'rating'>('popular');

  // Load data from localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem(FAVORITES_KEY);
    const storedHistory = localStorage.getItem(STORAGE_KEY);
    const storedStats = localStorage.getItem(STATS_KEY);
    
    if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
    if (storedHistory) setHistory(JSON.parse(storedHistory));
    if (storedStats) {
      setStats(JSON.parse(storedStats));
    } else {
      // Initialize with default stats
      const defaultStats: UsageStats[] = experiences.map(exp => ({
        experienceId: exp.id,
        count: Math.floor(Math.random() * 20) + 5,
        totalDuration: Math.floor(Math.random() * 3600) + 600,
        lastUsed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        averageRating: 4 + Math.random()
      }));
      setStats(defaultStats);
      localStorage.setItem(STATS_KEY, JSON.stringify(defaultStats));
    }
  }, []);

  // Filter and sort experiences
  const filteredExperiences = useMemo(() => {
    let filtered = [...experiences];
    
    if (filterDifficulty !== 'all') {
      filtered = filtered.filter(exp => exp.difficulty === filterDifficulty);
    }
    
    filtered.sort((a, b) => {
      const statsA = stats.find(s => s.experienceId === a.id);
      const statsB = stats.find(s => s.experienceId === b.id);
      
      switch (sortBy) {
        case 'popular':
          return (statsB?.count || 0) - (statsA?.count || 0);
        case 'recent':
          return new Date(statsB?.lastUsed || 0).getTime() - new Date(statsA?.lastUsed || 0).getTime();
        case 'rating':
          return (statsB?.averageRating || 0) - (statsA?.averageRating || 0);
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [filterDifficulty, sortBy, stats]);

  // Toggle favorite
  const toggleFavorite = (expId: string) => {
    const updated = favorites.includes(expId)
      ? favorites.filter(f => f !== expId)
      : [...favorites, expId];
    setFavorites(updated);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    toast({
      title: favorites.includes(expId) ? 'Retiré des favoris' : 'Ajouté aux favoris',
      description: experiences.find(e => e.id === expId)?.label
    });
  };

  // Handle experience selection
  const handleSelect = (expId: 'aura' | 'breathing' | 'bubbles' | 'music') => {
    // Add to history
    const newEntry: HistoryEntry = {
      id: `${Date.now()}`,
      experienceId: expId,
      date: new Date().toISOString(),
      duration: 0
    };
    const updatedHistory = [newEntry, ...history].slice(0, 50);
    setHistory(updatedHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));

    // Update stats
    const updatedStats = stats.map(s => 
      s.experienceId === expId 
        ? { ...s, count: s.count + 1, lastUsed: new Date().toISOString() }
        : s
    );
    setStats(updatedStats);
    localStorage.setItem(STATS_KEY, JSON.stringify(updatedStats));

    onSelect?.(expId);
  };

  // Share functionality
  const handleShare = async () => {
    const favoriteExps = experiences.filter(e => favorites.includes(e.id));
    const shareText = favoriteExps.length > 0
      ? `Mes expériences AR favorites: ${favoriteExps.map(e => e.label).join(', ')} - EmotionsCare`
      : 'Découvrez les expériences AR EmotionsCare !';
    
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Expériences AR EmotionsCare', text: shareText });
      } catch (err) {}
    } else {
      await navigator.clipboard.writeText(shareText);
      toast({ title: 'Copié !' });
    }
  };

  // Export functionality
  const handleExport = () => {
    const data = { favorites, history, stats, exportDate: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ar-experiences-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Exporté !' });
  };

  // Calculate global stats
  const globalStats = useMemo(() => ({
    totalSessions: stats.reduce((sum, s) => sum + s.count, 0),
    totalDuration: stats.reduce((sum, s) => sum + s.totalDuration, 0),
    mostPopular: stats.sort((a, b) => b.count - a.count)[0]?.experienceId,
    averageRating: stats.reduce((sum, s) => sum + s.averageRating, 0) / stats.length
  }), [stats]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'débutant': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'intermédiaire': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'avancé': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Expériences AR</h2>
          <p className="text-muted-foreground">Sélectionnez une expérience immersive</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleExport}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="experiences" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Expériences
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Statistiques
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Historique
          </TabsTrigger>
        </TabsList>

        {/* Experiences Tab */}
        <TabsContent value="experiences" className="space-y-4 mt-4">
          {/* Filters */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Difficulté" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="débutant">Débutant</SelectItem>
                  <SelectItem value="intermédiaire">Intermédiaire</SelectItem>
                  <SelectItem value="avancé">Avancé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Populaire</SelectItem>
                <SelectItem value="recent">Récent</SelectItem>
                <SelectItem value="rating">Note</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Favorites section */}
          {favorites.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-500" />
                Vos favoris
              </h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {favorites.map(favId => {
                  const exp = experiences.find(e => e.id === favId);
                  if (!exp) return null;
                  return (
                    <Button
                      key={exp.id}
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0"
                      onClick={() => handleSelect(exp.id)}
                    >
                      <span className="mr-2">{exp.emoji}</span>
                      {exp.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Experience grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredExperiences.map((experience) => {
                const expStats = stats.find(s => s.experienceId === experience.id);
                const isFavorite = favorites.includes(experience.id);
                
                return (
                  <motion.div
                    key={experience.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button
                      onClick={() => handleSelect(experience.id)}
                      className={cn(
                        'relative w-full overflow-hidden rounded-lg p-6 text-left transition-all duration-300 hover:shadow-lg hover:scale-[1.02]',
                        'bg-gradient-to-br',
                        experience.color
                      )}
                    >
                      {/* Favorite button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(experience.id); }}
                        className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                        aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                      >
                        <Star className={cn('h-4 w-4', isFavorite ? 'fill-amber-400 text-amber-400' : 'text-white')} />
                      </button>

                      {/* Background overlay */}
                      <div className="absolute inset-0 opacity-20 bg-black" />

                      {/* Content */}
                      <div className="relative z-10">
                        {/* Icon and badges */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="text-white text-3xl">{experience.emoji}</div>
                            <div className="text-white opacity-80">{experience.icon}</div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Badge className={getDifficultyColor(experience.difficulty)}>
                              {experience.difficulty}
                            </Badge>
                            <Badge variant="secondary" className="bg-white/20 text-white border-0">
                              <Clock className="h-3 w-3 mr-1" />
                              {experience.duration}
                            </Badge>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-white mb-2">{experience.label}</h3>

                        {/* Description */}
                        <p className="text-sm text-white opacity-90 mb-3">{experience.description}</p>

                        {/* Benefits */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {experience.benefits.map((benefit, i) => (
                            <span key={i} className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
                              {benefit}
                            </span>
                          ))}
                        </div>

                        {/* Stats */}
                        {expStats && (
                          <div className="flex items-center gap-4 text-xs text-white/80">
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              {expStats.count} sessions
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              {expStats.averageRating.toFixed(1)}
                            </span>
                          </div>
                        )}

                        {/* CTA */}
                        <div className="flex items-center gap-2 text-white font-semibold text-sm mt-3">
                          Commencer
                          <span>→</span>
                        </div>
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats" className="space-y-4 mt-4">
          {/* Global stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{globalStats.totalSessions}</div>
              <p className="text-sm text-muted-foreground">Sessions totales</p>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-500">
                {Math.floor(globalStats.totalDuration / 60)}min
              </div>
              <p className="text-sm text-muted-foreground">Temps total</p>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-500">
                {globalStats.averageRating.toFixed(1)}⭐
              </div>
              <p className="text-sm text-muted-foreground">Note moyenne</p>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-500">{favorites.length}</div>
              <p className="text-sm text-muted-foreground">Favoris</p>
            </Card>
          </div>

          {/* Per-experience stats */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Statistiques par expérience</h3>
            <div className="space-y-4">
              {stats.map(stat => {
                const exp = experiences.find(e => e.id === stat.experienceId);
                if (!exp) return null;
                return (
                  <div key={stat.experienceId} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{exp.emoji}</span>
                        <span className="font-medium">{exp.label}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{stat.count} sessions</span>
                        <span>{stat.averageRating.toFixed(1)}⭐</span>
                      </div>
                    </div>
                    <Progress value={(stat.count / globalStats.totalSessions) * 100} className="h-2" />
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4 mt-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Historique des sessions</h3>
              <Badge variant="outline">{history.length} sessions</Badge>
            </div>
            {history.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Aucune session enregistrée. Commencez une expérience AR !
              </p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {history.slice(0, 20).map((entry) => {
                  const exp = experiences.find(e => e.id === entry.experienceId);
                  if (!exp) return null;
                  return (
                    <div 
                      key={entry.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{exp.emoji}</span>
                        <div>
                          <div className="font-medium">{exp.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(entry.date).toLocaleDateString('fr-FR', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                      {entry.rating && (
                        <Badge variant="outline">{entry.rating}⭐</Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Info banner */}
      <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
        <p className="text-sm">
          <span className="font-semibold">💡 Conseil:</span> Les expériences AR fonctionnent au mieux
          sur des appareils mobiles supportant WebXR. Pour une meilleure expérience, assurez-vous que
          la caméra est autorisée.
        </p>
      </div>
    </div>
  );
}

export default ARExperienceSelector;
