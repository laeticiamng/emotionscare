
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Brain, 
  Music, 
  Scan, 
  MessageSquare, 
  TrendingUp, 
  Calendar, 
  Award,
  Loader2
} from 'lucide-react';

const B2CDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [emotionalScore, setEmotionalScore] = useState(75);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const quickActions = [
    {
      title: 'Scanner émotionnel',
      description: 'Analysez vos émotions en temps réel',
      icon: Scan,
      color: 'bg-blue-500',
      action: () => navigate('/scan')
    },
    {
      title: 'Coach IA',
      description: 'Votre accompagnateur personnel',
      icon: MessageSquare,
      color: 'bg-green-500',
      action: () => navigate('/coach')
    },
    {
      title: 'Musicothérapie',
      description: 'Musiques adaptées à vos émotions',
      icon: Music,
      color: 'bg-purple-500',
      action: () => navigate('/music')
    },
    {
      title: 'Profil',
      description: 'Gérer vos préférences',
      icon: Heart,
      color: 'bg-pink-500',
      action: () => navigate('/profile')
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
        <h1 className="text-3xl font-bold mb-2">
          Bonjour {user?.user_metadata?.firstName || user?.email?.split('@')[0]} 👋
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Prenez un moment pour vous aujourd'hui. Comment vous sentez-vous ?
        </p>
      </motion.div>

      {/* Emotional Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="mb-8"
      >
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-6 w-6 mr-2 text-blue-600" />
              Votre bien-être émotionnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {emotionalScore}%
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Niveau de bien-être général
                </p>
              </div>
              <div className="text-right">
                <TrendingUp className="h-8 w-8 text-green-500 mb-2" />
                <p className="text-sm text-green-600 font-medium">
                  +5% cette semaine
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold mb-6">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
            >
              <Card 
                className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={action.action}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 ${action.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
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

      {/* Recent Activity */}
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
                <span className="text-sm">Scanner émotionnel - Aujourd'hui</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Session coach - Hier</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm">Musicothérapie - Il y a 2 jours</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Vos accomplissements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Sessions complétées</span>
                <span className="font-bold">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Jours consécutifs</span>
                <span className="font-bold">5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Progression</span>
                <span className="font-bold text-green-600">+15%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2CDashboardPage;
