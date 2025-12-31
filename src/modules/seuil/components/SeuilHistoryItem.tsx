/**
 * Item d'historique SEUIL avec actions (favoris, notes)
 */
import React, { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useSeuilFavorites } from '../hooks/useSeuilFavorites';
import type { SeuilEvent, SeuilZone } from '../types';

const ZONE_COLORS: Record<SeuilZone, string> = {
  low: 'bg-emerald-500/20 text-emerald-600',
  intermediate: 'bg-amber-500/20 text-amber-600',
  critical: 'bg-rose-500/20 text-rose-600',
  closure: 'bg-indigo-500/20 text-indigo-600',
};

const ZONE_LABELS: Record<SeuilZone, string> = {
  low: 'Basse',
  intermediate: 'Intermédiaire',
  critical: 'Critique',
  closure: 'Clôture',
};

interface SeuilHistoryItemProps {
  event: SeuilEvent;
  showDetails?: boolean;
}

export const SeuilHistoryItem: React.FC<SeuilHistoryItemProps> = memo(({ 
  event,
  showDetails = false 
}) => {
  const [expanded, setExpanded] = useState(showDetails);
  const { isFavorite, toggleFavorite } = useSeuilFavorites();
  const favorite = isFavorite(event.id);

  return (
    <motion.div
      layout
      className="border rounded-lg p-3 bg-card hover:bg-muted/30 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${
            event.zone === 'low' ? 'bg-emerald-500' :
            event.zone === 'intermediate' ? 'bg-amber-500' :
            event.zone === 'critical' ? 'bg-rose-500' : 'bg-indigo-500'
          }`} />
          
          <Badge className={ZONE_COLORS[event.zone]} variant="secondary">
            {ZONE_LABELS[event.zone]}
          </Badge>
          
          <span className="text-sm text-muted-foreground">
            {event.thresholdLevel}%
          </span>
          
          {event.sessionCompleted && (
            <span className="text-xs text-emerald-500">✓</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {format(new Date(event.createdAt), 'd MMM HH:mm', { locale: fr })}
          </span>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => toggleFavorite(event.id)}
          >
            <Heart className={`w-4 h-4 ${favorite ? 'fill-rose-500 text-rose-500' : 'text-muted-foreground'}`} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t space-y-3"
          >
            {event.actionType && (
              <div className="text-sm">
                <span className="text-muted-foreground">Action: </span>
                <span>{event.actionType}</span>
              </div>
            )}
            
            {event.notes && (
              <div className="text-sm">
                <span className="text-muted-foreground">Notes: </span>
                <span className="italic">{event.notes}</span>
              </div>
            )}

            {!event.notes && (
              <p className="text-xs text-muted-foreground italic">
                Aucune note pour cette session
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

SeuilHistoryItem.displayName = 'SeuilHistoryItem';

export default SeuilHistoryItem;
