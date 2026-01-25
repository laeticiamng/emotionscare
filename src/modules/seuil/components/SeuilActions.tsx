/**
 * Actions disponibles selon la zone SEUIL
 * Choix doux et non-culpabilisants
 */
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { getZoneFromLevel } from '../constants';
import type { SeuilActionType } from '../types';

interface SeuilActionsProps {
  level: number;
  onSelectAction: (actionType: SeuilActionType) => void;
  isLoading?: boolean;
}

export const SeuilActions: React.FC<SeuilActionsProps> = memo(({
  level,
  onSelectAction,
  isLoading = false,
}) => {
  const zoneConfig = getZoneFromLevel(level);
  const actions = zoneConfig.actions;

  if (actions.length === 0) {
    // Zone basse - pas d'action requise
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-4"
      >
        <p className="text-sm text-muted-foreground italic">
          Aucune action nécessaire pour l'instant.
          <br />
          Tu peux simplement observer.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground text-center mb-4">
        Que veux-tu faire ?
      </p>
      
      <div className={`grid gap-3 ${
        actions.length === 1 ? 'grid-cols-1' :
        actions.length === 2 ? 'grid-cols-2' :
        'grid-cols-1 sm:grid-cols-3'
      }`}>
        {actions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              variant="outline"
              size="lg"
              className={`w-full h-auto py-4 flex flex-col gap-2 hover:scale-[1.02] transition-all ${
                zoneConfig.zone === 'low' ? 'hover:border-emerald-500/50 hover:bg-emerald-500/5' :
                zoneConfig.zone === 'intermediate' ? 'hover:border-amber-500/50 hover:bg-amber-500/5' :
                zoneConfig.zone === 'critical' ? 'hover:border-rose-500/50 hover:bg-rose-500/5' :
                'hover:border-indigo-500/50 hover:bg-indigo-500/5'
              }`}
              onClick={() => onSelectAction(action.id)}
              disabled={isLoading}
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="font-medium">{action.label}</span>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

SeuilActions.displayName = 'SeuilActions';

export default SeuilActions;
