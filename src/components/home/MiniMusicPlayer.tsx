
import React, { useState, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';

const MiniMusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(240);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayClick = () => {
    console.log('🎵 PLAY BUTTON CLICKED');
    setIsPlaying(!isPlaying);
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.log('Audio play failed:', error);
        });
      }
    }
  };

  const handlePreviousClick = () => {
    console.log('⏮️ PREVIOUS CLICKED');
  };

  const handleNextClick = () => {
    console.log('⏭️ NEXT CLICKED');
  };

  const progress = (currentTime / duration) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="premium-music-player w-full p-6 text-white relative"
    >
      {/* Album Art & Info */}
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-xl mr-4 flex items-center justify-center">
          <Volume2 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-lg">Focus Profond</h4>
          <p className="text-white/70 text-sm">Ambiance Zen • Relaxation</p>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="premium-progress-bar">
          <motion.div 
            className="premium-progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="flex justify-between text-xs mt-2 text-white/60">
          <span>{Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}</span>
          <span>{Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}</span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center space-x-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePreviousClick}
          className="premium-control-button p-3 transition-all duration-300"
        >
          <SkipBack className="h-5 w-5 text-white" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePlayClick}
          className="premium-control-button p-4 bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg"
        >
          {isPlaying ? (
            <Pause className="h-6 w-6 text-white" />
          ) : (
            <Play className="h-6 w-6 text-white ml-1" />
          )}
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNextClick}
          className="premium-control-button p-3 transition-all duration-300"
        >
          <SkipForward className="h-5 w-5 text-white" />
        </motion.button>
      </div>

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
