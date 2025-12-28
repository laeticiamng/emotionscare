import React, { useState, useMemo } from 'react';
import { Clock, TrendingUp, Activity, ChevronRight, Filter, Download, BarChart3, Camera, MessageSquare, Mic, SlidersHorizontal, Calendar, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useScanHistory } from '@/hooks/useScanHistory';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow, format, subDays, isAfter } from 'date-fns';
import { fr } from 'date-fns/locale';
import { scanAnalytics } from '@/lib/analytics/scanEvents';
import { motion, AnimatePresence } from 'framer-motion';

type ScanSource = 'scan_camera' | 'SAM' | 'scan_sliders' | 'voice' | 'all';
type TimePeriod = '7d' | '30d' | '90d' | 'all';

const getEmotionColor = (valence: number, arousal: number) => {
  if (valence > 60 && arousal > 60) return 'text-emerald-500';
  if (valence > 60 && arousal <= 60) return 'text-sky-500';
  if (valence <= 40 && arousal > 60) return 'text-orange-500';
  if (valence <= 40 && arousal <= 60) return 'text-violet-500';
  return 'text-muted-foreground';
};

const getEmotionBgColor = (valence: number, arousal: number) => {
  if (valence > 60 && arousal > 60) return 'bg-emerald-500/10';
  if (valence > 60 && arousal <= 60) return 'bg-sky-500/10';
  if (valence <= 40 && arousal > 60) return 'bg-orange-500/10';
  if (valence <= 40 && arousal <= 60) return 'bg-violet-500/10';
  return 'bg-muted/10';
};

const getEmotionLabel = (valence: number, arousal: number) => {
  if (valence > 60 && arousal > 60) return 'Énergique et positif';
  if (valence > 60 && arousal <= 60) return 'Calme et serein';
  if (valence <= 40 && arousal > 60) return 'Tension ressentie';
  if (valence <= 40 && arousal <= 60) return 'Apaisement recherché';
  return 'État neutre';
};

const sourceConfig: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  'scan_camera': { label: 'Vidéo', icon: Camera, color: 'text-blue-500' },
  'SAM': { label: 'Texte', icon: MessageSquare, color: 'text-green-500' },
  'scan_sliders': { label: 'Manuel', icon: SlidersHorizontal, color: 'text-purple-500' },
  'voice': { label: 'Vocal', icon: Mic, color: 'text-orange-500' },
};

// Mini graphique en barres
const MiniChart = ({ data }: { data: { valence: number; arousal: number }[] }) => {
  const recentData = data.slice(0, 7).reverse();
  const maxVal = 100;
  
  return (
    <div className="flex items-end gap-0.5 h-8">
      {recentData.map((item, i) => (
        <Tooltip key={i}>
          <TooltipTrigger asChild>
            <div 
              className="w-2 rounded-t bg-primary/60 hover:bg-primary transition-colors cursor-pointer"
              style={{ height: `${(item.valence / maxVal) * 100}%` }}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Valence: {Math.round(item.valence)}</p>
            <p className="text-xs">Arousal: {Math.round(item.arousal)}</p>
          </TooltipContent>
        </Tooltip>
      ))}
      {recentData.length === 0 && (
        <span className="text-xs text-muted-foreground">Pas de données</span>
      )}
    </div>
  );
};

