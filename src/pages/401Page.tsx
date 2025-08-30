import { AsyncState } from "@/components/transverse";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Lock, LogIn } from "lucide-react";

export default function Page401() {
  const navigate = useNavigate();

  return (
    <main data-testid="page-root" className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-orange-100 rounded-full">
              <Lock className="h-12 w-12 text-orange-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">401 - Authentification requise</CardTitle>
          <CardDescription>
            Vous devez être connecté pour accéder à cette ressource.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Cette page nécessite une authentification. 
            Connectez-vous pour accéder à votre cocon personnel.
          </p>
          
          <div className="space-y-2">
            <Button 
              onClick={() => navigate('/login')}
              className="w-full"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Se connecter
            </Button>
            
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full"
            >
              Retour à l'accueil
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}