
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Music, 
  Scan, 
  MessageCircle, 
  VrHeadset,
  BookOpen,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

const B2BUserDashboardPage: React.FC = () => {
  const modules = [
    { name: 'Journal', icon: BookOpen, path: '/journal', color: 'text-blue-500' },
    { name: 'Scan émotionnel', icon: Scan, path: '/scan', color: 'text-green-500' },
    { name: 'Thérapie musicale', icon: Music, path: '/music', color: 'text-purple-500' },
    { name: 'Coach IA', icon: MessageCircle, path: '/coach', color: 'text-orange-500' },
    { name: 'Expérience VR', icon: VrHeadset, path: '/vr', color: 'text-cyan-500' },
  ];

  return (
    <div className="min-h-screen bg-background" data-testid="page-root">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Espace Collaborateur</h1>
          <p className="text-muted-foreground">Votre bien-être au travail avec EmotionsCare</p>
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

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-blue-500" />
                Mon bien-être
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Score de bien-être</span>
                  <span className="font-bold text-green-500">78%</span>
                </div>
                <div className="flex justify-between">
                  <span>Dernière session</span>
                  <span className="text-muted-foreground">Il y a 2 jours</span>
                </div>
                <div className="flex justify-between">
                  <span>Objectif hebdo</span>
                  <span className="text-blue-500">3/5 sessions</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-green-500" />
                Progression
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Cette semaine</span>
                  <span className="font-bold text-green-500">+5%</span>
                </div>
                <div className="flex justify-between">
                  <span>Ce mois</span>
                  <span className="font-bold text-blue-500">+12%</span>
                </div>
                <div className="flex justify-between">
                  <span>Streak actuel</span>
                  <span className="text-orange-500">4 jours</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2BUserDashboardPage;
