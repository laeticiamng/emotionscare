/**
 * Sessions recommandées basées sur l'historique utilisateur
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { GroupSession } from '../types';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RecommendedSessionsProps {
  sessions: GroupSession[];
  onSelectSession: (session: GroupSession) => void;
  onRegister: (sessionId: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  wellbeing: 'bg-pink-500/10 text-pink-500',
  meditation: 'bg-purple-500/10 text-purple-500',
  breathing: 'bg-cyan-500/10 text-cyan-500',
  discussion: 'bg-blue-500/10 text-blue-500',
  creative: 'bg-amber-500/10 text-amber-500',
  movement: 'bg-green-500/10 text-green-500',
  support: 'bg-indigo-500/10 text-indigo-500',
  workshop: 'bg-red-500/10 text-red-500',
};

const CATEGORY_LABELS: Record<string, string> = {
  wellbeing: 'Bien-être',
  meditation: 'Méditation',
  breathing: 'Respiration',
  discussion: 'Discussion',
  creative: 'Créatif',
  movement: 'Mouvement',
  support: 'Soutien',
  workshop: 'Atelier',
};

export const RecommendedSessions: React.FC<RecommendedSessionsProps> = ({
  sessions,
  onSelectSession,
  onRegister,
}) => {
  if (sessions.length === 0) {
    return null;
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Pour vous
          <Badge variant="secondary" className="ml-auto text-xs">
            <Zap className="h-3 w-3 mr-1" />
            Recommandé
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sessions.slice(0, 3).map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative p-3 rounded-lg border bg-background/50 hover:bg-background hover:shadow-md transition-all cursor-pointer"
              onClick={() => onSelectSession(session)}
            >
              <div className="flex items-start gap-3">
                <Badge
                  variant="outline"
                  className={cn('shrink-0', CATEGORY_COLORS[session.category])}
                >
                  {CATEGORY_LABELS[session.category] || session.category}
                </Badge>

                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                    {session.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDistanceToNow(new Date(session.scheduled_at), {
                      addSuffix: true,
                      locale: fr,
                    })}{' '}
                    · {format(new Date(session.scheduled_at), 'HH:mm', { locale: fr })}
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRegister(session.id);
                  }}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              {/* XP Reward */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Badge variant="secondary" className="text-xs gap-1">
                  <Sparkles className="h-3 w-3" />+{session.xp_reward}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendedSessions;
