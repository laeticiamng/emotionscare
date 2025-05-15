
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff } from 'lucide-react';
import { LiveVoiceScannerProps, EmotionResult } from '@/types';

const LiveVoiceScanner: React.FC<LiveVoiceScannerProps> = ({
  onEmotionDetected,
  onTranscriptUpdate,
  onStart,
  onStop,
  autoStart = false,
  maxDuration = 60,
  className = '',
  visualizationMode = 'bars',
}) => {
  const [isActive, setIsActive] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);

  // Simuler un processus d'analyse vocale en direct
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    let emotionUpdateTimer: ReturnType<typeof setInterval>;

    if (isActive) {
      // Timer pour le temps écoulé
      timer = setInterval(() => {
        setElapsedTime(prev => {
          if (prev >= maxDuration) {
            stopScanning();
            return maxDuration;
          }
          return prev + 1;
        });
      }, 1000);

      // Simuler des mises à jour de transcription
      let phrases = [
        "Je me sens vraiment bien aujourd'hui.",
        "Le projet avance comme prévu.",
        "J'ai eu une conversation productive avec l'équipe.",
        "Je suis optimiste pour les résultats à venir.",
      ];
      
      let currentIndex = 0;
      let currentPhrase = '';
      
      const transcriptTimer = setInterval(() => {
        if (currentIndex < phrases.length) {
          const phrase = phrases[currentIndex];
          currentPhrase = phrase.substring(0, currentPhrase.length + 1);
          
          if (currentPhrase.length === phrase.length) {
            currentIndex++;
            setTimeout(() => {
              currentPhrase = '';
            }, 1000);
          }
          
          const fullTranscript = [...phrases.slice(0, currentIndex), currentPhrase].join(' ');
          setTranscript(fullTranscript);
          
          if (onTranscriptUpdate) {
            onTranscriptUpdate(fullTranscript);
          }
        }
      }, 100);

      // Simuler des détections d'émotions périodiques
      emotionUpdateTimer = setInterval(() => {
        if (onEmotionDetected) {
          const mockResult: EmotionResult = {
            emotion: ['joy', 'calm', 'focus', 'satisfaction'][Math.floor(Math.random() * 4)],
            confidence: 0.7 + Math.random() * 0.3,
            intensity: 0.4 + Math.random() * 0.6,
            transcript: transcript,
          };
          
          onEmotionDetected(mockResult);
        }
      }, 3000);

      return () => {
        clearInterval(timer);
        clearInterval(transcriptTimer);
        clearInterval(emotionUpdateTimer);
      };
    }
  }, [isActive, maxDuration, transcript, onEmotionDetected, onTranscriptUpdate]);

  // Démarrer automatiquement si configuré
  useEffect(() => {
    if (autoStart) {
      startScanning();
    }
    
    return () => {
      stopScanning();
    };
  }, [autoStart]);

  const startScanning = () => {
    setIsActive(true);
    setElapsedTime(0);
    setTranscript('');
    
    if (onStart) {
      onStart();
    }
  };

  const stopScanning = () => {
    setIsActive(false);
    
    if (onStop) {
      onStop();
    }
  };

  // Rendu du visualiseur selon le mode choisi
  const renderVisualizer = () => {
    switch (visualizationMode) {
      case 'wave':
        return (
          <div className="flex items-center justify-center h-16 mb-4">
            <svg width="200" height="60" viewBox="0 0 200 60">
              <path 
                d="M0,30 Q25,10 50,30 T100,30 T150,30 T200,30" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                className="animate-pulse text-primary"
              />
            </svg>
          </div>
        );
      case 'circle':
        return (
          <div className="flex justify-center mb-4">
            <div className={`h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center relative ${isActive ? 'animate-pulse' : ''}`}>
              <div className="absolute inset-0 rounded-full border-4 border-primary/40 animate-ping opacity-75" />
              <Mic className="h-10 w-10 text-primary" />
            </div>
          </div>
        );
      case 'bars':
      default:
        return (
          <div className="flex items-end justify-center gap-1 h-16 mb-4">
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className={`w-2 bg-primary rounded-t-full ${isActive ? 'animate-sound' : 'h-1'}`}
                style={{ 
                  height: isActive ? `${10 + Math.random() * 90}%` : '10%',
                  animationDelay: `${i * 0.05}s`,
                  animationDuration: '0.5s'
                }}
              />
            ))}
          </div>
        );
    }
  };

  return (
    <Card className={className}>
      <CardContent className="pt-6">
        {renderVisualizer()}
        
        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground">
            {isActive ? 'Analyse vocale en cours...' : 'Prêt pour analyse vocale en direct'}
          </p>
          {isActive && (
            <p className="text-xs text-muted-foreground mt-1">
              {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')} / {Math.floor(maxDuration / 60)}:{(maxDuration % 60).toString().padStart(2, '0')}
            </p>
          )}
        </div>

        {transcript && (
          <div className="mb-4 p-3 bg-muted/50 rounded-md max-h-24 overflow-y-auto">
            <p className="text-sm">{transcript}</p>
          </div>
        )}

        <div className="flex justify-center">
          <Button
            variant={isActive ? "destructive" : "default"}
            onClick={isActive ? stopScanning : startScanning}
            className="gap-2"
          >
            {isActive ? (
              <>
                <MicOff className="h-4 w-4" />
                <span>Arrêter l'analyse</span>
              </>
            ) : (
              <>
                <Mic className="h-4 w-4" />
                <span>Démarrer l'analyse</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveVoiceScanner;
