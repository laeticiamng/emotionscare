
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Mic, Music, BookOpen, Users, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const B2CDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Scanner mes émotions",
      description: "Analysez vos émotions en temps réel",
      icon: Heart,
      path: "/b2c/scan",
      color: "text-red-500"
    },
    {
      title: "Journal personnel", 
      description: "Écrivez vos pensées et émotions",
      icon: BookOpen,
      path: "/b2c/journal",
      color: "text-blue-500"
    },
    {
      title: "Musique thérapeutique",
      description: "Découvrez la musique adaptée à votre humeur",
      icon: Music,
      path: "/b2c/music",
      color: "text-purple-500"
    },
    {
      title: "Coach IA",
      description: "Discutez avec votre coach personnel",
      icon: Zap,
      path: "/b2c/coach",
      color: "text-green-500"
    },
    {
      title: "Communauté",
      description: "Partagez avec d'autres utilisateurs",
      icon: Users,
      path: "/b2c/social",
      color: "text-orange-500"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Tableau de bord - EmotionsCare</title>
        <meta name="description" content="Votre espace personnel EmotionsCare" />
      </Helmet>
      
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Bienvenue sur EmotionsCare
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Votre espace personnel pour explorer, comprendre et améliorer votre bien-être émotionnel.
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Card 
                key={action.title} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(action.path)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <IconComponent className={`h-6 w-6 ${action.color}`} />
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">
                    {action.description}
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Accéder
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-primary">12</CardTitle>
              <p className="text-sm text-gray-600">Entrées de journal</p>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-primary">85%</CardTitle>
              <p className="text-sm text-gray-600">Score de bien-être</p>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-primary">7</CardTitle>
              <p className="text-sm text-gray-600">Jours consécutifs</p>
            </CardHeader>
          </Card>
        </div>
      </div>
    </>
  );
};

export default B2CDashboardPage;
