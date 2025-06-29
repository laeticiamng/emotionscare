
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Sparkles, 
  Brain, 
  Heart, 
  Zap, 
  Star, 
  ArrowRight,
  Music,
  MessageCircle,
  BookOpen,
  Target,
  Users,
  Gamepad2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedBackground from '@/components/home/AnimatedBackground';
import MoodPicker from '@/components/home/MoodPicker';

const HomePage: React.FC = () => {
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    setShowMoodPicker(false);
  };

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Scanner d'Émotions",
      description: "Analysez vos émotions en temps réel avec notre IA avancée",
      path: "/scan",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Music className="w-8 h-8" />,
      title: "Thérapie Musicale",
      description: "Playlists personnalisées selon votre état émotionnel",
      path: "/music",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Journal Émotionnel",
      description: "Suivez votre évolution émotionnelle au quotidien",
      path: "/journal",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Coach IA",
      description: "Accompagnement personnalisé par intelligence artificielle",
      path: "/coach",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Réalité Virtuelle",
      description: "Expériences immersives pour le bien-être",
      path: "/vr",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: <Gamepad2 className="w-8 h-8" />,
      title: "Gamification",
      description: "Défis et récompenses pour votre progression",
      path: "/gamification",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>
      
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      {/* Animated Background */}
      <AnimatedBackground mood={selectedMood} />
      
      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              EmotionsCare
            </span>
          </motion.div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="text-white/80 hover:text-white hover:bg-white/10"
              onClick={() => setShowMoodPicker(true)}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Choisir mon humeur
            </Button>
            <Button 
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10"
              asChild
            >
              <Link to="/auth">Connexion</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight">
              Votre Bien-Être
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Émotionnel
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Découvrez une plateforme révolutionnaire qui combine intelligence artificielle 
              et neurosciences pour transformer votre relation avec vos émotions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 text-lg font-semibold shadow-2xl"
                asChild
              >
                <Link to="/choose-mode">
                  Commencer l'expérience
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg"
                onClick={() => setShowMoodPicker(true)}
              >
                <Zap className="w-5 h-5 mr-2" />
                Scan Express
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300 group cursor-pointer">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} p-4 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">{feature.description}</p>
                  <Button 
                    variant="ghost" 
                    className="text-white/80 hover:text-white p-0 h-auto font-semibold"
                    asChild
                  >
                    <Link to={feature.path} className="flex items-center">
                      Découvrir
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
              <div className="text-4xl font-bold text-white mb-2">95%</div>
              <div className="text-gray-300">Satisfaction utilisateurs</div>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
              <div className="text-4xl font-bold text-white mb-2">50K+</div>
              <div className="text-gray-300">Analyses émotionnelles</div>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-300">Support IA disponible</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mood Picker Modal */}
      {showMoodPicker && (
        <MoodPicker 
          onSelect={handleMoodSelect}
          onClose={() => setShowMoodPicker(false)}
        />
      )}

      {/* Floating Action Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="fixed bottom-8 right-8 z-20"
      >
        <Button 
          size="lg"
          className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-2xl"
          onClick={() => setShowMoodPicker(true)}
        >
          <Star className="w-6 h-6" />
        </Button>
      </motion.div>
    </div>
  );
};

export default HomePage;
