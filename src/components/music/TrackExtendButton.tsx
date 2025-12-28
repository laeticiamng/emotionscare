/**
 * TrackExtendButton - Bouton pour étendre une piste via Suno API
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Loader2, Maximize2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import type { MusicTrack } from '@/types/music';

interface TrackExtendButtonProps {
  track: MusicTrack;
  onExtended?: (newAudioUrl: string) => void;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'icon';
}

const TrackExtendButton: React.FC<TrackExtendButtonProps> = ({
  track,
  onExtended,
  variant = 'ghost',
  size = 'sm',
}) => {
  const [open, setOpen] = useState(false);
  const [isExtending, setIsExtending] = useState(false);
  const [continueAt, setContinueAt] = useState(120); // Default 2 minutes

  const audioUrl = track.audioUrl || track.url;

  const handleExtend = async () => {
    if (!audioUrl) {
      toast.error('URL audio non disponible');
      return;
    }

    setIsExtending(true);
    try {
      // Extract audioId from Suno URL if possible
      const audioIdMatch = audioUrl.match(/\/([a-f0-9-]{36})\./);
      const audioId = audioIdMatch ? audioIdMatch[1] : track.id;

      const { data, error } = await supabase.functions.invoke('suno-music', {
        body: {
          action: 'extend',
          audioId,
          continueAt,
          title: `${track.title} (Extended)`,
        },
      });

      if (error) throw error;

      const taskId = data?.taskId || data?.data?.taskId;
      
      if (taskId) {
        toast.success('Extension lancée', {
          description: 'La génération prend environ 30 secondes',
        });

        // Poll for completion
        let attempts = 0;
        const maxAttempts = 30;
        
        while (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const { data: statusData } = await supabase.functions.invoke('suno-music', {
            body: { action: 'status', trackIds: [taskId] },
          });

          const status = statusData?.status || statusData?.data?.status;
          const newAudioUrl = statusData?.audio_url || statusData?.data?.audio_url;

          if (status === 'completed' && newAudioUrl) {
            toast.success('Piste étendue !', {
              description: 'Nouvelle version disponible',
            });
            onExtended?.(newAudioUrl);
            setOpen(false);
            return;
          }

          if (status === 'failed' || status === 'error') {
            throw new Error('Génération échouée');
          }

          attempts++;
        }

        toast.info('Extension en cours', {
          description: 'Vérifiez votre bibliothèque dans quelques instants',
        });
      } else {
        throw new Error('Pas de taskId retourné');
      }

      logger.info('Track extended', { trackId: track.id, continueAt }, 'MUSIC');
    } catch (error) {
      logger.error('Extend failed', error as Error, 'MUSIC');
      toast.error('Erreur d\'extension', {
        description: 'Impossible d\'étendre la piste',
      });
    } finally {
      setIsExtending(false);
    }
  };

  if (!audioUrl) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} disabled={isExtending}>
          {isExtending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Maximize2 className="h-4 w-4 mr-1" />
              Étendre
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Étendre la piste</DialogTitle>
          <DialogDescription>
            Prolongez "{track.title}" à partir d'un point précis
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Continuer à partir de: {Math.floor(continueAt / 60)}:{(continueAt % 60).toString().padStart(2, '0')}
            </label>
            <Slider
              value={[continueAt]}
              onValueChange={(v) => setContinueAt(v[0])}
              min={30}
              max={Math.min(track.duration || 180, 300)}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              L'IA générera une continuation de ~2 minutes à partir de ce point
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleExtend} disabled={isExtending}>
            {isExtending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Génération...
              </>
            ) : (
              'Étendre la piste'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TrackExtendButton;
