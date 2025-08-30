import { AsyncState } from "@/components/transverse";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Search, ArrowLeft, Home } from "lucide-react";

export default function Page404() {
  const navigate = useNavigate();

  return (
    <main data-testid="page-root" className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-muted rounded-full">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">404 - Page introuvable</CardTitle>
          <CardDescription>
            La page que vous cherchez n'existe pas ou a été déplacée.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Cette adresse ne correspond à aucune page de notre plateforme.
            Vérifiez l'URL ou utilisez la navigation pour explorer nos fonctionnalités.
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
              onClick={() => navigate('/')}
              className="flex-1"
            >
              <Home className="h-4 w-4 mr-2" />
              Accueil
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}