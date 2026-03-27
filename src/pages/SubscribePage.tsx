// @ts-nocheck
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
      name: 'Gratuit',
      price: '0€',
      period: 'gratuit',
      description: 'Pour découvrir EmotionsCare',
      icon: <Zap className="h-6 w-6" />,
      features: [
        { text: '3 exercices par jour', included: true },
        { text: 'Scanner émotionnel de base', included: true },
        { text: 'Journal émotionnel', included: true },
        { text: 'Accès communauté', included: true },
        { text: 'Coach IA personnalisé', included: false },
        { text: 'Musicothérapie complète', included: false },
        { text: 'Analyses détaillées', included: false },
        { text: 'Export de données', included: false },
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: billingPeriod === 'monthly' ? '14,90€' : '11,90€',
      period: billingPeriod === 'monthly' ? '/mois' : '/mois (facturé annuellement)',
      description: 'L\'accompagnement complet pour les soignants',
      badge: 'Recommandé',
      highlighted: true,
      icon: <Crown className="h-6 w-6" />,
      features: [
        { text: 'Exercices illimités', included: true },
        { text: 'Tous les modules', included: true },
        { text: 'Coach IA personnalisé 24/7', included: true },
        { text: 'Musicothérapie intégrale', included: true },
        { text: 'Scanner émotionnel avancé', included: true },
        { text: 'Analyses détaillées & tendances', included: true },
        { text: 'Export RGPD complet', included: true },
        { text: 'Support prioritaire', included: true },
      ],
    },
    {
      id: 'etablissement',
      name: 'Établissement',
      price: 'Sur devis',
      period: 'par utilisateur',
      description: 'Pour les hôpitaux, cliniques et établissements de santé',
      icon: <Users className="h-6 w-6" />,
      features: [
        { text: 'Tout le plan Pro pour chaque utilisateur', included: true },
        { text: 'Dashboard RH anonymisé', included: true },
        { text: 'Analytics bien-être des équipes', included: true },
        { text: 'Rapports hebdomadaires automatisés', included: true },
        { text: 'Déploiement et onboarding dédié', included: true },
        { text: 'Interlocuteur et support dédiés', included: true },
        { text: 'Facturation centralisée', included: true },
        { text: 'Conformité RGPD renforcée', included: true },
      ],
    },
  ];

  const handleSubscribe = (planId: string) => {
    if (planId === 'free') {
      navigate('/signup');
      return;
    }
    
    if (planId === 'etablissement') {
      navigate('/contact');
      return;
    }

    // Pro plan - redirect to Stripe Checkout via pricing page
    logger.info('Redirecting to checkout for plan', { planId, billingPeriod }, 'SYSTEM');
    navigate('/pricing');
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Choisissez votre plan
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Commencez gratuitement. Passez à Pro quand vous êtes prêt.
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
                          ? 'bg-primary/10' 
                          : 'bg-muted'
                      }`}>
                        {feature.included ? (
                          <Check className="w-3 h-3 text-primary" />
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
                   plan.id === 'etablissement' ? 'Demander un devis' : 
                   'Passer à Pro'}
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
                  Aucune période d'engagement, aucun frais d'annulation. Droit de rétractation de 14 jours.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mes données sont-elles sécurisées ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Absolument. Toutes vos données sont chiffrées et hébergées en Union Européenne. 
                  Nous respectons le RGPD et vous pouvez exporter ou supprimer vos données à tout moment.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Le plan Gratuit est-il vraiment gratuit ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Oui, 100% gratuit, sans carte bancaire et sans limite de temps. 
                  Vous pouvez l'utiliser aussi longtemps que vous le souhaitez avant de passer au Pro.
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
              <span className="text-sm">Paiement sécurisé Stripe</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              <span className="text-sm">Conforme RGPD</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span className="text-sm">Support réactif</span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Sans engagement · Annulez quand vous voulez
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscribePage;
