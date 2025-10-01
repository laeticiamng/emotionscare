// @ts-nocheck
/**
 * Diagnostic des routes - Test rapide de toutes les routes importantes
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, CheckCircle, XCircle } from 'lucide-react';
import { routes } from '@/routerV2';

const RoutesDiagnostic: React.FC = () => {
  const [testedRoutes, setTestedRoutes] = useState<Record<string, boolean>>({});

  const routesToTest = [
    // Routes publiques
    { name: 'Accueil', path: routes.public.home(), type: 'public' },
    { name: 'À propos', path: routes.public.about(), type: 'public' },
    { name: 'Contact', path: routes.public.contact(), type: 'public' },
    { name: 'Aide', path: routes.public.help(), type: 'public' },
    
    // Auth
    { name: 'Login', path: routes.auth.login(), type: 'auth' },
    { name: 'Inscription', path: routes.auth.signup(), type: 'auth' },
    
    // B2C
    { name: 'B2C Accueil', path: routes.b2c.home(), type: 'public' },
    { name: 'Dashboard B2C', path: routes.b2c.dashboard(), type: 'protected' },
    { name: 'Scan', path: routes.b2c.scan(), type: 'protected' },
    { name: 'Musique', path: routes.b2c.music(), type: 'protected' },
    { name: 'Coach', path: routes.b2c.coach(), type: 'protected' },
    { name: 'Journal', path: routes.b2c.journal(), type: 'protected' },
    { name: 'VR', path: routes.b2c.vr(), type: 'protected' },
    
    // B2B
    { name: 'B2B Accueil', path: routes.b2b.home(), type: 'public' },
    { name: 'Dashboard Collaborateur', path: routes.b2b.user.dashboard(), type: 'protected' },
    { name: 'Dashboard Admin', path: routes.b2b.admin.dashboard(), type: 'protected' },
    
    // Modules Fun-First
    { name: 'Flash Glow', path: routes.b2c.flashGlow(), type: 'protected' },
    { name: 'Breathwork', path: routes.b2c.breathwork(), type: 'protected' },
    { name: 'AR Filters', path: routes.b2c.arFilters(), type: 'protected' },
    { name: 'Bubble Beat', path: routes.b2c.bubbleBeat(), type: 'protected' },
    { name: 'Mood Mixer', path: routes.b2c.moodMixer(), type: 'protected' },
    { name: 'Boss Level', path: routes.b2c.bossLevel(), type: 'protected' },
    
    // Pages spéciales
    { name: 'Choisir mode', path: routes.special.chooseMode(), type: 'public' },
    { name: 'Non autorisé', path: routes.special.unauthorized(), type: 'error' },
    { name: '404', path: routes.special.notFound(), type: 'error' },
  ];

  const markRouteAsTested = (path: string) => {
    setTestedRoutes(prev => ({ ...prev, [path]: true }));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'public': return 'bg-green-100 text-green-800';
      case 'auth': return 'bg-blue-100 text-blue-800';
      case 'protected': return 'bg-orange-100 text-orange-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="h-5 w-5" />
          Diagnostic des Routes ({routesToTest.length} routes)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {routesToTest.map((route, index) => (
            <div 
              key={route.path} 
              className="border rounded-lg p-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <Badge className={getTypeColor(route.type)}>
                  {route.type}
                </Badge>
                {testedRoutes[route.path] ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-gray-400" />
                )}
              </div>
              
              <h4 className="font-medium text-sm mb-1">{route.name}</h4>
              <p className="text-xs text-muted-foreground mb-3 font-mono">
                {route.path}
              </p>
              
              <Link to={route.path}>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full text-xs"
                  onClick={() => markRouteAsTested(route.path)}
                >
                  Tester →
                </Button>
              </Link>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-2">Instructions :</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• <strong>Public</strong> : Accessible sans connexion</li>
            <li>• <strong>Auth</strong> : Pages de connexion/inscription</li>
            <li>• <strong>Protected</strong> : Nécessite une authentification</li>
            <li>• <strong>Error</strong> : Pages d'erreur système</li>
          </ul>
          <p className="text-xs text-muted-foreground mt-3">
            Routes testées : {Object.keys(testedRoutes).length}/{routesToTest.length}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoutesDiagnostic;