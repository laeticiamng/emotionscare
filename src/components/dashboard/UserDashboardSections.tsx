import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GamificationStats, VRSessionTemplate } from '@/types';
import { CalendarDays, Edit, Medal, Star } from 'lucide-react';

export interface ProgressLatestSectionProps {
  progress: GamificationStats;
}

// Section for the latest VR sessions recommended
export const RecommendedVRSection = () => {
  const recommendedSessions: VRSessionTemplate[] = [
    {
      id: '1',
      title: 'Méditation guidée',
      description: 'Une session de méditation pour la détente et le bien-être',
      duration: 10,
      tags: ['relaxation', 'débutant'],
      theme: 'nature',
      is_audio_only: true,
      preview_url: '/images/vr-preview-1.jpg',
      audio_url: '/audio/meditation-1.mp3',
      emotionTarget: 'calme',
      thumbnailUrl: '/images/vr-banner-bg.jpg'
    },
    {
      id: '2',
      title: 'Booster de confiance',
      description: 'Transformez votre état d\'esprit et augmentez votre confiance',
      duration: 15,
      tags: ['confiance', 'intermédiaire'],
      theme: 'abstrait',
      preview_url: '/images/vr-preview-2.jpg',
      emotionTarget: 'confiance',
      thumbnailUrl: '/images/vr-banner-bg.jpg'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          Sessions VR recommandées
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {recommendedSessions.map(session => (
            <div 
              key={session.id}
              className="flex flex-col md:flex-row md:items-center gap-4 p-3 bg-accent/40 rounded-lg"
            >
              <div 
                className="w-full md:w-24 h-20 rounded-md bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${session.thumbnailUrl})` }}
              />

              <div className="flex-grow">
                <h3 className="font-medium">{session.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{session.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{session.duration} min</Badge>
                  {session.emotionTarget && (
                    <Badge variant="secondary">{session.emotionTarget}</Badge>
                  )}
                  {session.is_audio_only && (
                    <Badge variant="outline">Audio uniquement</Badge>
                  )}
                </div>
              </div>

              <div className="mt-3 md:mt-0">
                <Button size="sm">Démarrer</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Section for the latest journal entries
export const JournalLatestSection = () => {
  const latestEntries = [
    { id: '1', title: 'Journée productive', date: '2023-05-15', mood: 'Positif', content: 'Aujourd\'hui a été une journée très productive...' },
    { id: '2', title: 'Réflexions sur le projet', date: '2023-05-14', mood: 'Neutre', content: 'Je dois revoir certains aspects du projet...' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit className="h-5 w-5 text-primary" />
          Journal
        </CardTitle>
      </CardHeader>
      <CardContent>
        {latestEntries.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-4">
            Aucune entrée de journal pour le moment.
          </p>
        ) : (
          <div className="space-y-4">
            {latestEntries.map(entry => (
              <div key={entry.id} className="p-3 bg-accent/40 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium">{entry.title}</h3>
                  <Badge variant="outline">{entry.mood}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {new Date(entry.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <p className="text-sm line-clamp-2">{entry.content}</p>
                <div className="mt-3 text-right">
                  <Button size="sm" variant="ghost">Lire plus</Button>
                </div>
              </div>
            ))}
            <div className="text-center pt-2">
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Nouvelle entrée
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const MoodHistorySection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          Historique d'humeur
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: 28 }).map((_, i) => {
            const value = Math.random();
            let bgColor = 'bg-red-100 dark:bg-red-900/30';
            
            if (value > 0.7) bgColor = 'bg-green-100 dark:bg-green-900/30';
            else if (value > 0.4) bgColor = 'bg-yellow-100 dark:bg-yellow-900/30';
            
            return (
              <div 
                key={i}
                className={`w-6 h-6 rounded-sm ${bgColor} cursor-pointer`}
                title={`${new Date(Date.now() - (27-i) * 24 * 60 * 60 * 1000).toLocaleDateString()}: ${Math.round(value * 100)}% positive`}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export const ProgressLatestSection: React.FC<ProgressLatestSectionProps> = ({
  progress
}) => {
  // Calculate progress percentage
  const progressPercentage = progress.progress * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Medal className="h-5 w-5 text-primary" />
          Votre progression
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Niveau {progress.level}</p>
              <p className="text-xs text-muted-foreground">
                {progress.points} points
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
              {progress.level}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Vers Niveau {progress.nextLevel.level}</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-border flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Série active</p>
              <p className="text-xs text-muted-foreground">
                {progress.streak} jours consécutifs
              </p>
            </div>
            <Button size="sm" variant="outline">
              Voir plus
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
