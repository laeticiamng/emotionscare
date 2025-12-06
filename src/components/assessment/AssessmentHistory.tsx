import React from 'react';
import { AssessmentCard } from './AssessmentCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Assessment {
  id: string;
  instrument: string;
  ts: string;
  summary?: string;
  level?: number;
}

interface AssessmentHistoryProps {
  assessments: Assessment[];
  maxHeight?: string;
  className?: string;
}

/**
 * Historique des assessments avec filtrage par instrument
 */
export const AssessmentHistory: React.FC<AssessmentHistoryProps> = ({
  assessments,
  maxHeight = '600px',
  className = '',
}) => {
  const sortedAssessments = React.useMemo(() => {
    return [...assessments].sort((a, b) => 
      new Date(b.ts).getTime() - new Date(a.ts).getTime()
    );
  }, [assessments]);

  const instrumentTypes = React.useMemo(() => {
    const types = new Set(sortedAssessments.map(a => a.instrument));
    return ['all', ...Array.from(types)];
  }, [sortedAssessments]);

  const filterByInstrument = (instrument: string) => {
    if (instrument === 'all') return sortedAssessments;
    return sortedAssessments.filter(a => a.instrument === instrument);
  };

  const getInstrumentLabel = (code: string) => {
    const instruments: Record<string, string> = {
      'all': 'Tous',
      'STAI6': 'STAI-6',
      'SUDS': 'SUDS',
      'WHO5': 'WHO-5',
      'PHQ9': 'PHQ-9',
      'GAD7': 'GAD-7',
    };
    return instruments[code] || code;
  };

  if (sortedAssessments.length === 0) {
    return (
      <div className={`flex items-center justify-center p-8 rounded-lg bg-muted/50 ${className}`}>
        <p className="text-sm text-muted-foreground">
          Aucune évaluation pour le moment
        </p>
      </div>
    );
  }

  return (
    <Tabs defaultValue="all" className={className}>
      <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${Math.min(instrumentTypes.length, 6)}, 1fr)` }}>
        {instrumentTypes.slice(0, 6).map((instrument) => {
          const filtered = filterByInstrument(instrument);
          return (
            <TabsTrigger key={instrument} value={instrument}>
              {getInstrumentLabel(instrument)} ({filtered.length})
            </TabsTrigger>
          );
        })}
      </TabsList>

      {instrumentTypes.map((instrument) => {
        const filtered = filterByInstrument(instrument);
        return (
          <TabsContent key={instrument} value={instrument}>
            <ScrollArea style={{ maxHeight }}>
              <div className="space-y-4 pr-4">
                {filtered.length > 0 ? (
                  filtered.map((assessment) => (
                    <AssessmentCard key={assessment.id} {...assessment} />
                  ))
                ) : (
                  <div className="flex items-center justify-center p-8 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">
                      Aucune évaluation {getInstrumentLabel(instrument).toLowerCase()}
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        );
      })}
    </Tabs>
  );
};
