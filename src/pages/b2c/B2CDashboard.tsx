
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  BookOpen, 
  Scan, 
  Music, 
  Bot, 
  Headphones, 
  Settings,
  TrendingUp,
  Clock,
  Target
} from 'lucide-react';

const B2CDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const dashboardCards = [
    {
      title: 'Journal Émotionnel',
      description: 'Suivez votre parcours émotionnel',
      icon: BookOpen,
      path: '/b2c/journal',
      color: 'bg-blue-500'
    },
    {
      title: 'Scan Émotionnel',
      description: 'Analysez votre état en temps réel',
      icon: Scan,
      path: '/b2c/scan',
      color: 'bg-green-500'
    },
    {
      title: 'Musique Thérapeutique',
      description: 'Musique adaptée à votre humeur',
      icon: Music,
      path: '/b2c/music',
      color: 'bg-purple-500'
    },
    {
      title: 'Coach IA',
      description: 'Accompagnement personnalisé',
      icon: Bot,
      path: '/b2c/coach',
      color: 'bg-orange-500'
    },
    {
      title: 'Expériences VR',
      description: 'Immersion relaxante',
      icon: Headphones,
      path: '/b2c/vr',
      color: 'bg-indigo-500'
    },
    {
      title: 'Paramètres',
      description: 'Configurez votre expérience',
      icon: Settings,
      path: '/b2c/settings',
      color: 'bg-gray-500'
    }
  ];

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Bonjour, {user?.name || user?.email?.split('@')[0]} !
          </h1>
          <p className="text-muted-foreground">
            Votre espace personnel EmotionsCare
          </p>
        </div>
        <Button variant="outline" onClick={logout}>
          Déconnexion
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score de bien-être</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.2/10</div>
            <p className="text-xs text-muted-foreground">+0.3 depuis hier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps de méditation</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15 min</div>
            <p className="text-xs text-muted-foreground">Aujourd'hui</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Objectifs atteints</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3/5</div>
            <p className="text-xs text-muted-foreground">Cette semaine</p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card 
              key={card.path} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(card.path)}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${card.color} text-white`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{card.title}</CardTitle>
                    <CardDescription>{card.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Accéder
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Actions rapides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => navigate('/b2c/scan')}>
              Scan rapide
            </Button>
            <Button variant="outline" onClick={() => navigate('/b2c/journal')}>
              Nouvelle entrée
            </Button>
            <Button variant="outline" onClick={() => navigate('/b2c/music')}>
              Musique relaxante
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2CDashboard;
