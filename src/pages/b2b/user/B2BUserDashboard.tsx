
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Music, 
  BookOpen, 
  Scan, 
  MessageCircle, 
  Headphones,
  Users,
  Trophy,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const B2BUserDashboard: React.FC = () => {
  const navigate = useNavigate();

  const navigationCards = [
    {
      title: 'Journal Émotionnel',
      description: 'Suivez vos émotions au quotidien',
      icon: BookOpen,
      path: '/b2c/journal',
      color: 'bg-blue-500'
    },
    {
      title: 'Scan Émotionnel',
      description: 'Analysez votre état émotionnel',
      icon: Scan,
      path: '/b2c/scan',
      color: 'bg-green-500'
    },
    {
      title: 'Musique Thérapeutique',
      description: 'Écoutez de la musique adaptée',
      icon: Music,
      path: '/b2c/music',
      color: 'bg-purple-500'
    },
    {
      title: 'Coach IA',
      description: 'Obtenez des conseils personnalisés',
      icon: MessageCircle,
      path: '/b2c/coach',
      color: 'bg-orange-500'
    },
    {
      title: 'Expériences VR',
      description: 'Immersion thérapeutique',
      icon: Headphones,
      path: '/b2c/vr',
      color: 'bg-cyan-500'
    }
  ];

  const weeklyStats = {
    emotionalBalance: 75,
    sessionsCompleted: 12,
    streakDays: 7,
    teamRanking: 3
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tableau de Bord Collaborateur</h1>
          <p className="text-muted-foreground">
            Bienvenue dans votre espace de bien-être en entreprise
          </p>
        </div>
        <Button onClick={() => navigate('/b2c/settings')}>
          Paramètres
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Équilibre Émotionnel</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyStats.emotionalBalance}%</div>
            <Progress value={weeklyStats.emotionalBalance} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions cette semaine</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyStats.sessionsCompleted}</div>
            <p className="text-xs text-muted-foreground">+3 depuis la semaine dernière</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Série actuelle</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyStats.streakDays} jours</div>
            <p className="text-xs text-muted-foreground">Continue comme ça !</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classement équipe</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#{weeklyStats.teamRanking}</div>
            <p className="text-xs text-muted-foreground">Sur 15 membres</p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation principale */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Vos Outils de Bien-être</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {navigationCards.map((card) => (
            <Card 
              key={card.path} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(card.path)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center`}>
                    <card.icon className="h-5 w-5 text-white" />
                  </div>
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Activité récente et recommandations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activité Récente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Scan className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Scan émotionnel complété</p>
                <p className="text-xs text-muted-foreground">Il y a 2 heures</p>
              </div>
              <Badge variant="outline">Calme</Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Music className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Session musicale</p>
                <p className="text-xs text-muted-foreground">Hier à 14:30</p>
              </div>
              <Badge variant="outline">15 min</Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Entrée journal</p>
                <p className="text-xs text-muted-foreground">Hier à 9:15</p>
              </div>
              <Badge variant="outline">Productif</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommandations du Jour</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-sm mb-1">Session de respiration</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Recommandée pour réduire le stress matinal
              </p>
              <Button size="sm" variant="outline">
                Commencer (5 min)
              </Button>
            </div>
            
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-sm mb-1">Musique focus</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Playlist optimisée pour votre période de concentration
              </p>
              <Button size="sm" variant="outline">
                Écouter
              </Button>
            </div>
            
            <div className="p-3 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-sm mb-1">Check-in émotionnel</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Comment vous sentez-vous après votre pause déjeuner ?
              </p>
              <Button size="sm" variant="outline">
                Faire le point
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BUserDashboard;
