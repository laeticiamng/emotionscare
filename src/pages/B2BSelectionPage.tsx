import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building, Users, Crown, CheckCircle, Mail, Calendar } from 'lucide-react';

const B2BSelectionPage = () => {
  const [selectedPlan, setSelectedPlan] = useState('enterprise');

  const plans = [
    {
      id: 'team',
      name: 'Team',
      description: 'Pour équipes 5-50 personnes',
      price: '15€/mois/utilisateur',
      features: ['Dashboard équipe', 'Analytics de base', 'Support email']
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Solution complète entreprises',
      price: '12€/mois/utilisateur',
      badge: 'Recommandé',
      features: ['Dashboard complet', 'Analytics avancées', 'Support prioritaire', 'API complète']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6" data-testid="page-root">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4">Solutions B2B</Badge>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
            Choisissez votre solution entreprise
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Transformez le bien-être de vos équipes avec une solution adaptée
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedPlan === plan.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-white px-4 py-1">{plan.badge}</Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    {plan.id === 'team' ? <Users className="h-8 w-8 text-primary" /> : 
                     <Building className="h-8 w-8 text-primary" />}
                  </div>
                </div>
                
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <p className="text-muted-foreground">{plan.description}</p>
                <div className="text-2xl font-bold text-primary mt-4">{plan.price}</div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Demande d'information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="company">Entreprise</Label>
                <Input id="company" placeholder="Nom de votre entreprise" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="votre@entreprise.com" />
              </div>
            </div>

            <div className="flex gap-4">
              <Button className="flex-1">
                <Calendar className="mr-2 h-4 w-4" />
                Planifier une démo
              </Button>
              <Button variant="outline" className="flex-1">
                <Mail className="mr-2 h-4 w-4" />
                Recevoir la doc
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BSelectionPage;