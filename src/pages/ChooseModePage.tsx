
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Building2, Users, Shield, Zap, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { UNIFIED_ROUTES } from '@/utils/routeUtils';

const ChooseModePage: React.FC = () => {
  const navigate = useNavigate();

  const modes = [
    {
      id: 'b2c',
      title: 'Espace Personnel',
      description: 'Prenez soin de votre bien-être émotionnel avec des outils personnalisés',
      icon: Heart,
      color: 'bg-gradient-to-br from-pink-500 to-rose-600',
      features: ['Scan émotionnel personnel', 'Coach IA dédié', 'Journal privé', 'Musicothérapie'],
      route: UNIFIED_ROUTES.B2C_LOGIN,
      popular: true
    },
    {
      id: 'b2b',
      title: 'Espace Entreprise',
      description: 'Solutions professionnelles pour le bien-être de vos équipes',
      icon: Building2,
      color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      features: ['Tableau de bord RH', 'Analytics équipe', 'Gestion multi-utilisateurs', 'Rapports détaillés'],
      route: UNIFIED_ROUTES.B2B_SELECTION,
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Choisissez votre espace
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Sélectionnez l'expérience qui correspond à vos besoins pour commencer votre parcours bien-être
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {modes.map((mode, index) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="h-full relative overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                {mode.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      Populaire
                    </div>
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 rounded-2xl ${mode.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <mode.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl mb-2">{mode.title}</CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">{mode.description}</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {mode.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    onClick={() => navigate(mode.route)}
                    className={`w-full ${mode.color} text-white border-0 hover:shadow-lg transition-all duration-300 py-6 text-lg font-semibold`}
                  >
                    <mode.icon className="mr-2 h-5 w-5" />
                    Accéder à {mode.title}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Vous avez déjà un compte ?
          </p>
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="px-8"
          >
            Retour à l'accueil
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ChooseModePage;
