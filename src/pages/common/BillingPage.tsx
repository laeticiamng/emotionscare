
import React from 'react';
import Shell from '@/Shell';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const BillingPage: React.FC = () => {
  return (
    <Shell>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Facturation</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Votre abonnement actuel</h2>
          <Card>
            <CardHeader>
              <CardTitle>Plan Gratuit</CardTitle>
              <CardDescription>
                Fonctionnalités de base pour comprendre vos émotions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">0€ <span className="text-sm font-normal text-muted-foreground">/mois</span></p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>5 analyses d'émotions par jour</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Recommandations de base</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Tableau de bord personnel</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled>Votre plan actuel</Button>
            </CardFooter>
          </Card>
        </div>
        
        <h2 className="text-xl font-semibold mb-4">Nos offres</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Plan Gratuit</CardTitle>
              <CardDescription>
                Pour démarrer votre parcours émotionnel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">0€ <span className="text-sm font-normal text-muted-foreground">/mois</span></p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>5 analyses d'émotions par jour</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Recommandations de base</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Tableau de bord personnel</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled>Plan actuel</Button>
            </CardFooter>
          </Card>
          
          <Card className="border-primary">
            <CardHeader>
              <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium w-fit mb-2">
                Populaire
              </div>
              <CardTitle>Plan Premium</CardTitle>
              <CardDescription>
                Améliorez votre intelligence émotionnelle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">9,99€ <span className="text-sm font-normal text-muted-foreground">/mois</span></p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Analyses illimitées</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Recommandations personnalisées avancées</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Thérapie musicale</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Analyse de tendances</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Passer au Premium</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Plan Business</CardTitle>
              <CardDescription>
                Pour les professionnels et les équipes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">24,99€ <span className="text-sm font-normal text-muted-foreground">/mois</span></p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Tout du plan Premium</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Dashboard d'équipe</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Analytics et rapports</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Intégrations API</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Support prioritaire</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Contacter les ventes</Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Historique de facturation</h2>
          <Card>
            <CardHeader>
              <CardTitle>Factures</CardTitle>
              <CardDescription>
                Historique de vos paiements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Aucune facture disponible pour le moment.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Shell>
  );
};

export default BillingPage;
