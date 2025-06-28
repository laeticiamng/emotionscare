
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Music, 
  Zap, 
  Target, 
  Headphones, 
  Users,
  Sparkles,
  Heart,
  BookOpen,
  MessageCircle,
  Trophy,
  ArrowRight,
  Play,
  Star
} from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const immersiveFeatures = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Scanner Émotionnel",
      description: "Analyse IA avancée de vos émotions en temps réel",
      path: "/scan",
      color: "from-blue-500 to-cyan-500",
      premium: true
    },
    {
      icon: <Music className="h-8 w-8" />,
      title: "Musicothérapie Adaptative",
      description: "Compositions musicales personnalisées selon votre état",
      path: "/music",
      color: "from-purple-500 to-pink-500",
      premium: true
    },
    {
      icon: <Headphones className="h-8 w-8" />,
      title: "Réalité Virtuelle",
      description: "Expériences immersives pour le bien-être mental",
      path: "/vr",
      color: "from-green-500 to-emerald-500",
      premium: true
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "Coach IA Personnel",
      description: "Accompagnement intelligent 24/7",
      path: "/coach",
      color: "from-orange-500 to-red-500",
      premium: true
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Journal Émotionnel",
      description: "Suivez votre progression et vos insights",
      path: "/journal",
      color: "from-indigo-500 to-blue-500",
      premium: false
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "Gamification",
      description: "Défis et récompenses pour votre croissance",
      path: "/gamification",
      color: "from-yellow-500 to-orange-500",
      premium: false
    }
  ];

  const quickActions = [
    { title: "Flash Glow", path: "/flash-glow", icon: <Zap className="h-5 w-5" /> },
    { title: "Mood Mixer", path: "/mood-mixer", icon: <Sparkles className="h-5 w-5" /> },
    { title: "Breathwork", path: "/breathwork", icon: <Heart className="h-5 w-5" /> },
    { title: "Social Cocon", path: "/social-cocon", icon: <Users className="h-5 w-5" /> }
  ];

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.02"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
            <Sparkles className="h-4 w-4 text-yellow-400 mr-2" />
            <span className="text-white/90 text-sm font-medium">Plateforme Premium de Bien-être Mental</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-6 leading-tight">
            EmotionsCare
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            Transformez votre bien-être mental avec l'IA la plus avancée. 
            Une expérience immersive et personnalisée pour votre équilibre émotionnel.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/choose-mode')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
            >
              <Play className="h-5 w-5 mr-2" />
              Commencer l'Expérience
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/vr')}
              className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm"
            >
              <Headphones className="h-5 w-5 mr-2" />
              Découvrir la VR
            </Button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {immersiveFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group cursor-pointer"
              onClick={() => navigate(feature.path)}
            >
              <Card className="h-full bg-white/5 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10">
                <CardContent className="p-8">
                  {feature.premium && (
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} shadow-lg`}>
                        {feature.icon}
                      </div>
                      <div className="flex items-center px-2 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full">
                        <Star className="h-3 w-3 text-yellow-900 mr-1" />
                        <span className="text-xs font-bold text-yellow-900">PREMIUM</span>
                      </div>
                    </div>
                  )}
                  
                  {!feature.premium && (
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} shadow-lg mb-4 w-fit`}>
                      {feature.icon}
                    </div>
                  )}
                  
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-white/70 leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  
                  <div className="flex items-center text-blue-400 font-medium">
                    Découvrir
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-8">Actions Rapides</h2>
          
          <div className="flex flex-wrap justify-center gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.title}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(action.path)}
                className="flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full border border-white/20 text-white hover:text-blue-300 transition-all duration-300"
              >
                {action.icon}
                <span className="ml-2 font-medium">{action.title}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-center mt-20"
        >
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl rounded-3xl p-12 border border-white/10">
            <h2 className="text-4xl font-bold text-white mb-4">
              Prêt à Transformer Votre Bien-être ?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers d'utilisateurs qui ont déjà transformé leur vie émotionnelle
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
            >
              Commencer Gratuitement
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
