
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Brain, Music, Camera, BookOpen, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const B2CDashboardPage: React.FC = () => {
  const modules = [
    {
      title: 'Scan Émotionnel',
      description: 'Analysez vos émotions en temps réel',
      icon: Camera,
      href: '/b2c/scan',
      color: 'bg-blue-500',
    },
    {
      title: 'Coach IA',
      description: 'Votre assistant personnel pour le bien-être',
      icon: Brain,
      href: '/b2c/coach',
      color: 'bg-green-500',
    },
    {
      title: 'Musicothérapie',
      description: 'Musique adaptée à vos émotions',
      icon: Music,
      href: '/b2c/music',
      color: 'bg-purple-500',
    },
    {
      title: 'Journal Émotionnel',
      description: 'Suivez votre parcours émotionnel',
      icon: BookOpen,
      href: '/b2c/journal',
      color: 'bg-orange-500',
    },
    {
      title: 'Communauté',
      description: 'Partagez avec d\'autres utilisateurs',
      icon: Users,
      href: '/b2c/social',
      color: 'bg-pink-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Bienvenue dans votre espace bien-être personnel
          </p>
        </div>
        <Heart className="h-8 w-8 text-pink-500" />
      </div>

      {/* Welcome Card */}
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            Comment vous sentez-vous aujourd'hui ?
          </CardTitle>
          <CardDescription>
            Prenez un moment pour scanner vos émotions et découvrir la musique parfaite pour votre humeur.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/b2c/scan">
            <Button className="bg-pink-500 hover:bg-pink-600">
              Commencer un scan émotionnel
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {modules.map((module) => {
          const IconComponent = module.icon;
          return (
            <Card key={module.href} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${module.color}`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link to={module.href}>
                  <Button variant="outline" className="w-full">
                    Accéder
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
          <CardDescription>
            Vos dernières sessions et progrès
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Camera className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Scan émotionnel</p>
                  <p className="text-sm text-muted-foreground">Il y a 2 heures</p>
                </div>
              </div>
              <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                Joie
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Music className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-medium">Session musicale</p>
                  <p className="text-sm text-muted-foreground">Hier</p>
                </div>
              </div>
              <span className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">
                15 min
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="font-medium">Entrée de journal</p>
                  <p className="text-sm text-muted-foreground">Il y a 3 jours</p>
                </div>
              </div>
              <span className="text-sm bg-orange-100 text-orange-700 px-2 py-1 rounded">
                Réflexion
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2CDashboardPage;
