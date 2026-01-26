/**
 * Lecteur d'histoire immersif
 * @module story-synth
 */

import { memo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Play, 
  Pause,
  Volume2,
  VolumeX,
  Clock,
  Save,
  Download,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { StoryContent } from '../types';

interface StoryReaderProps {
  story: StoryContent | null;
  title?: string;
  theme?: string;
  onClose: () => void;
  onComplete: (duration: number) => void;
  onSave?: () => void;
  onExport?: () => void;
  ambient?: string;
}

const AMBIENTS: Record<string, string> = {
  doux: '/audio/lofi-120.mp3',
  pluie: '/audio/rain-soft.mp3',
  foret: '/audio/forest.mp3',
  ocean: '/audio/ocean.mp3',
};

const themeGradients: Record<string, string> = {
  calme: 'from-blue-900/95 via-cyan-900/90 to-slate-900/95',
  aventure: 'from-orange-900/95 via-red-900/90 to-slate-900/95',
  poetique: 'from-purple-900/95 via-pink-900/90 to-slate-900/95',
  mysterieux: 'from-slate-900/95 via-gray-800/90 to-slate-900/95',
  romance: 'from-rose-900/95 via-pink-900/90 to-slate-900/95',
  introspection: 'from-indigo-900/95 via-purple-900/90 to-slate-900/95',
  nature: 'from-green-900/95 via-emerald-900/90 to-slate-900/95',
};

export const StoryReader = memo(function StoryReader({
  story,
  title = 'Histoire',
  theme = 'calme',
  onClose,
  onComplete,
  onSave,
  onExport,
  ambient,
}: StoryReaderProps) {
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  const paragraphs = story?.paragraphs || [];
  const progress = paragraphs.length > 0 
    ? ((currentParagraph + 1) / paragraphs.length) * 100 
    : 0;

  // Auto-advance timer
  useEffect(() => {
    if (!isPlaying || currentParagraph >= paragraphs.length - 1) return;

    const timer = setTimeout(() => {
      setCurrentParagraph(prev => Math.min(prev + 1, paragraphs.length - 1));
    }, 8000); // 8 seconds per paragraph

    return () => clearTimeout(timer);
  }, [isPlaying, currentParagraph, paragraphs.length]);

  // Elapsed time tracker
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Auto-hide controls
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 3000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  // Audio handling
  useEffect(() => {
    if (ambient && ambient !== 'aucun' && AMBIENTS[ambient]) {
      audioRef.current = new Audio(AMBIENTS[ambient]);
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
      if (isPlaying && !isMuted) {
        audioRef.current.play().catch(() => {});
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [ambient]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      if (isPlaying && !isMuted) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isMuted, volume]);

  const handleComplete = () => {
    const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
    onComplete(duration);
  };

  const handleNext = () => {
    if (currentParagraph < paragraphs.length - 1) {
      setCurrentParagraph(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    setCurrentParagraph(prev => Math.max(0, prev - 1));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!story) return null;

  const currentContent = paragraphs[currentParagraph];
  const gradientClass = themeGradients[theme] || themeGradients.calme;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        'bg-gradient-to-br',
        gradientClass
      )}
      onClick={() => setIsPlaying(!isPlaying)}
    >
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * -200],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div 
        className="relative max-w-2xl mx-auto px-8 py-12 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-white/90 mb-2"
        >
          {story.title || title}
        </motion.h1>

        {/* Progress indicator */}
        <div className="text-sm text-white/60 mb-8">
          {currentParagraph + 1} / {paragraphs.length}
        </div>

        {/* Paragraph */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentParagraph}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="min-h-[200px] flex items-center justify-center"
          >
            <p 
              className={cn(
                'text-xl leading-relaxed text-white/90',
                currentContent?.emphasis === 'soft' && 'text-white/70 italic',
                currentContent?.emphasis === 'strong' && 'text-white font-semibold text-2xl'
              )}
            >
              {currentContent?.text || ''}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-6 mt-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrev}
            disabled={currentParagraph === 0}
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            <ChevronLeft className="w-8 h-8" />
          </Button>

          <Button
            variant="ghost"
            size="lg"
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-white hover:bg-white/10 px-8"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            <ChevronRight className="w-8 h-8" />
          </Button>
        </div>
      </div>

      {/* Controls overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-x-0 bottom-0 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Progress bar */}
            <Progress value={progress} className="h-1 mb-4 bg-white/20" />

            <div className="flex items-center justify-between">
              {/* Time */}
              <div className="flex items-center gap-2 text-white/60">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{formatTime(elapsedSeconds)}</span>
              </div>

              {/* Center actions */}
              <div className="flex items-center gap-4">
                {onSave && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onSave}
                    className="text-white/80 hover:text-white gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Sauvegarder
                  </Button>
                )}
                {onExport && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onExport}
                    className="text-white/80 hover:text-white gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Exporter
                  </Button>
                )}
              </div>

              {/* Volume & Close */}
              <div className="flex items-center gap-4">
                {ambient && ambient !== 'aucun' && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-white/80 hover:text-white"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </Button>
                    <Slider
                      value={[volume * 100]}
                      min={0}
                      max={100}
                      onValueChange={([v]) => setVolume(v / 100)}
                      className="w-20"
                    />
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-white/80 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close button (always visible) */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10"
      >
        <X className="w-6 h-6" />
      </Button>
    </motion.div>
  );
});

export default StoryReader;
