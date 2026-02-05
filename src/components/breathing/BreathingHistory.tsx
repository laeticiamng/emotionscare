/**
 * BreathingHistory - Historique et statistiques des sessions
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Calendar, Star, TrendingUp, Activity } from 'lucide-react';
import { useBreathingHistory } from '@/hooks/useBreathingHistory';
import { getProtocolById } from './BreathingProtocols';

export const BreathingHistory: React.FC = () => {
  const { history, stats, isLoading } = useBreathingHistory();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFeedbackEmoji = (feedback: string | null): string => {
    switch (feedback) {
      case 'better': return '😌';
      case 'same': return '😐';
      case 'worse': return '😔';
      default: return '•';
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Tes statistiques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                icon={Activity}
                value={stats.totalSessions}
                label="Sessions totales"
              />
              <StatCard
                icon={Clock}
                value={`${stats.totalMinutes} min`}
                label="Durée totale"
              />
              <StatCard
                icon={Calendar}
                value={stats.thisWeekSessions}
                label="Cette semaine"
              />
              <StatCard
                icon={Star}
                value={getProtocolById(stats.favoriteProtocol || '')?.icon || '—'}
                label="Protocole favori"
                isEmoji
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Historique récent */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Sessions récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Aucune session enregistrée</p>
                <p className="text-sm">Commence ta première séance de respiration !</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {history.slice(0, 10).map((session, index) => {
                  const protocol = getProtocolById(session.protocol);
                  return (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{protocol?.icon || '🫁'}</span>
                        <div>
                          <p className="font-medium text-sm">
                            {protocol?.name || session.protocol}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(session.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                          {Math.floor(session.duration_seconds / 60)} min
                        </span>
                        <span className="text-lg">
                          {getFeedbackEmoji(session.feedback)}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

interface StatCardProps {
  icon: React.FC<{ className?: string }>;
  value: string | number;
  label: string;
  isEmoji?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, value, label, isEmoji }) => (
  <div className="text-center p-3 bg-muted/50 rounded-lg">
    {isEmoji ? (
      <p className="text-2xl mb-1">{value}</p>
    ) : (
      <>
        <Icon className="h-5 w-5 text-primary mx-auto mb-1" />
        <p className="text-xl font-bold">{value}</p>
      </>
    )}
    <p className="text-xs text-muted-foreground">{label}</p>
  </div>
);

export default BreathingHistory;
