import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Heart, Brain, Music, MessageCircle, Target, Trophy, Calendar, Settings } from 'lucide-react';

const AppDashboard: React.FC = () => {
  const stats = [
    { label: 'Scans émotionnels', value: 24, icon: Brain, color: 'text-blue-500' },
    { label: 'Sessions musique', value: 12, icon: Music, color: 'text-purple-500' },
    { label: 'Conversations coach', value: 8, icon: MessageCircle, color: 'text-green-500' },
    { label: 'Objectifs atteints', value: 5, icon: Target, color: 'text-orange-500' },
  ];

  const quickActions = [
    { title: 'Scan émotionnel', description: 'Analysez votre état émotionnel', href: '/scan', icon: Brain },
    { title: 'Musique adaptative', description: 'Musique personnalisée selon votre humeur', href: '/music', icon: Music },
    { title: 'Coach IA', description: 'Conversation avec votre coach personnel', href: '/coach', icon: MessageCircle },
    { title: 'Journal', description: 'Notez vos pensées et progrès', href: '/journal', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tableau de bord</h1>
          <p className="text-muted-foreground">Bienvenue dans votre espace de bien-être émotionnel</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Progrès hebdomadaire
              </CardTitle>
              <CardDescription>Vos objectifs de bien-être cette semaine</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Scans émotionnels</span>
                  <span>6/10</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Sessions de musique</span>
                  <span>4/7</span>
                </div>
                <Progress value={57} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Méditation</span>
                  <span>3/5</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                État émotionnel récent
              </CardTitle>
              <CardDescription>Analyse de vos derniers scans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Aujourd'hui</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">Positif</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Hier</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">Calme</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Il y a 2 jours</span>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Neutre</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>Accédez rapidement à vos outils de bien-être</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-3 hover:bg-primary/5"
                  asChild
                >
                  <a href={action.href}>
                    <action.icon className="h-8 w-8 text-primary" />
                    <div className="text-center">
                      <p className="font-medium">{action.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                    </div>
                  </a>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppDashboard;