/**
 * AuraSphere - Une sphère d'aura flottante dans le ciel
 * Composant visuel représentant un utilisateur sans chiffre
 */
import { memo } from 'react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import type { AuraEntry } from '../hooks/useAurasLeaderboard';

interface AuraSphereProps {
  aura: AuraEntry;
  index: number;
}

export const AuraSphere = memo(function AuraSphere({ aura, index }: AuraSphereProps) {
  const baseSize = 48 * aura.sizeScale;
  const hue = aura.colorHue;
  const lightness = Math.round(aura.luminosity * 100);

  // Position pseudo-aléatoire basée sur l'index
  const row = Math.floor(index / 6);
  const col = index % 6;
  const offsetX = (col * 16) + (Math.sin(index * 0.7) * 4);
  const offsetY = (row * 14) + (Math.cos(index * 0.5) * 3);

  const bgColor = `hsl(${hue}, 70%, ${lightness}%)`;
  const glowColor = `hsla(${hue}, 80%, ${Math.min(lightness + 15, 90)}%, 0.6)`;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: index * 0.05, 
              type: 'spring', 
              stiffness: 200 
            }}
            whileHover={{ scale: 1.15, zIndex: 10 }}
            className="absolute cursor-pointer"
            style={{
              left: `${offsetX}%`,
              top: `${offsetY}%`,
              width: baseSize,
              height: baseSize,
            }}
            role="img"
            aria-label={`Aura de ${aura.displayName}${aura.who5Badge ? ` - ${aura.who5Badge}` : ''}`}
          >
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full blur-md"
              style={{ backgroundColor: glowColor }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            {/* Core sphere */}
            <div
              className={`relative w-full h-full rounded-full shadow-lg ${
                aura.isMe ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
              }`}
              style={{ backgroundColor: bgColor }}
            />
            {/* Inner glow */}
            <div
              className="absolute inset-2 rounded-full opacity-60"
              style={{
                background: `radial-gradient(circle at 30% 30%, white 0%, transparent 60%)`,
              }}
            />
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-card border-border">
          <div className="text-center space-y-1">
            <p className="font-medium text-foreground">
              {aura.displayName}
              {aura.isMe && <span className="ml-1 text-primary">(Vous)</span>}
            </p>
            {aura.who5Badge && (
              <p className="text-xs text-muted-foreground">{aura.who5Badge}</p>
            )}
            {aura.streakDays && aura.streakDays > 0 && (
              <p className="text-xs text-warning">🔥 {aura.streakDays} jours</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});
