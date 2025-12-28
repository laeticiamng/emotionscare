/**
 * TrackDownloadButton - Bouton d'export/téléchargement de tracks
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, Loader2, FileAudio, Share2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import type { MusicTrack } from '@/types/music';
import { logger } from '@/lib/logger';

interface TrackDownloadButtonProps {
  track: MusicTrack;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'icon';
  showLabel?: boolean;
}

const TrackDownloadButton: React.FC<TrackDownloadButtonProps> = ({
  track,
  variant = 'ghost',
  size = 'icon',
  showLabel = false,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const audioUrl = track.audioUrl || track.url;

  const downloadTrack = async () => {
    if (!audioUrl) {
      toast.error('URL audio non disponible');
      return;
    }

    setIsDownloading(true);
    try {
      // Fetch the audio file
      const response = await fetch(audioUrl);
      if (!response.ok) throw new Error('Téléchargement échoué');

      const blob = await response.blob();
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${track.title || 'track'}_${track.artist || 'emotionscare'}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Téléchargement terminé', {
        description: `"${track.title}" enregistrée`,
      });
      logger.info('Track downloaded', { trackId: track.id }, 'MUSIC');
    } catch (error) {
      logger.error('Download failed', error as Error, 'MUSIC');
      toast.error('Erreur de téléchargement', {
        description: 'Impossible de télécharger le fichier',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const copyLink = async () => {
    if (!audioUrl) return;
    
    try {
      await navigator.clipboard.writeText(audioUrl);
      setCopied(true);
      toast.success('Lien copié');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Impossible de copier le lien');
    }
  };

  const shareTrack = async () => {
    if (!navigator.share) {
      copyLink();
      return;
    }

    try {
      await navigator.share({
        title: track.title || 'Musique EmotionsCare',
        text: `Écoute "${track.title}" par ${track.artist || 'EmotionsCare AI'}`,
        url: audioUrl,
      });
      logger.info('Track shared', { trackId: track.id }, 'MUSIC');
    } catch (error) {
      // User cancelled or error
      if ((error as Error).name !== 'AbortError') {
        copyLink();
      }
    }
  };

  if (!audioUrl) return null;

  if (size === 'icon' && !showLabel) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size="icon" disabled={isDownloading}>
            {isDownloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={downloadTrack} disabled={isDownloading}>
            <FileAudio className="h-4 w-4 mr-2" />
            Télécharger MP3
          </DropdownMenuItem>
          <DropdownMenuItem onClick={shareTrack}>
            <Share2 className="h-4 w-4 mr-2" />
            Partager
          </DropdownMenuItem>
          <DropdownMenuItem onClick={copyLink}>
            {copied ? (
              <Check className="h-4 w-4 mr-2" />
            ) : (
              <Copy className="h-4 w-4 mr-2" />
            )}
            Copier le lien
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={downloadTrack}
      disabled={isDownloading}
    >
      {isDownloading ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : (
        <Download className="h-4 w-4 mr-2" />
      )}
      {showLabel && 'Télécharger'}
    </Button>
  );
};

export default TrackDownloadButton;
