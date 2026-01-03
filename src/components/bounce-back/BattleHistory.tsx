/**
 * BattleHistory - Historique des batailles récentes
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, Trophy, Target, ChevronRight, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface BattleRecord {
  id: string;
  mode: 'quick' | 'standard' | 'zen' | 'challenge';
  status: 'completed' | 'abandoned' | 'active';
  duration_seconds: number | null;
  started_at: string;
  ended_at: string | null;
}

interface BattleHistoryProps {
  battles: BattleRecord[];
  isLoading?: boolean;
}

const MODE_CONFIG = {
  quick: { label: 'Rapide', color: 'bg-success/20 text-success' },
  standard: { label: 'Standard', color: 'bg-info/20 text-info' },
  zen: { label: 'Zen', color: 'bg-primary/20 text-primary' },
  challenge: { label: 'Challenge', color: 'bg-destructive/20 text-destructive' },
};

const STATUS_CONFIG = {
  completed: { label: 'Terminée', color: 'bg-success/20 text-success' },
  abandoned: { label: 'Abandonnée', color: 'bg-muted text-muted-foreground' },
  active: { label: 'En cours', color: 'bg-warning/20 text-warning' },
};

const formatDuration = (seconds: number | null) => {
  if (!seconds) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const BattleHistory: React.FC<BattleHistoryProps> = ({ battles, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!battles || battles.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Aucune bataille dans l'historique</p>
          <p className="text-sm">Lancez votre première bataille !</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Historique des batailles
        </CardTitle>
        <CardDescription>
          Vos {battles.length} dernières sessions
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="p-4 space-y-3">
            {battles.map((battle, index) => {
              const modeConfig = MODE_CONFIG[battle.mode] || MODE_CONFIG.standard;
              const statusConfig = STATUS_CONFIG[battle.status] || STATUS_CONFIG.completed;

              return (
                <motion.div
                  key={battle.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {battle.status === 'completed' ? (
                        <Trophy className="w-4 h-4 text-primary" />
                      ) : (
                        <Shield className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge className={modeConfig.color} variant="secondary">
                          {modeConfig.label}
                        </Badge>
                        <Badge className={statusConfig.color} variant="secondary">
                          {statusConfig.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(battle.started_at), { 
                          addSuffix: true, 
                          locale: fr 
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="font-mono">{formatDuration(battle.duration_seconds)}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
