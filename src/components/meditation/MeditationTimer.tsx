import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Bell, 
  Settings2, 
  Volume2, 
  Vibrate,
  Save,
  Trash2,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface CustomPreset {
  id: string;
  name: string;
  duration: number;
}

const DEFAULT_DURATIONS = [5, 10, 15, 20, 25, 30, 45, 60];
const STORAGE_KEY = 'meditation-timer-presets';
const SETTINGS_KEY = 'meditation-timer-settings';

const MeditationTimer: React.FC = () => {
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [duration, setDuration] = useState(10);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [customPresets, setCustomPresets] = useState<CustomPreset[]>([]);
  
  // Settings
  const [settings, setSettings] = useState({
    playSound: true,
    soundVolume: 0.5,
    hapticFeedback: true,
    intervalBells: false,
    intervalMinutes: 5,
  });

  // Load saved presets and settings
  useEffect(() => {
    const savedPresets = localStorage.getItem(STORAGE_KEY);
    if (savedPresets) {
      setCustomPresets(JSON.parse(savedPresets));
    }
    
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings
  const saveSettings = useCallback((newSettings: typeof settings) => {
    setSettings(newSettings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
  }, []);

  // Save custom presets
  const savePresets = useCallback((presets: CustomPreset[]) => {
    setCustomPresets(presets);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  }, []);

  // Add custom preset
  const addCustomPreset = () => {
    const newPreset: CustomPreset = {
      id: Date.now().toString(),
      name: `${duration}min`,
      duration,
    };
    savePresets([...customPresets, newPreset]);
    toast({
      title: 'Préréglage sauvegardé',
      description: `${duration} minutes ajouté à vos préréglages`,
    });
  };

  // Remove custom preset
  const removePreset = (id: string) => {
    savePresets(customPresets.filter(p => p.id !== id));
  };

  // Reset timer when duration changes
  useEffect(() => {
    setTimeLeft(duration * 60);
    setIsFinished(false);
  }, [duration]);

  // Play completion sound
  const playCompletionSound = useCallback(() => {
    if (!settings.playSound) return;
    
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio('/audio/meditation-bell.mp3');
      }
      audioRef.current.volume = settings.soundVolume;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    } catch (e) {
      // Fallback: use browser notification sound
    }
  }, [settings.playSound, settings.soundVolume]);

  // Haptic feedback
  const triggerHaptic = useCallback(() => {
    if (!settings.hapticFeedback) return;
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  }, [settings.hapticFeedback]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          // Interval bells
          if (settings.intervalBells && time > 0) {
            const elapsed = duration * 60 - time;
            if (elapsed > 0 && elapsed % (settings.intervalMinutes * 60) === 0) {
              playCompletionSound();
            }
          }

          if (time <= 1) {
            setIsActive(false);
            setIsFinished(true);
            playCompletionSound();
            triggerHaptic();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, duration, settings, playCompletionSound, triggerHaptic]);

  const toggleTimer = () => {
    setIsActive(!isActive);
    setIsFinished(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration * 60);
    setIsFinished(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (): number => {
    const totalSeconds = duration * 60;
    const elapsed = totalSeconds - timeLeft;
    return (elapsed / totalSeconds) * 100;
  };

  // Phase color based on progress
  const getPhaseColor = () => {
    const progress = getProgressPercentage();
    if (progress < 33) return 'text-blue-500';
    if (progress < 66) return 'text-emerald-500';
    return 'text-purple-500';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Minuteur de Méditation
                {isFinished && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    <Bell className="h-3 w-3 mr-1" />
                    Terminé !
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                {isActive ? 'Session en cours...' : 'Choisissez votre durée et commencez'}
              </CardDescription>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              aria-label="Paramètres"
            >
              <Settings2 className={cn('h-5 w-5', showSettings && 'text-primary')} />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            {/* Settings panel */}
            <Collapsible open={showSettings} onOpenChange={setShowSettings}>
              <CollapsibleContent>
                <div className="p-4 bg-muted/50 rounded-lg space-y-4 mb-6 animate-fade-in">
                  <h4 className="font-medium text-sm">Paramètres</h4>
                  
                  <div className="space-y-4">
                    {/* Sound toggle */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Volume2 className="h-4 w-4 text-muted-foreground" />
                        <Label>Son de fin</Label>
                      </div>
                      <Switch
                        checked={settings.playSound}
                        onCheckedChange={(checked) => saveSettings({ ...settings, playSound: checked })}
                      />
                    </div>

                    {/* Volume slider */}
                    {settings.playSound && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Volume</span>
                          <span>{Math.round(settings.soundVolume * 100)}%</span>
                        </div>
                        <Slider
                          value={[settings.soundVolume]}
                          max={1}
                          step={0.1}
                          onValueChange={([v]) => saveSettings({ ...settings, soundVolume: v })}
                        />
                      </div>
                    )}

                    {/* Haptic feedback */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Vibrate className="h-4 w-4 text-muted-foreground" />
                        <Label>Vibration</Label>
                      </div>
                      <Switch
                        checked={settings.hapticFeedback}
                        onCheckedChange={(checked) => saveSettings({ ...settings, hapticFeedback: checked })}
                      />
                    </div>

                    {/* Interval bells */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <Label>Cloches intervalles</Label>
                      </div>
                      <Switch
                        checked={settings.intervalBells}
                        onCheckedChange={(checked) => saveSettings({ ...settings, intervalBells: checked })}
                      />
                    </div>

                    {settings.intervalBells && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Toutes les</span>
                          <span>{settings.intervalMinutes} min</span>
                        </div>
                        <Slider
                          value={[settings.intervalMinutes]}
                          min={1}
                          max={15}
                          step={1}
                          onValueChange={([v]) => saveSettings({ ...settings, intervalMinutes: v })}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Duration selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Durée de méditation</label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={addCustomPreset}
                  disabled={isActive}
                  className="text-xs"
                >
                  <Save className="h-3 w-3 mr-1" />
                  Sauvegarder
                </Button>
              </div>
              
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {DEFAULT_DURATIONS.map((minutes) => (
                  <Button
                    key={minutes}
                    variant={duration === minutes ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDuration(minutes)}
                    disabled={isActive}
                    className="text-xs"
                  >
                    {minutes}m
                  </Button>
                ))}
              </div>

              {/* Custom presets */}
              {customPresets.length > 0 && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground mb-2">Mes préréglages</p>
                  <div className="flex flex-wrap gap-2">
                    {customPresets.map((preset) => (
                      <div key={preset.id} className="flex items-center gap-1">
                        <Button
                          variant={duration === preset.duration ? "default" : "outline"}
                          size="sm"
                          onClick={() => setDuration(preset.duration)}
                          disabled={isActive}
                          className="text-xs"
                        >
                          {preset.name}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removePreset(preset.id)}
                          disabled={isActive}
                        >
                          <Trash2 className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom duration slider */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Durée personnalisée</span>
                  <span>{duration} minutes</span>
                </div>
                <Slider
                  value={[duration]}
                  min={1}
                  max={90}
                  step={1}
                  onValueChange={([v]) => setDuration(v)}
                  disabled={isActive}
                />
              </div>
            </div>

            {/* Main timer display */}
            <div className="text-center space-y-6">
              <div className="relative w-64 h-64 mx-auto">
                {/* Progress circle */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="text-muted-foreground/20"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgressPercentage() / 100)}`}
                    className={cn('transition-all duration-1000 ease-linear', getPhaseColor())}
                    strokeLinecap="round"
                  />
                </svg>
                
                {/* Time display */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={cn(
                      'text-5xl font-mono font-bold mb-2 transition-colors',
                      isFinished && 'text-green-500'
                    )}>
                      {formatTime(timeLeft)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {isActive ? 'En cours...' : isFinished ? 'Terminé !' : 'Prêt à commencer'}
                    </div>
                    {isActive && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {Math.round(getProgressPercentage())}% complété
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={toggleTimer}
                  size="lg"
                  className="min-w-[140px]"
                  variant={isActive ? "secondary" : "default"}
                >
                  {isActive ? (
                    <>
                      <Pause className="h-5 w-5 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      {timeLeft === duration * 60 ? 'Commencer' : 'Reprendre'}
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={resetTimer}
                  variant="outline"
                  size="lg"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Reset
                </Button>
              </div>

              {/* Status badges */}
              <div className="flex justify-center gap-2 flex-wrap">
                {isActive && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 animate-pulse">
                    Méditation active
                  </Badge>
                )}
                {!isActive && timeLeft > 0 && timeLeft < duration * 60 && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                    En pause
                  </Badge>
                )}
                {settings.intervalBells && isActive && (
                  <Badge variant="outline" className="text-xs">
                    <Bell className="h-3 w-3 mr-1" />
                    Cloche toutes les {settings.intervalMinutes}min
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MeditationTimer;
