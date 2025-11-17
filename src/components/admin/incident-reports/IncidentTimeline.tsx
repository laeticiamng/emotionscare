import React from 'react';
import { Clock } from 'lucide-react';
import { format as formatDate } from 'date-fns';
import { fr } from 'date-fns/locale';
import { TimelineEvent } from './types';

interface IncidentTimelineProps {
  timeline?: TimelineEvent[];
}

export const IncidentTimeline: React.FC<IncidentTimelineProps> = ({ timeline }) => {
  if (!timeline || timeline.length === 0) {
    return null;
  }

  return (
    <div>
      <label className="text-sm font-medium">Timeline</label>
      <div className="mt-2 space-y-2">
        {timeline.map((event, idx) => (
          <div key={idx} className="flex gap-3 text-sm">
            <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div className="flex-1">
              <div className="font-medium">{event.event}</div>
              <div className="text-muted-foreground">{event.description}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {formatDate(new Date(event.timestamp), 'PPpp', { locale: fr })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
