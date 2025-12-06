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

const RoutesDiagnostic: React.FC = () => {
  const [testedRoutes, setTestedRoutes] = useState<Record<string, boolean>>({});

  const routesToTest = [
    // Routes publiques
    { name: 'Accueil', path: '/', type: 'public' },
    { name: 'À propos', path: '/about', type: 'public' },
    { name: 'Contact', path: '/contact', type: 'public' },
    { name: 'Aide', path: '/help', type: 'public' },
    
    // Auth
    { name: 'Login', path: '/login', type: 'auth' },
    { name: 'Inscription', path: '/signup', type: 'auth' },
    
    // B2C
    { name: 'B2C Accueil', path: '/b2c', type: 'public' },
    { name: 'Dashboard B2C', path: '/app/consumer/home', type: 'protected' },
    { name: 'Scan', path: '/app/scan', type: 'protected' },
    { name: 'Musique', path: '/app/music', type: 'protected' },
    { name: 'Coach', path: '/app/coach', type: 'protected' },
    { name: 'Journal', path: '/app/journal', type: 'protected' },
    { name: 'VR', path: '/app/vr', type: 'protected' },
    
    // B2B
    { name: 'B2B Accueil', path: '/entreprise', type: 'public' },
    { name: 'Dashboard Collaborateur', path: '/app/collab', type: 'protected' },
    { name: 'Dashboard Admin', path: '/app/rh', type: 'protected' },
    
    // Modules Fun-First
    { name: 'Flash Glow', path: '/app/flash-glow', type: 'protected' },
    { name: 'Breathwork', path: '/app/breath', type: 'protected' },
    { name: 'AR Filters', path: '/app/face-ar', type: 'protected' },
    { name: 'Bubble Beat', path: '/app/bubble-beat', type: 'protected' },
    { name: 'Mood Mixer', path: '/app/mood-mixer', type: 'protected' },
    { name: 'Boss Level', path: '/app/boss-grit', type: 'protected' },
    
    // Pages spéciales
    { name: 'Choisir mode', path: '/mode-selection', type: 'public' },
    { name: 'Non autorisé', path: '/401', type: 'error' },
    { name: '404', path: '/404', type: 'error' },
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