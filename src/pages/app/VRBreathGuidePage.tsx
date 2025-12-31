/**
 * VR Breath Guide Page - Respiration guidée en VR
 * Session immersive de cohérence cardiaque
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX,
  Settings,
  Clock,
  Wind,
  Heart,
  TrendingUp,
  CheckCircle,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useVRSettings } from '@/hooks/useVRSettings';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { BREATH_PRESETS, type BreathingPattern, type BreathPhase } from '@/modules/vr-nebula/types';

const PATTERN_OPTIONS: { value: BreathingPattern; label: string; description: string }[] = [
  { value: 'box', label: 'Box Breathing', description: '4-4-4-4 · Anti-stress' },
  { value: 'coherence', label: 'Cohérence', description: '5-5 · Équilibre cardiaque' },
  { value: 'relax', label: 'Relaxation', description: '4-7-8 · Détente profonde' },
  { value: 'energize', label: 'Énergie', description: '3-5 · Boost énergétique' },
  { value: 'calm', label: 'Calme', description: '6-6 · Sérénité' },
];

const DURATION_OPTIONS = [3, 5, 10, 15, 20];

const PHASE_LABELS: Record<BreathPhase, string> = {
  inhale: 'Inspirez',
  hold_in: 'Retenez',
  exhale: 'Expirez',
  hold_out: 'Pause',
};

const PHASE_COLORS: Record<BreathPhase, string> = {
  inhale: 'from-primary/30 to-primary/60',
  hold_in: 'from-info/30 to-info/60',
  exhale: 'from-success/30 to-success/60',
  hold_out: 'from-muted/30 to-muted/60',
};

export default function VRBreathGuidePage() {
  const navigate = useNavigate();
  const { settings, saveSettings } = useVRSettings();
  const { toast } = useToast();
  
  // Session state
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(settings.audioEnabled);
  const [pattern, setPattern] = useState<BreathingPattern>(settings.defaultPattern);
  const [durationMinutes, setDurationMinutes] = useState(settings.defaultDuration);
  const [showSettings, setShowSettings] = useState(true);
  
  // Active session state
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<BreathPhase>('inhale');
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [breathScale, setBreathScale] = useState(1);
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const phaseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date | null>(null);
  
  const timing = BREATH_PRESETS[pattern];
  const totalDuration = durationMinutes * 60;
  const progress = Math.min(100, (elapsedSeconds / totalDuration) * 100);
  
  // Calculate cycle duration
  const cycleDuration = timing.inhale + timing.hold_in + timing.exhale + timing.hold_out;
  
  // Phase sequence
  const getPhaseSequence = useCallback((): { phase: BreathPhase; duration: number }[] => {
    const phases: { phase: BreathPhase; duration: number }[] = [];
    if (timing.inhale > 0) phases.push({ phase: 'inhale', duration: timing.inhale });
    if (timing.hold_in > 0) phases.push({ phase: 'hold_in', duration: timing.hold_in });
    if (timing.exhale > 0) phases.push({ phase: 'exhale', duration: timing.exhale });
    if (timing.hold_out > 0) phases.push({ phase: 'hold_out', duration: timing.hold_out });
    return phases;
  }, [timing]);
  
  // Start session
  const startSession = useCallback(async () => {
    setShowSettings(false);
    setIsPlaying(true);
    setElapsedSeconds(0);
    setCyclesCompleted(0);
    setCurrentPhase('inhale');
    setPhaseProgress(0);
    startTimeRef.current = new Date();
    
    // Create session in DB
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('vr_nebula_sessions')
          .insert({
            user_id: user.id,
            scene: 'breath',
            breathing_pattern: pattern,
            vr_mode: false,
            duration_s: 0,
            cycles_completed: 0,
          })
          .select('id')
          .single();
        
        if (!error && data) {
          setSessionId(data.id);
        }
      }
    } catch (err) {
      console.error('Error creating session:', err);
    }
    
    // Haptic feedback
    if (settings.hapticFeedback && navigator.vibrate) {
      navigator.vibrate(100);
    }
  }, [pattern, settings.hapticFeedback]);
  
  // Complete session
  const completeSession = useCallback(async () => {
    setIsPlaying(false);
    
    if (sessionId && startTimeRef.current) {
      const duration_s = Math.round((Date.now() - startTimeRef.current.getTime()) / 1000);
      
      try {
        await supabase
          .from('vr_nebula_sessions')
          .update({
            duration_s,
            cycles_completed: cyclesCompleted,
            coherence_score: Math.min(100, 50 + cyclesCompleted * 5),
            resp_rate_avg: 60 / cycleDuration,
          })
          .eq('id', sessionId);
        
        toast({
          title: 'Session terminée',
          description: `${cyclesCompleted} cycles de respiration complétés.`,
        });
      } catch (err) {
        console.error('Error completing session:', err);
      }
    }
    
    setSessionId(null);
    setShowSettings(true);
  }, [sessionId, cyclesCompleted, cycleDuration, toast]);
  
  // Timer effect
  useEffect(() => {
    if (!isPlaying) return;
    
    timerRef.current = setInterval(() => {
      setElapsedSeconds(prev => {
        if (prev >= totalDuration) {
          completeSession();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, totalDuration, completeSession]);
  
  // Breath phase animation
  useEffect(() => {
    if (!isPlaying) return;
    
    const phases = getPhaseSequence();
    let phaseIndex = 0;
    let phaseElapsed = 0;
    
    const runPhase = () => {
      const currentPhaseData = phases[phaseIndex];
      if (!currentPhaseData) return;
      
      setCurrentPhase(currentPhaseData.phase);
      setPhaseProgress(0);
      phaseElapsed = 0;
      
      // Update breath scale
      if (currentPhaseData.phase === 'inhale') {
        setBreathScale(1);
      }
      
      // Haptic on phase change
      if (settings.hapticFeedback && navigator.vibrate) {
        navigator.vibrate(50);
      }
      
      const phaseDurationMs = currentPhaseData.duration * 1000;
      const tickInterval = 50; // 50ms ticks for smooth animation
      
      phaseTimerRef.current = setInterval(() => {
        phaseElapsed += tickInterval;
        const progress = (phaseElapsed / phaseDurationMs) * 100;
        setPhaseProgress(Math.min(100, progress));
        
        // Animate breath scale
        if (currentPhaseData.phase === 'inhale') {
          setBreathScale(1 + (progress / 100) * 0.5);
        } else if (currentPhaseData.phase === 'exhale') {
          setBreathScale(1.5 - (progress / 100) * 0.5);
        }
        
        if (phaseElapsed >= phaseDurationMs) {
          if (phaseTimerRef.current) clearInterval(phaseTimerRef.current);
          
          phaseIndex = (phaseIndex + 1) % phases.length;
          
          // Count cycle on exhale completion
          if (currentPhaseData.phase === 'exhale' && phases[phaseIndex].phase === 'inhale') {
            setCyclesCompleted(c => c + 1);
          }
          
          runPhase();
        }
      }, tickInterval);
    };
    
    runPhase();
    
    return () => {
      if (phaseTimerRef.current) clearInterval(phaseTimerRef.current);
    };
  }, [isPlaying, getPhaseSequence, settings.hapticFeedback]);
  
  // Toggle pause
  const togglePause = useCallback(() => {
    setIsPlaying(prev => !prev);
    if (settings.hapticFeedback && navigator.vibrate) {
      navigator.vibrate(50);
    }
  }, [settings.hapticFeedback]);
  
  // Reset session
  const resetSession = useCallback(() => {
    setIsPlaying(false);
    setShowSettings(true);
    setElapsedSeconds(0);
    setCyclesCompleted(0);
    setCurrentPhase('inhale');
    setPhaseProgress(0);
    setBreathScale(1);
    setSessionId(null);
  }, []);
  
  // Format time
  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-info/5 to-background">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/app/vr')}
              aria-label="Retour"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Respiration guidée</h1>
              <p className="text-sm text-muted-foreground">Cohérence cardiaque</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setAudioEnabled(a => !a)}
            aria-label={audioEnabled ? 'Désactiver le son' : 'Activer le son'}
          >
            {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
        </header>
        
        <AnimatePresence mode="wait">
          {showSettings ? (
            // Settings View
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Pattern Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Wind className="h-4 w-4" />
                    Pattern de respiration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {PATTERN_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setPattern(opt.value)}
                      className={`w-full p-3 rounded-lg border text-left transition-colors ${
                        pattern === opt.value
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{opt.label}</p>
                          <p className="text-sm text-muted-foreground">{opt.description}</p>
                        </div>
                        {pattern === opt.value && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
              
              {/* Duration Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Durée de la session
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 flex-wrap">
                    {DURATION_OPTIONS.map((d) => (
                      <Button
                        key={d}
                        variant={durationMinutes === d ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setDurationMinutes(d)}
                      >
                        {d} min
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Start Button */}
              <Button
                size="lg"
                className="w-full h-14 text-lg"
                onClick={startSession}
              >
                <Play className="h-6 w-6 mr-2" />
                Commencer la session
              </Button>
            </motion.div>
          ) : (
            // Active Session View
            <motion.div
              key="session"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              {/* Breath Circle */}
              <div className="flex items-center justify-center py-8">
                <div className="relative">
                  <motion.div
                    animate={{ scale: breathScale }}
                    transition={{ duration: 0.1, ease: 'linear' }}
                    className={`w-48 h-48 rounded-full bg-gradient-to-br ${PHASE_COLORS[currentPhase]} flex items-center justify-center shadow-2xl`}
                  >
                    <div className="text-center">
                      <motion.p
                        key={currentPhase}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl font-bold text-foreground"
                      >
                        {PHASE_LABELS[currentPhase]}
                      </motion.p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {Math.ceil(timing[currentPhase] * (1 - phaseProgress / 100))}s
                      </p>
                    </div>
                  </motion.div>
                  
                  {/* Progress ring */}
                  <svg
                    className="absolute inset-0 w-full h-full -rotate-90"
                    viewBox="0 0 200 200"
                  >
                    <circle
                      cx="100"
                      cy="100"
                      r="96"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="text-muted/20"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="96"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeDasharray={2 * Math.PI * 96}
                      strokeDashoffset={2 * Math.PI * 96 * (1 - phaseProgress / 100)}
                      className="text-primary transition-all duration-100"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
              
              {/* Session Stats */}
              <div className="grid grid-cols-3 gap-3">
                <Card className="bg-card/50">
                  <CardContent className="p-3 text-center">
                    <Clock className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                    <p className="text-lg font-bold">{formatTime(elapsedSeconds)}</p>
                    <p className="text-xs text-muted-foreground">Temps</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-card/50">
                  <CardContent className="p-3 text-center">
                    <Wind className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                    <p className="text-lg font-bold">{cyclesCompleted}</p>
                    <p className="text-xs text-muted-foreground">Cycles</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-card/50">
                  <CardContent className="p-3 text-center">
                    <Target className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                    <p className="text-lg font-bold">{Math.round(progress)}%</p>
                    <p className="text-xs text-muted-foreground">Progrès</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Progress Bar */}
              <div>
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{formatTime(elapsedSeconds)}</span>
                  <span>{formatTime(totalDuration)}</span>
                </div>
              </div>
              
              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={resetSession}
                  aria-label="Réinitialiser"
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>
                
                <Button
                  size="lg"
                  className="w-16 h-16 rounded-full"
                  onClick={togglePause}
                  aria-label={isPlaying ? 'Pause' : 'Reprendre'}
                >
                  {isPlaying ? (
                    <Pause className="h-8 w-8" />
                  ) : (
                    <Play className="h-8 w-8 ml-1" />
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={completeSession}
                  aria-label="Terminer"
                >
                  <CheckCircle className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
