/**
 * Échelle de seuil émotionnel
 * Slider visuel de 0 à 100 représentant le niveau de bascule
 */
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { getZoneFromLevel, SEUIL_ZONES } from '../constants';

interface SeuilScaleProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export const SeuilScale: React.FC<SeuilScaleProps> = memo(({
  value,
  onChange,
  disabled = false,
}) => {
  const currentZone = getZoneFromLevel(value);

  return (
    <div className="space-y-6">
      {/* Scale visualization */}
      <div className="relative h-4 rounded-full overflow-hidden bg-muted">
        {/* Zone colors */}
        <div className="absolute inset-0 flex">
          {SEUIL_ZONES.map((zone, idx) => {
            const width = zone.range[1] - zone.range[0] + (idx === 0 ? 1 : 0);
            return (
              <div
                key={zone.zone}
                className={`h-full transition-opacity ${
                  zone.zone === 'low' ? 'bg-emerald-500/40' :
                  zone.zone === 'intermediate' ? 'bg-amber-500/40' :
                  zone.zone === 'critical' ? 'bg-rose-500/40' :
                  'bg-indigo-500/40'
                }`}
                style={{ width: `${width}%` }}
              />
            );
          })}
        </div>
        
        {/* Current value indicator */}
        <motion.div
          className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-transparent to-foreground/20"
          style={{ width: `${value}%` }}
          animate={{ width: `${value}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>

      {/* Slider */}
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={0}
        max={100}
        step={1}
        disabled={disabled}
        className="relative z-10"
      />

      {/* Zone labels */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span className="text-emerald-500">Léger décalage</span>
        <span className="text-amber-500">Moment clé</span>
        <span className="text-rose-500">Critique</span>
        <span className="text-indigo-500">Clôture</span>
      </div>

      {/* Current zone indicator */}
      <motion.div
        key={currentZone.zone}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-xl bg-gradient-to-br ${currentZone.ambiance.gradient} border`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${
            currentZone.zone === 'low' ? 'bg-emerald-500' :
            currentZone.zone === 'intermediate' ? 'bg-amber-500' :
            currentZone.zone === 'critical' ? 'bg-rose-500' :
            'bg-indigo-500'
          }`} />
          <span className="text-sm font-medium capitalize">
            Zone {currentZone.zone === 'low' ? 'basse' : 
                  currentZone.zone === 'intermediate' ? 'intermédiaire' :
                  currentZone.zone === 'critical' ? 'critique' : 'de clôture'}
          </span>
          <span className="text-sm text-muted-foreground ml-auto">
            {value}%
          </span>
        </div>
      </motion.div>
    </div>
  );
});

SeuilScale.displayName = 'SeuilScale';

export default SeuilScale;
