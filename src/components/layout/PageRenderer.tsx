import React, { Suspense } from 'react';
import { logger } from '@/lib/logger';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import LoadingAnimation from '@/components/ui/loading-animation';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface PageRendererProps {
  children: React.ReactNode;
}

const PageRenderer: React.FC<PageRendererProps> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const {  } = useUserMode();

  // Composant de fallback pour les erreurs de rendu
  const ErrorFallback = ({ error }: { error?: Error }) => (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-semibold">Erreur de Chargement</h2>
          <p className="text-sm text-muted-foreground">
            {error?.message || 'Une erreur est survenue lors du chargement de la page.'}
          </p>
          <p className="text-xs text-muted-foreground">
            Route: {location.pathname}
          </p>
        </CardContent>
      </Card>
    </div>
  );

  // Composant de chargement unifié
  const LoadingFallback = () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <LoadingAnimation text="Chargement de la page..." />
    </div>
  );

  // Wrapper avec gestion d'erreur
  const PageWrapper = ({ children }: { children: React.ReactNode }) => {
    try {
      return (
        <Suspense fallback={<LoadingFallback />}>
          <div className="min-h-screen bg-background">
            <main className="container mx-auto px-4 py-6">
              {children}
            </main>
          </div>
        </Suspense>
      );
    } catch (error) {
      logger.error('Erreur de rendu de page', error as Error, 'UI');
      return <ErrorFallback error={error as Error} />;
    }
  };

  return <PageWrapper>{children}</PageWrapper>;
};

export default PageRenderer;
