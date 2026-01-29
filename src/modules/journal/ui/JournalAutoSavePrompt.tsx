/**
 * JournalAutoSavePrompt - Bannière de restauration de brouillon
 * S'affiche si une sauvegarde automatique existe
 * @version 1.0.0
 */

import React from 'react';
import { AlertCircle, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface JournalAutoSavePromptProps {
  savedAt: string;
  onRestore: () => void;
  onDiscard: () => void;
}

const JournalAutoSavePrompt: React.FC<JournalAutoSavePromptProps> = ({
  savedAt,
  onRestore,
  onDiscard,
}) => {
  const timeAgo = formatDistanceToNow(new Date(savedAt), { 
    addSuffix: true, 
    locale: fr 
  });

  return (
    <Alert className="mb-4 border-amber-500/50 bg-amber-500/10">
      <AlertCircle className="h-4 w-4 text-amber-500" />
      <AlertDescription className="flex items-center justify-between gap-4 flex-wrap">
        <span className="text-sm">
          Un brouillon a été sauvegardé automatiquement {timeAgo}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRestore}
            className="gap-2"
          >
            <RefreshCw className="h-3 w-3" />
            Restaurer
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDiscard}
            className="gap-2 text-muted-foreground hover:text-destructive"
          >
            <X className="h-3 w-3" />
            Ignorer
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default JournalAutoSavePrompt;
