import React from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Heart, 
  Brain, 
  MessageSquare, 
  BookOpen, 
  Monitor,
  Trophy,
  TrendingUp,
  Calendar,
  Target,
  Zap
} from 'lucide-react';

const B2CDashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  // Mock data for stats
  const stats = [
    { title: 'Score Émotionnel', value: '7.8/10', change: '+12%', icon: Heart, color: 'text-pink-500' },
    { title: 'Sessions VR', value: '24', change: '+8%', icon: Monitor, color: 'text-purple-500' },
    { title: 'Défis Complétés', value: '15', change: '+25%', icon: Trophy, color: 'text-yellow-500' },
    { title: 'Points Gagnés', value: '1,240', change: '+18%', icon: Zap, color: 'text-blue-500' }
  ];

  const modules = [
    {
      title: 'Scan Émotionnel',
      description: 'Analysez votre état émotionnel en temps réel',
      icon: Brain,
      color: 'bg-blue-500',
      href: '/scan'
    },
    {
      title: 'Coach IA',
      description: 'Recevez des conseils personnalisés',
      icon: MessageSquare,
      color: 'bg-green-500',
      href: '/coach'
    },
    {
      title: 'Journal Personnel',
      description: 'Consignez vos pensées et émotions',
      icon: BookOpen,
      color: 'bg-purple-500',
      href: '/journal'
    },
    {
      title: 'Expériences VR',
      description: 'Explorez des environnements apaisants',
      icon: Monitor,
      color: 'bg-indigo-500',
      href: '/vr'
    },
    {
      title: 'Gamification',
      description: 'Défis et récompenses pour votre bien-être',
      icon: Trophy,
      color: 'bg-yellow-500',
      href: '/gamification'
    },
    {
      title: 'Musicothérapie',
      description: 'Musiques adaptées à votre humeur',
      icon: Heart,
      color: 'bg-pink-500',
      href: '/music'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Bonjour {user?.email?.split('@')[0] || 'Utilisateur'} 👋
          </h1>
          <p className="text-xl text-gray-600">
            Votre tableau de bord personnel pour votre bien-être émotionnel
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="flex items-center space-x-1 text-sm">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-600">{stat.change}</span>
                  <span className="text-gray-500">ce mois</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Progress Section */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Objectifs du mois</h3>
              <Badge variant="outline" className="text-green-600 border-green-200">
                En progression
              </Badge>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Sessions de méditation</span>
                  <span>12/20</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Entrées journal</span>
                  <span>18/25</span>
                </div>
                <Progress value={72} className="h-2" />
              </div>
            </div>
          </div>
        </Card>

        {/* Modules Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-900">
            Vos outils de bien-être
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className={`w-12 h-12 ${module.color} rounded-lg flex items-center justify-center mb-4`}>
                    <module.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{module.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {module.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full group-hover:scale-105 transition-transform"
                    onClick={() => window.location.href = module.href}
                  >
                    Accéder
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Actions rapides</h3>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Planifier une session</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Définir un objectif</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>Check-in émotionnel</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default B2CDashboardPage;
