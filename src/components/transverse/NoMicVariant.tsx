// @ts-nocheck
import { Mic, MicOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function NoMicVariant() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4" data-testid="page-root">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="relative mx-auto mb-4">
            <Mic className="h-12 w-12 text-muted-foreground" />
            <MicOff className="h-6 w-6 absolute -bottom-1 -right-1 text-destructive" />
          </div>
          <CardTitle>Mode sans microphone</CardTitle>
          <CardDescription>
            Cette fonctionnalité nécessite l'accès à votre microphone, mais il est désactivé. 
            Voici une version alternative qui ne nécessite pas de microphone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Vous pouvez utiliser la saisie de texte à la place de la dictée vocale.
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => navigate('/settings/privacy')}
              variant="outline"
              className="flex-1"
            >
              Activer le micro
            </Button>
            <Button 
              onClick={() => navigate('/app/home')}
              className="flex-1"
            >
              Continuer en silence
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}