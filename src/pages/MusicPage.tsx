
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Play, Pause, SkipForward, SkipBack } from 'lucide-react';

const MusicPage: React.FC = () => {
  const musicRecommendations = [
    { title: "Calm Meditation", genre: "Ambient", duration: "10:30" },
    { title: "Focus Flow", genre: "Lo-fi", duration: "8:45" },
    { title: "Energy Boost", genre: "Upbeat", duration: "6:20" }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Music className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Musique Thérapeutique</h1>
          </div>
          <p className="text-muted-foreground">
            Musiques personnalisées selon votre état émotionnel
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lecteur Audio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="w-48 h-48 mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                  <Music className="h-24 w-24 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Musique Relaxante</h3>
                  <p className="text-muted-foreground">Séance de méditation - 12:30</p>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <Button variant="outline" size="icon">
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button size="icon" className="h-12 w-12">
                    <Play className="h-6 w-6" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommandations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {musicRecommendations.map((track, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Button variant="ghost" size="icon">
                        <Play className="h-4 w-4" />
                      </Button>
                      <div>
                        <p className="font-medium">{track.title}</p>
                        <p className="text-sm text-muted-foreground">{track.genre}</p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{track.duration}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MusicPage;
