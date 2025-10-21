// @ts-nocheck

import { useState, useEffect } from 'react';
import { AVAILABLE_PRESETS } from '@/services/parcours-orchestrator';
import { useParcoursGeneration } from '@/hooks/useParcoursGeneration';
import { useParcoursPlayer } from '@/hooks/useParcoursPlayer';
import { useParcoursRealtime } from '@/hooks/useParcoursRealtime';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import {
  Play, 
  Pause, 
  Square, 
  SkipForward, 
  Volume2, 
  Heart,
  Sparkles,
  Music,
  AlertCircle 
} from 'lucide-react';
import type { ParcoursRun, ParcoursSegment } from '@/types/music/parcours';

export default function ParcoursXL() {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [stage, setStage] = useState<'select' | 'brief' | 'generating' | 'playing' | 'journal'>('select');
  const [journal, setJournal] = useState('');
  const [currentRun, setCurrentRun] = useState<ParcoursRun | null>(null);
  const [segments, setSegments] = useState<ParcoursSegment[]>([]);
  
  const { isGenerating, generationProgress, error: genError, createRun, reset } = useParcoursGeneration();
  const { playerState, play, pause, stop, skipToSegment, setVolume, getCurrentSegment } = useParcoursPlayer(currentRun, segments);

  // Listen to real-time updates for segments
  const { liveSegments } = useParcoursRealtime({
    runId: currentRun?.id || null,
    onSegmentUpdate: (segment) => {
      // Update segments array with new data
      setSegments((prev) =>
        prev.map((s) => (s.id === segment.id ? { ...s, ...segment } : s))
      );

      // Auto-play preview when first audio is ready
      if (segment.status === 'first' && segment.preview_url && !playerState.isPlaying) {
        logger.info('Auto-playing preview for segment', { segment_index: segment.segment_index }, 'MUSIC');
        play();
      }

      // Switch to final URL when complete
      if (segment.status === 'complete' && segment.final_url) {
        logger.info('Switching to final URL for segment', { segment_index: segment.segment_index }, 'MUSIC');
        // Player will automatically use final_url if available
      }
    },
    onRunComplete: () => {
      logger.info('All segments complete!', {}, 'MUSIC');
    },
  });

  const currentPreset = AVAILABLE_PRESETS.find(p => p.key === selectedPreset);
  const currentSegment = getCurrentSegment();

  const handleStart = async () => {
    if (!selectedPreset) return;
    
    setStage('generating');
    const result = await createRun(selectedPreset);
    
    if (result) {
      setCurrentRun(result.run);
      setSegments(result.segments);
      setStage('playing');
    }
  };

  const handleEmergencyStop = () => {
    stop();
    setStage('journal');
  };

  const handleSaveJournal = async () => {
    if (currentRun && journal.trim()) {
      await supabase
        .from('parcours_runs')
        .update({ notes_encrypted: journal, status: 'completed', ended_at: new Date().toISOString() })
        .eq('id', currentRun.id);
    }
    
    setStage('select');
    setSelectedPreset(null);
    setJournal('');
    setCurrentRun(null);
    setSegments([]);
    reset();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Music className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">Parcours Musicothérapie XL</h1>
        </div>
        <p className="text-muted-foreground mb-8">
          Parcours intégrés 18-24 minutes · TCC/ACT/DBT + Hypnose + TCM
        </p>

        {stage === 'select' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">Choisis ton émotion de départ</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {AVAILABLE_PRESETS.map(preset => (
                <Card
                  key={preset.key}
                  onClick={() => {
                    setSelectedPreset(preset.key);
                    setStage('brief');
                  }}
                  className="p-4 hover:bg-accent cursor-pointer transition-all hover:scale-[1.02]"
                >
                  <h3 className="font-semibold mb-1">{preset.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{preset.description}</p>
                  <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                    {preset.emotion}
                  </span>
                </Card>
              ))}
            </div>
          </div>
        )}

        {stage === 'brief' && currentPreset && (
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">{currentPreset.title}</h2>
              <p className="text-muted-foreground">{currentPreset.description}</p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Ce parcours inclut:
              </h3>
              <ul className="grid grid-cols-2 gap-2 text-sm">
                <li className="flex items-center gap-2">✓ Respiration guidée</li>
                <li className="flex items-center gap-2">✓ Techniques TCC/ACT/DBT</li>
                <li className="flex items-center gap-2">✓ Hypnose ericksonienne</li>
                <li className="flex items-center gap-2">✓ Acupression TCM</li>
                <li className="flex items-center gap-2">✓ Tapping bilatéral</li>
                <li className="flex items-center gap-2">✓ Immersion sensorielle</li>
              </ul>
            </div>

            <div className="p-4 bg-amber-500/10 rounded border border-amber-500/20 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700 dark:text-amber-400">
                Certains points d'acupression (LI4, SP6) sont contre-indiqués pendant la grossesse.
                Ce parcours est un outil de self-care, pas un traitement médical.
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStage('select')}>
                Retour
              </Button>
              <Button onClick={handleStart} className="flex-1">
                <Play className="w-4 h-4 mr-2" />
                Lancer le parcours
              </Button>
            </div>
          </Card>
        )}

        {stage === 'generating' && (
          <Card className="p-8 space-y-6 text-center">
            <div className="space-y-2">
              <Sparkles className="w-12 h-12 text-primary mx-auto animate-pulse" />
              <h2 className="text-2xl font-semibold">Génération en cours...</h2>
              <p className="text-muted-foreground">
                Création de ta session musicothérapeutique personnalisée
              </p>
            </div>
            <Progress value={generationProgress} className="w-full" />
            <p className="text-sm text-muted-foreground">
              {generationProgress}% - Cela peut prendre 1-2 minutes
            </p>
            {genError && (
              <div className="p-4 bg-destructive/10 rounded border border-destructive/20">
                <p className="text-sm text-destructive">{genError}</p>
              </div>
            )}
          </Card>
        )}

        {stage === 'playing' && (
          <Card className="p-6 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">{currentPreset?.title}</h2>
              <p className="text-sm text-muted-foreground">
                Segment {playerState.currentSegmentIndex + 1} / {segments.length}
              </p>
            </div>

            {currentSegment && (
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h3 className="font-semibold mb-1">{currentSegment.title}</h3>
                <p className="text-sm text-muted-foreground">{currentSegment.voiceover_text?.slice(0, 100)}...</p>
              </div>
            )}

            <div className="space-y-4">
              <Progress 
                value={(playerState.currentTime / playerState.totalDuration) * 100} 
                className="w-full h-3"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatTime(playerState.currentTime)}</span>
                <span>{formatTime(playerState.totalDuration)}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex gap-2 flex-1 justify-center">
                {!playerState.isPlaying ? (
                  <Button onClick={play} size="lg" className="rounded-full">
                    <Play className="w-5 h-5" />
                  </Button>
                ) : (
                  <Button onClick={pause} size="lg" variant="outline" className="rounded-full">
                    <Pause className="w-5 h-5" />
                  </Button>
                )}
                <Button 
                  onClick={() => skipToSegment(playerState.currentSegmentIndex + 1)}
                  variant="outline"
                  size="lg"
                  className="rounded-full"
                  disabled={playerState.currentSegmentIndex >= segments.length - 1}
                >
                  <SkipForward className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex items-center gap-2 w-32">
                <Volume2 className="w-5 h-5 text-muted-foreground" />
                <Slider
                  value={[playerState.volume * 100]}
                  onValueChange={(values) => setVolume(values[0] / 100)}
                  max={100}
                  step={1}
                  className="flex-1"
                />
              </div>
            </div>

            <Button 
              onClick={handleEmergencyStop}
              variant="destructive"
              className="w-full"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop d'urgence
            </Button>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground">Étapes du parcours</h4>
              <div className="space-y-1">
                {segments.map((seg, idx) => (
                  <button
                    key={seg.id}
                    onClick={() => skipToSegment(idx)}
                    className={`w-full text-left p-2 rounded text-sm transition-colors ${
                      idx === playerState.currentSegmentIndex
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {idx + 1}. {seg.title}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        )}

        {stage === 'journal' && (
          <Card className="p-6 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Comment te sens-tu ?</h2>
              <p className="text-sm text-muted-foreground">
                Prends 60 secondes pour noter ce que tu as appris, ou ce que tu feras différemment la prochaine fois.
              </p>
            </div>

            <Textarea
              value={journal}
              onChange={(e) => setJournal(e.target.value)}
              className="min-h-32 resize-none"
              placeholder="Mon ressenti, ce que j'ai appris, la prochaine fois je..."
            />

            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">
                🔒 Tes notes sont chiffrées et visibles uniquement par toi.
                Aucune donnée individuelle n'est partagée.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setStage('select');
                  setSelectedPreset(null);
                  setJournal('');
                }}
              >
                Passer
              </Button>
              <Button onClick={handleSaveJournal} className="flex-1">
                Sauvegarder et terminer
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
