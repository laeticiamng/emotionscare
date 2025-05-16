
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VRSessionTemplate } from '@/types';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Clock, Calendar } from 'lucide-react';

export const JournalLatestSection: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Votre dernier journal</CardTitle>
        <CardDescription>Il y a 2 jours</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Ma journée productive</h3>
          <p className="text-muted-foreground line-clamp-3">
            Aujourd'hui a été une journée particulièrement productive. J'ai réussi à terminer plusieurs tâches
            importantes et je me sens vraiment satisfait de mon travail...
          </p>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">Humeur:</span>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full dark:bg-green-800/30 dark:text-green-300">
                Satisfaction
              </span>
            </div>
            <Button variant="outline" size="sm">Continuer à écrire</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const RecommendedVRSection: React.FC = () => {
  const recommendedSession: VRSessionTemplate = {
    id: '123',
    title: 'Méditation sur la plage',
    description: 'Une session relaxante avec le bruit des vagues',
    duration: 15,
    tags: ['relaxation', 'nature', 'débutant'],
    theme: 'nature',
    is_audio_only: true,
    preview_url: '/assets/previews/beach-meditation.mp4',
    audio_url: '/assets/audio/beach-waves.mp3',
    vr_url: '/vr/beach-scene',
    thumbnailUrl: '/assets/thumbnails/beach.jpg',
    emotionTarget: 'calm'
  };

  const audioOnlySession = {
    id: '124',
    title: 'Respiration guidée',
    description: 'Technique de respiration pour la relaxation',
    duration: 10,
    tags: ['respiration', 'relaxation', 'débutant'],
    theme: 'mindfulness',
    is_audio_only: true,
    preview_url: '/assets/previews/guided-breathing.mp4',
    audio_url: '/assets/audio/guided-breathing.mp3',
    vr_url: '',
    thumbnailUrl: '/assets/thumbnails/breathing.jpg',
    emotionTarget: 'calm'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommandations pour vous</CardTitle>
        <CardDescription>Basées sur votre humeur récente</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-1 flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-amber-500" />
              Session recommandée
            </h3>
            <div className="bg-muted rounded-lg p-4">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-secondary/20 rounded-md overflow-hidden flex-shrink-0">
                  {/* Placeholder for thumbnail */}
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600"></div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{recommendedSession.title}</h4>
                  <p className="text-sm text-muted-foreground">{recommendedSession.description}</p>
                  <div className="flex items-center mt-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {recommendedSession.duration} minutes
                  </div>
                  <div className="flex gap-2 mt-2">
                    {recommendedSession.tags?.map((tag) => (
                      <span 
                        key={tag}
                        className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <Button className="w-full mt-4" size="sm">Démarrer la session</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-secondary/20 rounded-md overflow-hidden flex-shrink-0">
                  {/* Placeholder for thumbnail */}
                  <div className="w-full h-full bg-gradient-to-br from-green-400 to-teal-600"></div>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Méditation guidée</h4>
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    8 minutes
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-secondary/20 rounded-md overflow-hidden flex-shrink-0">
                  {/* Placeholder for thumbnail */}
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-600"></div>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Forêt apaisante</h4>
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    12 minutes
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ProgressLatestSection: React.FC<{ progress: any }> = ({ progress }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Votre progression</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Niveau {progress.level}</span>
              <span className="text-sm text-muted-foreground">
                {progress.points} / {progress.nextLevel.points} points
              </span>
            </div>
            <Progress value={progress.progress * 100} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">Streak actuel</p>
              <p className="text-xl font-bold">{progress.streak} jours</p>
            </div>
            <div className="bg-muted rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">Points</p>
              <p className="text-xl font-bold">{progress.points}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Il vous manque {progress.nextLevel.points - progress.points} points pour le niveau {progress.nextLevel.level}
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Voir toutes vos récompenses
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const MoodHistorySection: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique d'humeur</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="bg-muted w-10 h-10 rounded-full flex items-center justify-center">
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <div className="flex items-center">
                  <span className="font-medium">
                    {i === 0 ? 'Aujourd\'hui' : i === 1 ? 'Hier' : `Il y a ${i} jours`}
                  </span>
                  <span 
                    className={`ml-2 w-2 h-2 rounded-full ${
                      i % 3 === 0 ? 'bg-green-500' : i % 3 === 1 ? 'bg-blue-500' : 'bg-amber-500'
                    }`}
                  ></span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {i % 3 === 0 ? 'Calme' : i % 3 === 1 ? 'Joyeux' : 'Concentré'}
                </p>
              </div>
            </div>
          ))}
          
          <Button variant="link" size="sm" className="w-full mt-2">
            Voir l'historique complet
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
