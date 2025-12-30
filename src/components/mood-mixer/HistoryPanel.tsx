import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  History, 
  Clock, 
  TrendingUp, 
  Play,
  Trash2,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface MixHistoryItem {
  id: string;
  name: string;
  createdAt: Date;
  duration: number;
  moodBefore: string;
  moodAfter: string;
  moodDelta: number;
  components: { id: string; name: string; value: number }[];
}

interface HistoryPanelProps {
  history: MixHistoryItem[];
  onReplay: (item: MixHistoryItem) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onReplay,
  onDelete,
  isLoading = false
}) => {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR');
  };

  const getMoodDeltaColor = (delta: number) => {
    if (delta > 15) return 'text-green-500';
    if (delta > 5) return 'text-emerald-400';
    if (delta > 0) return 'text-blue-400';
    if (delta === 0) return 'text-muted-foreground';
    return 'text-orange-400';
  };

  const getMoodDeltaLabel = (delta: number) => {
    if (delta > 15) return 'Excellent';
    if (delta > 5) return 'Très bien';
    if (delta > 0) return 'Positif';
    if (delta === 0) return 'Neutre';
    return 'À améliorer';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historique des sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted/50 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historique des sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Aucune session enregistrée</p>
            <p className="text-sm">Créez votre premier mix pour commencer</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historique des sessions
          </CardTitle>
          <Badge variant="secondary">{history.length} sessions</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {history.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium truncate">{item.name}</span>
                      <Badge 
                        variant="outline" 
                        className={getMoodDeltaColor(item.moodDelta)}
                      >
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {item.moodDelta > 0 ? '+' : ''}{item.moodDelta}%
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.duration} min
                      </span>
                      <span>{formatDate(item.createdAt)}</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {item.components.slice(0, 3).map((comp) => (
                        <Badge key={comp.id} variant="secondary" className="text-xs">
                          {comp.name}: {comp.value}%
                        </Badge>
                      ))}
                      {item.components.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.components.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onReplay(item)}
                      className="h-8 w-8 p-0"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onReplay(item)}>
                          <Play className="h-4 w-4 mr-2" />
                          Rejouer ce mix
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onDelete(item.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default HistoryPanel;
