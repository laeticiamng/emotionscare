/**
 * MeditationHistory - Historique des sessions de méditation
 */

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, Circle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { MeditationSession } from '../types';
import { techniqueLables } from '../types';

interface MeditationHistoryProps {
  sessions: MeditationSession[];
  isLoading?: boolean;
}

export function MeditationHistory({ sessions, isLoading }: MeditationHistoryProps) {
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
    <div className="space-y-3">
      {sessions.map((session) => {
        const durationMin = Math.floor(session.completedDuration / 60);
        const targetMin = Math.floor(session.duration / 60);
        const isComplete = session.completed;
        const hasMoodImprovement = session.moodDelta && session.moodDelta > 0;

        return (
          <Card key={session.id} className={isComplete ? '' : 'opacity-60'}>
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
                      <Badge variant="secondary" className="text-xs">
                        +{session.moodDelta} humeur
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
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
