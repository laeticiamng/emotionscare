
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Mic, Music, BookOpen, Users, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const B2BUserDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Tableau de bord Collaborateur - EmotionsCare</title>
        <meta name="description" content="Votre espace collaborateur EmotionsCare" />
      </Helmet>
      
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Espace Collaborateur
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Votre bien-être au travail, notre priorité.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <Heart className="h-6 w-6 text-red-500" />
                <CardTitle className="text-lg">Scanner d'émotions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">
                Analysez votre état émotionnel
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Démarrer un scan
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-6 w-6 text-green-500" />
                <CardTitle className="text-lg">Statistiques équipe</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">
                Consultez le bien-être de l'équipe
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Voir les stats
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <Music className="h-6 w-6 text-purple-500" />
                <CardTitle className="text-lg">Musique de travail</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">
                Playlists pour la productivité
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Écouter
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-primary">78%</CardTitle>
              <p className="text-sm text-gray-600">Bien-être équipe</p>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-primary">15</CardTitle>
              <p className="text-sm text-gray-600">Collaborateurs actifs</p>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-primary">92%</CardTitle>
              <p className="text-sm text-gray-600">Satisfaction</p>
            </CardHeader>
          </Card>
        </div>
      </div>
    </>
  );
};

export default B2BUserDashboardPage;
