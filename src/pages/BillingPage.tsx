/**
 * BillingPage - Gestion de l'abonnement et facturation
 * Branche sur Stripe via useSubscription (donnees reelles, pas de mock)
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, ExternalLink, AlertCircle, Loader2 } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const PLAN_LABELS: Record<string, { name: string; price: string }> = {
  free: { name: 'Gratuit', price: '0 \u20ac' },
  pro: { name: 'Pro', price: '14,90 \u20ac / mois' },
  business: { name: 'Business', price: '49,90 \u20ac / mois' },
};

export default function BillingPage() {
  const { user } = useAuth();
  const {
    plan,
    subscribed,
    subscriptionEnd,
    isLoading,
    error,
    openCustomerPortal,
    createCheckout,
  } = useSubscription();
  const navigate = useNavigate();

  const handleManageSubscription = async () => {
    try {
      await openCustomerPortal();
    } catch {
      toast.error("Impossible d'ouvrir le portail de gestion. Veuillez r\u00e9essayer.");
    }
  };

  const handleUpgrade = async () => {
    try {
      await createCheckout('pro');
    } catch {
      toast.error('Impossible de lancer le processus de paiement. Veuillez r\u00e9essayer.');
    }
  };

  const planInfo = PLAN_LABELS[plan] ?? PLAN_LABELS.free;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center" data-testid="page-root">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Chargement de votre abonnement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6" data-testid="page-root">
      <div className="max-w-4xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-bold">Facturation</h1>
          <p className="text-muted-foreground">G\u00e9rez votre abonnement EmotionsCare</p>
        </header>

        {error && (
          <Card className="border-destructive">
            <CardContent className="flex items-center gap-3 py-4">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-destructive">
                Impossible de v\u00e9rifier votre abonnement. Veuillez rafra\u00eechir la page.
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Abonnement actuel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-lg">Plan {planInfo.name}</p>
                <p className="text-sm text-muted-foreground">{planInfo.price}</p>
              </div>
              <Badge variant={subscribed ? 'default' : 'secondary'}>
                {subscribed ? 'Actif' : 'Gratuit'}
              </Badge>
            </div>

            {subscribed && subscriptionEnd && (
              <p className="text-sm text-muted-foreground">
                Prochain renouvellement :{' '}
                {new Date(subscriptionEnd).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            )}

            <div className="flex gap-2 flex-wrap">
              {subscribed ? (
                <Button variant="outline" onClick={handleManageSubscription}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  G\u00e9rer mon abonnement
                </Button>
              ) : (
                <>
                  <Button onClick={handleUpgrade}>Passer \u00e0 Pro</Button>
                  <Button variant="outline" onClick={() => navigate('/pricing')}>
                    Voir les plans
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {!subscribed && (
          <Card>
            <CardContent className="py-6 text-center">
              <p className="text-muted-foreground mb-4">
                Passez \u00e0 Pro pour acc\u00e9der \u00e0 toutes les fonctionnalit\u00e9s : coaching IA
                illimit\u00e9, musique th\u00e9rapeutique, \u00e9valuations avanc\u00e9es et bien plus.
              </p>
              <Button onClick={() => navigate('/pricing')}>D\u00e9couvrir les plans</Button>
            </CardContent>
          </Card>
        )}

        {subscribed && (
          <Card>
            <CardHeader>
              <CardTitle>Factures et re\u00e7us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Consultez et t\u00e9l\u00e9chargez vos factures depuis le portail Stripe.
              </p>
              <Button variant="outline" onClick={handleManageSubscription}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Acc\u00e9der au portail de facturation
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
