
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Music, Scan, Brain, Headphones, Users, Settings, Trophy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const modules = [
    {
      title: 'Journal Émotionnel',
      description: 'Suivez votre état émotionnel quotidien',
      icon: Heart,
      path: '/b2c/journal',
      color: 'from-pink-500 to-rose-500'
    },
    {
      title: 'Musicothérapie',
      description: 'Musique adaptée à vos émotions',
      icon: Music,
      path: '/b2c/music',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Scanner Émotionnel',
      description: 'Analysez votre état en temps réel',
      icon: Scan,
      path: '/b2c/scan',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Coach IA',
      description: 'Votre accompagnateur personnel',
      icon: Brain,
      path: '/b2c/coach',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      title: 'Réalité Virtuelle',
      description: 'Expériences immersives',
      icon: Headphones,
      path: '/b2c/vr',
      color: 'from-red-500 to-rose-500'
    },
    {
      title: 'Gamification',
      description: 'Défis et récompenses',
      icon: Trophy,
      path: '/b2c/gamification',
      color: 'from-indigo-500 to-violet-500'
    },
    {
      title: 'Communauté',
      description: 'Connectez-vous avec d\'autres',
      icon: Users,
      path: '/b2c/social',
      color: 'from-teal-500 to-cyan-500'
    },
    {
      title: 'Paramètres',
      description: 'Personnalisez votre expérience',
      icon: Settings,
      path: '/b2c/settings',
      color: 'from-gray-500 to-slate-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              Tableau de Bord Personnel
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Bienvenue dans votre espace de bien-être émotionnel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((module, index) => (
              <motion.div
                key={module.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader className="text-center">
                    <div className={`mx-auto mb-4 p-4 rounded-full bg-gradient-to-r ${module.color} text-white group-hover:scale-110 transition-transform`}>
                      <module.icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {module.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => navigate(module.path)}
                      className="w-full"
                      variant="outline"
                    >
                      Accéder
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
