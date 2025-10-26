// @ts-nocheck
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Sparkles, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PremiumPage() {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Gratuit',
      price: '0€',
      period: '/mois',
      features: ['Scan émotionnel basique', 'Musique limitée', '5 sessions/mois', 'Support communautaire'],
      current: true,
    },
    {
      name: 'Premium',
      price: '9.99€',
      period: '/mois',
      features: ['Scan émotionnel avancé', 'Musique illimitée', 'Sessions illimitées', 'Coach IA', 'VR Premium', 'Support prioritaire'],
      recommended: true,
    },
    {
      name: 'Ultra',
      price: '19.99€',
      period: '/mois',
      features: ['Tout Premium +', 'Analyse IA approfondie', 'Sessions personnalisées', 'Accès anticipé', 'Support dédié 24/7'],
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6" data-testid="page-root">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Crown className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold">Passez en Premium</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Débloquez toutes les fonctionnalités et accélérez votre progression
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${plan.recommended ? 'border-primary shadow-lg scale-105' : ''}`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge variant="default" className="px-4 py-1">
                    <Sparkles className="h-3 w-3 mr-1 inline" />
                    Recommandé
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center space-y-4 pt-8">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div>
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                {plan.current ? (
                  <Button variant="outline" disabled className="w-full">
                    Plan Actuel
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    variant={plan.recommended ? 'default' : 'outline'}
                    onClick={() => navigate('/subscribe')}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Passer à {plan.name}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-center">Garantie Satisfait ou Remboursé</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              Essayez Premium sans risque pendant 30 jours. Si vous n'êtes pas satisfait, nous vous remboursons intégralement.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
