
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Users, 
  TrendingUp, 
  Calendar,
  Activity,
  Music,
  BookOpen,
  Headphones,
  Clock,
  ArrowRight
} from 'lucide-react';

const B2BUserDashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { 
      title: 'Scans émotionnels', 
      value: '12', 
      subtitle: 'Cette semaine', 
      icon: Heart,
      action: () => navigate('/emotions')
    },
    { 
      title: 'Séances de coaching', 
      value: '8', 
      subtitle: 'Ce mois', 
      icon: Users,
      action: () => navigate('/coach')
    },
    { 
      title: 'Bien-être moyen', 
      value: '7,2/10', 
      subtitle: '+0,5 par rapport au dernier mois', 
      icon: TrendingUp
    },
    { 
      title: 'Prochaine séance', 
      value: '2h', 
      subtitle: 'Coaching 1:1', 
      icon: Calendar
    }
  ];

  const features = [
    {
      title: 'Scan émotionnel',
      description: 'Analysez votre état émotionnel quotidien',
      icon: Activity,
      action: () => navigate('/emotions')
    },
    {
      title: 'Thérapie musicale',
      description: 'Playlist personnalisée selon votre humeur',
      icon: Music,
      action: () => navigate('/music')
    },
    {
      title: 'Personnel du journal',
      description: 'Suivez votre progression au quotidien',
      icon: BookOpen,
      action: () => navigate('/journal')
    }
  ];

  const recommendations = [
    {
      title: 'Séance de méditation',
      description: 'Basée sur vos derniers résultats de scan émotionnels',
      color: 'bg-blue-100 text-blue-800',
      action: () => navigate('/music')
    },
    {
      title: 'Exercice de respiration',
      description: 'Pour réduire le stress identifié',
      color: 'bg-green-100 text-green-800',
      action: () => navigate('/emotions')
    },
    {
      title: 'Playlist énergisante',
      description: 'Pour améliorer votre motivation',
      color: 'bg-purple-100 text-purple-800',
      action: () => navigate('/music')
    }
  ];

  return (
    <div data-testid="page-root" className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de bord utilisateur B2B</h1>
          <p className="text-gray-600">Bienvenue dans votre espace professionnel de bien-être</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className={`cursor-pointer hover:shadow-lg transition-all duration-300 ${stat.action ? 'hover:scale-105' : ''}`}
              onClick={stat.action}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                  {stat.action && <ArrowRight className="h-4 w-4 text-gray-400" />}
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm font-medium text-gray-900">{stat.title}</p>
                  <p className="text-xs text-gray-500">{stat.subtitle}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Fonctionnalités disponibles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Headphones className="h-5 w-5 mr-2" />
                Fonctionnalités disponibles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={feature.action}
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-500">{feature.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recommandations personnalisées */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Recommandations personnalisées
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendations.map((rec, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-lg border hover:shadow-md cursor-pointer transition-all"
                  onClick={rec.action}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium">{rec.title}</h3>
                    <Badge className={rec.color}>Recommandé</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                  <Button size="sm" variant="outline" className="w-full">
                    Commencer <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2BUserDashboard;
