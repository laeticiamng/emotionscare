import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, DollarSign, Users, TrendingUp } from 'lucide-react';

const B2BAdminBillingManagement: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestion de Facturation</h1>
        <p className="text-muted-foreground">
          Suivi des abonnements et facturation pour votre organisation
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coût mensuel</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€2,340</div>
            <p className="text-xs text-muted-foreground">120 utilisateurs actifs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plan actuel</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Enterprise</div>
            <p className="text-xs text-muted-foreground">Premium features</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs facturés</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120</div>
            <p className="text-xs text-muted-foreground">€19.50/utilisateur/mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Économies annuelles</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€4,680</div>
            <p className="text-xs text-muted-foreground">Vs plan mensuel</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Détails de l'abonnement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Plan Enterprise</span>
                <span className="text-sm font-medium">€2,340/mois</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">• 120 utilisateurs inclus</span>
                <span className="text-sm text-muted-foreground">€19.50/utilisateur</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">• Analytics avancées</span>
                <span className="text-sm text-green-600">Inclus</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">• Support premium 24/7</span>
                <span className="text-sm text-green-600">Inclus</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">• Intégrations illimitées</span>
                <span className="text-sm text-green-600">Inclus</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">• Stockage illimité</span>
                <span className="text-sm text-green-600">Inclus</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-medium">
                  <span>Prochain paiement</span>
                  <span>15 Jan 2025</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1">Modifier plan</Button>
              <Button variant="outline" className="flex-1">Télécharger facture</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historique de facturation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">Décembre 2024</p>
                  <p className="text-xs text-muted-foreground">120 utilisateurs • Payé</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">€2,340</p>
                  <Button variant="ghost" size="sm" className="text-xs">Télécharger</Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">Novembre 2024</p>
                  <p className="text-xs text-muted-foreground">118 utilisateurs • Payé</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">€2,301</p>
                  <Button variant="ghost" size="sm" className="text-xs">Télécharger</Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">Octobre 2024</p>
                  <p className="text-xs text-muted-foreground">115 utilisateurs • Payé</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">€2,242</p>
                  <Button variant="ghost" size="sm" className="text-xs">Télécharger</Button>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Méthode de paiement</label>
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4" />
                <span className="text-sm">•••• •••• •••• 4242</span>
                <Button variant="outline" size="sm">Modifier</Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Adresse de facturation</label>
              <div className="text-sm text-muted-foreground">
                <p>Tech Corp Inc.</p>
                <p>123 Innovation Street</p>
                <p>75001 Paris, France</p>
              </div>
              <Button variant="outline" size="sm">Modifier</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BAdminBillingManagement;