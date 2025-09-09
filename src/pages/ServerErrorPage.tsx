/**
 * ServerErrorPage - Page 503 Erreur serveur
 * TICKET: FE/BE-Router-Cleanup-01
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { routes } from '@/routerV2';
import { AlertTriangle, RefreshCw, ArrowLeft, MessageCircle } from 'lucide-react';

const ServerErrorPage: React.FC = () => {
  const [isRetrying, setIsRetrying] = React.useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    
    // Attendre un peu pour l'UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Recharger la page
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">503</h1>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Service temporairement indisponible
            </h2>
            <p className="text-gray-600">
              Nos serveurs rencontrent actuellement des difficultés. 
              Nous travaillons à résoudre le problème.
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <Button 
              onClick={handleRetry}
              disabled={isRetrying}
              className="w-full"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? 'Nouvelle tentative...' : 'Réessayer'}
            </Button>
            
            <Link to={routes.public.home()}>
              <Button variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à l'accueil
              </Button>
            </Link>
          </div>

          {/* Informations sur le statut */}
          <div className="p-4 bg-blue-50 rounded-lg mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">
              Que se passe-t-il ?
            </h3>
            <ul className="text-sm text-blue-800 text-left space-y-1">
              <li>• Maintenance programmée en cours</li>
              <li>• Mise à jour de nos serveurs</li>
              <li>• Charge temporairement élevée</li>
            </ul>
          </div>

          {/* Actions alternatives */}
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Le problème persiste ?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Link to={routes.public.contact()} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Signaler le problème
                </Button>
              </Link>
              
              <a 
                href="https://status.emotionscare.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="ghost" size="sm" className="w-full">
                  Page de statut
                </Button>
              </a>
            </div>
          </div>

          {/* Estimation */}
          <div className="mt-6 pt-4 border-t">
            <p className="text-xs text-gray-500">
              Temps de résolution estimé : 15-30 minutes<br />
              Dernière mise à jour : {new Date().toLocaleTimeString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServerErrorPage;