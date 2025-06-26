
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Brain, 
  Users, 
  Shield, 
  BarChart3, 
  Music, 
  Sparkles,
  ArrowRight,
  Play,
  Star,
  Zap
} from 'lucide-react';
import AnimatedBackground from '@/components/home/AnimatedBackground';
import HeroVideo from '@/components/HeroVideo';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "IA Coach Personnalisé",
      description: "Assistant virtuel intelligent qui s'adapte à vos besoins émotionnels uniques",
      color: "from-purple-500 to-indigo-600",
      delay: 0.1
    },
    {
      icon: Heart,
      title: "Scan Émotionnel Avancé",
      description: "Analysez votre état émotionnel en temps réel avec notre technologie de pointe",
      color: "from-pink-500 to-rose-600",
      delay: 0.2
    },
    {
      icon: Music,
      title: "Musicothérapie Adaptative",
      description: "Playlists personnalisées et sessions audio thérapeutiques sur mesure",
      color: "from-blue-500 to-cyan-600",
      delay: 0.3
    },
    {
      icon: Users,
      title: "Communauté Bienveillante",
      description: "Connectez-vous dans un environnement sécurisé et confidentiel",
      color: "from-green-500 to-emerald-600",
      delay: 0.4
    },
    {
      icon: Shield,
      title: "Sécurité Maximum",
      description: "Protection des données avec les plus hauts standards de sécurité",
      color: "from-orange-500 to-amber-600",
      delay: 0.5
    },
    {
      icon: BarChart3,
      title: "Analytics Intelligents",
      description: "Tableaux de bord détaillés et insights personnalisés avancés",
      color: "from-violet-500 to-purple-600",
      delay: 0.6
    }
  ];

  const stats = [
    { value: "10K+", label: "Professionnels accompagnés", icon: Users },
    { value: "95%", label: "Satisfaction utilisateur", icon: Star },
    { value: "24/7", label: "Support disponible", icon: Zap }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 relative overflow-hidden">
      <AnimatedBackground mood="calm" />
      
      {/* Navigation Premium */}
      <motion.nav 
        className="relative z-50 p-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="container mx-auto flex justify-between items-center">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EmotionsCare
            </h1>
          </motion.div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/auth')}
              className="hover:bg-white/10 backdrop-blur-sm"
            >
              Connexion
            </Button>
            <Button 
              onClick={() => navigate('/choose-mode')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Commencer
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section Premium */}
      <section className="relative z-10 container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center space-x-2 mb-6">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                Nouvelle génération
              </span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Révolutionnez
              </span>
              <br />
              <span className="text-slate-800 dark:text-slate-100">
                votre bien-être émotionnel
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              La plateforme d'intelligence émotionnelle la plus avancée, 
              conçue spécialement pour les professionnels de santé. 
              Découvrez une expérience transformatrice.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                size="lg"
                onClick={() => navigate('/choose-mode')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <Play className="mr-2 h-5 w-5" />
                Commencer l'expérience
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 text-lg border-2 border-blue-200 hover:bg-blue-50 dark:border-blue-700 dark:hover:bg-blue-900/20"
              >
                Découvrir la démo
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-2">
                    <stat.icon className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-900">
              <div className="aspect-video">
                <HeroVideo className="rounded-3xl" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl" />
            </div>
            
            {/* Floating elements */}
            <motion.div
              className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-30"
              animate={{ 
                scale: [1, 1.3, 1],
                y: [0, -20, 0]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section Premium */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Fonctionnalités
            </span>
            <span className="text-slate-800 dark:text-slate-100"> révolutionnaires</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Découvrez notre suite complète d'outils d'intelligence émotionnelle, 
            conçue pour transformer votre approche du bien-être professionnel.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: feature.delay }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
            >
              <Card className="h-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section Premium */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-12 text-center text-white shadow-2xl"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Prêt à transformer votre bien-être ?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Rejoignez des milliers de professionnels qui ont déjà révolutionné 
              leur approche du bien-être émotionnel avec EmotionsCare.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/choose-mode')}
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Commencer gratuitement
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold"
              >
                Planifier une démo
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer Premium */}
      <footer className="relative z-10 container mx-auto px-6 py-12 text-center">
        <div className="flex justify-center items-center space-x-2 mb-4">
          <Heart className="h-5 w-5 text-red-500" />
          <span className="text-slate-600 dark:text-slate-400">
            Conçu avec passion pour votre bien-être
          </span>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-500">
          © 2024 EmotionsCare. Tous droits réservés. 
          Une expérience premium pour les professionnels de santé.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
