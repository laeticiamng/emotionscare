/**
 * PricingPage - Page de tarification complète
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  Star, 
  Zap, 
  Crown, 
  Building2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

interface PricingPageProps {
  'data-testid'?: string;
}

const plans = [
  {
    name: 'Gratuit',
    price: '0€',
    period: 'pour toujours',
    description: 'Parfait pour découvrir EmotionsCare',
    icon: Zap,
    popular: false,
    features: [
      'Coach IA basique (5 conversations/mois)',
      'Analyse d\'émotions limitée',
      'Exercices de respiration de base',
      'Journal personnel',
      'Support communautaire'
    ],
    limitations: [
      'Pas de génération musicale',
      'Pas d\'analytics avancées',
      'Pas de VR'
    ],
    cta: 'Commencer gratuitement',
    color: 'border-gray-200'
  },
  {
    name: 'Premium',
    price: '9€',
    period: '/mois',
    description: 'Pour une expérience complète du bien-être',
    icon: Star,
    popular: true,
    features: [
      'Coach IA avancé (conversations illimitées)',
      'Analyses émotionnelles complètes',
      'Génération musicale thérapeutique',
      'Tous les exercices et jeux',
      'Analytics personnelles détaillées',
      'Export des données',
      'Support prioritaire'
    ],
    limitations: [],
    cta: 'Essai gratuit 14 jours',
    color: 'border-primary'
  },
  {
    name: 'Pro',
    price: '19€',
    period: '/mois',
    description: 'Pour les professionnels du bien-être',
    icon: Crown,
    popular: false,
    features: [
      'Toutes les fonctionnalités Premium',
      'Méditation VR complète',
      'API accès complet',
      'Intégrations tierces',
      'Dashboard professionnel',
      'Multi-utilisateurs (5 comptes)',
      'Formation certifiée incluse',
      'Support dédié'
    ],
    limitations: [],
    cta: 'Démarrer Pro',
    color: 'border-gold-400'
  },
  {
    name: 'Entreprise',
    price: 'Sur mesure',
    period: '',
    description: 'Solution complète pour organisations',
    icon: Building2,
    popular: false,
    features: [
      'Déploiement on-premise/cloud',
      'IA personnalisée secteur',
      'Intégration SIRH complète',
      'Support 24/7/365',
      'Conformité renforcée (RGPD+)',
      'Formation sur site',
      'Analytics équipe avancées',
      'Account manager dédié'
    ],
    limitations: [],
    cta: 'Nous contacter',
    color: 'border-purple-400'
  }
];

const faqs = [
  {
    question: 'Puis-je changer de plan à tout moment ?',
    answer: 'Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements prennent effet immédiatement.'
  },
  {
    question: 'Y a-t-il un engagement minimum ?',
    answer: 'Non, tous nos plans sont sans engagement. Vous pouvez annuler à tout moment.'
  },
  {
    question: 'Les données sont-elles sécurisées ?',
    answer: 'Absolument. Toutes vos données sont chiffrées et nous respectons strictement le RGPD.'
  },
  {
    question: 'Le plan gratuit a-t-il des limitations de temps ?',
    answer: 'Non, le plan gratuit est disponible indéfiniment avec les fonctionnalités de base.'
  }
];

export const PricingPage: React.FC<PricingPageProps> = ({ 'data-testid': testId }) => {
  const [isAnnual, setIsAnnual] = React.useState(false);

  const getPrice = React.useCallback((basePrice: string) => {
    if (basePrice === '0€' || basePrice === 'Sur mesure') return basePrice;
    if (isAnnual) {
      const monthly = parseInt(basePrice.replace('€', ''));
      const annual = Math.round(monthly * 12 * 0.8); // 20% de réduction
      return `${Math.round(annual / 12)}€`;
    }
    return basePrice;
  }, [isAnnual]);

  return (
    <main className="min-h-screen bg-background" data-testid={testId}>
      <div className="container mx-auto py-16 px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Tarification Simple et Transparente
          </Badge>
          <h1 className="text-5xl font-bold mb-6">
            Choisissez Votre Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Commencez gratuitement et évoluez à votre rythme. 
            Tous les plans incluent notre garantie satisfaction 30 jours.
          </p>

          {/* Toggle Annual/Monthly */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={isAnnual ? 'text-muted-foreground' : 'font-medium'}>Mensuel</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                isAnnual ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={!isAnnual ? 'text-muted-foreground' : 'font-medium'}>
              Annuel 
              <Badge variant="secondary" className="ml-2">-20%</Badge>
            </span>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary">
                    <Star className="w-3 h-3 mr-1" />
                    Plus Populaire
                  </Badge>
                </div>
              )}
              
              <Card className={`h-full ${plan.color} ${plan.popular ? 'shadow-lg scale-105' : ''} hover:shadow-xl transition-all`}>
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full ${plan.popular ? 'bg-primary/10' : 'bg-muted'}`}>
                      <plan.icon className={`w-6 h-6 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                  </div>
                  
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                  
                  <div className="mt-4">
                    <div className="text-4xl font-bold">
                      {getPrice(plan.price)}
                      {plan.period && (
                        <span className="text-lg text-muted-foreground font-normal">
                          {isAnnual && plan.period === '/mois' ? '/mois (facturé annuellement)' : plan.period}
                        </span>
                      )}
                    </div>
                    {isAnnual && plan.price !== '0€' && plan.price !== 'Sur mesure' && (
                      <div className="text-sm text-muted-foreground">
                        Économisez {Math.round(parseInt(plan.price.replace('€', '')) * 12 * 0.2)}€/an
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <Button 
                    className={`w-full ${plan.popular ? '' : 'variant-outline'}`}
                    size="lg"
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Inclus :</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {plan.limitations.length > 0 && (
                      <div className="pt-2">
                        <h4 className="font-medium text-muted-foreground text-sm">Limitations :</h4>
                        <ul className="space-y-1 mt-1">
                          {plan.limitations.map((limitation, idx) => (
                            <li key={idx} className="text-xs text-muted-foreground">
                              • {limitation}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Questions Fréquentes</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à commencer votre parcours bien-être ?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Rejoignez plus de 50,000 utilisateurs qui transforment leur vie avec EmotionsCare
          </p>
          <Button size="lg" className="px-8 py-4 text-lg">
            Commencer Gratuitement
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </main>
  );
};