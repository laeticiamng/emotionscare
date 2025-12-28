/**
 * TrackLyrics - Génération et affichage des paroles via Suno API
 * Utilise suno-lyrics edge function
 */

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Wand2, Loader2, Copy, Check, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';

interface TrackLyricsProps {
  trackTitle?: string;
  mood?: string;
  style?: string;
  onLyricsGenerated?: (lyrics: string, title: string) => void;
  className?: string;
}

export const TrackLyrics: React.FC<TrackLyricsProps> = ({
  trackTitle,
  mood = 'calm',
  style = 'therapeutic',
  onLyricsGenerated,
  className,
}) => {
  const { toast } = useToast();
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [generatedTitle, setGeneratedTitle] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateLyrics = useCallback(async () => {
    setIsGenerating(true);
    setLyrics(null);
    setGeneratedTitle(null);

    try {
      // Build prompt for lyrics
      const prompt = trackTitle 
        ? `Write ${style} lyrics for a song titled "${trackTitle}" with a ${mood} mood. Make it emotional and therapeutic.`
        : `Write ${style} ${mood} lyrics for a therapeutic song. Theme: emotional healing and inner peace.`;

      logger.info('Generating lyrics', { prompt, mood, style }, 'MUSIC');

      // Call suno-lyrics edge function
      const { data, error } = await supabase.functions.invoke('suno-lyrics', {
        body: {
          action: 'generate',
          prompt,
        },
      });

      if (error) throw error;

      if (!data.success || !data.data?.taskId) {
        throw new Error('Failed to start lyrics generation');
      }

      const newTaskId = data.data.taskId;
      setTaskId(newTaskId);

      // Poll for completion
      await pollLyricsStatus(newTaskId);

    } catch (error) {
      logger.error('Failed to generate lyrics', error as Error, 'MUSIC');
      toast({
        title: 'Erreur',
        description: 'Impossible de générer les paroles',
        variant: 'destructive',
      });
      setIsGenerating(false);
    }
  }, [trackTitle, mood, style, toast]);

  const pollLyricsStatus = async (lyricsTaskId: string) => {
    const maxAttempts = 30;
    let attempts = 0;

    const checkStatus = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('suno-lyrics', {
          body: {
            action: 'status',
            taskId: lyricsTaskId,
          },
        });

        if (error) throw error;

        if (data.data?.status === 'completed' && data.data?.lyrics) {
          setLyrics(data.data.lyrics);
          setGeneratedTitle(data.data.title || null);
          setIsGenerating(false);
          
          onLyricsGenerated?.(data.data.lyrics, data.data.title || '');
          
          toast({
            title: '✍️ Paroles générées !',
            description: data.data.title || 'Les paroles sont prêtes',
          });
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 2000);
        } else {
          throw new Error('Lyrics generation timeout');
        }
      } catch (error) {
        logger.error('Lyrics status check failed', error as Error, 'MUSIC');
        toast({
          title: 'Erreur',
          description: 'La génération des paroles a échoué',
          variant: 'destructive',
        });
        setIsGenerating(false);
      }
    };

    checkStatus();
  };

  const handleCopy = async () => {
    if (!lyrics) return;
    
    try {
      await navigator.clipboard.writeText(lyrics);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: 'Copié !',
        description: 'Les paroles ont été copiées',
      });
    } catch {
      toast({
        title: 'Erreur',
        description: 'Impossible de copier les paroles',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className={cn('border-primary/20', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Paroles
          </div>
          {lyrics && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopy}
              className="gap-1"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copié
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copier
                </>
              )}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!lyrics && !isGenerating && (
          <div className="text-center py-6 space-y-4">
            <FileText className="h-10 w-10 mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Générez des paroles pour accompagner votre musique
            </p>
            <Button onClick={generateLyrics} className="gap-2">
              <Wand2 className="h-4 w-4" />
              Générer des paroles
            </Button>
          </div>
        )}

        {isGenerating && (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 py-6">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">
                Création des paroles...
              </span>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        )}

        {lyrics && (
          <div className="space-y-3">
            {generatedTitle && (
              <Badge variant="secondary" className="mb-2">
                {generatedTitle}
              </Badge>
            )}
            <ScrollArea className="h-[250px] rounded-md border p-4">
              <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">
                {lyrics}
              </pre>
            </ScrollArea>
            <Button
              variant="outline"
              size="sm"
              onClick={generateLyrics}
              className="gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              Régénérer
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrackLyrics;
