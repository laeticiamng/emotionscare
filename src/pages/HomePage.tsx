
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Building2, Sparkles, Users, Brain, Music } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Brain, title: "Analyse IA avancée", description: "Intelligence émotionnelle de pointe" },
    { icon: Music, title: "Musicothérapie personnalisée", description: "Musique adaptée à vos émotions" },
    { icon: Users, title: "Communauté bienveillante", description: "Entraide et soutien mutuel" },
    { icon: Sparkles, title: "Expérience immersive", description: "VR et technologies innovantes" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10" />
        <div className="relative container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge variant="outline" className="mb-6 px-6 py-2 text-sm font-medium bg-white/80 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Plateforme d'intelligence émotionnelle
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
              EmotionsCare
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-4 font-light">
              Plateforme d'intelligence émotionnelle pour le bien-être personnel et professionnel
            </p>
            
            <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
              Analysez, comprenez et améliorez votre bien-être émotionnel avec nos outils innovants
            </p>

            {/* Features Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Cards Section */}
      <div className="container mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto"
        >
          {/* Espace Particulier */}
          <Card className="group relative overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200/50 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 group-hover:from-pink-500/10 group-hover:to-purple-500/10 transition-all duration-500" />
            
            <CardHeader className="relative z-10 text-center pb-6">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl"
              >
                <Heart className="w-10 h-10 text-white" />
              </motion.div>
              
              <CardTitle className="text-3xl font-bold text-gray-800 mb-3">
                Espace Particulier
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Accédez à votre espace personnel pour analyser vos émotions et améliorer votre bien-être.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="relative z-10 space-y-4">
              <div className="space-y-3 mb-8">
                {[
                  'Analyse émotionnelle personnelle',
                  'Musique thérapeutique',
                  'Coach IA personnel',
                  'Journal intime'
                ].map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className="flex items-center text-gray-700"
                  >
                    <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mr-3" />
                    <span className="font-medium">{feature}</span>
                  </motion.div>
                ))}
              </div>
              
              <Button
                onClick={() => navigate('/b2c/login')}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                Accéder à Espace Particulier
                <Heart className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>

          {/* Espace Entreprise */}
          <Card className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200/50 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-500" />
            
            <CardHeader className="relative z-10 text-center pb-6">
              <motion.div
                whileHover={{ scale: 1.1, rotate: -5 }}
                className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl"
              >
                <Building2 className="w-10 h-10 text-white" />
              </motion.div>
              
              <CardTitle className="text-3xl font-bold text-gray-800 mb-3">
                Espace Entreprise
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Solutions complètes pour le bien-être émotionnel de vos équipes et collaborateurs.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="relative z-10 space-y-4">
              <div className="space-y-3 mb-8">
                {[
                  'Gestion des équipes',
                  'Analytics RH',
                  'Rapports détaillés',
                  'Suivi collaborateurs'
                ].map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className="flex items-center text-gray-700"
                  >
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full mr-3" />
                    <span className="font-medium">{feature}</span>
                  </motion.div>
                ))}
              </div>
              
              <Button
                onClick={() => navigate('/b2b/selection')}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                Accéder à Espace Entreprise
                <Building2 className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-20"
        >
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 text-white max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Commencez votre parcours de bien-être émotionnel
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Rejoignez des milliers d'utilisateurs qui transforment leur vie avec EmotionsCare
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/b2c/login')}
                variant="secondary"
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8"
              >
                Essai gratuit particulier
              </Button>
              <Button
                onClick={() => navigate('/b2b/selection')}
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-purple-600 font-semibold px-8"
              >
                Solution entreprise
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