export const ScanHistory: React.FC = () => {
  const [limit, setLimit] = useState(5);
  const { data: history, isLoading } = useScanHistory(50); // Charger plus pour le filtrage
  const [isExpanded, setIsExpanded] = useState(false);
  const [sourceFilter, setSourceFilter] = useState<ScanSource>('all');
  const [periodFilter, setPeriodFilter] = useState<TimePeriod>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filtrer l'historique
  const filteredHistory = useMemo(() => {
    if (!history) return [];
    
    let filtered = [...history];
    
    // Filtre par source
    if (sourceFilter !== 'all') {
      filtered = filtered.filter(scan => scan.source === sourceFilter);
    }
    
    // Filtre par période
    if (periodFilter !== 'all') {
      const daysMap: Record<TimePeriod, number> = { '7d': 7, '30d': 30, '90d': 90, 'all': 0 };
      const cutoffDate = subDays(new Date(), daysMap[periodFilter]);
      filtered = filtered.filter(scan => isAfter(new Date(scan.created_at), cutoffDate));
    }
    
    return filtered;
  }, [history, sourceFilter, periodFilter]);

  const displayedHistory = isExpanded ? filteredHistory.slice(0, 15) : filteredHistory.slice(0, limit);

  // Statistiques rapides
  const stats = useMemo(() => {
    if (!filteredHistory.length) return null;
    
    const avgValence = filteredHistory.reduce((sum, s) => sum + s.valence, 0) / filteredHistory.length;
    const avgArousal = filteredHistory.reduce((sum, s) => sum + s.arousal, 0) / filteredHistory.length;
    const sourceCounts = filteredHistory.reduce((acc, s) => {
      acc[s.source] = (acc[s.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topSource = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
    
    return { avgValence, avgArousal, topSource, total: filteredHistory.length };
  }, [filteredHistory]);

  const handleToggleExpanded = () => {
    if (!isExpanded) {
      scanAnalytics.historyViewed(history?.length || 0);
    }
    setIsExpanded(!isExpanded);
  };

  const handleExport = () => {
    if (!filteredHistory.length) return;
    
    // Fonction pour échapper correctement les valeurs CSV
    const escapeCSV = (value: string | number | undefined | null): string => {
      if (value === undefined || value === null) return '';
      const str = String(value);
      // Si la valeur contient des guillemets, virgules ou retours à la ligne, l'entourer de guillemets
      if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };
    
    const csvContent = [
      ['Date', 'Valence', 'Arousal', 'Source', 'État', 'Résumé'].join(','),
      ...filteredHistory.map(scan => [
        escapeCSV(format(new Date(scan.created_at), 'dd/MM/yyyy HH:mm')),
        Math.round(scan.valence),
        Math.round(scan.arousal),
        escapeCSV(sourceConfig[scan.source]?.label || scan.source),
        escapeCSV(getEmotionLabel(scan.valence, scan.arousal)),
        escapeCSV(scan.summary || ''),
      ].join(','))
    ].join('\n');
    
    // Ajouter BOM pour UTF-8 (support caractères spéciaux dans Excel)
    const bom = '\uFEFF';
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `scan-history-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setSourceFilter('all');
    setPeriodFilter('all');
  };

  const hasActiveFilters = sourceFilter !== 'all' || periodFilter !== 'all';

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!history || history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Historique récent
          </CardTitle>
          <CardDescription>
            Vos derniers scans apparaîtront ici
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-6">
            Aucun scan enregistré pour le moment
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Historique récent
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2">
                    {filteredHistory.length} résultat{filteredHistory.length > 1 ? 's' : ''}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                {isExpanded ? 'Historique détaillé' : `${displayedHistory.length} derniers états`}
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Mini graphique */}
              {stats && filteredHistory.length > 1 && (
                <div className="hidden sm:block">
                  <MiniChart data={filteredHistory.map(s => ({ valence: s.valence, arousal: s.arousal }))} />
                </div>
              )}
              
              {/* Bouton filtres */}
              <Popover open={showFilters} onOpenChange={setShowFilters}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Filter className="h-4 w-4" />
                    Filtres
                    {hasActiveFilters && (
                      <span className="ml-1 h-2 w-2 rounded-full bg-primary" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64" align="end">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Filtres</h4>
                      {hasActiveFilters && (
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="h-auto p-1">
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Source</label>
                      <Select value={sourceFilter} onValueChange={(v) => setSourceFilter(v as ScanSource)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes les sources</SelectItem>
                          {Object.entries(sourceConfig).map(([key, config]) => (
                            <SelectItem key={key} value={key}>
                              <span className="flex items-center gap-2">
                                <config.icon className={`h-4 w-4 ${config.color}`} />
                                {config.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Période</label>
                      <Select value={periodFilter} onValueChange={(v) => setPeriodFilter(v as TimePeriod)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toute la période</SelectItem>
                          <SelectItem value="7d">7 derniers jours</SelectItem>
                          <SelectItem value="30d">30 derniers jours</SelectItem>
                          <SelectItem value="90d">90 derniers jours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              
              {/* Export */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleExport}
                    disabled={filteredHistory.length === 0}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Exporter en CSV</TooltipContent>
              </Tooltip>
            </div>
          </div>
          
          {/* Stats rapides */}
          {stats && (
            <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t">
              <div className="flex items-center gap-2 text-sm">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Moy:</span>
                <span className={getEmotionColor(stats.avgValence, stats.avgArousal)}>
                  V:{Math.round(stats.avgValence)} A:{Math.round(stats.avgArousal)}
                </span>
              </div>
              {stats.topSource && sourceConfig[stats.topSource] && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Source principale:</span>
                  <Badge variant="outline" className="gap-1">
                    {React.createElement(sourceConfig[stats.topSource].icon, { 
                      className: `h-3 w-3 ${sourceConfig[stats.topSource].color}` 
                    })}
                    {sourceConfig[stats.topSource].label}
                  </Badge>
                </div>
              )}
            </div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-2">
          <AnimatePresence mode="popLayout">
            {displayedHistory.map((scan, index) => {
              const emotionColor = getEmotionColor(scan.valence, scan.arousal);
              const emotionBg = getEmotionBgColor(scan.valence, scan.arousal);
              const emotionLabel = getEmotionLabel(scan.valence, scan.arousal);
              const sourceInfo = sourceConfig[scan.source];
              const timeAgo = formatDistanceToNow(new Date(scan.created_at), {
                addSuffix: true,
                locale: fr,
              });

              return (
                <motion.div
                  key={scan.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className={`flex items-center gap-3 rounded-lg border p-3 transition-all hover:shadow-sm ${emotionBg}`}
                >
                  <div className={`flex-shrink-0 ${emotionColor}`}>
                    {index === 0 ? (
                      <TrendingUp className="h-5 w-5" />
                    ) : (
                      <Activity className="h-5 w-5" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-sm font-medium ${emotionColor}`}>
                        {emotionLabel}
                      </p>
                      {sourceInfo && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 gap-1">
                          <sourceInfo.icon className={`h-3 w-3 ${sourceInfo.color}`} />
                          {sourceInfo.label}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {timeAgo}
                      </span>
                      {scan.summary && (
                        <span className="ml-2 opacity-80">· {scan.summary}</span>
                      )}
                    </p>
                  </div>
                  
                  {/* Barre visuelle des valeurs */}
                  <div className="flex-shrink-0 hidden sm:flex flex-col gap-1 w-16">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-muted-foreground w-3">V</span>
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 rounded-full transition-all"
                              style={{ width: `${scan.valence}%` }}
                            />
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>Valence: {Math.round(scan.valence)}</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-muted-foreground w-3">A</span>
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-amber-500 rounded-full transition-all"
                              style={{ width: `${scan.arousal}%` }}
                            />
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>Arousal: {Math.round(scan.arousal)}</TooltipContent>
                    </Tooltip>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {/* Message si filtres sans résultat */}
          {filteredHistory.length === 0 && hasActiveFilters && (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground">Aucun scan ne correspond aux filtres.</p>
              <Button variant="link" size="sm" onClick={clearFilters}>
                Réinitialiser les filtres
              </Button>
            </div>
          )}
          
          {/* Bouton voir plus */}
          {filteredHistory.length > limit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleExpanded}
              className="w-full gap-1 mt-2"
            >
              {isExpanded ? 'Voir moins' : `Voir plus (${filteredHistory.length - limit} autres)`}
              <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            </Button>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
