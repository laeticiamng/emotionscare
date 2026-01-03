/**
 * PlaylistExportButton - Export de playlists vers JSON/M3U
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileJson, FileText, Music, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { MusicTrack } from '@/types/music';

interface PlaylistExportButtonProps {
  playlistName: string;
  tracks: MusicTrack[];
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'icon';
}

export const PlaylistExportButton: React.FC<PlaylistExportButtonProps> = ({
  playlistName,
  tracks,
  variant = 'ghost',
  size = 'sm',
}) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportAsJSON = async () => {
    setIsExporting(true);
    try {
      const data = {
        name: playlistName,
        exportDate: new Date().toISOString(),
        trackCount: tracks.length,
        totalDuration: tracks.reduce((sum, t) => sum + (t.duration || 0), 0),
        tracks: tracks.map((t, index) => ({
          position: index + 1,
          id: t.id,
          title: t.title,
          artist: t.artist || 'Unknown',
          duration: t.duration,
          mood: t.mood,
          url: t.url || t.audioUrl,
        })),
      };

      const json = JSON.stringify(data, null, 2);
      const filename = `${playlistName.replace(/\s+/g, '_')}_${Date.now()}.json`;
      downloadFile(json, filename, 'application/json');

      toast({
        title: '✅ Export JSON réussi',
        description: `${tracks.length} pistes exportées`,
      });
    } catch (error) {
      toast({
        title: 'Erreur d\'export',
        description: 'Impossible d\'exporter en JSON',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsM3U = async () => {
    setIsExporting(true);
    try {
      let m3u = '#EXTM3U\n';
      m3u += `#PLAYLIST:${playlistName}\n\n`;

      tracks.forEach((t) => {
        const duration = t.duration || -1;
        const artist = t.artist || 'Unknown Artist';
        const title = t.title || 'Unknown Track';
        const url = t.url || t.audioUrl || '';

        m3u += `#EXTINF:${duration},${artist} - ${title}\n`;
        if (t.mood) {
          m3u += `#EXTGRP:${t.mood}\n`;
        }
        m3u += `${url}\n\n`;
      });

      const filename = `${playlistName.replace(/\s+/g, '_')}_${Date.now()}.m3u`;
      downloadFile(m3u, filename, 'audio/x-mpegurl');

      toast({
        title: '✅ Export M3U réussi',
        description: `${tracks.length} pistes exportées`,
      });
    } catch (error) {
      toast({
        title: 'Erreur d\'export',
        description: 'Impossible d\'exporter en M3U',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsText = async () => {
    setIsExporting(true);
    try {
      let text = `${playlistName}\n`;
      text += `${'='.repeat(playlistName.length)}\n\n`;
      text += `Exporté le: ${new Date().toLocaleDateString('fr-FR')}\n`;
      text += `Nombre de pistes: ${tracks.length}\n\n`;
      text += `Liste des pistes:\n`;
      text += `${'─'.repeat(40)}\n\n`;

      tracks.forEach((t, index) => {
        const duration = t.duration
          ? `${Math.floor(t.duration / 60)}:${(t.duration % 60).toString().padStart(2, '0')}`
          : '--:--';
        text += `${(index + 1).toString().padStart(2, '0')}. ${t.title}\n`;
        text += `    Artiste: ${t.artist || 'Inconnu'}\n`;
        text += `    Durée: ${duration}\n`;
        if (t.mood) {
          text += `    Humeur: ${t.mood}\n`;
        }
        text += `\n`;
      });

      const filename = `${playlistName.replace(/\s+/g, '_')}_${Date.now()}.txt`;
      downloadFile(text, filename, 'text/plain');

      toast({
        title: '✅ Export texte réussi',
        description: `${tracks.length} pistes exportées`,
      });
    } catch (error) {
      toast({
        title: 'Erreur d\'export',
        description: 'Impossible d\'exporter en texte',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (!tracks || tracks.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} disabled={isExporting}>
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Download className="h-4 w-4 mr-1" />
              Exporter
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Format d'export</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={exportAsJSON}>
          <FileJson className="h-4 w-4 mr-2" />
          JSON (complet)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsM3U}>
          <Music className="h-4 w-4 mr-2" />
          M3U (playlist)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsText}>
          <FileText className="h-4 w-4 mr-2" />
          Texte (lisible)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PlaylistExportButton;
