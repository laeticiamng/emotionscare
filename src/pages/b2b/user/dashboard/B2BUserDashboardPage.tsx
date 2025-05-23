
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, Brain, MessageSquare, Music, Calendar, Target, TrendingUp } from 'lucide-react';

const B2BUserDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const teamModules = [
    {
      title: 'Scanner émotions',
      description: 'Votre état émotionnel en temps réel',
      icon: Brain,
      path: '/scan',
      color: 'bg-blue-500'
    },
    {
      title: 'Coach IA',
      description: 'Accompagnement professionnel personnalisé',
      icon: MessageSquare,
      path: '/coach',
      color: 'bg-green-500'
    },
    {
      title: 'Musicothérapie',
      description: 'Détente et concentration au travail',
      icon: Music,
      path: '/music',
      color: 'bg-purple-500'
    },
    {
      title: 'Sessions équipe',
      description: 'Activités collectives de bien-être',
      icon: Users,
      path: '/sessions',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Building2 className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold">EmotionsCare</span>
          </div>
          
          <h1 className="text-4xl font-light tracking-tight text-slate-900 dark:text-white mb-4">
            Votre espace collaborateur
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            L'énergie partagée au service de l'excellence collective
          </p>
        </motion.div>

        {/* Team Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          <Card>
            <CardContent className="flex items-center p-6">
              <TrendingUp className="h-8 w-8 text-green-500 mr-4" />
              <div>
                <p className="text-2xl font-bold">87%</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Engagement équipe</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <Users className="h-8 w-8 text-blue-500 mr-4" />
              <div>
                <p className="text-2xl font-bold">24</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Collaborateurs actifs</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <Calendar className="h-8 w-8 text-purple-500 mr-4" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Sessions cette semaine</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <Target className="h-8 w-8 text-orange-500 mr-4" />
              <div>
                <p className="text-2xl font-bold">92%</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Objectifs atteints</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Modules Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
        >
          {teamModules.map((module, index) => (
            <motion.div
              key={module.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.8 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <CardHeader>
                  <div className={`w-12 h-12 ${module.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <module.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full"
                    onClick={() => navigate(module.path)}
                  >
                    Accéder
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Team Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Climat émotionnel équipe</CardTitle>
              <CardDescription>Température collective cette semaine</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Motivation</span>
                  <div className="w-32 bg-slate-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Sérénité</span>
                  <div className="w-32 bg-slate-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Énergie</span>
                  <div className="w-32 bg-slate-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-0">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Message de votre RH</h3>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                "Excellents résultats d'équipe cette semaine ! Votre engagement dans le bien-être 
                collectif contribue à créer un environnement de travail exceptionnel."
              </p>
              <Button variant="outline" size="sm">
                Voir tous les messages
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default B2BUserDashboardPage;
