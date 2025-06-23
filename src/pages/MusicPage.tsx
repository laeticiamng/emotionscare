
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Play, Headphones, Radio } from 'lucide-react';

const MusicPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 pt-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Musicothérapie
          </h1>
          <p className="text-xl text-gray-600">
            Musique thérapeutique adaptée à votre état émotionnel
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-purple-100 rounded-full w-fit">
                <Music className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle>Playlist Adaptive</CardTitle>
              <CardDescription>
                Musique qui s'adapte à vos émotions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Notre IA crée des playlists personnalisées basées sur votre état émotionnel actuel.
              </p>
              <Button className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Écouter maintenant
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full w-fit">
                <Headphones className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>Séances Guidées</CardTitle>
              <CardDescription>
                Méditation musicale avec guidage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Sessions de relaxation guidées avec musique thérapeutique et instructions vocales.
              </p>
              <Button className="w-full">Commencer une séance</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-green-100 rounded-full w-fit">
                <Radio className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>Radio Zen</CardTitle>
              <CardDescription>
                Flux continu de musique apaisante
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Radio en continu avec de la musique sélectionnée pour favoriser la concentration et la détente.
              </p>
              <Button className="w-full">Écouter la radio</Button>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Votre bibliothèque musicale</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">Playlists favorites</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>Détente du matin</span>
                  <Button size="sm" variant="ghost">
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>Focus travail</span>
                  <Button size="sm" variant="ghost">
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>Relaxation du soir</span>
                  <Button size="sm" variant="ghost">
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">Recommandations</h3>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 mb-2">Basé sur votre état actuel :</p>
                <p className="font-medium text-blue-900">Musique de méditation zen</p>
                <Button size="sm" className="mt-2">Écouter</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link to="/">
            <Button variant="outline">← Retour à l'accueil</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MusicPage;
