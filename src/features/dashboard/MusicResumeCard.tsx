/**
 * Carte Dashboard pour la reprise de lecture musicale
 * Affiche la dernière piste écoutée si elle mérite une reprise
 */

import React, { useState, useEffect } from 'react';
import { Play, Clock, Music } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { getRecent, shouldSuggestResume, getListeningProgress, type RecentTrack } from '@/services/music/recentApi';

export const MusicResumeCard: React.FC = () => {
  const [recentTrack, setRecentTrack] = useState<RecentTrack | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Charger la piste récente
  useEffect(() => {
    const loadRecentTrack = async () => {
      try {
        const recent = await getRecent();
        
        // Ne montrer la carte que si la reprise est pertinente
        if (recent && shouldSuggestResume(recent)) {
          setRecentTrack(recent);
        }
      } catch (error) {
        console.error('Erreur chargement piste récente:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadRecentTrack();
  }, []);
  
  // Naviguer vers le module musique pour reprendre
  const handleResume = () => {
    if (!recentTrack) return;
    
    // Construire l'URL avec les paramètres pour reprendre automatiquement
    const params = new URLSearchParams({
      resume: recentTrack.track_id,
      position: recentTrack.position_sec.toString()
    });
    
    navigate(`/music?${params.toString()}`);
    
    toast({
      title: 'Reprise de lecture',
      description: `Reprendre "${recentTrack.meta.title}"`
    });
  };
  
  // Formater le temps en mm:ss
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculer le temps restant
  const getRemainingTime = (): string => {
    if (!recentTrack?.meta.duration_sec) return '';
    const remaining = recentTrack.meta.duration_sec - recentTrack.position_sec;
    return formatTime(remaining);
  };
  
  // Ne pas afficher la carte si pas de données pertinentes
  if (loading || !recentTrack) {
    return null;
  }
  
  const progress = getListeningProgress(recentTrack);
  const remainingTime = getRemainingTime();
  
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-md transition-all">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-primary" />
          À reprendre
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Informations de la piste */}
        <div className="flex items-start gap-3">
          {recentTrack.meta.cover ? (
            <img
              src={recentTrack.meta.cover}
              alt={`Pochette de ${recentTrack.meta.title}`}
              className="w-12 h-12 rounded object-cover shrink-0"
              loading="lazy"
            />
          ) : (
            <div className="w-12 h-12 rounded bg-secondary flex items-center justify-center shrink-0">
              <Music className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">
              {recentTrack.meta.title || 'Piste inconnue'}
            </h3>
            {recentTrack.meta.artist && (
              <p className="text-sm text-muted-foreground truncate">
                {recentTrack.meta.artist}
              </p>
            )}
            {recentTrack.meta.genre && (
              <span className="inline-block text-xs bg-secondary px-2 py-1 rounded mt-1">
                {recentTrack.meta.genre}
              </span>
            )}
          </div>
        </div>
        
        {/* Progression d'écoute */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progression</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Écouté : {formatTime(recentTrack.position_sec)}</span>
            {remainingTime && <span>Reste : {remainingTime}</span>}
          </div>
        </div>
        
        {/* Bouton de reprise */}
        <Button 
          onClick={handleResume}
          className="w-full"
          size="sm"
        >
          <Play className="h-4 w-4 mr-2" />
          Reprendre la lecture
        </Button>
        
        {/* Dernière écoute */}
        <p className="text-xs text-muted-foreground text-center">
          Dernière écoute : {new Date(recentTrack.updated_at).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </CardContent>
    </Card>
  );
};