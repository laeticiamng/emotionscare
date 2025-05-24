
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  TrendingUp, 
  Calendar, 
  Clock,
  Heart,
  Brain,
  Target,
  ArrowRight,
  Smile,
  AlertCircle
} from 'lucide-react';

const UnifiedEmotionCheckin: React.FC = () => {
  const { user } = useAuth();
  const isDemoAccount = user?.email?.endsWith('@exemple.fr');

  const todayStats = isDemoAccount ? {
    lastCheckin: '14:30',
    mood: 'Optimiste',
    score: 85,
    streak: 7
  } : {
    lastCheckin: null,
    mood: null,
    score: null,
    streak: 0
  };

  const weeklyProgress = isDemoAccount ? {
    completed: 5,
    target: 7,
    percentage: 71
  } : {
    completed: 0,
    target: 7,
    percentage: 0
  };

  const recentMoods = isDemoAccount ? [
    { date: 'Lun', mood: 'Calme', score: 82 },
    { date: 'Mar', mood: 'Énergique', score: 88 },
    { date: 'Mer', mood: 'Concentré', score: 85 },
    { date: 'Jeu', mood: 'Optimiste', score: 90 },
    { date: 'Ven', mood: 'Détendu', score: 87 }
  ] : [];

  const insights = isDemoAccount ? [
    {
      type: 'positive',
      title: 'Excellente progression !',
      description: 'Votre bien-être s\'améliore constamment cette semaine.',
      icon: <TrendingUp className="h-4 w-4" />
    },
    {
      type: 'tip',
      title: 'Conseil du jour',
      description: 'Maintenez votre routine de check-in pour de meilleurs résultats.',
      icon: <Target className="h-4 w-4" />
    }
  ] : [
    {
      type: 'info',
      title: 'Commencez votre suivi',
      description: 'Effectuez votre premier check-in pour voir vos insights personnalisés.',
      icon: <Brain className="h-4 w-4" />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Today's Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-muted-foreground">Dernier check-in</span>
            </div>
            <p className="text-lg font-bold">
              {todayStats.lastCheckin || 'Aucun'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Smile className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-muted-foreground">Humeur actuelle</span>
            </div>
            <p className="text-lg font-bold">
              {todayStats.mood || '--'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-muted-foreground">Score bien-être</span>
            </div>
            <p className="text-lg font-bold">
              {todayStats.score ? `${todayStats.score}%` : '--'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-muted-foreground">Série en cours</span>
            </div>
            <p className="text-lg font-bold">
              {todayStats.streak} jour{todayStats.streak > 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Progression hebdomadaire</span>
          </CardTitle>
          <CardDescription>
            Objectif : 7 check-ins par semaine
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {weeklyProgress.completed}/{weeklyProgress.target} complétés
            </span>
            <Badge variant={weeklyProgress.percentage >= 70 ? "default" : "secondary"}>
              {weeklyProgress.percentage}%
            </Badge>
          </div>
          <Progress value={weeklyProgress.percentage} className="h-2" />
          
          {weeklyProgress.percentage >= 70 ? (
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-300">
                🎉 Excellent ! Vous êtes en bonne voie pour atteindre votre objectif.
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                💪 Plus que {weeklyProgress.target - weeklyProgress.completed} check-ins pour atteindre votre objectif !
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Moods */}
      {recentMoods.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Humeurs récentes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              {recentMoods.map((mood, index) => (
                <div key={index} className="text-center p-3 border rounded-lg">
                  <p className="text-sm font-medium">{mood.date}</p>
                  <p className="text-xs text-muted-foreground mb-2">{mood.mood}</p>
                  <div className={`text-lg font-bold ${
                    mood.score >= 80 ? 'text-green-600' :
                    mood.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {mood.score}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>Insights personnalisés</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.map((insight, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border-l-4 ${
                insight.type === 'positive' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
                insight.type === 'tip' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' :
                'border-gray-500 bg-gray-50 dark:bg-gray-900/20'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${
                  insight.type === 'positive' ? 'bg-green-100 text-green-600' :
                  insight.type === 'tip' ? 'bg-blue-100 text-blue-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {insight.icon}
                </div>
                <div>
                  <h4 className="font-medium">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Call to Action */}
      {!todayStats.lastCheckin && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Vous n'avez pas encore fait votre check-in aujourd'hui
            </h3>
            <p className="text-muted-foreground mb-4">
              Prenez quelques minutes pour analyser votre état émotionnel actuel
            </p>
            <Button className="w-full md:w-auto">
              Commencer mon check-in
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UnifiedEmotionCheckin;
