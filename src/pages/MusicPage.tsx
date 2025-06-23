
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, Play, Pause, SkipForward, Volume2, Heart, Brain } from 'lucide-react';

const MusicPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  
  const playlists = [
    {
      id: 1,
      name: "Sérénité",
      description: "Musiques apaisantes pour la relaxation",
      emotion: "calm",
      tracks: 12,
      duration: "45 min",
      color: "blue"
    },
    {
      id: 2,
      name: "Énergie Positive",
      description: "Morceaux dynamisants pour retrouver la motivation",
      emotion: "energetic",
      tracks: 18,
      duration: "62 min",
      color: "green"
    },
    {
      id: 3,
      name: "Focus Profond",
      description: "Sons binauraux pour la concentration",
      emotion: "focused",
      tracks: 8,
      duration: "35 min",
      color: "purple"
    }
  ];

  const currentPlaylist = playlists[0];

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Music className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Musicothérapie
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez des playlists adaptées à votre état émotionnel
          </p>
        </div>

        {/* Current Player */}
        <Card className="max-w-2xl mx-auto mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span>En cours de lecture</span>
                </CardTitle>
                <CardDescription>
                  Adapté à votre profil émotionnel
                </CardDescription>
              </div>
              <Brain className="h-8 w-8 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">{currentPlaylist.name}</h3>
              <p className="text-muted-foreground">{currentPlaylist.description}</p>
            </div>
            
            <div className="flex items-center justify-center space-x-4">
              <Button variant="outline" size="icon">
                <SkipForward className="h-4 w-4 rotate-180" />
              </Button>
              
              <Button 
                size="lg" 
                onClick={() => setIsPlaying(!isPlaying)}
                className="rounded-full w-14 h-14"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
              
              <Button variant="outline" size="icon">
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1 h-2 bg-muted rounded-full">
                <div className="w-3/4 h-full bg-primary rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Playlists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {playlists.map((playlist) => (
            <Card 
              key={playlist.id} 
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => setCurrentTrack(playlist.id)}
            >
              <CardHeader>
                <div className={`w-full h-32 bg-gradient-to-br from-${playlist.color}-500/20 to-${playlist.color}-600/30 rounded-lg flex items-center justify-center mb-4`}>
                  <Music className={`h-12 w-12 text-${playlist.color}-600`} />
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">
                  {playlist.name}
                </CardTitle>
                <CardDescription>
                  {playlist.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-muted-foreground mb-4">
                  <span>{playlist.tracks} titres</span>
                  <span>{playlist.duration}</span>
                </div>
                <Button 
                  className="w-full" 
                  variant={currentTrack === playlist.id ? "default" : "outline"}
                >
                  {currentTrack === playlist.id ? (
                    <>
                      <Pause className="mr-2 h-4 w-4" />
                      En cours
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Écouter
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recommendations */}
        <Card className="max-w-4xl mx-auto mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-primary" />
              <span>Recommandations personnalisées</span>
            </CardTitle>
            <CardDescription>
              Basées sur votre dernière analyse émotionnelle
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Pour des recommandations plus précises, effectuez d'abord un scan émotionnel
              </p>
              <Button asChild>
                <a href="/scan">
                  Scanner mes émotions
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MusicPage;
