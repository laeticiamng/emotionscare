import { AsyncState } from "@/components/transverse";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";

export default function Page403() {
  const navigate = useNavigate();

  return (
    <main data-testid="page-root" className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-destructive/10 rounded-full">
              <Shield className="h-12 w-12 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl">403 - Accès refusé</CardTitle>
          <CardDescription>
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Cette ressource nécessite des droits d'accès particuliers. 
            Contactez votre administrateur si vous pensez qu'il s'agit d'une erreur.
          </p>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <Button 
              onClick={() => navigate('/app/home')}
              className="flex-1"
            >
              Accueil
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}