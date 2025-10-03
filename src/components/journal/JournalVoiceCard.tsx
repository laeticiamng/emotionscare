import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface JournalVoiceCardProps {
  id: string;
  ts: string;
  summary120?: string;
  durationSec?: number;
  emoVec?: number[];
  crystalMeta?: Record<string, unknown>;
  className?: string;
}

/**
 * Affiche une entrée journal vocale avec résumé et émotions
 * Respect RGPD : pas de texte brut, uniquement résumé et vecteurs émotionnels
 */
export const JournalVoiceCard: React.FC<JournalVoiceCardProps> = ({
  ts,
  summary120,
  durationSec,
  emoVec,
  crystalMeta,
  className = '',
}) => {
  const date = new Date(ts);
  const formattedDate = format(date, "d MMMM yyyy 'à' HH:mm", { locale: fr });
  
  // Extraire l'émotion dominante du vecteur
  const dominantEmotion = React.useMemo(() => {
    if (!emoVec || emoVec.length === 0) return null;
    const emotions = ['joie', 'tristesse', 'colère', 'peur', 'surprise', 'dégoût'];
    const maxIndex = emoVec.indexOf(Math.max(...emoVec));
    return emotions[maxIndex] || null;
  }, [emoVec]);

  const formatDuration = (seconds?: number) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Mic className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>Entrée vocale</span>
          </CardTitle>
          {dominantEmotion && (
            <Badge variant="secondary" className="capitalize">
              {dominantEmotion}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-3 w-3" aria-hidden="true" />
          <time dateTime={ts}>{formattedDate}</time>
          {durationSec && (
            <>
              <span aria-hidden="true">•</span>
              <span>{formatDuration(durationSec)}</span>
            </>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {summary120 ? (
          <p className="text-sm text-foreground leading-relaxed">
            {summary120}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            Aucun résumé disponible
          </p>
        )}
        
        {crystalMeta && Object.keys(crystalMeta).length > 0 && (
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Métadonnées enrichies disponibles
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
