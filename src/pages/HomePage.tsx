
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Heart, 
  Zap, 
  Users, 
  BarChart3, 
  Settings,
  FileText,
  CheckCircle
} from 'lucide-react';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: 'Glow Experiences',
      description: 'Flash Glow, Filtres AR, Bubble-Beat, VR Galactique',
      status: 'partial',
      link: '/glow'
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: 'Bien-être',
      description: 'Journal, Musicothérapie, Scan émotionnel, Breathwork',
      status: 'partial',
      link: '/wellness'
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: 'Dashboard',
      description: 'Widgets Glow, Barres hebdo, Heatmap RH',
      status: 'implemented',
      link: '/dashboard'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Gamification',
      description: 'Leaderboard, badges, défis collaboratifs',
      status: 'missing',
      link: '/gamification'
    },
    {
      icon: <Settings className="h-8 w-8" />,
      title: 'Paramètres',
      description: 'Privacy toggles, export CSV, suppression compte',
      status: 'missing',
      link: '/settings'
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: 'Audit Projet',
      description: 'État complet des fonctionnalités et du développement',
      status: 'implemented',
      link: '/audit'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'implemented':
        return <Badge className="bg-green-100 text-green-800">Prêt</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-100 text-yellow-800">En cours</Badge>;
      case 'missing':
        return <Badge className="bg-red-100 text-red-800">À faire</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          EmotionsCare
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Plateforme de bien-être émotionnel avec intelligence artificielle, 
          réalité virtuelle et monitoring physiologique
        </p>
        <div className="mt-6">
          <Link to="/audit">
            <Button size="lg" className="mr-4">
              <CheckCircle className="h-5 w-5 mr-2" />
              Voir l'Audit Complet
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" size="lg">
              <BarChart3 className="h-5 w-5 mr-2" />
              Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
                {getStatusBadge(feature.status)}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {feature.description}
              </p>
              <Link to={feature.link}>
                <Button variant="outline" className="w-full">
                  Explorer
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 bg-muted/50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">État du Projet</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">8</div>
            <div className="text-sm text-muted-foreground">Fonctionnalités prêtes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">12</div>
            <div className="text-sm text-muted-foreground">En développement</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">15</div>
            <div className="text-sm text-muted-foreground">À implémenter</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">35</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
