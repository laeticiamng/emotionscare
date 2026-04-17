/**
 * ModuleGate — bloque le rendu d'un module si son kill-switch est actif.
 * @module components/governance/ModuleGate
 */
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useModuleLifecycle } from '@/lib/governance/useModuleLifecycle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ModuleGateProps {
  moduleKey: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function ModuleGate({ moduleKey, children, fallback }: ModuleGateProps) {
  const { loading, killSwitch, module } = useModuleLifecycle(moduleKey);

  if (loading) {
    return (
      <div
        className="flex h-32 items-center justify-center text-sm text-muted-foreground"
        role="status"
        aria-live="polite"
      >
        Vérification de la disponibilité…
      </div>
    );
  }

  if (killSwitch) {
    if (fallback) return <>{fallback}</>;
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-10">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldAlert className="h-5 w-5 text-destructive" aria-hidden />
              Module temporairement indisponible
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Le module <strong className="text-foreground">{module?.display_name ?? moduleKey}</strong>{' '}
              est désactivé par les équipes EmotionsCare pour maintenance ou raison de sécurité.
            </p>
            <p className="text-xs">
              Cette mesure est temporaire. Vous pouvez continuer à utiliser les autres modules.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/app/home">
                <ArrowLeft className="mr-2 h-4 w-4" /> Retour à l'accueil
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

export default ModuleGate;
