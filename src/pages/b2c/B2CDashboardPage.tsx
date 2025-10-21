// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logger } from '@/lib/logger';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { useUserRole } from '@/hooks/useUserRole';
import { moodService } from '@/services/b2c/moodService';
import { musicService } from '@/services/b2c/musicService';
import { immersiveService } from '@/services/b2c/immersiveService';
import { MoodVisualizer } from '@/components/b2c/MoodVisualizer';
import { 
  Heart, 
  Music, 
  Glasses, 
  Sparkles, 
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const B2CDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { flags, isEnabled } = useFeatureFlags();
  const { isB2C, loading: roleLoading } = useUserRole();
  
  const [moodStats, setMoodStats] = useState<any>(null);
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roleLoading && !isB2C()) {
      toast({
        title: 'Accès refusé',
        description: 'Vous devez être un utilisateur B2C pour accéder à cet espace',
        variant: 'destructive',
      });
      navigate('/');
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        const [stats, music, immersive] = await Promise.all([
          moodService.getMoodStats(7),
          musicService.getUserMusicSessions(5),
          immersiveService.getUserSessions(5),
        ]);

        setMoodStats(stats);
        setRecentSessions([...music, ...immersive].slice(0, 5));
      } catch (error) {
        logger.error('Error loading B2C dashboard', error as Error, 'UI');
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les données',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (!roleLoading && isB2C()) {
      loadData();
    }
  }, [roleLoading, isB2C, navigate]);

  if (roleLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  const getTrendIcon = () => {
    if (!moodStats) return <Minus className="h-5 w-5" />;
    if (moodStats.trend === 'up') return <TrendingUp className="h-5 w-5 text-green-500" />;
    if (moodStats.trend === 'down') return <TrendingDown className="h-5 w-5 text-red-500" />;
    return <Minus className="h-5 w-5 text-muted-foreground" />;
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Mon Espace Bien-être</h1>
        </div>
        <p className="text-muted-foreground">
          Bienvenue dans votre espace personnel de sérénité et d'équilibre
        </p>
      </div>

      {/* Mood Visualizer */}
      {moodStats && moodStats.latestMood && (
        <MoodVisualizer
          valence={moodStats.latestMood.valence || 0}
          arousal={moodStats.latestMood.arousal || 0}
          size="lg"
        />
      )}

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Mood Stats */}
        <Card className="p-6 b2c-card">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Heart className="h-8 w-8 text-primary" />
              {getTrendIcon()}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Humeur moyenne (7 jours)</p>
              <p className="text-3xl font-bold">
                {moodStats ? `${((moodStats.avgValence + 1) * 50).toFixed(0)}%` : '—'}
              </p>
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/app/particulier/mood')}
            >
              Saisir mon humeur
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Music Sessions */}
        {isEnabled('FF_MUSIC_THERAPY') && (
          <Card className="p-6">
            <div className="space-y-4">
              <Music className="h-8 w-8 text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">Sessions musicales</p>
                <p className="text-3xl font-bold">
                  {recentSessions.filter((s) => 'preset_id' in s).length}
                </p>
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/app/particulier/music')}
              >
                Créer une séance
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* Immersive Sessions */}
        {isEnabled('FF_IMMERSIVE_SESSIONS') && (
          <Card className="p-6">
            <div className="space-y-4">
              <Glasses className="h-8 w-8 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Expériences immersives</p>
                <p className="text-3xl font-bold">
                  {recentSessions.filter((s) => 'type' in s).length}
                </p>
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/app/particulier/immersive')}
              >
                Commencer une expérience
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Actions rapides</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button 
            variant="secondary" 
            className="h-auto py-4 flex-col gap-2"
            onClick={() => navigate('/app/particulier/mood')}
          >
            <Heart className="h-6 w-6" />
            <span>Enregistrer mon humeur</span>
          </Button>

          {isEnabled('FF_MUSIC_THERAPY') && (
            <Button 
              variant="secondary" 
              className="h-auto py-4 flex-col gap-2"
              onClick={() => navigate('/app/particulier/music')}
            >
              <Music className="h-6 w-6" />
              <span>Musicothérapie</span>
            </Button>
          )}

          {isEnabled('FF_VR') && (
            <Button 
              variant="secondary" 
              className="h-auto py-4 flex-col gap-2"
              onClick={() => navigate('/app/particulier/immersive')}
            >
              <Glasses className="h-6 w-6" />
              <span>Expérience VR</span>
            </Button>
          )}
        </div>
      </Card>

      {/* Recent Activity */}
      {recentSessions.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Activité récente</h2>
          <div className="space-y-3">
            {recentSessions.map((session) => (
              <div 
                key={session.id} 
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  {'preset_id' in session ? (
                    <Music className="h-5 w-5 text-secondary" />
                  ) : (
                    <Glasses className="h-5 w-5 text-accent" />
                  )}
                  <div>
                    <p className="font-medium">
                      {'preset_id' in session ? 'Session musicale' : `Session ${session.type}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(session.ts_start).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <span className="text-sm px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {session.status || 'Terminée'}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default B2CDashboardPage;
