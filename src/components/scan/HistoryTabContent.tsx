// @ts-nocheck

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { EmotionResult } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Search, Calendar, TrendingUp, TrendingDown, Filter, 
  Download, Share2, Trash2, Star, ChevronDown, ChevronUp,
  BarChart3, Clock, Heart, Minus
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useScanSettings } from '@/hooks/useScanSettings';

interface HistoryTabContentProps {
  emotionHistory: EmotionResult[];
  onDelete?: (id: string) => void;
  onSelect?: (item: EmotionResult) => void;
}

type SortBy = 'date' | 'score' | 'emotion';
type SortOrder = 'asc' | 'desc';
type TimeFilter = 'all' | 'today' | 'week' | 'month';

const HistoryTabContent: React.FC<HistoryTabContentProps> = ({ 
  emotionHistory,
  onDelete,
  onSelect
}) => {
  const { toast } = useToast();
  const { historyFavorites, toggleHistoryFavorite } = useScanSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>(historyFavorites);
  const [showStats, setShowStats] = useState(true);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Sync favorites from hook
  useEffect(() => {
    setFavorites(historyFavorites);
  }, [historyFavorites]);

  // Get unique emotions
  const uniqueEmotions = useMemo(() => {
    const emotions = new Set<string>();
    emotionHistory.forEach(item => {
      if (item.emotion) emotions.add(item.emotion);
    });
    return Array.from(emotions);
  }, [emotionHistory]);

  // Filter and sort data
  const filteredHistory = useMemo(() => {
    let filtered = [...emotionHistory];

    // Time filter
    const now = new Date();
    if (timeFilter !== 'all') {
      const cutoff = new Date();
      switch (timeFilter) {
        case 'today':
          cutoff.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoff.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoff.setMonth(now.getMonth() - 1);
          break;
      }
      filtered = filtered.filter(item => new Date(item.date) >= cutoff);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.emotion?.toLowerCase().includes(query) ||
        item.text?.toLowerCase().includes(query)
      );
    }

    // Emotion filter
    if (selectedEmotions.length > 0) {
      filtered = filtered.filter(item => 
        item.emotion && selectedEmotions.includes(item.emotion)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
          break;
        case 'score':
          comparison = (b.score || 0) - (a.score || 0);
          break;
        case 'emotion':
          comparison = (a.emotion || '').localeCompare(b.emotion || '');
          break;
      }
      return sortOrder === 'desc' ? comparison : -comparison;
    });

    return filtered;
  }, [emotionHistory, searchQuery, sortBy, sortOrder, timeFilter, selectedEmotions]);

  // Statistics
  const stats = useMemo(() => {
    if (filteredHistory.length === 0) return null;

    const avgScore = filteredHistory.reduce((sum, item) => sum + (item.score || 0), 0) / filteredHistory.length;
    
    // Trend
    const halfIndex = Math.floor(filteredHistory.length / 2);
    const firstHalf = filteredHistory.slice(halfIndex);
    const secondHalf = filteredHistory.slice(0, halfIndex);
    const firstAvg = firstHalf.reduce((s, i) => s + (i.score || 0), 0) / (firstHalf.length || 1);
    const secondAvg = secondHalf.reduce((s, i) => s + (i.score || 0), 0) / (secondHalf.length || 1);
    const trend = secondAvg > firstAvg ? 'up' : secondAvg < firstAvg ? 'down' : 'stable';

    // Top emotions
    const emotionCounts: Record<string, number> = {};
    filteredHistory.forEach(item => {
      if (item.emotion) {
        emotionCounts[item.emotion] = (emotionCounts[item.emotion] || 0) + 1;
      }
    });
    const topEmotions = Object.entries(emotionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    return { avgScore: Math.round(avgScore * 100), trend, topEmotions, total: filteredHistory.length };
  }, [filteredHistory]);

  // Toggle favorite
  const handleToggleFavorite = (id: string) => {
    const updated = favorites.includes(id)
      ? favorites.filter(f => f !== id)
      : [...favorites, id];
    setFavorites(updated);
    toggleHistoryFavorite(id);
  };

  // Toggle item selection
  const toggleSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Toggle item expansion
  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Export functionality
  const handleExport = (format: 'json' | 'csv') => {
    const dataToExport = selectedItems.length > 0 
      ? filteredHistory.filter(item => selectedItems.includes(item.id))
      : filteredHistory;

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `emotion-history-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const headers = ['Date', 'Emotion', 'Score', 'Text'];
      const rows = dataToExport.map(item => [
        new Date(item.date).toISOString(),
        item.emotion,
        (item.score * 100).toFixed(0) + '%',
        `"${item.text?.replace(/"/g, '""') || ''}"`
      ]);
      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `emotion-history-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }

    toast({ title: 'Exporté !', description: `${dataToExport.length} entrées exportées en ${format.toUpperCase()}` });
  };

  // Share functionality
  const handleShare = async () => {
    if (!stats) return;
    const shareText = `Mon historique émotionnel: ${stats.total} entrées, score moyen ${stats.avgScore}% - EmotionsCare`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Mon Historique Émotionnel', text: shareText });
      } catch (err) {}
    } else {
      await navigator.clipboard.writeText(shareText);
      toast({ title: 'Copié !' });
    }
  };

  // Delete selected
  const handleDeleteSelected = () => {
    if (selectedItems.length === 0 || !onDelete) return;
    if (!confirm(`Supprimer ${selectedItems.length} entrées ?`)) return;
    
    selectedItems.forEach(id => onDelete(id));
    setSelectedItems([]);
    toast({ title: 'Supprimé', description: `${selectedItems.length} entrées supprimées` });
  };

  // Get emotion color
  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      happy: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      sad: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      angry: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      fear: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      neutral: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
      calm: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
      excited: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      stressed: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
    };
    return colors[emotion?.toLowerCase()] || 'bg-muted text-muted-foreground';
  };

  if (emotionHistory.length === 0) {
    return (
      <Card className="p-6 text-center">
        <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <p className="font-medium">Vous n'avez pas encore d'historique d'émotions.</p>
        <p className="text-muted-foreground mt-2">Effectuez votre première analyse émotionnelle pour commencer à suivre vos émotions.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with stats */}
      <Collapsible open={showStats} onOpenChange={setShowStats}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Historique des analyses
            <Badge variant="outline">{filteredHistory.length}</Badge>
          </h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {showStats ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent>
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
              <Card className="p-3 text-center">
                <div className="text-2xl font-bold text-primary">{stats.avgScore}%</div>
                <div className="text-xs text-muted-foreground">Score moyen</div>
              </Card>
              <Card className="p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                  {stats.trend === 'up' && <TrendingUp className="h-5 w-5 text-emerald-500" />}
                  {stats.trend === 'down' && <TrendingDown className="h-5 w-5 text-red-500" />}
                  {stats.trend === 'stable' && <Minus className="h-5 w-5 text-slate-500" />}
                </div>
                <div className="text-xs text-muted-foreground">Tendance</div>
              </Card>
              <Card className="p-3 text-center">
                <div className="text-2xl font-bold text-blue-500">{stats.total}</div>
                <div className="text-xs text-muted-foreground">Entrées</div>
              </Card>
              <Card className="p-3 text-center">
                <div className="text-2xl font-bold text-amber-500">{favorites.length}</div>
                <div className="text-xs text-muted-foreground">Favoris</div>
              </Card>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Filters and actions */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={timeFilter} onValueChange={(v: TimeFilter) => setTimeFilter(v)}>
          <SelectTrigger className="w-32">
            <Calendar className="h-4 w-4 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tout</SelectItem>
            <SelectItem value="today">Aujourd'hui</SelectItem>
            <SelectItem value="week">7 jours</SelectItem>
            <SelectItem value="month">30 jours</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(v: SortBy) => setSortBy(v)}>
          <SelectTrigger className="w-28">
            <Filter className="h-4 w-4 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="score">Score</SelectItem>
            <SelectItem value="emotion">Émotion</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
        >
          {sortOrder === 'desc' ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>

        <Button variant="outline" size="icon" onClick={handleShare}>
          <Share2 className="h-4 w-4" />
        </Button>

        <Select onValueChange={(v: 'json' | 'csv') => handleExport(v)}>
          <SelectTrigger className="w-10">
            <Download className="h-4 w-4" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="json">JSON</SelectItem>
            <SelectItem value="csv">CSV</SelectItem>
          </SelectContent>
        </Select>

        {selectedItems.length > 0 && onDelete && (
          <Button variant="destructive" size="sm" onClick={handleDeleteSelected}>
            <Trash2 className="h-4 w-4 mr-1" />
            {selectedItems.length}
          </Button>
        )}
      </div>

      {/* Emotion filters */}
      {uniqueEmotions.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {uniqueEmotions.map(emotion => (
            <Badge
              key={emotion}
              variant={selectedEmotions.includes(emotion) ? 'default' : 'outline'}
              className="cursor-pointer transition-all"
              onClick={() => {
                setSelectedEmotions(prev => 
                  prev.includes(emotion) ? prev.filter(e => e !== emotion) : [...prev, emotion]
                );
              }}
            >
              {emotion}
            </Badge>
          ))}
          {selectedEmotions.length > 0 && (
            <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setSelectedEmotions([])}>
              Réinitialiser
            </Button>
          )}
        </div>
      )}

      {/* History list */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {filteredHistory.map((item) => (
          <Card 
            key={item.id} 
            className={cn(
              "p-4 hover:bg-accent/10 transition-colors cursor-pointer",
              selectedItems.includes(item.id) && "ring-2 ring-primary",
              favorites.includes(item.id) && "border-amber-300 dark:border-amber-700"
            )}
            onClick={() => onSelect?.(item)}
          >
            <div className="flex items-start gap-3">
              <Checkbox
                checked={selectedItems.includes(item.id)}
                onCheckedChange={() => toggleSelection(item.id)}
                onClick={(e) => e.stopPropagation()}
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <Badge className={getEmotionColor(item.emotion)}>
                      {item.emotion}
                    </Badge>
                    {favorites.includes(item.id) && (
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      Score: {Math.round(item.score * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(item.date), { addSuffix: true, locale: fr })}
                    </div>
                  </div>
                </div>

                {item.text && (
                  <Collapsible open={expandedItems.includes(item.id)}>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {item.text}
                    </p>
                    <CollapsibleContent>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.text}
                      </p>
                    </CollapsibleContent>
                    {item.text.length > 80 && (
                      <CollapsibleTrigger asChild>
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="h-auto p-0 text-xs"
                          onClick={(e) => { e.stopPropagation(); toggleExpanded(item.id); }}
                        >
                          {expandedItems.includes(item.id) ? 'Moins' : 'Plus'}
                        </Button>
                      </CollapsibleTrigger>
                    )}
                  </Collapsible>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="flex-shrink-0"
                onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}
              >
                <Star className={cn(
                  'h-4 w-4',
                  favorites.includes(item.id) ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground'
                )} />
              </Button>
            </div>
          </Card>
        ))}

        {filteredHistory.length === 0 && (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">Aucun résultat trouvé</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HistoryTabContent;
