
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Activity, Brain, Heart, TrendingUp, Calendar, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UnifiedEmotionCheckin from '@/components/scan/UnifiedEmotionCheckin';
import { EmotionResult } from '@/types/emotion';

const B2CDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showScanForm, setShowScanForm] = useState(false);

  const handleScanComplete = (result: EmotionResult) => {
    console.log('Scan completed:', result);
    setShowScanForm(false);
  };

  const stats = [
    {
      title: "Score bien-être",
      value: "85%",
      icon: Activity,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Excellente forme aujourd'hui"
    },
    {
      title: "Analyses cette semaine",
      value: "7",
      icon: Brain,
      color: "text-blue-600", 
      bgColor: "bg-blue-50",
      description: "+2 par rapport à la semaine dernière"
    },
    {
      title: "Humeur dominante",
      value: "Joie",
      icon: Heart,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      description: "Tendance positive stable"
    },
    {
      title: "Progression",
      value: "+15%",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Amélioration continue"
    }
  ];

  const quickActions = [
    {
      title: "Analyser mes émotions",
      description: "Scanner votre état émotionnel actuel",
      icon: Brain,
      action: () => navigate('/b2c/scan'),
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "Communauté",
      description: "Partager avec d'autres utilisateurs",
      icon: Heart,
      action: () => navigate('/b2c/social'),
      color: "bg-pink-600 hover:bg-pink-700"
    },
    {
      title: "Objectifs personnels",
      description: "Définir vos objectifs bien-être",
      icon: Star,
      action: () => console.log('Goals feature'),
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      title: "Mon agenda",
      description: "Planifier votre bien-être",
      icon: Calendar,
      action: () => console.log('Calendar feature'),
      color: "bg-purple-600 hover:bg-purple-700"
    }
  ];

  const insights = [
    {
      title: "Conseil du jour",
      content: "Prenez 5 minutes pour une respiration consciente. Cela peut améliorer votre concentration de 20%.",
      type: "tip"
    },
    {
      title: "Analyse de la semaine",
      content: "Votre bien-être est en hausse ! Vous avez montré une grande régularité dans vos analyses.",
      type: "insight"
    },
    {
      title: "Objectif atteint",
      content: "Félicitations ! Vous avez atteint votre objectif de 5 analyses cette semaine.",
      type: "achievement"
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Votre tableau de bord</h1>
          <p className="text-muted-foreground">
            Bonjour {user?.name}, voici votre espace bien-être personnel
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
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
                <div>
                  <p className="font-medium">{stat.title}</p>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
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
            Accédez facilement à vos outils de bien-être favoris
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

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <UnifiedEmotionCheckin />
          </CardContent>
        </Card>

        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Insights personnalisés</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.map((insight, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg ${
                  insight.type === 'tip' ? 'bg-blue-50 border-l-4 border-blue-500' :
                  insight.type === 'insight' ? 'bg-green-50 border-l-4 border-green-500' :
                  'bg-yellow-50 border-l-4 border-yellow-500'
                }`}
              >
                <h4 className="font-medium mb-2">{insight.title}</h4>
                <p className="text-sm text-muted-foreground">{insight.content}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Mood Tracking Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Suivi de votre humeur</CardTitle>
          <CardDescription>
            Évolution de votre bien-être sur les 7 derniers jours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
            <div className="text-center">
              <Activity className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">Graphique de suivi</p>
              <p className="text-sm text-muted-foreground">
                Vos données de bien-être seront affichées ici
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2CDashboardPage;
