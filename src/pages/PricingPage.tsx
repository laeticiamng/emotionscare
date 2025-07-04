import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Crown } from 'lucide-react';

const PricingPage: React.FC = () => {
  const plans = [
    {
      name: 'Essential',
      price: '9.99',
      period: '/mois',
      description: 'Parfait pour commencer votre parcours bien-être',
      icon: <Star className="h-6 w-6" />,
      features: [
        'Scan émotionnel quotidien',
        'Journal personnel',
        'Recommandations musicales de base',
        'Coach IA limité (10 conversations/mois)',
        'Accès aux modules de base',
        'Support par email'
      ],
      popular: false,
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Premium',
      price: '19.99',
      period: '/mois',
      description: 'L\'expérience complète pour votre bien-être',
      icon: <Zap className="h-6 w-6" />,
      features: [
        'Tout du plan Essential',
        'Scan émotionnel illimité',
        'Coach IA avancé (conversations illimitées)',
        'Musicothérapie personnalisée',
        'Modules VR exclusifs',
        'Analytics détaillés',
        'Gamification complète',
        'Export de données',
        'Support prioritaire'
      ],
      popular: true,
      color: 'from-purple-500 to-purple-600'
    },
    {
      name: 'Enterprise',
      price: 'Sur mesure',
      period: '',
      description: 'Solution complète pour les organisations',
      icon: <Crown className="h-6 w-6" />,
      features: [
        'Tout du plan Premium',
        'Dashboard administrateur',
        'Gestion d\'équipes',
        'Rapports avancés',
        'API personnalisée',
        'Formation dédiée',
        'Support 24/7',
        'Conformité RGPD',
        'Intégrations sur mesure'
      ],
      popular: false,
      color: 'from-amber-500 to-amber-600'
    }
  ];

  const features = [
    'Scan émotionnel IA avancé',
    'Musicothérapie personnalisée',
    'Coach virtuel intelligent',
    'Modules VR immersifs',
    'Journal émotionnel',
    'Analytics détaillés',
    'Gamification motivante',
    'Communauté bienveillante'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Choisissez votre plan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez la plateforme EmotionsCare qui révolutionne le bien-être émotionnel 
            avec l'intelligence artificielle et la musicothérapie.
          </p>
        </motion.div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-1">
                    Le plus populaire
                  </Badge>
                </div>
              )}
              <Card className={`h-full ${plan.popular ? 'ring-2 ring-purple-500 shadow-lg' : ''}`}>
                <CardHeader className="text-center pb-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center text-white mx-auto mb-4`}>
                    {plan.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <p className="text-muted-foreground text-sm">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">{plan.price}€</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white border-0`}
                    size="lg"
                  >
                    {plan.name === 'Enterprise' ? 'Nous contacter' : 'Commencer maintenant'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-8">Fonctionnalités incluses</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="bg-card rounded-lg p-4 border">
                <p className="text-sm font-medium">{feature}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Prêt à transformer votre bien-être ?</h3>
              <p className="text-muted-foreground mb-6">
                Rejoignez des milliers d'utilisateurs qui ont déjà amélioré leur qualité de vie 
                avec EmotionsCare.
              </p>
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80">
                Essai gratuit 14 jours
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingPage;