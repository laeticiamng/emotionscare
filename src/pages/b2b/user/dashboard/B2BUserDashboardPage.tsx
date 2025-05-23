
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Activity, Brain, Users, TrendingUp, Calendar, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UnifiedEmotionCheckin from '@/components/scan/UnifiedEmotionCheckin';
import { EmotionResult } from '@/types/emotion';

const B2BUserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showScanForm, setShowScanForm] = useState(false);

  const handleScanComplete = (result: EmotionResult) => {
    console.log('Scan completed:', result);
    setShowScanForm(false);
  };

  const stats = [
    {
      title: "Bien-être moyen",
      value: "78%",
      icon: Activity,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Analyses cette semaine",
      value: "5",
      icon: Brain,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Équipe connectée",
      value: "24/30",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Progression",
      value: "+12%",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const quickActions = [
    {
      title: "Analyser mes émotions",
      description: "Scanner votre état émotionnel actuel",
      icon: Brain,
      action: () => navigate('/b2b/user/scan'),
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "Espace social",
      description: "Interagir avec votre équipe",
      icon: Users,
      action: () => navigate('/b2b/user/social'),
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      title: "Planifier une pause",
      description: "Organiser votre bien-être",
      icon: Calendar,
      action: () => console.log('Planning feature'),
      color: "bg-purple-600 hover:bg-purple-700"
    },
    {
      title: "Coaching IA",
      description: "Dialogue avec votre coach virtuel",
      icon: MessageCircle,
      action: () => console.log('AI Coach feature'),
      color: "bg-orange-600 hover:bg-orange-700"
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord collaborateur</h1>
          <p className="text-muted-foreground">
            Bonjour {user?.name}, voici votre espace bien-être professionnel
          </p>
        </div>
        <Button onClick={() => setShowScanForm(true)}>
          <Brain className="mr-2 h-4 w-4" />
          Analyse rapide
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>
            Accédez facilement à vos outils de bien-être
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={action.action}
                >
                  <div className={`p-3 rounded-full ${action.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium">{action.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <UnifiedEmotionCheckin />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications d'équipe</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Nouvelle session de méditation</p>
                <p className="text-xs text-muted-foreground">Il y a 2 heures</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Rapport d'équipe disponible</p>
                <p className="text-xs text-muted-foreground">Il y a 1 jour</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Challenge bien-être lancé</p>
                <p className="text-xs text-muted-foreground">Il y a 3 jours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BUserDashboardPage;
