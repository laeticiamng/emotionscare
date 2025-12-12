import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, Download, Filter, TrendingUp, TrendingDown, Minus,
  Calendar, BarChart3, ArrowUpDown, Eye, Share2, Trash2
} from 'lucide-react';
import { EmotionResult } from '@/types/emotion';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface EmotionHistoryProps {
  history: EmotionResult[];
  onDelete?: (id: string) => void;
}

const emotionColors: Record<string, string> = {
  happy: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  sad: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  angry: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  calm: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  anxious: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  excited: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
};

export const formatDate = (timestamp: string | Date): string => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const EmotionHistory: React.FC<EmotionHistoryProps> = ({ history, onDelete }) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [emotionFilter, setEmotionFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showStats, setShowStats] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Get unique emotions for filter
  const uniqueEmotions = useMemo(() => {
    const emotions = new Set(history.map(item => item.emotion?.toLowerCase() || 'unknown'));
    return Array.from(emotions).sort();
  }, [history]);

  // Filter and sort history
  const filteredHistory = useMemo(() => {
    let filtered = [...history];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.emotion?.toLowerCase().includes(query) ||
        item.insight?.toLowerCase().includes(query) ||
        item.sentiment?.toLowerCase().includes(query)
      );
    }

    // Emotion filter
    if (emotionFilter !== 'all') {
      filtered = filtered.filter(item => 
        item.emotion?.toLowerCase() === emotionFilter
      );
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [history, searchQuery, emotionFilter, sortOrder]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (history.length === 0) return null;

    const emotionCounts: Record<string, number> = {};
    let totalValence = 0;
    let totalArousal = 0;

    history.forEach(item => {
      const emotion = item.emotion?.toLowerCase() || 'unknown';
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      totalValence += item.valence || 0;
      totalArousal += item.arousal || 0;
    });

    const topEmotion = Object.entries(emotionCounts)
      .sort(([, a], [, b]) => b - a)[0];

    // Calculate weekly trend
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;
    
    const thisWeek = history.filter(item => 
      new Date(item.timestamp).getTime() > oneWeekAgo
    );
    const lastWeek = history.filter(item => {
      const time = new Date(item.timestamp).getTime();
      return time > twoWeeksAgo && time <= oneWeekAgo;
    });

    const thisWeekAvg = thisWeek.length > 0 
      ? thisWeek.reduce((sum, item) => sum + (item.valence || 0), 0) / thisWeek.length 
      : 0;
    const lastWeekAvg = lastWeek.length > 0 
      ? lastWeek.reduce((sum, item) => sum + (item.valence || 0), 0) / lastWeek.length 
      : 0;

    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (thisWeekAvg > lastWeekAvg + 5) trend = 'up';
    else if (thisWeekAvg < lastWeekAvg - 5) trend = 'down';

    return {
      total: history.length,
      topEmotion: topEmotion ? { name: topEmotion[0], count: topEmotion[1] } : null,
      avgValence: Math.round(totalValence / history.length),
      avgArousal: Math.round(totalArousal / history.length),
      emotionCounts,
      trend,
      thisWeekCount: thisWeek.length
    };
  }, [history]);

  const handleExport = (format: 'json' | 'csv') => {
    const dataToExport = selectedItems.size > 0 
      ? filteredHistory.filter(item => item.id && selectedItems.has(item.id))
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
      const headers = ['Date', 'Émotion', 'Valence', 'Arousal', 'Source', 'Insight'];
      const rows = dataToExport.map(item => [
        item.timestamp ? formatDate(item.timestamp) : '',
        item.emotion || '',
        String(item.valence || 0),
        String(item.arousal || 0),
        item.source || '',
        item.insight || ''
      ]);
      
      const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `emotion-history-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }

    toast({ title: 'Export réussi', description: `${dataToExport.length} entrées exportées.` });
  };

  const handleShare = async () => {
    if (!stats) return;
    const text = `📊 Mon historique émotionnel:\n• ${stats.total} scans\n• Émotion principale: ${stats.topEmotion?.name || 'N/A'}\n• Valence moyenne: ${stats.avgValence}%`;
    
    if (navigator.share) {
      await navigator.share({ title: 'Mon historique émotionnel', text });
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Copié !', description: 'Résumé copié dans le presse-papier.' });
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const TrendIcon = stats?.trend === 'up' ? TrendingUp : stats?.trend === 'down' ? TrendingDown : Minus;
  const trendColor = stats?.trend === 'up' ? 'text-green-500' : stats?.trend === 'down' ? 'text-red-500' : 'text-muted-foreground';

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Historique des Émotions
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowStats(!showStats)}
              className="gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Stats
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('csv')} className="gap-2">
              <Download className="h-4 w-4" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats Panel */}
        <AnimatePresence>
          {showStats && stats && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-muted/50 rounded-lg"
            >
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total scans</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary capitalize">{stats.topEmotion?.name || 'N/A'}</p>
                <p className="text-xs text-muted-foreground">Émotion principale</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{stats.avgValence}%</p>
                <p className="text-xs text-muted-foreground">Valence moyenne</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <TrendIcon className={`h-5 w-5 ${trendColor}`} />
                  <span className={`text-sm font-medium ${trendColor}`}>
                    {stats.trend === 'up' ? 'Hausse' : stats.trend === 'down' ? 'Baisse' : 'Stable'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{stats.thisWeekCount} cette semaine</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={emotionFilter} onValueChange={setEmotionFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filtrer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les émotions</SelectItem>
              {uniqueEmotions.map(emotion => (
                <SelectItem key={emotion} value={emotion} className="capitalize">
                  {emotion}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            title={sortOrder === 'desc' ? 'Plus récent en premier' : 'Plus ancien en premier'}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{filteredHistory.length} résultat{filteredHistory.length > 1 ? 's' : ''}</span>
          {selectedItems.size > 0 && (
            <span>{selectedItems.size} sélectionné{selectedItems.size > 1 ? 's' : ''}</span>
          )}
        </div>

        {/* History List */}
        {filteredHistory.length > 0 ? (
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {filteredHistory.map((item, index) => (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className={`
                  p-4 rounded-lg border transition-all cursor-pointer
                  ${selectedItems.has(item.id || '') 
                    ? 'bg-primary/10 border-primary/50' 
                    : 'bg-card hover:bg-muted/50 border-border'}
                `}
                onClick={() => item.id && toggleSelect(item.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={emotionColors[item.emotion?.toLowerCase() || 'neutral'] || emotionColors.neutral}>
                        {item.emotion || 'Inconnu'}
                      </Badge>
                      {item.source && (
                        <Badge variant="outline" className="text-xs">
                          {item.source}
                        </Badge>
                      )}
                      {item.confidence && (
                        <span className="text-xs text-muted-foreground">
                          {Math.round(item.confidence)}% confiance
                        </span>
                      )}
                    </div>
                    
                    {item.insight && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {item.insight}
                      </p>
                    )}

                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Valence: {item.valence || 0}%</span>
                      <span>Arousal: {item.arousal || 0}%</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {item.timestamp ? formatDate(item.timestamp) : 'Date inconnue'}
                    </span>
                    {onDelete && item.id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(item.id!);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Eye className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">Aucun historique d'émotion</p>
            <p className="text-sm">
              {searchQuery || emotionFilter !== 'all' 
                ? 'Essayez de modifier vos filtres' 
                : 'Vos scans émotionnels apparaîtront ici'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionHistory;
