import { Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface EmptyFeatureProps {
  flagName?: string;
  title?: string;
  description?: string;
}

export function EmptyFeature({ 
  flagName, 
  title = "Fonctionnalité non disponible",
  description = "Cette fonctionnalité n'est pas encore activée pour votre compte."
}: EmptyFeatureProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4" data-testid="page-root">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {description}
            {flagName && (
              <span className="block mt-2 text-xs font-mono text-muted-foreground">
                Flag: {flagName}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => navigate('/app/home')}
            variant="outline"
            className="w-full"
          >
            Retour à l'accueil
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}