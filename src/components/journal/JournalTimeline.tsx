import React from 'react';
import { JournalVoiceCard } from './JournalVoiceCard';
import { JournalTextCard } from './JournalTextCard';
import { ScrollArea } from '@/components/ui/scroll-area';

interface JournalEntry {
  id: string;
  type: 'voice' | 'text';
  ts: string;
  // Voice specific
  summary120?: string;
  durationSec?: number;
  // Text specific
  preview?: string;
  wordCount?: number;
  // Common
  emoVec?: number[];
  crystalMeta?: Record<string, unknown>;
}

interface JournalTimelineProps {
  entries: JournalEntry[];
  maxHeight?: string;
  className?: string;
}

/**
 * Timeline chronologique des entrées journal (voix + texte)
 * Tri par date décroissante (plus récent en premier)
 */
export const JournalTimeline: React.FC<JournalTimelineProps> = ({
  entries,
  maxHeight = '600px',
  className = '',
}) => {
  const sortedEntries = React.useMemo(() => {
    return [...entries].sort((a, b) => 
      new Date(b.ts).getTime() - new Date(a.ts).getTime()
    );
  }, [entries]);

  if (sortedEntries.length === 0) {
    return (
      <div className={`flex items-center justify-center p-8 rounded-lg bg-muted/50 ${className}`}>
        <p className="text-sm text-muted-foreground">
          Aucune entrée journal pour le moment
        </p>
      </div>
    );
  }

  return (
    <ScrollArea style={{ maxHeight }} className={className}>
      <div className="space-y-4 pr-4">
        {sortedEntries.map((entry) => (
          <div key={entry.id}>
            {entry.type === 'voice' ? (
              <JournalVoiceCard
                id={entry.id}
                ts={entry.ts}
                summary120={entry.summary120}
                durationSec={entry.durationSec}
                emoVec={entry.emoVec}
                crystalMeta={entry.crystalMeta}
              />
            ) : (
              <JournalTextCard
                id={entry.id}
                ts={entry.ts}
                preview={entry.preview}
                emoVec={entry.emoVec}
                wordCount={entry.wordCount}
              />
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
