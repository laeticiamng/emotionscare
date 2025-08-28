/**
 * B2BLandingPage - Page de destination B2B complète
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Shield, BarChart3, Heart, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Routes } from '@/routerV2';

const B2BLandingPageComplete: React.FC = () => {
  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Gestion d'équipe",
      description: "Suivez le bien-être de vos collaborateurs en temps réel"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Sécurité des données",
      description: "Conformité RGPD et chiffrement bout-en-bout"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Analytics RH",
      description: "Tableaux de bord détaillés et rapports personnalisés"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Programmes bien-être",
      description: "Modules de méditation, gestion du stress et coaching"
    }
  ];

  const benefits = [
    "Réduction de 40% du stress au travail",
    "Amélioration de 25% de la productivité",
    "Diminution de 60% de l'absentéisme",
    "ROI de 300% sur le bien-être"
  ];

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Transformez le bien-être de vos{' '}
                <span className="text-blue-600">équipes</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                EmotionsCare B2B offre une plateforme complète de bien-être mental 
                pour vos collaborateurs avec des outils de gestion avancés pour les RH.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={Routes.signup({ segment: 'b2b' })}>
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Demander une démo
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link to={Routes.login({ segment: 'b2b' })}>
                  <Button size="lg" variant="outline">
                    Espace client
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Une solution complète pour le bien-être en entreprise
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez comment EmotionsCare peut transformer la culture du bien-être dans votre organisation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Résultats prouvés
              </h2>
              <p className="text-lg text-gray-600">
                Nos clients constatent des améliorations mesurables
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-lg text-gray-800">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center text-white"
          >
            <h2 className="text-3xl font-bold mb-4">
              Prêt à transformer votre entreprise ?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Rejoignez plus de 500 entreprises qui font confiance à EmotionsCare
            </p>
            <Link to={Routes.signup({ segment: 'b2b' })}>
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                Commencer maintenant
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default B2BLandingPageComplete;