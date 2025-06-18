
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Music, Play, Pause, SkipForward, Volume2, Heart } from 'lucide-react';

const MusicTherapyPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState('Méditation Matinale');

  const playlists = [
    { id: 1, name: 'Relaxation Profonde', mood: 'Calme', tracks: 12, duration: '45 min' },
    { id: 2, name: 'Énergie Positive', mood: 'Joyeux', tracks: 15, duration: '52 min' },
    { id: 3, name: 'Focus & Concentration', mood: 'Concentré', tracks: 18, duration: '68 min' },
    { id: 4, name: 'Sommeil Réparateur', mood: 'Paisible', tracks: 10, duration: '38 min' }
  ];

  const recommendations = [
    { title: 'Sons de la Nature', type: 'Ambiance', emotion: 'Stress' },
    { title: 'Musique Classique Douce', type: 'Instrumentale', emotion: 'Anxiété' },
    { title: 'Fréquences Binaurales', type: 'Thérapeutique', emotion: 'Insomnie' }
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Musicothérapie</h1>
        <p className="text-muted-foreground">
          Découvrez le pouvoir guérisseur de la musique adaptée à vos émotions
        </p>
      </div>

      <Tabs defaultValue="player" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="player">Lecteur</TabsTrigger>
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
          <TabsTrigger value="therapy">Thérapie</TabsTrigger>
        </TabsList>

        <TabsContent value="player">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  Lecteur Musical
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="w-48 h-48 mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                    <Music className="h-16 w-16 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{currentTrack}</h3>
                    <p className="text-muted-foreground">Playlist Relaxation</p>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full">
                    <div className="bg-primary h-2 rounded-full w-1/3"></div>
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <Button variant="outline" size="icon">
                      <SkipForward className="h-4 w-4 rotate-180" />
                    </Button>
                    <Button 
                      size="lg"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-16 h-16 rounded-full"
                    >
                      {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </Button>
                    <Button variant="outline" size="icon">
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    <div className="flex-1 bg-muted h-2 rounded-full">
                      <div className="bg-primary h-2 rounded-full w-2/3"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Recommandations Personnalisées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{rec.title}</h4>
                        <Button size="sm" variant="ghost">
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.type}</p>
                      <span className="inline-block mt-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        Pour: {rec.emotion}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="playlists">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {playlists.map((playlist) => (
              <Card key={playlist.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{playlist.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Humeur cible:</span>
                      <span className="font-medium">{playlist.mood}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Pistes:</span>
                      <span className="font-medium">{playlist.tracks}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Durée:</span>
                      <span className="font-medium">{playlist.duration}</span>
                    </div>
                  </div>
                  <Button className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Écouter
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="therapy">
          <Card>
            <CardHeader>
              <CardTitle>Séances de Musicothérapie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-6 border rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Gestion du Stress</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Séance de 20 minutes avec sons binauraux
                  </p>
                  <Button>Commencer</Button>
                </div>
                <div className="text-center p-6 border rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Améliorer le Sommeil</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Mélodies apaisantes pour l'endormissement
                  </p>
                  <Button>Commencer</Button>
                </div>
                <div className="text-center p-6 border rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Boost d'Énergie</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Rythmes dynamiques pour la motivation
                  </p>
                  <Button>Commencer</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MusicTherapyPage;
