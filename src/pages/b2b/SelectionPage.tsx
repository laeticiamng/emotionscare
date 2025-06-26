
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Shield, BarChart3, Settings, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { UNIFIED_ROUTES } from '@/utils/routeUtils';

const B2BSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  const userTypes = [
    {
      id: 'user',
      title: 'Collaborateur',
      description: 'Accédez aux outils de bien-être de votre entreprise',
      icon: Users,
      color: 'bg-gradient-to-br from-blue-500 to-cyan-600',
      features: [
        'Dashboard personnel',
        'Scan émotionnel',
        'Coach IA dédié',
        'Suivi de progression',
        'Accès aux ressources'
      ],
      route: UNIFIED_ROUTES.B2B_USER_LOGIN,
      buttonText: 'Connexion Collaborateur'
    },
    {
      id: 'admin',
      title: 'Administrateur RH',
      description: 'Gérez le bien-être de vos équipes avec des outils avancés',
      icon: Shield,
      color: 'bg-gradient-to-br from-purple-500 to-indigo-600',
      features: [
        'Tableau de bord équipe',
        'Analytics avancées',
        'Gestion multi-utilisateurs',
        'Rapports détaillés',
        'Configuration système'
      ],
      route: UNIFIED_ROUTES.B2B_ADMIN_LOGIN,
      buttonText: 'Connexion Administrateur',
      premium: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mb-6">
            <Building2 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Espace Entreprise
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Solutions professionnelles pour le bien-être émotionnel de vos collaborateurs
          </p>
        </motion.div>

        {/* User Type Selection */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {userTypes.map((type, index) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="h-full relative overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                {type.premium && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Premium
                    </div>
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 rounded-2xl ${type.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <type.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl mb-2">{type.title}</CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">{type.description}</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {type.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    onClick={() => navigate(type.route)}
                    className={`w-full ${type.color} text-white border-0 hover:shadow-lg transition-all duration-300 py-6 text-lg font-semibold`}
                  >
                    <type.icon className="mr-2 h-5 w-5" />
                    {type.buttonText}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Registration Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mb-12"
        >
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <UserCheck className="h-12 w-12 text-blue-500 mb-4 mx-auto" />
              <h3 className="text-2xl font-bold mb-4">Nouvelle entreprise ?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Créez un compte pour votre organisation et commencez à prendre soin du bien-être de vos équipes
              </p>
              <Button 
                onClick={() => navigate(UNIFIED_ROUTES.B2B_USER_REGISTER)}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8"
              >
                Créer un compte entreprise
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {[
            {
              icon: BarChart3,
              title: 'Analytics Avancées',
              description: 'Suivez la santé émotionnelle de vos équipes avec des données précises'
            },
            {
              icon: Shield,
              title: 'Sécurité Enterprise',
              description: 'Données protégées avec les plus hauts standards de sécurité'
            },
            {
              icon: Settings,
              title: 'Configuration Flexible',
              description: 'Adaptez la plateforme aux besoins spécifiques de votre organisation'
            }
          ].map((feature, index) => (
            <Card key={index} className="text-center p-6">
              <feature.icon className="h-12 w-12 text-blue-500 mb-4 mx-auto" />
              <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.description}</p>
            </Card>
          ))}
        </motion.div>

        {/* Back to Selection */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <Button 
            variant="outline" 
            onClick={() => navigate(UNIFIED_ROUTES.CHOOSE_MODE)}
            className="px-8"
          >
            Retour au choix d'espace
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default B2BSelectionPage;
