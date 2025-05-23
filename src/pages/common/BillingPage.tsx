
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Check, Star, Calendar, Download } from 'lucide-react';
import { toast } from 'sonner';

const BillingPage: React.FC = () => {
  const [currentPlan] = useState('free');
  const [billingHistory] = useState([
    {
      id: '1',
      date: '2024-01-15',
      description: 'Plan Premium - Mensuel',
      amount: '19.99€',
      status: 'paid'
    },
    {
      id: '2',
      date: '2023-12-15',
      description: 'Plan Premium - Mensuel',
      amount: '19.99€',
      status: 'paid'
    }
  ]);

  const plans = [
    {
      id: 'free',
      name: 'Gratuit',
      price: '0€',
      period: '/mois',
      description: 'Parfait pour commencer',
      features: [
        '5 scans émotionnels par mois',
        'Analyse de base',
        'Communauté',
        'Support par email'
      ],
      current: currentPlan === 'free'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '19.99€',
      period: '/mois',
      description: 'Pour un suivi complet',
      features: [
        'Scans émotionnels illimités',
        'Analyse avancée avec IA',
        'Coach personnel',
        'Rapports détaillés',
        'Support prioritaire',
        'Accès aux fonctionnalités bêta'
      ],
      popular: true,
      current: currentPlan === 'premium'
    },
    {
      id: 'business',
      name: 'Entreprise',
      price: 'Sur devis',
      period: '',
      description: 'Pour les organisations',
      features: [
        'Toutes les fonctionnalités Premium',
        'Tableau de bord administrateur',
        'Gestion d\'équipes',
        'Rapports d\'organisation',
        'API personnalisée',
        'Support dédié'
      ],
      current: currentPlan === 'business'
    }
  ];

  const handlePlanChange = (planId: string) => {
    if (planId === currentPlan) return;
    
    // In real app, this would integrate with Stripe or other payment processor
    toast.success(`Changement vers le plan ${planId === 'free' ? 'Gratuit' : planId === 'premium' ? 'Premium' : 'Entreprise'} initié`);
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    // In real app, this would download the actual invoice
    toast.info('Téléchargement de la facture...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="container mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Facturation et abonnements</h1>
          <p className="text-muted-foreground">
            Gérez votre abonnement et consultez vos factures
          </p>
        </header>

        {/* Current Plan */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Abonnement actuel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  Plan {currentPlan === 'free' ? 'Gratuit' : currentPlan === 'premium' ? 'Premium' : 'Entreprise'}
                </h3>
                <p className="text-muted-foreground">
                  {currentPlan === 'free' 
                    ? 'Accès aux fonctionnalités de base'
                    : currentPlan === 'premium'
                    ? 'Renouvelé le 15 de chaque mois'
                    : 'Plan personnalisé pour votre organisation'
                  }
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">
                  {currentPlan === 'free' ? '0€' : currentPlan === 'premium' ? '19.99€' : 'Sur devis'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {currentPlan !== 'business' ? '/mois' : ''}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Plans */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Plans disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''} ${plan.current ? 'bg-primary/5' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-white gap-1">
                      <Star className="h-3 w-3" />
                      Populaire
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    {plan.name}
                    {plan.current && <Badge variant="outline">Actuel</Badge>}
                  </CardTitle>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={plan.current ? "outline" : "default"}
                    disabled={plan.current}
                    onClick={() => handlePlanChange(plan.id)}
                  >
                    {plan.current ? 'Plan actuel' : plan.id === 'business' ? 'Nous contacter' : 'Choisir ce plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Billing History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Historique de facturation
            </CardTitle>
            <CardDescription>
              Consultez et téléchargez vos factures
            </CardDescription>
          </CardHeader>
          <CardContent>
            {billingHistory.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucune facture disponible</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Vos factures apparaîtront ici une fois que vous aurez un abonnement payant
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {billingHistory.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{invoice.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(invoice.date).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">{invoice.amount}</p>
                        <Badge variant={invoice.status === 'paid' ? 'default' : 'destructive'}>
                          {invoice.status === 'paid' ? 'Payé' : 'Impayé'}
                        </Badge>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadInvoice(invoice.id)}
                        className="gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Télécharger
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Méthode de paiement</CardTitle>
            <CardDescription>
              Gérez vos informations de paiement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">VISA</span>
                </div>
                <div>
                  <p className="font-medium">•••• •••• •••• 4242</p>
                  <p className="text-sm text-muted-foreground">Expire 12/2026</p>
                </div>
              </div>
              <Button variant="outline">
                Modifier
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BillingPage;
