import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface PageErrorFallbackProps {
  error: Error;
  resetError: () => void;
  className?: string;
}

const PageErrorFallback: React.FC<PageErrorFallbackProps> = ({
  error,
  resetError,
  className,
}) => {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        'flex min-h-[60vh] items-center justify-center bg-background px-4 py-10',
        className,
      )}
    >
      <Card className="w-full max-w-xl shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-10 w-10 text-destructive" aria-hidden="true" />
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Oups, quelque chose s&apos;est mal passé
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-sm text-muted-foreground">
            L&apos;équipe technique a été notifiée. Vous pouvez tenter de recharger la vue ou revenir plus tard.
          </p>

          <div className="rounded-md bg-muted/50 p-4 text-left">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Détails techniques
            </p>
            <Separator className="my-2" />
            <pre className="max-h-40 overflow-auto text-xs text-muted-foreground/90">
              {error.message}
            </pre>
          </div>

          <Button onClick={resetError} className="w-full" variant="default">
            <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
            Réessayer
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PageErrorFallback;
