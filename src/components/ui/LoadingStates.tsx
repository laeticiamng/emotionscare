import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Lightbulb } from 'lucide-react';

/**
 * États L/C/E/V systématiques selon le ticket
 * L = Loading (≤1s, skeleton/shimmer)
 * C = Content (affiché)  
 * E = Error (toast + bouton "Réessayer")
 * V = Vide (pédagogique + CTA)
 */

// État Loading - Skeleton avec shimmer
export const LoadingState: React.FC<{ 
  type?: 'card' | 'list' | 'dashboard' | 'chart';
  count?: number;
}> = ({ type = 'card', count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-4 w-2/3" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-1/2 mb-2" />
                    <Skeleton className="h-3 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        );
        
      case 'list':
        return (
          <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        );
        
      case 'chart':
        return (
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-48 w-full" />
            </CardContent>
          </Card>
        );
        
      default: // card
        return (
          <Card>
            <CardHeader>
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="animate-pulse" aria-label="Chargement en cours...">
      {renderSkeleton()}
    </div>
  );
};

// État Error - Non bloquant avec retry
export const ErrorState: React.FC<{
  error: string;
  onRetry?: () => void;
  type?: 'inline' | 'card' | 'full';
}> = ({ error, onRetry, type = 'card' }) => {
  const content = (
    <div className="text-center p-4 space-y-3">
      <AlertCircle className="w-8 h-8 text-destructive mx-auto" aria-hidden="true" />
      <div>
        <h3 className="font-medium text-destructive mb-1">Erreur de chargement</h3>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
      {onRetry && (
        <Button 
          onClick={onRetry}
          size="sm"
          variant="outline"
          aria-label="Réessayer de charger le contenu"
        >
          <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
          Réessayer
        </Button>
      )}
    </div>
  );

  if (type === 'full') {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        {content}
      </div>
    );
  }

  if (type === 'inline') {
    return (
      <div className="bg-destructive/5 border border-destructive/20 rounded-lg">
        {content}
      </div>
    );
  }

  return (
    <Card className="border-destructive/20">
      <CardContent className="p-0">
        {content}
      </CardContent>
    </Card>
  );
};

// État Vide - Pédagogique avec CTA clair
export const EmptyState: React.FC<{
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
  tips?: string[];
}> = ({ title, description, action, icon, tips }) => {
  return (
    <Card className="border-dashed border-2">
      <CardContent className="text-center p-8 space-y-4">
        <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto">
          {icon || <Lightbulb className="w-8 h-8 text-muted-foreground" aria-hidden="true" />}
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium text-lg">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>

        {tips && tips.length > 0 && (
          <div className="bg-secondary/30 rounded-lg p-4 text-sm">
            <h4 className="font-medium mb-2">💡 Conseils :</h4>
            <ul className="text-left space-y-1 text-muted-foreground">
              {tips.map((tip, index) => (
                <li key={index}>• {tip}</li>
              ))}
            </ul>
          </div>
        )}

        {action && (
          <Button onClick={action.onClick} className="mt-4">
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

// Hook pour gérer les états L/C/E/V
export const useLoadingStates = <T>(
  asyncFunction: () => Promise<T>,
  dependencies: unknown[] = []
) => {
  const [state, setState] = React.useState<{
    loading: boolean;
    error: string | null;
    data: T | null;
    isEmpty: boolean;
  }>({
    loading: true,
    error: null,
    data: null,
    isEmpty: false
  });

  const execute = React.useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await asyncFunction();
      const isEmpty = !result || 
        (Array.isArray(result) && result.length === 0) ||
        (typeof result === 'object' && Object.keys(result).length === 0);
        
      setState({
        loading: false,
        error: null,
        data: result,
        isEmpty
      });
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        data: null,
        isEmpty: false
      });
    }
  }, dependencies);

  React.useEffect(() => {
    execute();
  }, [execute]);

  return {
    ...state,
    retry: execute
  };
};