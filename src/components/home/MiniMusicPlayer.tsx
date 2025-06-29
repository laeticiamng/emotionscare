
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

const MiniMusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(240); // 4 minutes par défaut
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fonction de test simple pour vérifier que les clics fonctionnent
  const handlePlayClick = () => {
    console.log('🎵 CLICK DÉTECTÉ - Bouton Play cliqué !');
    alert('Bouton Play cliqué !'); // Alerte visible pour tester
    setIsPlaying(!isPlaying);
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        console.log('⏸️ Audio en pause');
      } else {
        audioRef.current.play().catch(error => {
          console.log('❌ Impossible de lire l\'audio:', error);
        });
        console.log('▶️ Audio en lecture');
      }
    }
  };

  const handlePreviousClick = () => {
    console.log('⏮️ CLICK DÉTECTÉ - Bouton Précédent cliqué !');
    alert('Bouton Précédent cliqué !');
  };

  const handleNextClick = () => {
    console.log('⏭️ CLICK DÉTECTÉ - Bouton Suivant cliqué !');
    alert('Bouton Suivant cliqué !');
  };

  return (
    <div className="w-full bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
      <div className="text-center mb-3">
        <h4 className="font-medium">Focus Profond</h4>
        <p className="text-sm opacity-75">Ambiance Zen</p>
      </div>
      
      {/* Barre de progression */}
      <div className="mb-3">
        <div className="w-full bg-white/20 rounded-full h-1">
          <div 
            className="bg-white h-1 rounded-full transition-all duration-300" 
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs mt-1 opacity-75">
          <span>0:00</span>
          <span>4:00</span>
        </div>
      </div>

      {/* Contrôles de lecture - VERSION SIMPLE AVEC ONCLICK DIRECT */}
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={handlePreviousClick}
          className="p-2 hover:bg-white/20 rounded-full transition-colors"
          type="button"
        >
          <SkipBack className="h-5 w-5" />
        </button>
        
        <button
          onClick={handlePlayClick}
          className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          type="button"
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6" />
          )}
        </button>
        
        <button
          onClick={handleNextClick}
          className="p-2 hover:bg-white/20 rounded-full transition-colors"
          type="button"
        >
          <SkipForward className="h-5 w-5" />
        </button>
      </div>

      {/* Audio element caché */}
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
        <source src="/sounds/nature-calm.mp3" type="audio/mpeg" />
        <source src="/sounds/ambient-calm.mp3" type="audio/mpeg" />
        Votre navigateur ne supporte pas l'élément audio.
      </audio>
    </div>
  );
};

export default MiniMusicPlayer;
