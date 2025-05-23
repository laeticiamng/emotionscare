
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Building2, Heart, ArrowRight } from 'lucide-react';

const ChooseModePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900">
      <div className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Choisissez votre expérience
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            EmotionsCare s'adapte à vos besoins. Particulier ou professionnel, découvrez l'expérience qui vous correspond.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-blue-200">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Heart className="h-10 w-10 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Particuliers</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <p className="text-slate-600 dark:text-slate-400">
                  Une expérience personnalisée pour votre bien-être quotidien. 
                  Trouvez votre équilibre, à votre rythme.
                </p>
                <ul className="text-left space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li>• Scanner émotionnel personnel</li>
                  <li>• Coach IA dédié</li>
                  <li>• Musicothérapie adaptée</li>
                  <li>• Journal de bien-être</li>
                </ul>
                <Button 
                  className="w-full group" 
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
            <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-purple-200">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Building2 className="h-10 w-10 text-purple-600" />
                </div>
                <CardTitle className="text-2xl">Entreprises</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <p className="text-slate-600 dark:text-slate-400">
                  Transformez le bien-être de vos équipes avec une solution complète 
                  et des outils d'analyse avancés.
                </p>
                <ul className="text-left space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li>• Tableau de bord RH</li>
                  <li>• Analyses d'équipe</li>
                  <li>• Modules collaboratifs</li>
                  <li>• Accompagnement personnalisé</li>
                </ul>
                <Button 
                  className="w-full group" 
                  variant="outline"
                  onClick={() => navigate('/b2b/selection')}
                >
                  Découvrir l'offre entreprise
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
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            Vous hésitez ? Découvrez d'abord notre approche
          </p>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
          >
            Retour à l'accueil
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ChooseModePage;
