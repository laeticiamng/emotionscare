import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ServiceUnavailablePage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <main data-testid="page-root" className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl">Service temporairement indisponible</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-muted-foreground space-y-2">
            <p>
              Nos services sont actuellement en maintenance ou font face à une charge élevée.
            </p>
            <p>
              Nous travaillons activement à rétablir le service dans les plus brefs délais.
            </p>
          </div>

          {/* Status Info */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span>Temps d'arrêt estimé : 5-15 minutes</span>
            </div>
            
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">État des services :</div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>API principale</span>
                  <span className="text-yellow-600">⚠️ Dégradé</span>
                </div>
                <div className="flex justify-between">
                  <span>Base de données</span>
                  <span className="text-green-600">✅ Opérationnel</span>
                </div>
                <div className="flex justify-between">
                  <span>Authentification</span>
                  <span className="text-green-600">✅ Opérationnel</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button 
              onClick={handleRefresh} 
              className="w-full"
              variant="default"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>

            <Link to="/" className="block">
              <Button variant="outline" className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Retour à l'accueil
              </Button>
            </Link>
          </div>

          {/* Contact Info */}
          <div className="text-xs text-muted-foreground border-t pt-4">
            <p>
              Problème persistant ? Contactez-nous à{' '}
              <a 
                href="mailto:support@emotionscare.fr" 
                className="text-primary hover:underline"
              >
                support@emotionscare.fr
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}