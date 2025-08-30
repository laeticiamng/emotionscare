/**
 * B2C Thérapie Musicale Premium - Silence sculpté & nappes Suno
 * Pitch : Une pièce sonore qui t'apaise vraiment : peu de sons, beaucoup d'air.
 * Boucle cœur : Choisir Apaiser ou Énergiser → piste générée → "encore 2 min ?" → sauver la vibe.
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Waves, Zap, Play, Pause, Heart, MoreHorizontal, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useMusicGeneration } from '@/hooks/useMusicGeneration';

interface VibeTrack {
  id: string;
  name: string;
  duration: number;
  type: 'apaiser' | 'energiser';
  audioUrl?: string;
}

export default function B2CMusicTherapyPremiumPage() {
  const [selectedVibe, setSelectedVibe] = useState<'apaiser' | 'energiser' | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentTrack, setCurrentTrack] = useState<VibeTrack | null>(null);
  const [showExtend, setShowExtend] = useState(false);
  const [savedVibes, setSavedVibes] = useState<VibeTrack[]>([]);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const { generateMusic, isGenerating } = useMusicGeneration();

  const handleVibeSelection = async (vibe: 'apaiser' | 'energiser') => {
    setSelectedVibe(vibe);
    
    // Générer la musique via Suno
    const prompt = vibe === 'apaiser' 
      ? 'Ambient, slow, minimal, breathing space, calm, healing, soft textures'
      : 'Gentle energy, uplifting, motivating, subtle rhythm, inspiring, warm';
    
    const track = await generateMusic(vibe, prompt, vibe, 0.3);
    
    if (track) {
      const vibeTrack: VibeTrack = {
        id: track.id,
        name: track.title,
        duration: track.duration,
        type: vibe,
        audioUrl: track.audioUrl
      };
      setCurrentTrack(vibeTrack);
      
      // Auto-start playback
      setTimeout(() => {
        handlePlay();
      }, 500);
    }
  };

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleExtend = () => {
    if (audioRef.current) {
      // Simulation d'extension de 2 minutes
      const currentDuration = audioRef.current.duration || 180;
      setCurrentTrack(prev => prev ? { ...prev, duration: currentDuration + 120 } : null);
      setShowExtend(false);
    }
  };

  const handleSaveVibe = () => {
    if (currentTrack) {
      setSavedVibes(prev => [...prev, { ...currentTrack, id: `saved-${Date.now()}` }]);
    }
  };

  // Gestionnaire du temps de lecture
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      
      // Proposer l'extension vers la fin
      const timeLeft = audio.duration - audio.currentTime;
      if (timeLeft <= 30 && timeLeft > 25 && !showExtend) {
        setShowExtend(true);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack, showExtend]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background p-4">
      <div className="max-w-md mx-auto pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Thérapie Musicale
          </h1>
          <p className="text-muted-foreground text-sm">
            Silence sculpté, nappes qui respirent
          </p>
          <div className="w-12 h-0.5 bg-gradient-to-r from-primary/50 to-primary mx-auto mt-3" />
        </motion.div>

        {/* Vibe Selection */}
        {!selectedVibe && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card
                className="p-8 cursor-pointer bg-gradient-to-br from-blue-500/10 to-blue-600/20 border-blue-500/30 hover:border-blue-500/50 transition-all duration-300"
                onClick={() => handleVibeSelection('apaiser')}
              >
                <div className="text-center">
                  <Waves className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Apaiser</h3>
                  <p className="text-muted-foreground text-sm">
                    Textures douces, beaucoup d'air, respirations lentes
                  </p>
                </div>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card
                className="p-8 cursor-pointer bg-gradient-to-br from-orange-500/10 to-orange-600/20 border-orange-500/30 hover:border-orange-500/50 transition-all duration-300"
                onClick={() => handleVibeSelection('energiser')}
              >
                <div className="text-center">
                  <Zap className="w-12 h-12 mx-auto mb-4 text-orange-500" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Énergiser</h3>
                  <p className="text-muted-foreground text-sm">
                    Énergie douce, motivation subtile, rythmes chaleureux
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Saved Vibes */}
            {savedVibes.length > 0 && (
              <div className="mt-8">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Tes vibes sauvées</h4>
                <div className="space-y-2">
                  {savedVibes.slice(-3).map((vibe) => (
                    <Card
                      key={vibe.id}
                      className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setCurrentTrack(vibe)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">{vibe.name}</span>
                        <span className="text-xs text-muted-foreground">{Math.floor(vibe.duration / 60)}min</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Generation Loading */}
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <MoreHorizontal className="w-8 h-8 text-primary" />
              </motion.div>
            </div>
            <p className="text-muted-foreground">Sculpture de votre pièce sonore...</p>
          </motion.div>
        )}

        {/* Music Player */}
        <AnimatePresence>
          {currentTrack && !isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Track Info */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {currentTrack.name}
                </h3>
                <p className="text-sm text-muted-foreground capitalize">
                  {currentTrack.type} • {Math.floor(currentTrack.duration / 60)} min
                </p>
              </div>

              {/* Visualizer */}
              <div className="relative h-32 bg-gradient-to-r from-muted/20 via-primary/10 to-muted/20 rounded-lg overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/40"
                  animate={{ 
                    opacity: isPlaying ? [0.3, 0.6, 0.3] : 0.3,
                    scaleX: isPlaying ? [1, 1.05, 1] : 1
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: isPlaying ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: isPlaying ? [1, 1.1, 1] : 1 }}
                    transition={{ duration: 2, repeat: isPlaying ? Infinity : 0 }}
                  >
                    {currentTrack.type === 'apaiser' ? (
                      <Waves className="w-12 h-12 text-primary" />
                    ) : (
                      <Zap className="w-12 h-12 text-primary" />
                    )}
                  </motion.div>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <Progress 
                  value={currentTrack.duration > 0 ? (currentTime / currentTrack.duration) * 100 : 0} 
                  className="h-1"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}</span>
                  <span>{Math.floor(currentTrack.duration / 60)}:{Math.floor(currentTrack.duration % 60).toString().padStart(2, '0')}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={isPlaying ? handlePause : handlePlay}
                  size="lg"
                  className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-1" />
                  )}
                </Button>
              </div>

              {/* Extension Prompt */}
              <AnimatePresence>
                {showExtend && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-primary/10 rounded-lg p-4 text-center"
                  >
                    <p className="text-sm text-foreground mb-3">Encore 2 min ?</p>
                    <div className="space-x-2">
                      <Button size="sm" onClick={handleExtend}>
                        Oui
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setShowExtend(false)}>
                        Non merci
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="flex justify-center space-x-2">
                <Button
                  onClick={handleSaveVibe}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Sauver la vibe</span>
                </Button>
                
                <Button
                  onClick={() => {
                    setSelectedVibe(null);
                    setCurrentTrack(null);
                    setIsPlaying(false);
                    setCurrentTime(0);
                  }}
                  variant="outline"
                  size="sm"
                >
                  Nouvelle vibe
                </Button>
              </div>

              {/* Hidden Audio Element */}
              {currentTrack?.audioUrl && (
                <audio
                  ref={audioRef}
                  src={currentTrack.audioUrl}
                  onLoadedData={() => console.log('Audio loaded')}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}