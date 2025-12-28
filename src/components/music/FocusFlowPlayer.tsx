/**
 * Focus Flow Player - Interface de session de concentration
 * avec timer Pomodoro et progression visualisée
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useFocusFlow, type FocusMode } from '@/hooks/useFocusFlow';
import { useMusic } from '@/hooks/useMusic';
import { 
  Play, 
  Pause, 
  Square, 
  Brain, 
  BookOpen, 
  Sparkles,
  Timer,
  Coffee,
  TrendingUp
} from 'lucide-react';

const MODE_ICONS = {
  work: Brain,
  study: BookOpen,
  meditation: Sparkles
};

const PHASE_COLORS = {
  warmup: 'bg-blue-500',
  peak: 'bg-green-500',
  sustain: 'bg-yellow-500',
  cooldown: 'bg-purple-500'
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const FocusFlowPlayer: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<FocusMode>('work');
  const [duration, setDuration] = useState(120);
  
  // Connect to global music context
  const musicContext = useMusic();
  
  const {
    currentSession,
    tracks,
    currentTrack,
    currentTrackIndex,
    isGenerating,
    isPlaying,
    isPaused,
    isBreak,
    timeRemaining,
    pomodoroTimeRemaining,
    startFocusSession,
    play,
    pause,
    resume,
    stop,
    resumeFromBreak,
    FOCUS_MODE_CONFIG
  } = useFocusFlow();

  // Sync with global music context when playing focus tracks
  useEffect(() => {
    if (currentTrack && isPlaying && !isPaused) {
      // Sync playback state with global context
      const trackUrl = (currentTrack as any).suno_audio_url || (currentTrack as any).audio_url || '';
      if (trackUrl) {
        musicContext.play({
          id: currentTrack.id,
          title: `Focus Track #${currentTrackIndex + 1}`,
          artist: 'Focus Flow',
          duration: 180,
          url: trackUrl,
          audioUrl: trackUrl,
          emotion: 'focused',
          mood: `${currentTrack.phase} - ${currentTrack.target_tempo} BPM`
        });
      }
    }
  }, [currentTrack?.id, isPlaying, isPaused]);

  const handleStart = () => {
    startFocusSession(selectedMode, duration);
  };

  const progressPercent = currentSession 
    ? ((currentSession.duration_minutes * 60 - timeRemaining) / (currentSession.duration_minutes * 60)) * 100
    : 0;

  const pomodoroPercent = currentSession
    ? ((currentSession.pomodoro_duration * 60 - pomodoroTimeRemaining) / (currentSession.pomodoro_duration * 60)) * 100
    : 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Focus Flow
        </CardTitle>
        <CardDescription>
          Sessions de concentration avec progression tempo optimisée
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!currentSession ? (
          // Configuration initiale
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {(Object.keys(FOCUS_MODE_CONFIG) as FocusMode[]).map(mode => {
                const Icon = MODE_ICONS[mode];
                const config = FOCUS_MODE_CONFIG[mode];
                
                return (
                  <button
                    key={mode}
                    onClick={() => setSelectedMode(mode)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedMode === mode
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Icon className="w-8 h-8 mx-auto mb-2" />
                    <h3 className="font-semibold capitalize">{mode}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {config.description}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Durée (minutes)</label>
              <div className="flex gap-2">
                {[60, 90, 120, 150].map(mins => (
                  <Button
                    key={mins}
                    variant={duration === mins ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDuration(mins)}
                  >
                    {mins}min
                  </Button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleStart}
              disabled={isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? 'Génération en cours...' : 'Démarrer Focus Flow'}
            </Button>
          </div>
        ) : (
          // Session active
          <div className="space-y-6">
            {/* Infos session */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {currentSession.mode}
                </Badge>
                <Badge variant="secondary">
                  {currentTrack?.phase}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Track {currentTrackIndex + 1}/{tracks.length}
              </div>
            </div>

            {/* Timer principal */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Temps restant</span>
                <span className="text-2xl font-bold tabular-nums">
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <Progress value={progressPercent} className="h-3" />
            </div>

            {/* Timer Pomodoro */}
            <div className="p-4 rounded-lg bg-muted/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isBreak ? (
                    <Coffee className="w-4 h-4 text-orange-500" />
                  ) : (
                    <Timer className="w-4 h-4 text-primary" />
                  )}
                  <span className="text-sm font-medium">
                    {isBreak ? 'Pause' : 'Pomodoro'}
                  </span>
                </div>
                <span className="text-xl font-bold tabular-nums">
                  {formatTime(pomodoroTimeRemaining)}
                </span>
              </div>
              <Progress 
                value={pomodoroPercent} 
                className={`h-2 ${isBreak ? 'bg-orange-200' : ''}`}
              />
              
              {isBreak && (
                <Button
                  onClick={resumeFromBreak}
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                >
                  Reprendre maintenant
                </Button>
              )}
            </div>

            {/* Progression tempo */}
            {currentTrack && (
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <div className={`w-3 h-3 rounded-full ${PHASE_COLORS[currentTrack.phase]}`} />
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    Tempo: {currentTrack.target_tempo} BPM
                  </div>
                  <div className="text-xs text-muted-foreground capitalize">
                    Phase: {currentTrack.phase}
                  </div>
                </div>
              </div>
            )}

            {/* Statistiques */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold">
                  {currentSession.pomodoros_completed || 0}
                </div>
                <div className="text-xs text-muted-foreground">Pomodoros</div>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold">
                  {currentSession.tracks_generated || 0}
                </div>
                <div className="text-xs text-muted-foreground">Tracks générés</div>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold">
                  {currentTrack?.target_tempo || 0}
                </div>
                <div className="text-xs text-muted-foreground">BPM actuel</div>
              </div>
            </div>

            {/* Contrôles de lecture */}
            <div className="flex gap-2">
              {!isPlaying ? (
                <Button onClick={play} className="flex-1" size="lg">
                  <Play className="w-4 h-4 mr-2" />
                  Démarrer
                </Button>
              ) : isPaused ? (
                <Button onClick={resume} className="flex-1" size="lg">
                  <Play className="w-4 h-4 mr-2" />
                  Reprendre
                </Button>
              ) : (
                <Button onClick={pause} variant="secondary" className="flex-1" size="lg">
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
              )}
              
              <Button onClick={stop} variant="destructive" size="lg">
                <Square className="w-4 h-4" />
              </Button>
            </div>

            {/* Liste des tracks */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              <h4 className="text-sm font-medium">Playlist générée</h4>
              {tracks.map((track, idx) => (
                <div
                  key={track.id}
                  className={`p-2 rounded-lg border text-sm flex items-center justify-between ${
                    idx === currentTrackIndex ? 'border-primary bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${PHASE_COLORS[track.phase]}`} />
                    <span className="font-medium">#{idx + 1}</span>
                    <span className="text-xs text-muted-foreground">
                      {track.target_tempo} BPM
                    </span>
                  </div>
                  <Badge 
                    variant={track.generation_status === 'completed' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {track.generation_status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
