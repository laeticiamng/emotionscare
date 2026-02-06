import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function PricingPageWorking() {
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Gratuit',
      price: { monthly: 0, yearly: 0 },
      description: 'Pour découvrir EmotionsCare',
      features: [
        'Scan émotionnel de base',
        'Musique thérapeutique limitée',
        'Journal émotionnel',
        'Accès à 3 modules',
      ],
      cta: 'Commencer gratuitement',
      popular: false,
    },
    {
      name: 'Premium',
      price: { monthly: 14.99, yearly: 149.99 },
      description: 'Pour un accompagnement complet',
      features: [
        'Tous les scans émotionnels',
        'Musique thérapeutique illimitée',
        'Coach IA personnalisé',
        'Tous les modules premium',
        'Expériences VR/AR',
        'Analyses avancées',
      ],
      cta: 'Essayer Premium',
      popular: true,
    },
    {
      name: 'Entreprise',
      price: { monthly: 'Sur devis', yearly: 'Sur devis' },
      description: 'Pour équipes et organisations',
      features: [
        'Tout Premium +',
        'Dashboard RH/Manager',
        'Analytics équipe',
        'Support prioritaire',
        'Formation incluse',
        'API sur mesure',
      ],
      cta: 'Nous contacter',
      popular: false,
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted py-12 px-6">
      <div className="mx-auto max-w-7xl space-y-12">
        <header className="text-center space-y-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>

          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">EmotionsCare</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Choisissez votre plan
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Commencez gratuitement et passez à Premium quand vous êtes prêt
          </p>

          <div className="flex justify-center gap-4 pt-6">
            <Button
              variant={billingPeriod === 'monthly' ? 'default' : 'outline'}
              onClick={() => setBillingPeriod('monthly')}
            >
              Mensuel
            </Button>
            <Button
              variant={billingPeriod === 'yearly' ? 'default' : 'outline'}
              onClick={() => setBillingPeriod('yearly')}
            >
              Annuel
              <Badge variant="secondary" className="ml-2">
                -17%
              </Badge>
            </Button>
          </div>
        </header>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.popular ? 'border-primary shadow-lg' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <Badge className="bg-primary">Populaire</Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8 pt-6">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <div className="text-4xl font-bold">
                    {typeof plan.price[billingPeriod] === 'number'
                      ? plan.price[billingPeriod] === 0
                        ? 'Gratuit'
                        : `${plan.price[billingPeriod]}€`
                      : plan.price[billingPeriod]}
                  </div>
                  {typeof plan.price[billingPeriod] === 'number' && plan.price[billingPeriod] > 0 && (
                    <div className="text-sm text-muted-foreground">
                      par {billingPeriod === 'monthly' ? 'mois' : 'an'}
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <Button
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                  size="lg"
                  onClick={() => {
                    if (plan.name === 'Gratuit') {
                      navigate('/signup');
                    } else if (plan.name === 'Entreprise') {
                      navigate('/contact');
                    } else {
                      navigate('/signup');
                    }
                  }}
                >
                  {plan.cta}
                </Button>

                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="h-5 w-5 shrink-0 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Vous avez des questions ?{' '}
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() => navigate('/contact')}
            >
              Contactez-nous
            </Button>
          </p>
        </div>
      </div>
    </main>
  );
}
