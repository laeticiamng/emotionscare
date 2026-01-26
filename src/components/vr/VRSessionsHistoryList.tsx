import React from 'react';
import { VRNebulaSession } from './VRNebulaSession';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Activity } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface NebulaSession {
  id: string;
  type: 'nebula';
  tsStart: string;
  tsEnd?: string;
  hrvPre?: number;
  hrvPost?: number;
  rmssdDelta?: number;
  respRateAvg?: number;
  coherenceScore?: number;
  durationMin?: number;
}

interface DomeSession {
  id: string;
  type: 'dome';
  sessionId: string;
  tsJoin: string;
  tsLeave?: string;
  hrMean?: number;
  valence?: number;
  synchronyIdx?: number;
  teamPa?: number;
}

interface VRSessionsHistoryListProps {
  nebulaSessions?: NebulaSession[];
  domeSessions?: DomeSession[];
  maxHeight?: string;
  className?: string;
}

/**
 * Liste historique des sessions VR (Nebula + Dome) avec tabs
 */
export const VRSessionsHistoryList: React.FC<VRSessionsHistoryListProps> = ({
  nebulaSessions = [],
  domeSessions = [],
  maxHeight = '600px',
  className = '',
}) => {
  const sortedNebula = React.useMemo(() => {
    return [...nebulaSessions].sort((a, b) => 
      new Date(b.tsStart).getTime() - new Date(a.tsStart).getTime()
    );
  }, [nebulaSessions]);

  const sortedDome = React.useMemo(() => {
    return [...domeSessions].sort((a, b) => 
      new Date(b.tsJoin).getTime() - new Date(a.tsJoin).getTime()
    );
  }, [domeSessions]);

  return (
    <Tabs defaultValue="nebula" className={className}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="nebula" className="flex items-center gap-2">
          <Activity className="h-4 w-4" aria-hidden="true" />
          <span>Nebula ({sortedNebula.length})</span>
        </TabsTrigger>
        <TabsTrigger value="dome" className="flex items-center gap-2">
          <Users className="h-4 w-4" aria-hidden="true" />
          <span>Dome ({sortedDome.length})</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="nebula">
        <ScrollArea style={{ maxHeight }}>
          <div className="space-y-4 pr-4">
            {sortedNebula.length > 0 ? (
              sortedNebula.map((session) => (
                <VRNebulaSession key={session.id} {...session} />
              ))
            ) : (
              <div className="flex items-center justify-center p-8 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  Aucune session Nebula pour le moment
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="dome">
        <ScrollArea style={{ maxHeight }}>
          <div className="space-y-4 pr-4">
            {sortedDome.length > 0 ? (
              sortedDome.map((session) => (
                <DomeSessionCard key={session.id} {...session} />
              ))
            ) : (
              <div className="flex items-center justify-center p-8 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  Aucune session Dome pour le moment
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
};

/**
 * Carte pour session Dome (collective)
 */
const DomeSessionCard: React.FC<DomeSession> = ({
  sessionId,
  tsJoin,
  hrMean,
  valence,
  synchronyIdx,
  teamPa,
}) => {
  const joinDate = new Date(tsJoin);
  const formattedDate = format(joinDate, "d MMMM yyyy 'à' HH:mm", { locale: fr });

  const getSyncLevel = (score?: number) => {
    if (!score) return { label: 'N/A', color: 'bg-muted text-muted-foreground' };
    if (score >= 0.8) return { label: 'Excellente', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
    if (score >= 0.6) return { label: 'Bonne', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' };
    return { label: 'Modérée', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' };
  };

  const syncLevel = getSyncLevel(synchronyIdx);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" aria-hidden="true" />
            <span className="font-medium text-sm">Session {sessionId.slice(0, 8)}</span>
          </div>
          <Badge variant="secondary" className={syncLevel.color}>
            {syncLevel.label}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3">{formattedDate}</p>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-2 rounded-lg bg-muted/50">
            <p className="text-xs font-medium text-muted-foreground mb-1">FC moyenne</p>
            <p className="text-sm font-semibold text-foreground">
              {hrMean ? `${hrMean.toFixed(0)} bpm` : 'N/A'}
            </p>
          </div>
          
          <div className="p-2 rounded-lg bg-muted/50">
            <p className="text-xs font-medium text-muted-foreground mb-1">Valence</p>
            <p className="text-sm font-semibold text-foreground">
              {valence ? valence.toFixed(2) : 'N/A'}
            </p>
          </div>

          {teamPa !== undefined && teamPa !== null && (
            <div className="col-span-2 p-2 rounded-lg bg-primary/10">
              <p className="text-xs font-medium text-muted-foreground mb-1">Affect positif équipe</p>
              <p className="text-sm font-semibold text-foreground">
                {teamPa.toFixed(2)}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
