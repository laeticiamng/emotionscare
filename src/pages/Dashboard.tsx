import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Scan, 
  Music, 
  MessageCircle, 
  BookOpen, 
  Zap, 
  TrendingUp,
  Calendar,
  Target,
  Award,
  Activity
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const modules = [
    {
      icon: Scan,
      title: 'Scanner d\'émotions',
      description: 'Analysez vos émotions via texte, voix ou vidéo',
      path: '/scan',
      color: 'bg-blue-500',
      progress: 75
    },
    {
      icon: Music,
      title: 'Musicothérapie',
      description: 'Musique personnalisée selon votre état émotionnel',
      path: '/music',
      color: 'bg-purple-500',
      progress: 60
    },
    {
      icon: MessageCircle,
      title: 'Coach IA',
      description: 'Conversation avec votre assistant bien-être',
      path: '/coach',
      color: 'bg-green-500',
      progress: 85
    },
    {
      icon: BookOpen,
      title: 'Journal émotionnel',
      description: 'Suivez votre évolution jour après jour',
      path: '/journal',
      color: 'bg-orange-500',
      progress: 45
    },
    {
      icon: Zap,
      title: 'Expérience VR',
      description: 'Relaxation immersive en réalité virtuelle',
      path: '/vr',
      color: 'bg-cyan-500',
      progress: 30
    }
  ];

  const stats = [
    { icon: Activity, label: 'Scans cette semaine', value: '12', change: '+3' },
    { icon: TrendingUp, label: 'Score bien-être', value: '7.2/10', change: '+0.5' },
    { icon: Target, label: 'Objectifs atteints', value: '4/6', change: '+1' },
    { icon: Award, label: 'Badges obtenus', value: '8', change: '+2' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">
            Bonjour, {user?.full_name || 'Utilisateur'} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Voici votre tableau de bord bien-être pour aujourd'hui
          </p>
        </div>
        <Button asChild>
          <Link to="/scan">
            <Scan className="mr-2 h-4 w-4" />
            Nouveau scan
          </Link>
        </Button>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="glass-effect hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    {stat.change}
                    <TrendingUp className="ml-1 h-3 w-3" />
                  </p>
                </div>
                <stat.icon className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modules principaux */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Vos modules bien-être</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <Card key={index} className="group hover-lift">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${module.color}`}>
                    <module.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {module.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progression</span>
                    <span>{module.progress}%</span>
                  </div>
                  <Progress value={module.progress} className="h-2" />
                </div>
                <Button asChild className="w-full" variant="outline">
                  <Link to={module.path}>Accéder au module</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Activité récente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Activité récente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <Scan className="h-4 w-4 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Scan émotionnel terminé</p>
                <p className="text-xs text-muted-foreground">Score: 7.5/10 - Il y a 2 heures</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <Music className="h-4 w-4 text-purple-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Session musicothérapie</p>
                <p className="text-xs text-muted-foreground">Relaxation - 25 min - Hier</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <BookOpen className="h-4 w-4 text-orange-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Nouvelle entrée journal</p>
                <p className="text-xs text-muted-foreground">&quot;Journée productive&quot; - Hier</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};