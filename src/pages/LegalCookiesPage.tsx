import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Cookie, ArrowLeft, Shield, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const LegalCookiesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6" data-testid="page-root">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
          </Link>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Cookie className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Politique des Cookies
            </h1>
          </div>
          <p className="text-muted-foreground">
            Dernière mise à jour : 15 janvier 2024
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Qu'est-ce qu'un cookie ?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, 
              smartphone) lors de la visite d'un site web. Il permet au site de reconnaître votre 
              terminal et de stocker certaines informations sur vos préférences ou actions.
            </p>
            <p>
              EmotionsCare utilise des cookies pour améliorer votre expérience utilisateur, 
              analyser l'utilisation de notre plateforme et personnaliser notre contenu.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Types de cookies utilisés</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">Obligatoires</Badge>
                <h3 className="text-lg font-semibold">Cookies strictement nécessaires</h3>
              </div>
              <p>
                Ces cookies sont indispensables au fonctionnement du site et ne peuvent pas être 
                désactivés. Ils sont généralement activés en réponse à des actions de votre part 
                (connexion, panier, préférences de confidentialité).
              </p>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Cookies de session et d'authentification</li>
                <li>Cookies de sécurité et de protection CSRF</li>
                <li>Cookies de préférences linguistiques</li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">Optionnels</Badge>
                <h3 className="text-lg font-semibold">Cookies de performance</h3>
              </div>
              <p>
                Ces cookies nous permettent de compter les visites et sources de trafic afin 
                d'améliorer les performances de notre site.
              </p>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Google Analytics (données d'usage anonymisées)</li>
                <li>Métriques de performance</li>
              </ul>
            </div>

          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Gérer vos préférences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Vous avez le contrôle sur les cookies déposés sur votre terminal. Vous pouvez 
              à tout moment modifier vos préférences ou retirer votre consentement.
            </p>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Via notre plateforme :</h3>
              <div className="flex gap-4">
                <Button>
                  <Settings className="mr-2 h-4 w-4" />
                  Gérer les cookies
                </Button>
                <Button variant="outline">
                  Refuser tous les cookies optionnels
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LegalCookiesPage;