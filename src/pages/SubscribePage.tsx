import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  CheckCircle, 
  Star, 
  Crown,
  ArrowLeft,
  CreditCard,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SubscribePage = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium' | 'pro'>('premium');

  const plans = {
    basic: {
      name: 'Essentiel',
      icon: Star,
      monthlyPrice: 9.99,
      yearlyPrice: 99.99,
      description: 'Parfait pour commencer votre parcours bien-être',
      color: 'border-blue-200 bg-blue-50/50',
      features: [
        'Scan émotionnel quotidien',
        'Musicothérapie de base',
        'Journal personnel',
        'Méditations guidées (5 par mois)',
        'Support par email'
      ]
    },
    premium: {
      name: 'Premium',
      icon: Crown,
      monthlyPrice: 19.99,
      yearlyPrice: 199.99,
      description: 'Le plus populaire - Accès complet aux fonctionnalités',
      color: 'border-primary bg-primary/5 ring-2 ring-primary',
      badge: 'Populaire',
      features: [
        'Scan émotionnel illimité',
        'Musicothérapie premium complète',
        'Coach IA personnalisé',
        'Expériences VR complètes',
        'Journal vocal et écrit',
        'Analytics détaillées',
        'Support prioritaire 24/7',
        'Export de données'
      ]
    },
    pro: {
      name: 'Professionnel',
      icon: Crown,
      monthlyPrice: 39.99,
      yearlyPrice: 399.99,
      description: 'Pour les professionnels et équipes',
      color: 'border-purple-200 bg-purple-50/50',
      features: [
        'Tout du Premium',
        'Gestion multi-comptes (jusqu\'à 5)',
        'Dashboard manager',
        'Rapports avancés',
        'API access',
        'Account manager dédié',
        'Intégrations tierces'
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6" data-testid="page-root">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/app/home">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au dashboard
            </Button>
          </Link>
        </div>

        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
            Choisissez votre abonnement
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Investissez dans votre bien-être mental avec un accès complet à tous nos outils thérapeutiques
          </p>

          {/* Bascule mensuel/annuel */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-lg ${!isYearly ? 'font-semibold' : 'text-muted-foreground'}`}>
              Mensuel
            </span>
            <Switch 
              checked={isYearly} 
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-green-600"
            />
            <span className={`text-lg ${isYearly ? 'font-semibold' : 'text-muted-foreground'}`}>
              Annuel
            </span>
            {isYearly && (
              <Badge variant="secondary" className="bg-green-100 text-green-700 ml-2">
                Économisez jusqu'à 16%
              </Badge>
            )}
          </div>
        </div>

        {/* Plans tarifaires */}
        <div className="grid gap-8 lg:grid-cols-3">
          {Object.entries(plans).map(([key, plan]) => {
            const planKey = key as keyof typeof plans;
            const PlanIcon = plan.icon;
            const isSelected = selectedPlan === planKey;
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            
            return (
              <Card 
                key={key} 
                className={`relative cursor-pointer transition-all duration-300 hover:shadow-lg ${plan.color} ${
                  isSelected ? 'scale-105 shadow-xl' : ''
                }`}
                onClick={() => setSelectedPlan(planKey)}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-white px-4 py-1">
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-2">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <PlanIcon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-center">
                    {plan.description}
                  </CardDescription>
                  
                  <div className="pt-4">
                    <div className="text-4xl font-bold">
                      {price}€
                      <span className="text-lg text-muted-foreground font-normal">
                        /{isYearly ? 'an' : 'mois'}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className={`w-full mt-6 ${
                      planKey === 'premium' 
                        ? 'bg-primary hover:bg-primary/90' 
                        : 'bg-primary/80 hover:bg-primary'
                    }`}
                    size="lg"
                  >
                    {isSelected ? 'Plan sélectionné' : 'Choisir ce plan'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Section paiement */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Finaliser votre abonnement
            </CardTitle>
            <CardDescription>
              Plan sélectionné : {plans[selectedPlan].name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-background rounded-lg border">
              <Shield className="h-6 w-6 text-green-600" />
              <div>
                <p className="font-medium">Paiement 100% sécurisé</p>
                <p className="text-sm text-muted-foreground">
                  Vos données sont protégées par un chiffrement SSL 256-bit
                </p>
              </div>
            </div>

            <Button size="lg" className="w-full">
              <CreditCard className="mr-2 h-5 w-5" />
              Commencer l'essai gratuit
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              En continuant, vous acceptez nos{' '}
              <Link to="/legal/terms" className="underline">conditions d'utilisation</Link>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscribePage;