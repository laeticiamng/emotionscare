
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, UserCheck, Shield, BarChart3, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const B2BSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  const userTypes = [
    {
      icon: Users,
      title: 'Collaborateur',
      description: 'Accédez à vos outils de bien-être personnels et participez aux initiatives de votre entreprise',
      features: [
        'Scan émotionnel personnel',
        'Coach IA adapté au travail',
        'Sessions VR de décompression',
        'Journal de bien-être',
        'Communauté d\'entreprise'
      ],
      cta: 'Accès Collaborateur',
      route: '/b2b/user/login',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: UserCheck,
      title: 'Administrateur RH',
      description: 'Gérez le bien-être de vos équipes avec des outils d\'analyse et de suivi avancés',
      features: [
        'Dashboard équipes complet',
        'Analyses de bien-être collectif',
        'Gestion des utilisateurs',
        'Rapports détaillés',
        'Outils de prévention',
        'Conformité RGPD'
      ],
      cta: 'Accès Administrateur',
      route: '/b2b/admin/login',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Sécurité Renforcée',
      description: 'Chiffrement de niveau entreprise et conformité RGPD complète'
    },
    {
      icon: BarChart3,
      title: 'Analytics Avancés',
      description: 'Tableaux de bord et rapports pour mesurer l\'impact sur le bien-être'
    },
    {
      icon: Heart,
      title: 'Prévention Active',
      description: 'Outils de détection précoce des risques psychosociaux'
    },
    {
      icon: Building2,
      title: 'Intégration Simple',
      description: 'Déploiement rapide et intégration avec vos outils existants'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-6">
              <Building2 className="h-12 w-12 text-blue-600 mr-4" />
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
                Espace Entreprise
              </h1>
            </div>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Renforcez le bien-être de vos équipes avec EmotionsCare Business. 
              Une solution complète pour prendre soin de la santé mentale au travail.
            </p>
          </motion.div>
        </div>
      </section>

      {/* User Type Selection */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choisissez Votre Type d'Accès
            </h2>
            <p className="text-lg text-gray-600">
              Sélectionnez le profil correspondant à votre rôle dans l'entreprise
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {userTypes.map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200">
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${type.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <type.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl">{type.title}</CardTitle>
                    <CardDescription className="text-base mt-2">
                      {type.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">Fonctionnalités incluses :</h4>
                      <ul className="space-y-1">
                        {type.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button 
                      className={`w-full mt-6 bg-gradient-to-r ${type.color} hover:opacity-90 transition-opacity`}
                      onClick={() => navigate(type.route)}
                    >
                      {type.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi Choisir EmotionsCare Business ?
            </h2>
            <p className="text-lg text-gray-600">
              Une solution pensée pour l'entreprise moderne et ses défis
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Découvrez EmotionsCare en Action
          </h2>
          <p className="text-xl mb-8">
            Demandez une démonstration personnalisée pour votre entreprise
          </p>
          <div className="space-x-4">
            <Button 
              size="lg" 
              variant="secondary"
              className="px-8 py-4 text-lg"
            >
              Demander une Démo
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-blue-600"
              onClick={() => navigate('/')}
            >
              Retour à l'Accueil
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default B2BSelectionPage;
