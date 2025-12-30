/**
 * Modal de détail d'une activité avec mode guidé
 */

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  Play, 
  Pause, 
  CheckCircle, 
  Heart,
  Star,
  TrendingUp,
  Zap,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import * as Icons from 'lucide-react';
import type { Activity } from '../types';
import { ActivitySessionService } from '../services/activitySessionService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ActivityDetailModalProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

type SessionPhase = 'intro' | 'mood-before' | 'activity' | 'mood-after' | 'complete';

export function ActivityDetailModal({
  activity,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite
}: ActivityDetailModalProps) {
  const { user } = useAuth();
  const [phase, setPhase] = useState<SessionPhase>('intro');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [moodBefore, setMoodBefore] = useState(5);
  const [energyBefore, setEnergyBefore] = useState(5);
  const [moodAfter, setMoodAfter] = useState(5);
  const [energyAfter, setEnergyAfter] = useState(5);
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  if (!activity) return null;

  const IconComponent = activity.icon ? (Icons as any)[activity.icon] : Icons.Activity;
  const totalDuration = activity.duration_minutes * 60;
  const progress = (elapsedTime / totalDuration) * 100;

  const resetState = () => {
    setPhase('intro');
    setSessionId(null);
    setMoodBefore(5);
    setEnergyBefore(5);
    setMoodAfter(5);
    setEnergyAfter(5);
    setRating(0);
    setNotes('');
    setCurrentStep(0);
    setIsPlaying(false);
    setElapsedTime(0);
    if (timerId) clearInterval(timerId);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const startSession = async () => {
    if (!user) {
      toast.error('Connectez-vous pour enregistrer votre progression');
      setPhase('activity');
      return;
    }

    try {
      const session = await ActivitySessionService.startSession(
        user.id,
        activity.id,
        moodBefore,
        energyBefore
      );
      setSessionId(session.id);
      setPhase('activity');
    } catch (error) {
      console.error('Error starting session:', error);
      setPhase('activity');
    }
  };

  const toggleTimer = () => {
    if (isPlaying) {
      if (timerId) clearInterval(timerId);
      setIsPlaying(false);
    } else {
      const id = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      setTimerId(id);
      setIsPlaying(true);
    }
  };

  const finishActivity = () => {
    if (timerId) clearInterval(timerId);
    setIsPlaying(false);
    setPhase('mood-after');
  };

  const completeSession = async () => {
    if (sessionId && user) {
      try {
        await ActivitySessionService.completeSession(sessionId, {
          mood_after: moodAfter,
          energy_after: energyAfter,
          rating,
          notes: notes || undefined,
          was_guided: true
        });
        toast.success('Session enregistrée ! +XP gagné');
      } catch (error) {
        console.error('Error completing session:', error);
      }
    }
    setPhase('complete');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const categoryLabels: Record<string, string> = {
    relaxation: 'Relaxation',
    physical: 'Physique',
    creative: 'Créative',
    social: 'Sociale',
    mindfulness: 'Pleine conscience',
    nature: 'Nature'
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {IconComponent && <IconComponent className="h-6 w-6 text-primary" />}
              <DialogTitle>{activity.title}</DialogTitle>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={onToggleFavorite}
              className="h-8 w-8 p-0"
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </div>
        </DialogHeader>

        {/* Phase: Introduction */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <p className="text-muted-foreground">{activity.description}</p>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{categoryLabels[activity.category]}</Badge>
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                {activity.duration_minutes} min
              </Badge>
              {activity.is_premium && (
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500">Premium</Badge>
              )}
            </div>

            {activity.benefits.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Bénéfices
                </h4>
                <ul className="space-y-1">
                  {activity.benefits.map((benefit, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button onClick={() => setPhase('mood-before')} className="w-full gap-2">
              <Play className="h-4 w-4" />
              Commencer l'activité
            </Button>
          </div>
        )}

        {/* Phase: Mood Before */}
        {phase === 'mood-before' && (
          <div className="space-y-6">
            <p className="text-center text-muted-foreground">
              Comment vous sentez-vous avant de commencer ?
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Heart className="h-4 w-4 text-pink-500" />
                  Humeur : {moodBefore}/10
                </label>
                <Slider
                  value={[moodBefore]}
                  onValueChange={([v]) => setMoodBefore(v)}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  Énergie : {energyBefore}/10
                </label>
                <Slider
                  value={[energyBefore]}
                  onValueChange={([v]) => setEnergyBefore(v)}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>
            </div>

            <Button onClick={startSession} className="w-full gap-2">
              <ChevronRight className="h-4 w-4" />
              Continuer
            </Button>
          </div>
        )}

        {/* Phase: Activity */}
        {phase === 'activity' && (
          <div className="space-y-6">
            {/* Timer */}
            <div className="text-center space-y-2">
              <div className="text-4xl font-mono font-bold text-primary">
                {formatTime(elapsedTime)}
              </div>
              <Progress value={Math.min(progress, 100)} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Objectif : {activity.duration_minutes} minutes
              </p>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                variant={isPlaying ? 'outline' : 'default'}
                onClick={toggleTimer}
                className="gap-2"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                {isPlaying ? 'Pause' : 'Reprendre'}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setElapsedTime(0)}
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
            </div>

            {/* Instructions */}
            {activity.instructions.length > 0 && (
              <div className="space-y-3 bg-muted/50 rounded-lg p-4">
                <h4 className="font-semibold text-sm">Instructions</h4>
                <div className="space-y-2">
                  {activity.instructions.map((instruction, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-3 p-2 rounded ${
                        currentStep === i ? 'bg-primary/10 border border-primary/20' : ''
                      }`}
                      onClick={() => setCurrentStep(i)}
                    >
                      <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        currentStep >= i ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20'
                      }`}>
                        {i + 1}
                      </span>
                      <span className="text-sm">{instruction}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button onClick={finishActivity} className="w-full" variant="secondary">
              <CheckCircle className="h-4 w-4 mr-2" />
              Terminer l'activité
            </Button>
          </div>
        )}

        {/* Phase: Mood After */}
        {phase === 'mood-after' && (
          <div className="space-y-6">
            <p className="text-center text-muted-foreground">
              Comment vous sentez-vous après l'activité ?
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Heart className="h-4 w-4 text-pink-500" />
                  Humeur : {moodAfter}/10
                </label>
                <Slider
                  value={[moodAfter]}
                  onValueChange={([v]) => setMoodAfter(v)}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  Énergie : {energyAfter}/10
                </label>
                <Slider
                  value={[energyAfter]}
                  onValueChange={([v]) => setEnergyAfter(v)}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Note cette activité</label>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`h-8 w-8 transition-colors ${
                          star <= rating 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-muted-foreground/30'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notes (optionnel)</label>
                <Textarea
                  placeholder="Comment s'est passée cette activité ?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <Button onClick={completeSession} className="w-full gap-2">
              <CheckCircle className="h-4 w-4" />
              Enregistrer
            </Button>
          </div>
        )}

        {/* Phase: Complete */}
        {phase === 'complete' && (
          <div className="space-y-6 text-center py-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            
            <div>
              <h3 className="text-xl font-bold">Bravo !</h3>
              <p className="text-muted-foreground">
                Vous avez terminé {activity.title}
              </p>
            </div>

            {moodAfter > moodBefore && (
              <div className="bg-green-500/10 rounded-lg p-3">
                <p className="text-green-600 dark:text-green-400 font-medium">
                  +{moodAfter - moodBefore} points d'humeur
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Fermer
              </Button>
              <Button onClick={resetState} className="flex-1">
                Refaire
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
