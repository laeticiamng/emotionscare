
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, BookOpen, Music, MessageSquare, Glasses, 
  Users, Activity, BarChart2, Brain, ArrowRight 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Scanner émotionnel',
      description: 'Analysez et comprenez votre état émotionnel en temps réel',
      icon: Heart,
      path: '/scan',
      color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    },
    {
      title: 'Journal émotionnel',
      description: 'Suivez et documentez l\'évolution de vos émotions au quotidien',
      icon: BookOpen,
      path: '/journal',
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    },
    {
      title: 'Thérapie musicale',
      description: 'Écoutez des playlists adaptées à votre état émotionnel',
      icon: Music,
      path: '/music',
      color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
    },
    {
      title: 'Coach IA',
      description: 'Bénéficiez de conseils personnalisés pour améliorer votre bien-être',
      icon: MessageSquare,
      path: '/coach',
      color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    },
    {
      title: 'Expériences VR',
      description: 'Immergez-vous dans des environnements apaisants en réalité virtuelle',
      icon: Glasses,
      path: '/vr',
      color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
    },
    {
      title: 'Cocoon Social',
      description: 'Échangez anonymement avec une communauté bienveillante',
      icon: Users,
      path: '/social',
      color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
    }
  ];

  // Options utilisateur
  const userModes = [
    {
      title: 'Particulier',
      description: 'Accès personnel à toutes les fonctionnalités de bien-être',
      path: '/b2c/dashboard',
      icon: Heart
    },
    {
      title: 'Collaborateur',
      description: 'Accès aux fonctionnalités pour employés d\'entreprises partenaires',
      path: '/b2b/user/dashboard',
      icon: Users
    },
    {
      title: 'Administration RH',
      description: 'Gérez le bien-être de vos équipes en entreprise',
      path: '/b2b/admin/dashboard',
      icon: Building
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Bienvenue sur <span className="text-primary">EmotionsCare</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Votre plateforme de bien-être émotionnel personnalisée
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              onClick={() => navigate('/choose-mode')}
              className="gap-2"
            >
              <Brain className="h-5 w-5" />
              Commencer
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/about')}
              className="gap-2"
            >
              <Activity className="h-5 w-5" />
              En savoir plus
            </Button>
          </div>
        </motion.div>
        
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-10">Nos fonctionnalités principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card 
                  className="h-full transition-all hover:shadow-md cursor-pointer"
                  onClick={() => navigate(feature.path)}
                >
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <div className={`p-3 rounded-full ${feature.color}`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                    <Button variant="ghost" className="mt-4 gap-2 p-0 hover:bg-transparent hover:underline">
                      Explorer <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
        
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-10">Choisissez votre mode d'accès</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {userModes.map((mode, index) => (
              <motion.div
                key={mode.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card 
                  className="h-full flex flex-col transition-all hover:shadow-md cursor-pointer"
                  onClick={() => navigate(mode.path)}
                >
                  <CardHeader>
                    <mode.icon className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>{mode.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground mb-4">{mode.description}</p>
                    <Button className="w-full">
                      Accéder
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
        
        <section>
          <div className="bg-muted rounded-lg p-8 text-center max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Commencez dès maintenant</h2>
            <p className="text-muted-foreground mb-6">
              Découvrez comment EmotionsCare peut vous aider à améliorer votre bien-être émotionnel
              et à développer une meilleure compréhension de vous-même.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button onClick={() => navigate('/b2c/register')}>
                Créer un compte
              </Button>
              <Button variant="outline" onClick={() => navigate('/login')}>
                Se connecter
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
