
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Code, Zap } from 'lucide-react';

const TestPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Page de Test
            </h1>
            <p className="text-xl text-muted-foreground">
              Validation du fonctionnement du routeur et des composants
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Routeur Fonctionnel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Cette page confirme que le système de routage fonctionne correctement.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Routes principales configurées</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Lazy loading activé</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Page 404 configurée</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Composants Actifs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Les composants UI sont correctement chargés et stylés.
                </p>
                <div className="space-y-2">
                  <Button className="w-full bg-blue-500 hover:bg-blue-600">
                    Bouton Primaire
                  </Button>
                  <Button variant="outline" className="w-full">
                    Bouton Secondaire
                  </Button>
                  <Button variant="ghost" className="w-full">
                    Bouton Ghost
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Test réussi ! ✅</h2>
            <p className="text-muted-foreground mb-6">
              Tous les systèmes sont opérationnels. Vous pouvez naviguer dans l'application.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => window.history.back()}>
                Retour
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                Accueil
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
