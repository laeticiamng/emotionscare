
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Music, Clock, BarChart2, User, HeartPulse } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import useMusicStats from '@/hooks/useMusicStats';
import { UnifiedEmptyState as EmptyState } from '@/components/ui/unified-empty-state';

const MusicStatistics: React.FC = () => {
  const { user } = useAuth();
  const { stats, formatListeningTime, hasData, isLoading } = useMusicStats(user?.id);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <span className="ml-2 text-muted-foreground">Chargement des statistiques...</span>
      </div>
    );
  }

  if (!hasData) {
    return (
      <EmptyState 
        title="Aucune donnée d'écoute disponible"
        description="Commencez à écouter de la musique pour voir apparaître vos statistiques."
        icon={<Music className="h-12 w-12 text-muted-foreground" />}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard 
          title="Temps d'écoute total"
          value={formatListeningTime(stats.totalListeningTime)}
          icon={<Clock className="h-4 w-4" />}
        />
        <StatCard 
          title="Genre le plus écouté"
          value={stats.mostPlayedGenre}
          icon={<Music className="h-4 w-4" />}
        />
        <StatCard 
          title="Morceau favori"
          value={stats.mostPlayedTrack}
          icon={<BarChart2 className="h-4 w-4" />}
        />
        <StatCard 
          title="Artiste préféré"
          value={stats.mostPlayedArtist}
          icon={<User className="h-4 w-4" />}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recommandation basée sur vos émotions</CardTitle>
          <CardDescription>
            En fonction de vos scans émotionnels et de votre historique d'écoute
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <HeartPulse className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Émotion dominante</p>
              <p className="font-medium text-lg capitalize">{stats.favoriteEmotion}</p>
              <p className="text-sm mt-1">
                Nous vous recommandons des morceaux apaisants pour maintenir votre équilibre émotionnel.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Composant pour afficher une statistique individuelle
const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ 
  title, 
  value, 
  icon
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-semibold mt-1">{value}</p>
          </div>
          <div className="bg-primary/10 p-3 rounded-full">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicStatistics;
