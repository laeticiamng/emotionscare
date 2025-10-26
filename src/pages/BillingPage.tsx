// @ts-nocheck
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Download, Calendar } from 'lucide-react';

export default function BillingPage() {
  const invoices = [
    { id: 1, date: '2025-10-01', amount: '9.99€', status: 'Payé', plan: 'Premium' },
    { id: 2, date: '2025-09-01', amount: '9.99€', status: 'Payé', plan: 'Premium' },
    { id: 3, date: '2025-08-01', amount: '9.99€', status: 'Payé', plan: 'Premium' },
  ];

  return (
    <div className="min-h-screen bg-background p-6" data-testid="page-root">
      <div className="max-w-4xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-bold">Facturation</h1>
          <p className="text-muted-foreground">Gérez vos paiements et factures</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Abonnement Actuel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-lg">Plan Premium</p>
                <p className="text-sm text-muted-foreground">9.99€ / mois</p>
              </div>
              <Badge variant="default">Actif</Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Prochain paiement le 1er novembre 2025</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Changer de Plan</Button>
              <Button variant="destructive">Annuler l'Abonnement</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historique des Factures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{invoice.plan}</p>
                    <p className="text-sm text-muted-foreground">{invoice.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">{invoice.amount}</p>
                      <Badge variant="secondary">{invoice.status}</Badge>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
