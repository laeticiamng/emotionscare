import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface JournalTextCardProps {
  id: string;
  ts: string;
  preview?: string;
  emoVec?: number[];
  wordCount?: number;
  className?: string;
}

/**
 * Affiche une entrée journal texte avec aperçu et émotions
 * Respect RGPD : aperçu limité, pas de texte intégral exposé
 */
export const JournalTextCard: React.FC<JournalTextCardProps> = ({
  ts,
  preview,
  emoVec,
  wordCount,
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

  const getEmotionColor = (emotion: string | null) => {
    switch (emotion) {
      case 'joie': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'tristesse': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'colère': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'peur': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'surprise': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>Entrée texte</span>
          </CardTitle>
          {dominantEmotion && (
            <Badge 
              variant="secondary" 
              className={`capitalize ${getEmotionColor(dominantEmotion)}`}
            >
              {dominantEmotion}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" aria-hidden="true" />
          <time dateTime={ts}>{formattedDate}</time>
          {wordCount && (
            <>
              <span aria-hidden="true">•</span>
              <span>{wordCount} mots</span>
            </>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {preview ? (
          <p className="text-sm text-foreground leading-relaxed line-clamp-3">
            {preview}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            Aucun aperçu disponible
          </p>
        )}
      </CardContent>
    </Card>
  );
};
