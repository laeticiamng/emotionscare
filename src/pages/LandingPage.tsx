
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Brain, 
  Music, 
  Scan, 
  Bot, 
  BookOpen, 
  ArrowRight,
  CheckCircle,
  Users,
  Shield,
  Sparkles
} from 'lucide-react';
import HeroSection from '@/components/home/HeroSection';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Scan,
      title: 'Scanner d\'émotions IA',
      description: 'Analysez vos émotions en temps réel grâce à l\'intelligence artificielle avancée',
      color: 'bg-blue-500'
    },
    {
      icon: Bot,
      title: 'Coach personnel',
      description: 'Un assistant IA disponible 24h/24 pour vous accompagner dans votre bien-être',
      color: 'bg-green-500'
    },
    {
      icon: Music,
      title: 'Musicothérapie',
      description: 'Musiques personnalisées selon votre état émotionnel pour optimiser votre humeur',
      color: 'bg-purple-500'
    },
    {
      icon: BookOpen,
      title: 'Journal intelligent',
      description: 'Tenez un journal avec des insights IA pour mieux comprendre vos émotions',
      color: 'bg-orange-500'
    }
  ];

  const plans = [
    {
      name: 'Particulier',
      price: 'Gratuit',
      period: '3 jours d\'essai',
      description: 'Parfait pour découvrir EmotionsCare',
      features: [
        'Scanner d\'émotions illimité',
        'Coach IA personnel',
        'Musicothérapie de base',
        'Journal personnel'
      ],
      action: () => navigate('/b2c/register'),
      highlight: false
    },
    {
      name: 'Entreprise',
      price: 'Sur devis',
      period: 'par collaborateur/mois',
      description: 'Solution complète pour votre organisation',
      features: [
        'Toutes les fonctionnalités particulier',
        'Analytics équipe',
        'Gestion des utilisateurs',
        'Support prioritaire',
        'Rapports de bien-être'
      ],
      action: () => navigate('/b2b/selection'),
      highlight: true
    }
  ];

  const benefits = [
    'Amélioration du bien-être émotionnel',
    'Réduction du stress et de l\'anxiété',
    'Meilleure connaissance de soi',
    'Outils basés sur la science',
    'Interface intuitive et sécurisée',
    'Support professionnel continu'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Fonctionnalités principales */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Une plateforme complète pour votre bien-être
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Découvrez nos outils innovants basés sur l'intelligence artificielle pour prendre soin de votre santé émotionnelle
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="text-center">
                    <div className={`mx-auto p-3 ${feature.color} rounded-full w-fit mb-4`}>
                      <feature.icon className="h-8 w-8 text-white" />
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

      {/* Bénéfices */}
      <section className="py-16 bg-blue-50 dark:bg-blue-900/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Pourquoi choisir EmotionsCare ?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Une approche scientifique du bien-être émotionnel
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center space-x-3"
              >
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans et tarifs */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Choisissez votre formule
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Solutions adaptées à vos besoins personnels et professionnels
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className={`h-full relative ${plan.highlight ? 'border-blue-500 border-2' : ''}`}>
                  {plan.highlight && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                      Populaire
                    </Badge>
                  )}
                  <CardHeader className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      {plan.name === 'Particulier' ? (
                        <Heart className="h-6 w-6 text-blue-500" />
                      ) : (
                        <Users className="h-6 w-6 text-green-500" />
                      )}
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    </div>
                    <div className="text-3xl font-bold">{plan.price}</div>
                    <CardDescription>{plan.period}</CardDescription>
                    <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      onClick={plan.action}
                      className="w-full"
                      variant={plan.highlight ? "default" : "outline"}
                    >
                      {plan.name === 'Particulier' ? 'Essayer gratuitement' : 'Demander un devis'}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à prendre soin de votre bien-être ?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Rejoignez des milliers d'utilisateurs qui ont déjà amélioré leur qualité de vie avec EmotionsCare
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/choose-mode')}
                size="lg" 
                variant="secondary"
                className="text-blue-600"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Commencer maintenant
              </Button>
              <Button 
                onClick={() => navigate('/b2b/selection')}
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                <Shield className="h-5 w-5 mr-2" />
                Solutions entreprise
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
