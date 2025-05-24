
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Heart, 
  Music, 
  BookOpen, 
  TrendingUp, 
  Smile,
  Calendar,
  Award,
  Target,
  Users
} from 'lucide-react';
import { toast } from 'sonner';

const B2CDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [emotionalScore, setEmotionalScore] = useState(75);
  const [weeklyGoal, setWeeklyGoal] = useState(5);
  const [completedSessions, setCompletedSessions] = useState(3);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const quickActions = [
    {
      title: 'Scanner d\'émotions',
      description: 'Analysez votre état émotionnel',
      icon: <Brain className="h-6 w-6" />,
      path: '/scan',
      color: 'bg-blue-500'
    },
    {
      title: 'Coach IA',
      description: 'Accompagnement personnalisé',
      icon: <Heart className="h-6 w-6" />,
      path: '/coach',
      color: 'bg-red-500'
    },
    {
      title: 'Musique thérapeutique',
      description: 'Sons apaisants personnalisés',
      icon: <Music className="h-6 w-6" />,
      path: '/music',
      color: 'bg-purple-500'
    },
    {
      title: 'Journal personnel',
      description: 'Exprimez vos pensées',
      icon: <BookOpen className="h-6 w-6" />,
      path: '/journal',
      color: 'bg-green-500'
    }
  ];

  const handleQuickAction = (path: string) => {
    setIsLoading(true);
    navigate(path);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="container mx-auto space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="container mx-auto space-y-6">
        {/* En-tête de bienvenue */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Bonjour {user?.name || 'Utilisateur'} 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Voici votre tableau de bord personnel EmotionsCare
          </p>
        </div>

        {/* Indicateurs clés */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Score émotionnel</CardTitle>
              <Smile className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{emotionalScore}%</div>
              <Progress value={emotionalScore} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                +12% depuis la semaine dernière
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Objectif hebdomadaire</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedSessions}/{weeklyGoal}</div>
              <Progress value={(completedSessions / weeklyGoal) * 100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Sessions de bien-être complétées
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Série de réussites</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7 jours</div>
              <p className="text-xs text-muted-foreground mt-2">
                Votre plus longue série active
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Actions rapides */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Card 
                key={index} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleQuickAction(action.path)}
              >
                <CardHeader>
                  <div className={`${action.color} w-12 h-12 rounded-full flex items-center justify-center text-white mb-2`}>
                    {action.icon}
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full">
                    Commencer →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Activité récente */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Progression cette semaine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Scans émotionnels</span>
                  <span className="text-sm font-medium">5 complétés</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Sessions de méditation</span>
                  <span className="text-sm font-medium">3 complétées</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Entrées journal</span>
                  <span className="text-sm font-medium">7 écrites</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Prochaines sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <span className="text-sm">Méditation guidée</span>
                  <span className="text-xs text-muted-foreground">Aujourd'hui 18h</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <span className="text-sm">Check-in émotionnel</span>
                  <span className="text-xs text-muted-foreground">Demain 9h</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <span className="text-sm">Session coaching</span>
                  <span className="text-xs text-muted-foreground">Vendredi 14h</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2CDashboardPage;
