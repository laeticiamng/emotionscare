
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Heart, Building2, ArrowRight, Sparkles } from 'lucide-react';

const ChooseModePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900">
      <div className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
            <Sparkles className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Bienvenue dans EmotionsCare
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-4">
            Votre espace de bien-être émotionnel personnalisé
          </p>
          <p className="text-lg text-slate-500 dark:text-slate-500 max-w-2xl mx-auto italic">
            "Offrir à chacun une parenthèse, à chaque équipe une énergie partagée"
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-blue-200 bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-800 dark:to-blue-900/20">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Heart className="h-10 w-10 text-blue-600" />
                </div>
                <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Espace Particulier
                </CardTitle>
                <CardDescription className="text-base">
                  Votre parenthèse personnelle de bien-être
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <p className="text-slate-600 dark:text-slate-400">
                  Créez votre propre bulle de sérénité. Un espace où le temps redevient 
                  un luxe accessible pour vous reconnecter à l'essentiel.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center text-left space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Scanner émotionnel personnalisé</span>
                  </div>
                  <div className="flex items-center text-left space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Coach IA adapté à vos besoins</span>
                  </div>
                  <div className="flex items-center text-left space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Musique thérapeutique sur mesure</span>
                  </div>
                  <div className="flex items-center text-left space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Suivi personnel et objectifs</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    ✨ 3 jours d'essai gratuit
                  </p>
                </div>
                <Button 
                  className="w-full group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
                  onClick={() => navigate('/b2c/login')}
                >
                  Commencer mon parcours
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-slate-200 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-700/20">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Building2 className="h-10 w-10 text-slate-600" />
                </div>
                <CardTitle className="text-2xl text-slate-900 dark:text-white">
                  Espace Entreprise
                </CardTitle>
                <CardDescription className="text-base">
                  L'énergie partagée de votre équipe
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <p className="text-slate-600 dark:text-slate-400">
                  Cultivez le bien-être collectif. Un espace où l'énergie partagée 
                  devient le moteur d'une organisation épanouie.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center text-left space-x-3">
                    <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Dashboard administrateur</span>
                  </div>
                  <div className="flex items-center text-left space-x-3">
                    <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Espaces collaborateurs dédiés</span>
                  </div>
                  <div className="flex items-center text-left space-x-3">
                    <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Analytics d'équipe</span>
                  </div>
                  <div className="flex items-center text-left space-x-3">
                    <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Modules team building</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    🏢 Solution professionnelle
                  </p>
                </div>
                <Button 
                  className="w-full group bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600" 
                  onClick={() => navigate('/b2b/selection')}
                >
                  Accéder à l'espace entreprise
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-8 rounded-3xl max-w-4xl mx-auto">
            <p className="text-xl font-light text-slate-700 dark:text-slate-300 italic leading-relaxed">
              "Ici, le temps redevient un luxe accessible, et l'essentiel se retrouve 
              dans l'énergie partagée."
            </p>
            <div className="mt-6 h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChooseModePage;
