
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Play, Pause, ArrowLeft, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MusicPage: React.FC = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = React.useState(false);

  const playlists = [
    { name: 'Détente', description: 'Musiques apaisantes pour la relaxation', mood: 'calm' },
    { name: 'Motivation', description: 'Énergisez votre journée', mood: 'energetic' },
    { name: 'Focus', description: 'Musiques pour la concentration', mood: 'focused' },
    { name: 'Sommeil', description: 'Sons doux pour s\'endormir', mood: 'sleepy' }
  ];

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => navigate('/b2c/dashboard')}
            variant="outline"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Music className="h-8 w-8 text-purple-500" />
              Musicothérapie
            </h1>
            <p className="text-gray-600 mt-2">Musique adaptée à votre humeur du moment</p>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Lecteur Musical</CardTitle>
              <CardDescription>
                Contrôles de lecture pour votre musique thérapeutique
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-4 p-8">
                <Button
                  onClick={() => setIsPlaying(!isPlaying)}
                  size="lg"
                  className="rounded-full h-16 w-16"
                >
                  {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                </Button>
                <div className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div className="w-1/2 h-full bg-purple-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Playlists Recommandées</CardTitle>
              <CardDescription>
                Sélections musicales basées sur votre profil émotionnel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {playlists.map((playlist) => (
                  <Card key={playlist.name} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{playlist.name}</CardTitle>
                      <CardDescription>{playlist.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" size="sm" className="w-full">
                        <Play className="h-4 w-4 mr-2" />
                        Écouter
                      </Button>
                    </CardContent>
                  </Card>
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
