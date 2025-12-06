
import React, { useState, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { logger } from '@/lib/logger';

const MiniMusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(240);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayClick = () => {
    logger.debug('Play button clicked', null, 'UI');
    setIsPlaying(!isPlaying);
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          logger.error('Audio play failed', error as Error, 'UI');
        });
      }
    }
  };

  const handlePreviousClick = () => {
    logger.debug('Previous button clicked', null, 'UI');
  };

  const handleNextClick = () => {
    logger.debug('Next button clicked', null, 'UI');
  };

  const progress = (currentTime / duration) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white shadow-2xl border border-white/10 backdrop-blur-xl"
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-8">
        {/* Album Art & Info */}
        <div className="flex items-center mb-8">
          <motion.div 
            className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl mr-6 flex items-center justify-center shadow-xl border border-white/20"
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.3 }}
          >
            <Volume2 className="h-8 w-8 text-white" />
          </motion.div>
          <div>
            <h4 className="font-bold text-xl mb-2 bg-gradient-to-r from-white to-white/90 bg-clip-text">Focus Profond</h4>
            <p className="text-white/80 text-sm font-medium">Ambiance Zen • Relaxation</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="relative h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-white to-white/80 rounded-full shadow-lg"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
          </div>
          <div className="flex justify-between text-xs mt-3 text-white/70 font-medium">
            <span>{Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}</span>
            <span>{Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center space-x-8">
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePreviousClick}
            className="p-4 rounded-2xl bg-white/15 backdrop-blur-md hover:bg-white/25 transition-all duration-300 shadow-xl border border-white/20"
            aria-label="Piste précédente"
          >
            <SkipBack className="h-6 w-6 text-white" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlayClick}
            className="p-6 rounded-2xl bg-white/20 backdrop-blur-md hover:bg-white/30 shadow-2xl border border-white/30 transition-all duration-300"
            aria-label={isPlaying ? "Pause" : "Lecture"}
          >
            {isPlaying ? (
              <Pause className="h-8 w-8 text-white" />
            ) : (
              <Play className="h-8 w-8 text-white ml-1" />
            )}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNextClick}
            className="p-4 rounded-2xl bg-white/15 backdrop-blur-md hover:bg-white/25 transition-all duration-300 shadow-xl border border-white/20"
            aria-label="Piste suivante"
          >
            <SkipForward className="h-6 w-6 text-white" />
          </motion.button>
        </div>
      </div>

      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        preload="none"
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        }}
      >
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+b12H4" type="audio/wav" />
      </audio>
    </motion.div>
  );
};

export default MiniMusicPlayer;
