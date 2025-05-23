
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Brain, Music, Scan, MessageSquare, FileText, Target, Calendar, Heart } from 'lucide-react';

const B2CDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const modules = [
    {
      title: 'Scanner émotions',
      description: 'Analysez vos émotions en temps réel',
      icon: Scan,
      path: '/scan',
      color: 'bg-blue-500'
    },
    {
      title: 'Coach IA',
      description: 'Votre accompagnement personnalisé',
      icon: MessageSquare,
      path: '/coach',
      color: 'bg-green-500'
    },
    {
      title: 'Musicothérapie',
      description: 'Musiques adaptées à vos émotions',
      icon: Music,
      path: '/music',
      color: 'bg-purple-500'
    },
    {
      title: 'Journal',
      description: 'Vos réflexions et évolutions',
      icon: FileText,
      path: '/journal',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold">EmotionsCare</span>
          </div>
          
          <h1 className="text-4xl font-light tracking-tight text-slate-900 dark:text-white mb-4">
            Bienvenue dans votre espace bien-être
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Une parenthèse pour vous. Le luxe de prendre le temps.
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          <Card>
            <CardContent className="flex items-center p-6">
              <Heart className="h-8 w-8 text-red-500 mr-4" />
              <div>
                <p className="text-2xl font-bold">8.2/10</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Bien-être moyen</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <Target className="h-8 w-8 text-green-500 mr-4" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Sessions cette semaine</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <Calendar className="h-8 w-8 text-blue-500 mr-4" />
              <div>
                <p className="text-2xl font-bold">7</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Jours consécutifs</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <Music className="h-8 w-8 text-purple-500 mr-4" />
              <div>
                <p className="text-2xl font-bold">45min</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Musicothérapie</p>
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
          {modules.map((module, index) => (
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
                    Commencer
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Daily Inspiration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-0">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-4">Inspiration du jour</h3>
              <p className="text-lg italic text-slate-700 dark:text-slate-300 mb-6">
                "Le bien-être ne s'explique pas, il se vit. Chaque respiration compte."
              </p>
              <Button variant="outline" onClick={() => navigate('/coach')}>
                Découvrir plus d'inspirations
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default B2CDashboardPage;
