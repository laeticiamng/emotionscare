/**
 * GlassMusicPlayer — Premium glass shell wrapping the music player
 * Adds ambient glow, 3D elevation, glass morphism, and cinematic presence
 */

import React, { memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useMusic } from '@/hooks/useMusic';
import PremiumMusicPlayer from './PremiumMusicPlayer';
import '@/styles/premium-3d-player.css';

interface GlassMusicPlayerProps {
  className?: string;
  compact?: boolean;
  showAmbientGlow?: boolean;
}

const GlassMusicPlayer: React.FC<GlassMusicPlayerProps> = ({
  className,
  compact = false,
  showAmbientGlow = true,
}) => {
  const { state } = useMusic();
  const { currentTrack, isPlaying } = state;

  // Extract a color mood from the track for the ambient glow
  const glowGradient = useMemo(() => {
    if (!currentTrack) return 'radial-gradient(ellipse at center, hsl(var(--primary) / 0.2), transparent 70%)';
    // Use emotional palette based on track mood/category
    return 'radial-gradient(ellipse at center, hsl(var(--primary) / 0.25), hsl(var(--accent-warm) / 0.1) 50%, transparent 80%)';
  }, [currentTrack]);

  return (
    <div className={cn('relative', className)}>
      {/* Ambient glow layer */}
      {showAmbientGlow && currentTrack && (
        <motion.div
          className="absolute -inset-8 pointer-events-none z-0"
          style={{ background: glowGradient, filter: 'blur(40px)' }}
          animate={{
            opacity: isPlaying ? 0.5 : 0.2,
            scale: isPlaying ? [1, 1.02, 1] : 1,
          }}
          transition={{
            opacity: { duration: 0.8 },
            scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          }}
          aria-hidden="true"
        />
      )}

      {/* Glass shell */}
      <motion.div
        className="music-player-glass relative z-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Now playing indicator — subtle top glow when active */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              className="absolute -top-px left-1/4 right-1/4 h-[2px] rounded-full z-20"
              style={{
                background: 'linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)',
              }}
              initial={{ opacity: 0, scaleX: 0.5 }}
              animate={{ opacity: 0.7, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0.5 }}
              transition={{ duration: 0.6 }}
            />
          )}
        </AnimatePresence>

        <PremiumMusicPlayer compact={compact} />
      </motion.div>
    </div>
  );
};

export default memo(GlassMusicPlayer);
