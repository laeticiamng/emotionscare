
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

const RouteDebugger: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { userMode } = useUserMode();

  // Affichage uniquement en développement
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const debugInfo = {
    route: location.pathname,
    search: location.search,
    hash: location.hash,
    authenticated: isAuthenticated,
    userRole: user?.role || 'non défini',
    userMode: userMode || 'non défini',
    userId: user?.id || 'non défini'
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm">
      <Card className="bg-black/90 text-white border-gray-700">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Debug Route</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(!isVisible)}
              className="h-6 w-6 p-0 text-white hover:bg-white/20"
            >
              {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        {isVisible && (
          <CardContent className="pt-0 space-y-2">
            <div className="text-xs space-y-1">
              <div>
                <span className="text-gray-400">Route:</span> {debugInfo.route}
              </div>
              {debugInfo.search && (
                <div>
                  <span className="text-gray-400">Query:</span> {debugInfo.search}
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Auth:</span>
                <Badge variant={debugInfo.authenticated ? "default" : "destructive"} className="text-xs">
                  {debugInfo.authenticated ? 'Oui' : 'Non'}
                </Badge>
              </div>
              <div>
                <span className="text-gray-400">Rôle:</span> {debugInfo.userRole}
              </div>
              <div>
                <span className="text-gray-400">Mode:</span> {debugInfo.userMode}
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default RouteDebugger;
