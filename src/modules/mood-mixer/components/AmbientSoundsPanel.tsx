/**
 * Panneau de gestion des sons ambiants
 */
import React, { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Volume2, 
  VolumeX, 
  CloudRain, 
  Wind, 
  Waves, 
  Bird, 
  TreePine,
  Flame,
  Coffee,
  Music,
  type LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AmbientSound {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  category: 'nature' | 'urban' | 'music';
}

interface ActiveSound {
  id: string;
  volume: number;
}

interface AmbientSoundsPanelProps {
  onSoundsChange?: (sounds: ActiveSound[]) => void;
  className?: string;
}

const AMBIENT_SOUNDS: AmbientSound[] = [
  { id: 'rain', name: 'Pluie', icon: CloudRain, color: 'text-blue-500', category: 'nature' },
  { id: 'wind', name: 'Vent', icon: Wind, color: 'text-gray-500', category: 'nature' },
  { id: 'waves', name: 'Vagues', icon: Waves, color: 'text-cyan-500', category: 'nature' },
  { id: 'birds', name: 'Oiseaux', icon: Bird, color: 'text-amber-500', category: 'nature' },
  { id: 'forest', name: 'Forêt', icon: TreePine, color: 'text-green-500', category: 'nature' },
  { id: 'fire', name: 'Feu', icon: Flame, color: 'text-orange-500', category: 'nature' },
  { id: 'cafe', name: 'Café', icon: Coffee, color: 'text-amber-700', category: 'urban' },
  { id: 'lofi', name: 'Lo-Fi', icon: Music, color: 'text-purple-500', category: 'music' },
];

export const AmbientSoundsPanel: React.FC<AmbientSoundsPanelProps> = memo(({
  onSoundsChange,
  className,
}) => {
  const [activeSounds, setActiveSounds] = useState<ActiveSound[]>([]);
  const [masterVolume, setMasterVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);

  const toggleSound = useCallback((soundId: string) => {
    setActiveSounds(prev => {
      const exists = prev.find(s => s.id === soundId);
      const newSounds = exists
        ? prev.filter(s => s.id !== soundId)
        : [...prev, { id: soundId, volume: 50 }];
      
      onSoundsChange?.(newSounds);
      return newSounds;
    });
  }, [onSoundsChange]);

  const updateSoundVolume = useCallback((soundId: string, volume: number) => {
    setActiveSounds(prev => {
      const newSounds = prev.map(s => 
        s.id === soundId ? { ...s, volume } : s
      );
      onSoundsChange?.(newSounds);
      return newSounds;
    });
  }, [onSoundsChange]);

  const handleMasterVolumeChange = useCallback((value: number[]) => {
    setMasterVolume(value[0]);
    if (value[0] === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const isActive = (soundId: string) => activeSounds.some(s => s.id === soundId);

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Sons ambiants
          </CardTitle>
          {activeSounds.length > 0 && (
            <Badge variant="secondary">{activeSounds.length} actif(s)</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Master Volume */}
        <div className="flex items-center gap-3 pb-3 border-b">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggleMute}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          <Slider
            value={[isMuted ? 0 : masterVolume]}
            onValueChange={handleMasterVolumeChange}
            max={100}
            step={1}
            className="flex-1"
            aria-label="Volume principal"
          />
          <span className="text-sm text-muted-foreground w-10 text-right">
            {isMuted ? 0 : masterVolume}%
          </span>
        </div>

        {/* Sound Grid */}
        <div className="grid grid-cols-4 gap-2">
          {AMBIENT_SOUNDS.map((sound) => {
            const active = isActive(sound.id);
            const SoundIcon = sound.icon;
            
            return (
              <motion.button
                key={sound.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleSound(sound.id)}
                className={cn(
                  "flex flex-col items-center gap-1 p-3 rounded-lg transition-all",
                  "border hover:border-primary/50",
                  active 
                    ? "bg-primary/10 border-primary" 
                    : "bg-muted/30 border-transparent"
                )}
              >
                <SoundIcon className={cn("h-5 w-5", active ? sound.color : "text-muted-foreground")} />
                <span className={cn(
                  "text-xs",
                  active ? "text-foreground font-medium" : "text-muted-foreground"
                )}>
                  {sound.name}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Active Sounds Volume Controls */}
        <AnimatePresence>
          {activeSounds.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 pt-3 border-t"
            >
              <p className="text-sm font-medium text-muted-foreground">
                Volumes individuels
              </p>
              {activeSounds.map((activeSound) => {
                const soundInfo = AMBIENT_SOUNDS.find(s => s.id === activeSound.id);
                if (!soundInfo) return null;
                const SoundIcon = soundInfo.icon;
                
                return (
                  <div key={activeSound.id} className="flex items-center gap-3">
                    <SoundIcon className={cn("h-4 w-4", soundInfo.color)} />
                    <span className="text-sm w-16">{soundInfo.name}</span>
                    <Slider
                      value={[activeSound.volume]}
                      onValueChange={(v) => updateSoundVolume(activeSound.id, v[0])}
                      max={100}
                      step={1}
                      className="flex-1"
                      aria-label={`Volume ${soundInfo.name}`}
                    />
                    <span className="text-xs text-muted-foreground w-8 text-right">
                      {activeSound.volume}%
                    </span>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
});

AmbientSoundsPanel.displayName = 'AmbientSoundsPanel';

export default AmbientSoundsPanel;
