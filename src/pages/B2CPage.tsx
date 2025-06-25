
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Heart, Shield, Users, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const B2CPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Heart,
      title: 'Scan Émotionnel Personnel',
      description: 'Analysez votre état émotionnel en temps réel avec notre IA avancée'
    },
    {
      icon: Users,
      title: 'Coach IA Personnalisé',
      description: 'Bénéficiez de conseils personnalisés 24h/24 adaptés à vos besoins'
    },
    {
      icon: Shield,
      title: 'Données Sécurisées',
      description: 'Vos informations personnelles sont protégées par un chiffrement de niveau bancaire'
    },
    {
      icon: Sparkles,
      title: 'Expérience VR Immersive',
      description: 'Détendez-vous avec nos environnements de réalité virtuelle thérapeutiques'
    }
  ];

  const plans = [
    {
      name: 'Gratuit',
      price: '0€',
      period: '/mois',
      features: [
        '3 scans émotionnels par jour',
        'Accès au coach IA basique',
        'Journal personnel',
        'Communauté sociale'
      ],
      cta: 'Commencer gratuitement',
      popular: false
    },
    {
      name: 'Premium',
      price: '19€',
      period: '/mois',
      features: [
        'Scans émotionnels illimités',
        'Coach IA avancé avec personnalisation',
        'Expériences VR complètes',
        'Analyses et rapports détaillés',
        'Support prioritaire',
        'Synchronisation multi-appareils'
      ],
      cta: 'Essai gratuit 7 jours',
      popular: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Votre Bien-être,
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {' '}Notre Priorité
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Découvrez EmotionsCare, la plateforme de bien-être émotionnel qui vous accompagne 
              au quotidien avec des outils personnalisés et une intelligence artificielle dédiée.
            </p>
            <div className="space-x-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/b2c/register')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 text-lg"
              >
                Commencer Gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/b2c/login')}
                className="px-8 py-4 text-lg border-2"
              >
                Se Connecter
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Des Outils Puissants pour Votre Bien-être
            </h2>
            <p className="text-lg text-gray-600">
              Tout ce dont vous avez besoin pour prendre soin de votre santé mentale
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choisissez Votre Plan
            </h2>
            <p className="text-lg text-gray-600">
              Commencez gratuitement, évoluez selon vos besoins
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className={`h-full ${plan.popular ? 'border-2 border-blue-600 shadow-lg' : ''}`}>
                  <CardHeader className="text-center">
                    {plan.popular && (
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium mb-4 mx-auto w-fit">
                        Le plus populaire
                      </div>
                    )}
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="text-4xl font-bold text-gray-900 mt-4">
                      {plan.price}
                      <span className="text-lg text-gray-600 font-normal">{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full mt-6 ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                          : ''
                      }`}
                      variant={plan.popular ? 'default' : 'outline'}
                      onClick={() => navigate(plan.name === 'Gratuit' ? '/b2c/register' : '/b2c/register?plan=premium')}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à Transformer Votre Bien-être ?
          </h2>
          <p className="text-xl mb-8">
            Rejoignez des milliers d'utilisateurs qui ont déjà amélioré leur qualité de vie
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate('/b2c/register')}
            className="px-8 py-4 text-lg"
          >
            Commencer Maintenant
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default B2CPage;
