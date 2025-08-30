import { AsyncState } from "@/components/transverse";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Building2, Heart } from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <main data-testid="page-root" className="min-h-screen bg-background">
      {/* Skip link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded"
      >
        Skip to content
      </a>

      <div className="container mx-auto px-4 py-8" id="main-content">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            EmotionsCare
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Votre plateforme de bien-être émotionnel
          </p>
        </div>

        <AsyncState.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* B2C Card */}
            <Card className="cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => navigate('/b2c')}>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Heart className="h-6 w-6 text-primary" />
                  <CardTitle>Découvrir B2C</CardTitle>
                </div>
                <CardDescription>
                  Votre espace personnel de bien-être et d'épanouissement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Commencer mon parcours
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* B2B Card */}
            <Card className="cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => navigate('/entreprise')}>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Building2 className="h-6 w-6 text-primary" />
                  <CardTitle>Entreprise</CardTitle>
                </div>
                <CardDescription>
                  Solutions bien-être pour vos équipes et votre organisation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Découvrir nos solutions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Navigation footer */}
          <div className="text-center mt-12">
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Entrer
              </Button>
              <Button variant="ghost" onClick={() => navigate('/help')}>
                Aide
              </Button>
            </div>
          </div>
        </AsyncState.Content>
      </div>
    </main>
  );
}