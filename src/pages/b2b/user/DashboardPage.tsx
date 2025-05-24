
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Scan, Brain, Music, Building2, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const modules = [
    {
      title: 'Scanner Émotionnel',
      description: 'Analysez l\'état émotionnel de votre équipe',
      icon: Scan,
      path: '/b2b/user/scan',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Coach IA Professionnel',
      description: 'Accompagnement pour le bien-être au travail',
      icon: Brain,
      path: '/b2b/user/coach',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      title: 'Musicothérapie',
      description: 'Musique adaptée à l\'environnement de travail',
      icon: Music,
      path: '/b2b/user/music',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Équipe',
      description: 'Collaborez avec vos collègues',
      icon: Users,
      path: '/b2b/user/team',
      color: 'from-green-500 to-teal-500'
    },
    {
      title: 'Défis d\'équipe',
      description: 'Participez aux challenges collectifs',
      icon: Target,
      path: '/b2b/user/challenges',
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Espace Organisation',
      description: 'Ressources de votre entreprise',
      icon: Building2,
      path: '/b2b/user/organization',
      color: 'from-gray-500 to-slate-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Tableau de Bord Collaborateur
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Votre espace de bien-être professionnel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

          <div className="mt-12">
            <Card className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
              <CardHeader>
                <CardTitle className="text-xl text-white">Bienvenue dans votre espace professionnel</CardTitle>
                <CardDescription className="text-blue-100">
                  Découvrez tous les outils pour améliorer votre bien-être au travail
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-blue-100">
                  Explorez les différents modules disponibles pour optimiser votre expérience professionnelle et maintenir un équilibre émotionnel sain.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
