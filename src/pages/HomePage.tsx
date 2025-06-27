
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Music, 
  BookOpen, 
  MessageCircle, 
  Headphones,
  Heart,
  Users,
  Trophy,
  Settings,
  Sparkles,
  Zap,
  Star
} from 'lucide-react';
import AnimatedBackground from '@/components/home/AnimatedBackground';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Scanner Émotionnel",
      description: "Analysez vos émotions en temps réel avec l'IA",
      path: "/scan",
      color: "from-blue-500 to-cyan-500",
      badge: "IA"
    },
    {
      icon: <Music className="h-8 w-8" />,
      title: "Musicothérapie",
      description: "Musique adaptative à votre état émotionnel",
      path: "/music",
      color: "from-purple-500 to-pink-500",
      badge: "Adaptative"
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Journal Intelligent",
      description: "Suivez votre progression avec des insights personnalisés",
      path: "/journal",
      color: "from-green-500 to-emerald-500",
      badge: "Insights"
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "Coach IA",
      description: "Accompagnement personnalisé 24/7",
      path: "/coach",
      color: "from-orange-500 to-red-500",
      badge: "24/7"
    },
    {
      icon: <Headphones className="h-8 w-8" />,
      title: "Réalité Virtuelle",
      description: "Expériences immersives de bien-être",
      path: "/vr",
      color: "from-indigo-500 to-purple-500",
      badge: "Immersif"
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Méditation",
      description: "Sessions guidées personnalisées",
      path: "/meditation",
      color: "from-pink-500 to-rose-500",
      badge: "Guidée"
    }
  ];

  const quickActions = [
    { icon: <Users className="h-5 w-5" />, title: "Espace Particulier", path: "/b2c", color: "bg-blue-600" },
    { icon: <Trophy className="h-5 w-5" />, title: "Espace Entreprise", path: "/b2b", color: "bg-purple-600" },
    { icon: <Settings className="h-5 w-5" />, title: "Préférences", path: "/preferences", color: "bg-green-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 relative overflow-hidden" data-testid="page-root">
      <AnimatedBackground mood="calm" />
      
      {/* Hero Section */}
      <div className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-75"></div>
                <div className="relative bg-white dark:bg-slate-800 rounded-full p-4">
                  <Sparkles className="h-12 w-12 text-blue-600" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              EmotionsCare
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Votre plateforme de bien-être émotionnel alimentée par l'IA. 
              Découvrez, analysez et améliorez votre santé mentale avec des outils innovants.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/choose-mode')}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-semibold"
              >
                <Zap className="mr-2 h-5 w-5" />
                Commencer l'expérience
              </Button>
              
              <Button 
                onClick={() => navigate('/auth')}
                variant="outline"
                size="lg"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-8 py-4 text-lg font-semibold"
              >
                Se connecter
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  onClick={() => navigate(action.path)}
                  className={`${action.color} hover:opacity-90 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
                >
                  {action.icon}
                  <span className="ml-2">{action.title}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">
              Fonctionnalités Premium
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Découvrez nos outils innovants conçus pour votre bien-être émotionnel
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group cursor-pointer"
                onClick={() => navigate(feature.path)}
              >
                <Card className="h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:bg-white dark:group-hover:bg-slate-800">
                  <CardContent className="p-8">
                    <div className="relative mb-6">
                      <div className={`absolute -inset-1 bg-gradient-to-r ${feature.color} rounded-2xl blur opacity-25 group-hover:opacity-50 transition-opacity`}></div>
                      <div className={`relative bg-gradient-to-r ${feature.color} rounded-2xl p-4 text-white w-fit`}>
                        {feature.icon}
                      </div>
                      <Badge className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 border-0">
                        {feature.badge}
                      </Badge>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">
                      {feature.title}
                    </h3>
                    
                    <p className="text-slate-600 dark:text-slate-300 mb-4">
                      {feature.description}
                    </p>
                    
                    <div className="flex items-center text-blue-600 font-semibold group-hover:text-purple-600 transition-colors">
                      <span>Découvrir</span>
                      <Star className="ml-2 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="relative z-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à transformer votre bien-être ?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Rejoignez des milliers d'utilisateurs qui ont déjà amélioré leur santé mentale
            </p>
            <Button 
              onClick={() => navigate('/choose-mode')}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Commencer gratuitement
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
