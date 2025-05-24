
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Building, 
  Users, 
  Heart, 
  TrendingUp, 
  Scan, 
  Bot, 
  Music, 
  BookOpen,
  Calendar,
  Target,
  Award
} from 'lucide-react';

const B2BUserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    emotionalScore: 72,
    teamAverage: 68,
    scansThisWeek: 3,
    streakDays: 8,
    teamRank: 3
  });

  const isDemo = user?.email?.endsWith('@exemple.fr');
  const company = user?.user_metadata?.company || 'Votre entreprise';
  const jobTitle = user?.user_metadata?.job_title || 'Collaborateur';

  const quickActions = [
    {
      title: 'Scanner mes émotions',
      description: 'Analysez votre état émotionnel',
      icon: Scan,
      color: 'bg-blue-500',
      action: () => navigate('/scan')
    },
    {
      title: 'Coach IA personnel',
      description: 'Conseils adaptés à votre rôle',
      icon: Bot,
      color: 'bg-green-500',
      action: () => navigate('/coach')
    },
    {
      title: 'Musicothérapie',
      description: 'Détente pendant les pauses',
      icon: Music,
      color: 'bg-purple-500',
      action: () => navigate('/music')
    },
    {
      title: 'Journal professionnel',
      description: 'Réflexions sur votre bien-être au travail',
      icon: BookOpen,
      color: 'bg-orange-500',
      action: () => navigate('/journal')
    }
  ];

  const teamInsights = [
    {
      title: 'Mon score vs équipe',
      value: `${stats.emotionalScore}% / ${stats.teamAverage}%`,
      description: 'Score personnel / Moyenne équipe',
      icon: TrendingUp,
      positive: stats.emotionalScore > stats.teamAverage
    },
    {
      title: 'Classement équipe',
      value: `${stats.teamRank}/12`,
      description: 'Position dans l\'équipe',
      icon: Award,
      positive: stats.teamRank <= 5
    },
    {
      title: 'Série active',
      value: `${stats.streakDays} jours`,
      description: 'Utilisation continue',
      icon: Calendar,
      positive: true
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* En-tête collaborateur */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="bg-gradient-to-r from-blue-50 to-slate-50 dark:from-blue-900/20 dark:to-slate-900/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Building className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    Bonjour {user?.user_metadata?.name} ! 👋
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {jobTitle} chez {company}
                  </CardDescription>
                  {isDemo && (
                    <Badge variant="secondary" className="mt-2">
                      Compte démo
                    </Badge>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 justify-end">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span className="text-2xl font-bold">{stats.emotionalScore}%</span>
                </div>
                <p className="text-sm text-muted-foreground">Score bien-être</p>
                <Badge variant={stats.emotionalScore > stats.teamAverage ? "default" : "secondary"} className="mt-1">
                  {stats.emotionalScore > stats.teamAverage ? 'Au-dessus' : 'En-dessous'} de la moyenne
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Actions rapides */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Outils de bien-être au travail</CardTitle>
            <CardDescription>
              Prenez soin de votre équilibre professionnel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Button
                    variant="outline"
                    className="h-auto flex flex-col items-center gap-3 p-6 w-full hover:shadow-md transition-all"
                    onClick={action.action}
                  >
                    <div className={`p-3 rounded-full ${action.color} text-white`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-sm">{action.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {action.description}
                      </div>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Comparaison équipe et insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Performance équipe</span>
              </CardTitle>
              <CardDescription>
                Votre position dans l'équipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamInsights.map((insight, index) => (
                  <div key={insight.title} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        insight.positive ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        <insight.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{insight.title}</p>
                        <p className="text-xs text-muted-foreground">{insight.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{insight.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Scan className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Scan matinal</p>
                  <p className="text-xs text-muted-foreground">Aujourd'hui 9h30</p>
                </div>
                <Badge variant="secondary">+5 pts</Badge>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <Bot className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Conseil sur la gestion du stress</p>
                  <p className="text-xs text-muted-foreground">Hier 15h20</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Music className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Pause musicale relaxante</p>
                  <p className="text-xs text-muted-foreground">Hier 12h00</p>
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full mt-4">
                Voir l'historique complet
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Encouragements et objectifs professionnels */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span>Objectif bien-être au travail</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-muted-foreground">
                Excellente progression ! Votre score de bien-être au travail est supérieur à la moyenne de l'équipe. 
                Continuez à prendre soin de vous pour maintenir cette performance.
              </p>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">+4%</p>
                  <p className="text-xs text-muted-foreground">Cette semaine</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{stats.streakDays}</p>
                  <p className="text-xs text-muted-foreground">Jours consécutifs</p>
                </div>
              </div>
              <Button className="mt-4" onClick={() => navigate('/scan')}>
                Faire mon check-in du jour
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2BUserDashboardPage;
