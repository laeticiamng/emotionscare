
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Building, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

const ChooseModePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900">
      <div className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Sparkles className="h-16 w-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-6 text-slate-900 dark:text-white">
            Choisissez votre expérience
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            EmotionsCare s'adapte à vos besoins. Sélectionnez l'espace qui vous correspond.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-pink-200">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Heart className="h-10 w-10 text-pink-600" />
                </div>
                <CardTitle className="text-2xl">Espace Particulier</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <p className="text-slate-600 dark:text-slate-400">
                  Un espace personnel dédié à votre bien-être émotionnel. 
                  Prenez du temps pour vous avec des outils adaptés à votre rythme.
                </p>
                <ul className="text-left space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li>• Scanner émotionnel personnel</li>
                  <li>• Coach IA adaptatif</li>
                  <li>• Musicothérapie personnalisée</li>
                  <li>• Suivi de progression</li>
                  <li>• Interface zen et apaisante</li>
                </ul>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">
                    ✨ 3 jours d'essai gratuit
                  </p>
                </div>
                <Button 
                  className="w-full group bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700" 
                  onClick={() => navigate('/b2c/register')}
                >
                  Commencer gratuitement
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline"
                  className="w-full" 
                  onClick={() => navigate('/b2c/login')}
                >
                  J'ai déjà un compte
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-blue-200">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Building className="h-10 w-10 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Espace Entreprise</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <p className="text-slate-600 dark:text-slate-400">
                  Solutions professionnelles pour le bien-être de vos équipes. 
                  Analysez, accompagnez et améliorez le climat organisationnel.
                </p>
                <ul className="text-left space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li>• Tableau de bord RH avancé</li>
                  <li>• Analytics d'équipe en temps réel</li>
                  <li>• Outils de gestion des collaborateurs</li>
                  <li>• Rapports de bien-être détaillés</li>
                  <li>• Support et formation inclus</li>
                </ul>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">
                    🏢 Solution complète B2B
                  </p>
                </div>
                <Button 
                  className="w-full group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
                  onClick={() => navigate('/b2b/selection')}
                >
                  Découvrir les solutions
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
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-center mt-12 text-sm text-slate-400"
        >
          EmotionsCare - Le bien-être ne s'explique pas, il se vit
        </motion.div>
      </div>
    </div>
  );
};

export default ChooseModePage;
