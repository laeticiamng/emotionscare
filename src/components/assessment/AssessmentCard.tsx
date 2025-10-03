import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClipboardCheck, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AssessmentCardProps {
  id: string;
  instrument: string;
  ts: string;
  summary?: string;
  level?: number;
  className?: string;
}

/**
 * Affiche un résultat d'assessment de manière qualitative
 * Respect RGPD : pas de scores numériques affichés, uniquement résumé textuel
 */
export const AssessmentCard: React.FC<AssessmentCardProps> = ({
  instrument,
  ts,
  summary,
  level,
  className = '',
}) => {
  const date = new Date(ts);
  const formattedDate = format(date, "d MMMM yyyy 'à' HH:mm", { locale: fr });
  
  const getLevelBadge = (lvl?: number) => {
    if (lvl === undefined || lvl === null) {
      return { label: 'Non évalué', color: 'bg-muted text-muted-foreground' };
    }
    
    // Niveaux 0-4 : 0=très bas, 1=bas, 2=moyen, 3=élevé, 4=très élevé
    switch (lvl) {
      case 0:
        return { label: 'Très faible', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
      case 1:
        return { label: 'Faible', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' };
      case 2:
        return { label: 'Modéré', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' };
      case 3:
        return { label: 'Élevé', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' };
      case 4:
        return { label: 'Très élevé', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' };
      default:
        return { label: 'Non défini', color: 'bg-muted text-muted-foreground' };
    }
  };

  const levelBadge = getLevelBadge(level);

  const getInstrumentLabel = (code: string) => {
    const instruments: Record<string, string> = {
      'STAI6': 'Anxiété (STAI-6)',
      'SUDS': 'Détresse subjective (SUDS)',
      'WHO5': 'Bien-être (WHO-5)',
      'PHQ9': 'Dépression (PHQ-9)',
      'GAD7': 'Anxiété généralisée (GAD-7)',
    };
    return instruments[code] || code;
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>{getInstrumentLabel(instrument)}</span>
          </CardTitle>
          <Badge variant="secondary" className={levelBadge.color}>
            {levelBadge.label}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" aria-hidden="true" />
          <time dateTime={ts}>{formattedDate}</time>
        </div>
      </CardHeader>
      
      <CardContent>
        {summary ? (
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-sm text-foreground leading-relaxed">
              {summary}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            Aucun résumé disponible pour cette évaluation
          </p>
        )}
        
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Les résultats sont présentés de manière qualitative pour respecter votre confidentialité
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
