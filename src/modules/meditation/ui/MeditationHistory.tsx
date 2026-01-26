/**
 * MeditationHistory - Historique des sessions de méditation enrichi
 */

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, CheckCircle2, Circle, Download, Share2, Star, 
  Filter, TrendingUp, Calendar, BarChart3, Info
} from 'lucide-react';
import { format, subDays, isWithinInterval, startOfWeek, endOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { MeditationSession } from '../types';
import { techniqueLables } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

interface MeditationHistoryProps {
  sessions: MeditationSession[];
  isLoading?: boolean;
}

type PeriodFilter = 'all' | '7days' | '30days' | 'thisWeek';
type TechniqueFilter = 'all' | string;

export function MeditationHistory({ sessions, isLoading }: MeditationHistoryProps) {
  const { toast } = useToast();
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('all');
  const [techniqueFilter, setTechniqueFilter] = useState<TechniqueFilter>('all');
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('meditationFavorites');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [_selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);

  // Filtrer les sessions
  const filteredSessions = useMemo(() => {
    return sessions.filter(session => {
      // Filtre par période
      const sessionDate = new Date(session.createdAt);
      const now = new Date();

      if (periodFilter === '7days' && !isWithinInterval(sessionDate, { start: subDays(now, 7), end: now })) {
        return false;
      }
      if (periodFilter === '30days' && !isWithinInterval(sessionDate, { start: subDays(now, 30), end: now })) {
        return false;
      }
      if (periodFilter === 'thisWeek' && !isWithinInterval(sessionDate, { 
        start: startOfWeek(now, { locale: fr }), 
        end: endOfWeek(now, { locale: fr }) 
      })) {
        return false;
      }

      // Filtre par technique
      if (techniqueFilter !== 'all' && session.technique !== techniqueFilter) {
        return false;
      }

      // Filtre favoris
      if (showFavoritesOnly && !favorites.has(session.id)) {
        return false;
      }

      return true;
    });
  }, [sessions, periodFilter, techniqueFilter, showFavoritesOnly, favorites]);

  // Statistiques
  const stats = useMemo(() => {
    const completed = filteredSessions.filter(s => s.completed);
    const totalMinutes = filteredSessions.reduce((sum, s) => sum + Math.floor(s.completedDuration / 60), 0);
    const avgMoodImprovement = completed.filter(s => s.moodDelta).reduce((sum, s, _, arr) => 
      sum + (s.moodDelta || 0) / arr.length, 0);
    const completionRate = sessions.length > 0 ? (completed.length / filteredSessions.length) * 100 : 0;
    
    return { 
      totalSessions: filteredSessions.length,
      completedSessions: completed.length, 
      totalMinutes, 
      avgMoodImprovement: avgMoodImprovement.toFixed(1),
      completionRate: completionRate.toFixed(0)
    };
  }, [filteredSessions, sessions.length]);

  // Techniques uniques pour le filtre
  const uniqueTechniques = useMemo(() => {
    return [...new Set(sessions.map(s => s.technique))];
  }, [sessions]);

  // Toggle favori
  const toggleFavorite = (sessionId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(sessionId)) {
        newFavorites.delete(sessionId);
      } else {
        newFavorites.add(sessionId);
      }
      localStorage.setItem('meditationFavorites', JSON.stringify([...newFavorites]));
      return newFavorites;
    });
  };

  // Export CSV
  const exportToCSV = () => {
    const headers = ['Date', 'Technique', 'Durée (min)', 'Durée cible (min)', 'Complétée', 'Amélioration humeur', 'Guidée', 'Musique'];
    const rows = filteredSessions.map(s => [
      format(new Date(s.createdAt), 'yyyy-MM-dd HH:mm'),
      techniqueLables[s.technique],
      Math.floor(s.completedDuration / 60),
      Math.floor(s.duration / 60),
      s.completed ? 'Oui' : 'Non',
      s.moodDelta || '',
      s.withGuidance ? 'Oui' : 'Non',
      s.withMusic ? 'Oui' : 'Non'
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `meditation_history_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    
    toast({
      title: 'Export réussi',
      description: `${filteredSessions.length} sessions exportées`,
    });
  };

  // Partage
  const shareStats = async () => {
    const text = `🧘 Mon parcours méditation:\n📊 ${stats.totalSessions} sessions\n⏱️ ${stats.totalMinutes} minutes\n✅ ${stats.completionRate}% taux de complétion\n📈 +${stats.avgMoodImprovement} amélioration humeur moyenne`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Mes statistiques de méditation', text });
      } catch {
        // cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Copié !', description: 'Statistiques copiées' });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-muted rounded" />
                  <div className="h-3 w-48 bg-muted rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Circle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Aucune session enregistrée
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Commencez votre première méditation pour voir votre historique
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Statistiques globales */}
        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Statistiques
              </CardTitle>
              <div className="flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={shareStats}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Partager</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={exportToCSV}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Exporter CSV</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-background/60">
                <p className="text-2xl font-bold text-primary">{stats.totalSessions}</p>
                <p className="text-xs text-muted-foreground">Sessions</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-background/60">
                <p className="text-2xl font-bold text-emerald-500">{stats.totalMinutes}min</p>
                <p className="text-xs text-muted-foreground">Temps total</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-background/60">
                <p className="text-2xl font-bold text-blue-500">{stats.completionRate}%</p>
                <p className="text-xs text-muted-foreground">Complétion</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-background/60">
                <p className="text-2xl font-bold text-amber-500">+{stats.avgMoodImprovement}</p>
                <p className="text-xs text-muted-foreground">Humeur moy.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filtres */}
        <div className="flex flex-wrap gap-2">
          <Select value={periodFilter} onValueChange={(v) => setPeriodFilter(v as PeriodFilter)}>
            <SelectTrigger className="w-36">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tout</SelectItem>
              <SelectItem value="7days">7 derniers jours</SelectItem>
              <SelectItem value="30days">30 derniers jours</SelectItem>
              <SelectItem value="thisWeek">Cette semaine</SelectItem>
            </SelectContent>
          </Select>

          <Select value={techniqueFilter} onValueChange={setTechniqueFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Technique" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes techniques</SelectItem>
              {uniqueTechniques.map(tech => (
                <SelectItem key={tech} value={tech}>
                  {techniqueLables[tech]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant={showFavoritesOnly ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          >
            <Star className={`h-4 w-4 mr-1 ${showFavoritesOnly ? 'fill-current' : ''}`} />
            Favoris
          </Button>
        </div>

        {/* Liste des sessions */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredSessions.map((session, index) => {
              const durationMin = Math.floor(session.completedDuration / 60);
              const targetMin = Math.floor(session.duration / 60);
              const isComplete = session.completed;
              const hasMoodImprovement = session.moodDelta && session.moodDelta > 0;
              const isFavorite = favorites.has(session.id);

              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`${isComplete ? '' : 'opacity-60'} hover:shadow-md transition-shadow`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Status icon */}
                        <div className={`mt-1 ${isComplete ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                          {isComplete ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <Circle className="h-5 w-5" />
                          )}
                        </div>

                        {/* Session info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium truncate">
                              {techniqueLables[session.technique]}
                            </p>
                            {hasMoodImprovement && (
                              <Badge variant="secondary" className="text-xs bg-emerald-500/10 text-emerald-600">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                +{session.moodDelta}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {durationMin}min / {targetMin}min
                            </span>
                            <span>
                              {format(new Date(session.createdAt), 'PPp', { locale: fr })}
                            </span>
                          </div>

                          {/* Additional details */}
                          <div className="flex items-center gap-2 mt-2">
                            {session.withGuidance && (
                              <Badge variant="outline" className="text-xs">
                                Guidée
                              </Badge>
                            )}
                            {session.withMusic && (
                              <Badge variant="outline" className="text-xs">
                                Musique
                              </Badge>
                            )}
                            {!isComplete && (
                              <Badge variant="secondary" className="text-xs">
                                Incomplète
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => toggleFavorite(session.id)}
                              >
                                <Star className={`h-4 w-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                            </TooltipContent>
                          </Tooltip>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setSelectedSession(session)}
                              >
                                <Info className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Détails de la session</DialogTitle>
                                <DialogDescription>
                                  {format(new Date(session.createdAt), 'PPPp', { locale: fr })}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="p-3 rounded-lg bg-muted/50">
                                    <p className="text-sm text-muted-foreground">Technique</p>
                                    <p className="font-semibold">{techniqueLables[session.technique]}</p>
                                  </div>
                                  <div className="p-3 rounded-lg bg-muted/50">
                                    <p className="text-sm text-muted-foreground">Durée</p>
                                    <p className="font-semibold">{durationMin} / {targetMin} min</p>
                                  </div>
                                  <div className="p-3 rounded-lg bg-muted/50">
                                    <p className="text-sm text-muted-foreground">Statut</p>
                                    <p className="font-semibold">{isComplete ? '✅ Complétée' : '⏸️ Incomplète'}</p>
                                  </div>
                                  <div className="p-3 rounded-lg bg-muted/50">
                                    <p className="text-sm text-muted-foreground">Humeur</p>
                                    <p className="font-semibold">
                                      {session.moodDelta ? `+${session.moodDelta}` : 'Non mesurée'}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  {session.withGuidance && <Badge>Guidée</Badge>}
                                  {session.withMusic && <Badge>Avec musique</Badge>}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredSessions.length === 0 && sessions.length > 0 && (
          <Card>
            <CardContent className="py-8 text-center">
              <Filter className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Aucune session ne correspond aux filtres</p>
              <Button 
                variant="link" 
                onClick={() => {
                  setPeriodFilter('all');
                  setTechniqueFilter('all');
                  setShowFavoritesOnly(false);
                }}
              >
                Réinitialiser les filtres
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
}
