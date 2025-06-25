
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Music, 
  Scan, 
  MessageCircle, 
  Gamepad2, 
  VrHeadset,
  BookOpen,
  Settings 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const B2CDashboardPage: React.FC = () => {
  const modules = [
    { name: 'Journal', icon: BookOpen, path: '/journal', color: 'text-blue-500' },
    { name: 'Scan émotionnel', icon: Scan, path: '/scan', color: 'text-green-500' },
    { name: 'Thérapie musicale', icon: Music, path: '/music', color: 'text-purple-500' },
    { name: 'Coach IA', icon: MessageCircle, path: '/coach', color: 'text-orange-500' },
    { name: 'Expérience VR', icon: VrHeadset, path: '/vr', color: 'text-cyan-500' },
    { name: 'Gamification', icon: Gamepad2, path: '/gamification', color: 'text-red-500' },
  ];

  return (
    <div className="min-h-screen bg-background" data-testid="page-root">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tableau de bord personnel</h1>
          <p className="text-muted-foreground">Bienvenue dans votre espace bien-être EmotionsCare</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {modules.map((module) => (
            <Link key={module.name} to={module.path}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader className="text-center">
                  <module.icon className={`h-12 w-12 mx-auto mb-4 ${module.color}`} />
                  <CardTitle>{module.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <Button variant="outline" className="w-full">
                    Accéder
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-500" />
              Résumé de votre bien-être
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">85%</div>
                <div className="text-sm text-muted-foreground">Score de bien-être</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">12</div>
                <div className="text-sm text-muted-foreground">Entrées journal</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">7</div>
                <div className="text-sm text-muted-foreground">Jours consécutifs</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link to="/settings">
            <Button variant="ghost" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Paramètres
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default B2CDashboardPage;
