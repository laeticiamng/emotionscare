
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Building2, ArrowRight, ArrowLeft, Heart, Users } from 'lucide-react';

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
          <div className="flex items-center justify-center gap-2 mb-6">
            <Heart className="h-6 w-6 text-pink-500 animate-pulse" />
            <span className="text-purple-600 font-medium">Votre parenthèse commence ici</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-slate-900 dark:text-white">
            Choisissez votre expérience
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Que vous souhaitiez cultiver votre bien-être personnel ou développer 
            l'énergie collective de votre équipe, nous avons l'expérience qu'il vous faut.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Card className="h-full hover:shadow-2xl transition-all duration-500 cursor-pointer group border-2 hover:border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <User className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-slate-800 dark:text-white">
                  Expérience Particulier
                </CardTitle>
                <p className="text-pink-600 font-medium">Ma parenthèse personnelle</p>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Créez votre oasis de bien-être personnel. Prenez le temps de vous reconnecter 
                  à vos émotions avec des outils d'accompagnement sur mesure.
                </p>
                <ul className="text-left space-y-3 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    Scanner émotionnel IA personnalisé
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Coach virtuel adaptatif
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    Thérapie musicale sur mesure
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Journal émotionnel privé
                  </li>
                </ul>
                <Button 
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white group/btn" 
                  onClick={() => navigate('/b2c/login')}
                >
                  Commencer ma parenthèse
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Card className="h-full hover:shadow-2xl transition-all duration-500 cursor-pointer group border-2 hover:border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Building2 className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-slate-800 dark:text-white">
                  Expérience Entreprise
                </CardTitle>
                <p className="text-blue-600 font-medium">L'énergie partagée</p>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Cultivez le bien-être collectif de vos équipes. Transformez votre environnement 
                  professionnel en espace d'épanouissement partagé.
                </p>
                <ul className="text-left space-y-3 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Analyse du climat émotionnel
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    Outils collaboratifs bien-être
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Tableau de bord RH avancé
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    Suivi d'équipe en temps réel
                  </li>
                </ul>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white group/btn" 
                  onClick={() => navigate('/b2b/selection')}
                >
                  Énergiser mon équipe
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
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
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm p-6 rounded-2xl max-w-2xl mx-auto mb-8">
            <Users className="h-8 w-8 text-purple-500 mx-auto mb-4" />
            <p className="text-lg italic text-slate-600 dark:text-slate-400 leading-relaxed">
              "Le temps redevient un luxe accessible, et l'essentiel se retrouve dans l'énergie partagée"
            </p>
          </div>
          
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ChooseModePage;
