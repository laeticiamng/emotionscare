import React, { useState, useMemo, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { EmotionResult } from '@/types/emotion';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Search, Calendar, TrendingUp, TrendingDown, Filter, 
  Download, Trash2, Star, ChevronDown, ChevronUp,
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

  useEffect(() => {
    setFavorites(historyFavorites);
  }, [historyFavorites]);

  // Helper to get item date
  const getItemDate = (item: EmotionResult): Date => {
    if (item.date) return new Date(item.date);
    if (item.timestamp) return new Date(item.timestamp);
    return new Date();
  };

  // Helper to get item score
  const getItemScore = (item: EmotionResult): number => {
    if (typeof item.score === 'number') return item.score;
    if (typeof item.confidence === 'number') return item.confidence;
    return 0.5;
  };

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
      filtered = filtered.filter(item => getItemDate(item) >= cutoff);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.emotion?.toLowerCase().includes(query) ||
        item.text?.toLowerCase().includes(query)
      );
    }

    if (selectedEmotions.length > 0) {
      filtered = filtered.filter(item => 
        item.emotion && selectedEmotions.includes(item.emotion)
      );
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = getItemDate(b).getTime() - getItemDate(a).getTime();
          break;
        case 'score':
          comparison = getItemScore(b) - getItemScore(a);
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

    const avgScore = filteredHistory.reduce((sum, item) => sum + getItemScore(item), 0) / filteredHistory.length;
    
    const halfIndex = Math.floor(filteredHistory.length / 2);
    const firstHalf = filteredHistory.slice(halfIndex);
    const secondHalf = filteredHistory.slice(0, halfIndex);
    const firstAvg = firstHalf.reduce((s, i) => s + getItemScore(i), 0) / (firstHalf.length || 1);
    const secondAvg = secondHalf.reduce((s, i) => s + getItemScore(i), 0) / (secondHalf.length || 1);
    const trend = secondAvg > firstAvg ? 'up' : secondAvg < firstAvg ? 'down' : 'stable';

    return { avgScore: Math.round(avgScore * 100), trend, total: filteredHistory.length };
  }, [filteredHistory]);

  const toggleFavorite = (id: string) => {
    const updated = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    setFavorites(updated);
    toggleHistoryFavorite(id);
  };

  const toggleSelection = (id: string) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleExport = (format: 'json' | 'csv') => {
    const dataToExport = selectedItems.length > 0 
      ? filteredHistory.filter(item => item.id && selectedItems.includes(item.id))
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
        getItemDate(item).toISOString(),
        item.emotion || '',
        (getItemScore(item) * 100).toFixed(0) + '%',
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

    toast({ title: 'Exporté !', description: `${dataToExport.length} entrées exportées` });
  };

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0 || !onDelete) return;
    if (!confirm(`Supprimer ${selectedItems.length} entrées ?`)) return;
    
    selectedItems.forEach(id => onDelete(id));
    setSelectedItems([]);
    toast({ title: 'Supprimé', description: `${selectedItems.length} entrées supprimées` });
  };

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      happy: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      sad: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      angry: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      neutral: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
      calm: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
    };
    return colors[emotion?.toLowerCase()] || 'bg-muted text-muted-foreground';
  };

  if (emotionHistory.length === 0) {
    return (
      <Card className="p-6 text-center">
        <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <p className="font-medium">Aucun historique d'émotions.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Collapsible open={showStats} onOpenChange={setShowStats}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Historique
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
            <div className="grid grid-cols-3 gap-3 mt-3">
              <Card className="p-3 text-center">
                <div className="text-2xl font-bold text-primary">{stats.avgScore}%</div>
                <div className="text-xs text-muted-foreground">Score moyen</div>
              </Card>
              <Card className="p-3 text-center">
                <div className="flex items-center justify-center">
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
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
        </div>

        <Select value={timeFilter} onValueChange={(v: TimeFilter) => setTimeFilter(v)}>
          <SelectTrigger className="w-32"><Calendar className="h-4 w-4 mr-1" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tout</SelectItem>
            <SelectItem value="today">Aujourd'hui</SelectItem>
            <SelectItem value="week">7 jours</SelectItem>
            <SelectItem value="month">30 jours</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(v: SortBy) => setSortBy(v)}>
          <SelectTrigger className="w-28"><Filter className="h-4 w-4 mr-1" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="score">Score</SelectItem>
            <SelectItem value="emotion">Émotion</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="icon" onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}>
          {sortOrder === 'desc' ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>

        <Select onValueChange={(v: 'json' | 'csv') => handleExport(v)}>
          <SelectTrigger className="w-10"><Download className="h-4 w-4" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="json">JSON</SelectItem>
            <SelectItem value="csv">CSV</SelectItem>
          </SelectContent>
        </Select>

        {selectedItems.length > 0 && onDelete && (
          <Button variant="destructive" size="sm" onClick={handleDeleteSelected}>
            <Trash2 className="h-4 w-4 mr-1" />{selectedItems.length}
          </Button>
        )}
      </div>

      {uniqueEmotions.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {uniqueEmotions.map(emotion => (
            <Badge key={emotion} variant={selectedEmotions.includes(emotion) ? 'default' : 'outline'} className="cursor-pointer"
              onClick={() => setSelectedEmotions(prev => prev.includes(emotion) ? prev.filter(e => e !== emotion) : [...prev, emotion])}>
              {emotion}
            </Badge>
          ))}
        </div>
      )}

      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {filteredHistory.map((item) => {
          const itemId = item.id || `item-${getItemDate(item).getTime()}`;
          return (
            <Card key={itemId} className={cn("p-4 hover:bg-accent/10 cursor-pointer", selectedItems.includes(itemId) && "ring-2 ring-primary")}
              onClick={() => onSelect?.(item)}>
              <div className="flex items-start gap-3">
                <Checkbox checked={selectedItems.includes(itemId)} onCheckedChange={() => toggleSelection(itemId)} onClick={(e) => e.stopPropagation()} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <Badge className={getEmotionColor(item.emotion || '')}>{item.emotion}</Badge>
                    <div className="text-right">
                      <div className="text-sm font-medium">Score: {Math.round(getItemScore(item) * 100)}%</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(getItemDate(item), { addSuffix: true, locale: fr })}
                      </div>
                    </div>
                  </div>
                  {item.text && (
                    <Collapsible open={expandedItems.includes(itemId)}>
                      <p className="text-sm text-muted-foreground line-clamp-1">{item.text}</p>
                      <CollapsibleContent><p className="text-sm text-muted-foreground mt-1">{item.text}</p></CollapsibleContent>
                      {item.text.length > 80 && (
                        <CollapsibleTrigger asChild>
                          <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={(e) => { e.stopPropagation(); toggleExpanded(itemId); }}>
                            {expandedItems.includes(itemId) ? 'Moins' : 'Plus'}
                          </Button>
                        </CollapsibleTrigger>
                      )}
                    </Collapsible>
                  )}
                </div>
                <Button variant="ghost" size="icon" className="flex-shrink-0" onClick={(e) => { e.stopPropagation(); toggleFavorite(itemId); }}>
                  <Star className={cn('h-4 w-4', favorites.includes(itemId) ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground')} />
                </Button>
              </div>
            </Card>
          );
        })}

        {filteredHistory.length === 0 && (
          <Card className="p-6 text-center"><p className="text-muted-foreground">Aucun résultat trouvé</p></Card>
        )}
      </div>
    </div>
  );
};

export default HistoryTabContent;
