
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Brain, 
  Music, 
  Scan, 
  MessageSquare, 
  TrendingUp, 
  Calendar,
  Building,
  Loader2,
  Award,
  Target
} from 'lucide-react';

const B2BUserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [teamScore, setTeamScore] = useState(82);
  const [personalScore, setPersonalScore] = useState(78);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const teamModules = [
    {
      title: 'Scanner d\'équipe',
      description: 'Analyse du climat émotionnel de l\'équipe',
      icon: Scan,
      color: 'bg-blue-500',
      action: () => navigate('/scan')
    },
    {
      title: 'Coach collaboratif',
      description: 'Accompagnement adapté au contexte professionnel',
      icon: MessageSquare,
      color: 'bg-green-500',
      action: () => navigate('/coach')
    },
    {
      title: 'Musicothérapie pro',
      description: 'Playlists pour la concentration et détente',
      icon: Music,
      color: 'bg-purple-500',
      action: () => navigate('/music')
    },
    {
      title: 'Espace équipe',
      description: 'Partage et communication avec vos collègues',
      icon: Users,
      color: 'bg-orange-500',
      action: () => navigate('/team')
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Building className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">
              Bonjour {user?.user_metadata?.firstName || user?.email?.split('@')[0]} 👋
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {user?.user_metadata?.company && (
                <span className="font-medium">{user.user_metadata.company}</span>
              )}
              {user?.user_metadata?.department && (
                <span> • {user.user_metadata.department}</span>
              )}
            </p>
          </div>
        </div>
        <p className="text-slate-600 dark:text-slate-400">
          Prenez soin de votre bien-être professionnel et contribuez à l'énergie de votre équipe.
        </p>
      </motion.div>

      {/* Scores Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-6 w-6 mr-2 text-blue-600" />
                Votre bien-être
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {personalScore}%
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Score personnel
                  </p>
                </div>
                <div className="text-right">
                  <TrendingUp className="h-8 w-8 text-green-500 mb-2" />
                  <p className="text-sm text-green-600 font-medium">
                    +3% cette semaine
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-6 w-6 mr-2 text-green-600" />
                Climat d'équipe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {teamScore}%
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Score équipe
                  </p>
                </div>
                <div className="text-right">
                  <Target className="h-8 w-8 text-blue-500 mb-2" />
                  <p className="text-sm text-blue-600 font-medium">
                    Objectif: 85%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Team Modules Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold mb-6">Outils collaboratifs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamModules.map((module, index) => (
            <motion.div
              key={module.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
            >
              <Card 
                className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={module.action}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 ${module.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <module.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Accéder
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Activity Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Activités récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Scanner d'équipe - Aujourd'hui</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Session coach - Hier</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm">Pause musicale - Il y a 2 jours</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm">Réunion équipe bien-être - Il y a 3 jours</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Contribution équipe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Sessions d'équipe</span>
                <span className="font-bold">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Feedback partagés</span>
                <span className="font-bold">5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Amélioration climat</span>
                <span className="font-bold text-green-600">+7%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Rang équipe</span>
                <span className="font-bold text-blue-600">2ème</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2BUserDashboardPage;
