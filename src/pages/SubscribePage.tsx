import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logger } from '@/lib/logger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Users, Shield } from 'lucide-react';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  badge?: string;
  features: PlanFeature[];
  icon: React.ReactNode;
  highlighted?: boolean;
}

const SubscribePage: React.FC = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const navigate = useNavigate();

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Découverte',
      price: '0€',
      period: 'gratuit',
      description: 'Parfait pour commencer votre voyage bien-être',
      icon: <Zap className="h-6 w-6" />,
      features: [
        { text: '3 sessions Flash Glow / jour', included: true },
        { text: 'Scan émotionnel de base', included: true },
        { text: 'Journal personnel', included: true },
        { text: 'Musicothérapie limitée', included: true },
        { text: 'Coach IA avancé', included: false },
        { text: 'VR et AR', included: false },
        { text: 'Analytics détaillés', included: false },
        { text: 'Export de données', included: false },
      ],
    },
    {
      id: 'premium',
      name: 'Premium',
      price: billingPeriod === 'monthly' ? '9.99€' : '7.99€',
      period: billingPeriod === 'monthly' ? '/mois' : '/mois (facturé annuellement)',
      description: 'Expérience complète pour votre bien-être quotidien',
      badge: 'Populaire',
      highlighted: true,
      icon: <Crown className="h-6 w-6" />,
      features: [
        { text: 'Sessions illimitées', included: true },
        { text: 'Tous les modules (VR, AR, etc.)', included: true },
        { text: 'Coach IA personnalisé', included: true },
        { text: 'Analytics détaillés', included: true },
        { text: 'Export RGPD complet', included: true },
        { text: 'Accès prioritaire aux nouveautés', included: true },
        { text: 'Support premium', included: true },
        { text: 'Mode hors-ligne', included: true },
      ],
    },
    {
      id: 'enterprise',
      name: 'Entreprise',
      price: 'Sur mesure',
      period: 'par utilisateur',
      description: 'Solution complète pour teams et organisations',
      icon: <Users className="h-6 w-6" />,
      features: [
        { text: 'Tout du Premium', included: true },
        { text: 'Dashboard RH anonymisé', included: true },
        { text: 'Heatmaps d\'équipe', included: true },
        { text: 'Rapports de bien-être', included: true },
        { text: 'API personnalisée', included: true },
        { text: 'Formation équipe', included: true },
        { text: 'Support dédié', included: true },
        { text: 'Conformité SOC2/ISO27001', included: true },
      ],
    },
  ];

  const handleSubscribe = (planId: string) => {
    if (planId === 'free') {
      // Navigate to signup
      navigate('/signup');
      return;
    }
    
    if (planId === 'enterprise') {
      // Navigate to contact
      navigate('/contact');
      return;
    }

    // For premium plan - would redirect to Stripe Checkout
    logger.info('Redirecting to checkout for plan', { planId, billingPeriod }, 'SYSTEM');
    // Here you would integrate with Stripe via your Render backend
    // window.location.href = `/api/billing/checkout?plan=${planId}&period=${billingPeriod}`;
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Choisissez votre plan bien-être
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Commencez gratuitement, évoluez selon vos besoins
          </p>
          
          {/* Billing Period Toggle */}
          <div className="inline-flex items-center bg-muted rounded-lg p-1">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                billingPeriod === 'yearly'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Annuel
              <Badge variant="secondary" className="ml-2">
                -20%
              </Badge>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${
                plan.highlighted
                  ? 'border-primary shadow-lg scale-105'
                  : 'border-border'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    {plan.badge}
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${
                    plan.highlighted 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {plan.icon}
                  </div>
                </div>
                
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">{plan.period}</span>
                </div>
                <p className="text-muted-foreground mt-2">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                        feature.included 
                          ? 'bg-green-100 dark:bg-green-900/30' 
                          : 'bg-muted'
                      }`}>
                        {feature.included ? (
                          <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                        ) : (
                          <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                        )}
                      </div>
                      <span className={`text-sm ${
                        feature.included ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
                
                <Button
                  className="w-full"
                  variant={plan.highlighted ? 'default' : 'outline'}
                  size="lg"
                  onClick={() => handleSubscribe(plan.id)}
                >
                  {plan.id === 'free' ? 'Commencer gratuitement' : 
                   plan.id === 'enterprise' ? 'Nous contacter' : 
                   'Choisir ce plan'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Questions fréquentes</h2>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Puis-je annuler à tout moment ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Oui, vous pouvez annuler votre abonnement à tout moment depuis vos paramètres. 
                  Aucune période d'engagement, aucun frais d'annulation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mes données sont-elles sécurisées ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Absolument. Toutes vos données sont chiffrées et stockées de manière sécurisée. 
                  Nous respectons le RGPD et vous pouvez exporter ou supprimer vos données à tout moment.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Comment fonctionne l'essai gratuit ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Le plan Découverte est entièrement gratuit et sans limite de temps. 
                  Vous pouvez l'utiliser aussi longtemps que vous le souhaitez avant de passer au Premium.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Puis-je changer de plan ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. 
                  Les changements sont effectifs immédiatement avec un prorata automatique.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="flex justify-center items-center gap-8 text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span className="text-sm">Paiement sécurisé</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              <span className="text-sm">Conforme RGPD</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span className="text-sm">Support 7j/7</span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Rejoignez les premiers utilisateurs d'EmotionsCare pour votre bien-être quotidien
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscribePage;