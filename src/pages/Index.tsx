
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Shell from '@/Shell';
import HeroSection from '@/components/home/HeroSection';
import GlobalNav from '@/components/navigation/GlobalNav';
import { 
  BookOpen, Music, Headphones, MessageSquare, Glasses, 
  HeartHandshake, Activity, Calendar, Users 
} from 'lucide-react';

const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const featuredFeatures = [
    {
      title: "Journal émotionnel",
      description: "Suivez votre bien-être émotionnel jour après jour",
      icon: <BookOpen className="h-6 w-6 text-blue-500" />,
      path: "/journal",
      color: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: "Musique thérapeutique",
      description: "Des playlists adaptées à votre état émotionnel",
      icon: <Music className="h-6 w-6 text-indigo-500" />,
      path: "/music",
      color: "bg-indigo-50 dark:bg-indigo-900/20"
    },
    {
      title: "Audio guidances",
      description: "Méditations et exercices de relaxation audio",
      icon: <Headphones className="h-6 w-6 text-purple-500" />,
      path: "/audio",
      color: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      title: "Coach émotionnel",
      description: "Un coach personnel pour votre bien-être",
      icon: <MessageSquare className="h-6 w-6 text-green-500" />,
      path: "/coach",
      color: "bg-green-50 dark:bg-green-900/20"
    },
    {
      title: "Expérience VR",
      description: "Immergez-vous dans des environnements apaisants",
      icon: <Glasses className="h-6 w-6 text-cyan-500" />,
      path: "/vr",
      color: "bg-cyan-50 dark:bg-cyan-900/20"
    },
    {
      title: "Social Cocoon",
      description: "Communauté de soutien et partage d'expériences",
      icon: <HeartHandshake className="h-6 w-6 text-pink-500" />,
      path: "/social",
      color: "bg-pink-50 dark:bg-pink-900/20"
    }
  ];

  const professionalFeatures = [
    {
      title: "Tableau de bord",
      description: "Suivez vos progrès et statistiques",
      icon: <Activity className="h-6 w-6 text-amber-500" />,
      path: "/dashboard",
      color: "bg-amber-50 dark:bg-amber-900/20"
    },
    {
      title: "Sessions programmées",
      description: "Planifiez vos sessions de bien-être",
      icon: <Calendar className="h-6 w-6 text-orange-500" />,
      path: "/sessions",
      color: "bg-orange-50 dark:bg-orange-900/20"
    },
    {
      title: "Gestion d'équipe",
      description: "Pour les professionnels et entreprises",
      icon: <Users className="h-6 w-6 text-teal-500" />,
      path: "/teams",
      color: "bg-teal-50 dark:bg-teal-900/20",
      b2bOnly: true
    }
  ];

  return (
    <Shell>
      <HeroSection />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne de navigation rapide */}
          <div className="lg:col-span-1">
            <GlobalNav />
            
            {!isAuthenticated && (
              <Card className="mt-6 border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Vous n'êtes pas connecté</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Connectez-vous pour accéder à toutes les fonctionnalités d'EmotionsCare
                  </p>
                  <div className="flex space-x-2">
                    <Button onClick={() => navigate('/login')} className="w-full">
                      Se connecter
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/register')} className="w-full">
                      S'inscrire
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-12">
            {/* Fonctionnalités vedettes */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Nos fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {featuredFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.path}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <Button
                      variant="ghost"
                      className={`w-full h-auto flex items-start text-left p-4 rounded-lg ${feature.color}`}
                      onClick={() => {
                        if (!isAuthenticated) {
                          navigate('/login');
                        } else {
                          navigate(feature.path);
                        }
                      }}
                    >
                      <div className="mr-4">{feature.icon}</div>
                      <div>
                        <h3 className="font-medium">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Fonctionnalités pour professionnels */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Outils professionnels</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {professionalFeatures
                  .filter(feature => !feature.b2bOnly || (isAuthenticated && feature.b2bOnly))
                  .map((feature, index) => (
                    <motion.div
                      key={feature.path}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <Button
                        variant="ghost"
                        className={`w-full h-auto flex items-start text-left p-4 rounded-lg ${feature.color}`}
                        onClick={() => {
                          if (!isAuthenticated) {
                            navigate('/login');
                          } else {
                            navigate(feature.path);
                          }
                        }}
                      >
                        <div className="mr-4">{feature.icon}</div>
                        <div>
                          <h3 className="font-medium">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </Button>
                    </motion.div>
                  ))}
              </div>
            </div>
            
            {/* Section d'information */}
            <div>
              <h2 className="text-2xl font-bold mb-4">À propos d'EmotionsCare</h2>
              <Card>
                <CardContent className="p-6">
                  <p className="mb-4">
                    EmotionsCare est une plateforme complète dédiée au bien-être émotionnel, combinant technologie et approches thérapeutiques pour vous aider à mieux comprendre et gérer vos émotions au quotidien.
                  </p>
                  <div className="flex flex-wrap gap-4 mt-4">
                    <Button variant="outline" asChild>
                      <Link to="/team">Notre équipe</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/support">Support</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/legal">Mentions légales</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
};

export default Index;
