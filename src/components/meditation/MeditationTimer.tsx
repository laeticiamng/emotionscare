
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Timer, Play, Pause, RotateCcw, Bell, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';

const MeditationTimer: React.FC = () => {
  const [duration, setDuration] = useState(10); // en minutes
  const [timeLeft, setTimeLeft] = useState(duration * 60); // en secondes
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [bellSettings, setBellSettings] = useState({
    enabled: true,
    interval: 5, // minutes
    volume: 50
  });
  const [backgroundSound, setBackgroundSound] = useState('none');
  const [backgroundVolume, setBackgroundVolume] = useState(30);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);

  const backgroundSounds = [
    { id: 'none', name: 'Silence' },
    { id: 'rain', name: 'Pluie douce' },
    { id: 'ocean', name: 'Vagues océan' },
    { id: 'forest', name: 'Forêt' },
    { id: 'meditation', name: 'Bol tibétain' }
  ];

  // Effect pour le timer
  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(timeLeft => {
          if (timeLeft <= 1) {
            setIsActive(false);
            playBell();
            return 0;
          }
          
          // Bell d'intervalle
          if (bellSettings.enabled && bellSettings.interval > 0) {
            const totalSeconds = duration * 60;
            const elapsedMinutes = Math.floor((totalSeconds - timeLeft + 1) / 60);
            if (elapsedMinutes > 0 && elapsedMinutes % bellSettings.interval === 0 && 
                (totalSeconds - timeLeft + 1) % 60 === 0) {
              playBell();
            }
          }
          
          return timeLeft - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, timeLeft, bellSettings, duration]);

  // Effect pour le son de fond
  useEffect(() => {
    if (backgroundSound !== 'none' && isActive) {
      if (!backgroundAudioRef.current) {
        backgroundAudioRef.current = new Audio(`/sounds/${backgroundSound}.mp3`);
        backgroundAudioRef.current.loop = true;
      }
      backgroundAudioRef.current.volume = backgroundVolume / 100;
      backgroundAudioRef.current.play().catch(console.error);
    } else if (backgroundAudioRef.current) {
      backgroundAudioRef.current.pause();
    }

    return () => {
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
      }
    };
  }, [backgroundSound, isActive, backgroundVolume]);

  const playBell = () => {
    const bellAudio = new Audio('/sounds/bell.mp3');
    bellAudio.volume = bellSettings.volume / 100;
    bellAudio.play().catch(console.error);
  };

  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resumeTimer = () => {
    setIsPaused(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(duration * 60);
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.pause();
    }
  };

  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration);
    if (!isActive) {
      setTimeLeft(newDuration * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Configuration du timer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Durée */}
          <div className="space-y-3">
            <Label>Durée de méditation</Label>
            <div className="space-y-2">
              <Slider
                value={[duration]}
                onValueChange={(values) => handleDurationChange(values[0])}
                min={1}
                max={60}
                step={1}
                disabled={isActive}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>1 min</span>
                <span className="font-medium">{duration} minutes</span>
                <span>60 min</span>
              </div>
            </div>
          </div>

          {/* Son de fond */}
          <div className="space-y-3">
            <Label>Son de fond</Label>
            <Select value={backgroundSound} onValueChange={setBackgroundSound}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {backgroundSounds.map(sound => (
                  <SelectItem key={sound.id} value={sound.id}>
                    {sound.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {backgroundSound !== 'none' && (
              <div className="space-y-2">
                <Label className="text-sm">Volume du son de fond</Label>
                <Slider
                  value={[backgroundVolume]}
                  onValueChange={(values) => setBackgroundVolume(values[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <span className="text-xs text-muted-foreground">{backgroundVolume}%</span>
              </div>
            )}
          </div>

          {/* Paramètres de la cloche */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Switch
                id="bell-enabled"
                checked={bellSettings.enabled}
                onCheckedChange={(enabled) => setBellSettings(prev => ({ ...prev, enabled }))}
              />
              <Label htmlFor="bell-enabled" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Cloche d'intervalle
              </Label>
            </div>
            
            {bellSettings.enabled && (
              <div className="space-y-3 pl-6">
                <div className="space-y-2">
                  <Label className="text-sm">Intervalle (minutes)</Label>
                  <Select
                    value={bellSettings.interval.toString()}
                    onValueChange={(value) => setBellSettings(prev => ({ ...prev, interval: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Désactivé</SelectItem>
                      <SelectItem value="1">1 minute</SelectItem>
                      <SelectItem value="2">2 minutes</SelectItem>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="10">10 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm">Volume de la cloche</Label>
                  <Slider
                    value={[bellSettings.volume]}
                    onValueChange={(values) => setBellSettings(prev => ({ ...prev, volume: values[0] }))}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <span className="text-xs text-muted-foreground">{bellSettings.volume}%</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Timer visuel */}
      <Card>
        <CardHeader>
          <CardTitle>Timer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Cercle de progression */}
          <div className="relative flex items-center justify-center">
            <svg className="w-64 h-64 transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-muted-foreground/20"
              />
              <motion.circle
                cx="128"
                cy="128"
                r="120"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="text-primary transition-all duration-1000"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <div className="text-4xl font-bold">{formatTime(timeLeft)}</div>
              <div className="text-sm text-muted-foreground">
                {isActive ? (isPaused ? 'En pause' : 'En cours') : 'Prêt'}
              </div>
            </div>
          </div>

          {/* Contrôles */}
          <div className="flex justify-center gap-3">
            {!isActive ? (
              <Button onClick={startTimer} className="flex items-center gap-2" size="lg">
                <Play className="h-5 w-5" />
                Commencer
              </Button>
            ) : isPaused ? (
              <Button onClick={resumeTimer} className="flex items-center gap-2" size="lg">
                <Play className="h-5 w-5" />
                Reprendre
              </Button>
            ) : (
              <Button onClick={pauseTimer} variant="outline" className="flex items-center gap-2" size="lg">
                <Pause className="h-5 w-5" />
                Pause
              </Button>
            )}
            
            <Button onClick={resetTimer} variant="outline" className="flex items-center gap-2" size="lg">
              <RotateCcw className="h-5 w-5" />
              Reset
            </Button>
          </div>

          {/* Informations sur la session */}
          {isActive && (
            <div className="text-center space-y-2 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium">Session de {duration} minutes</p>
              {backgroundSound !== 'none' && (
                <p className="text-xs text-muted-foreground">
                  Son de fond: {backgroundSounds.find(s => s.id === backgroundSound)?.name}
                </p>
              )}
              {bellSettings.enabled && bellSettings.interval > 0 && (
                <p className="text-xs text-muted-foreground">
                  Cloche toutes les {bellSettings.interval} minutes
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MeditationTimer;
