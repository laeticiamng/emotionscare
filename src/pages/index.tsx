import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Building2, Heart } from "lucide-react";
import MainNavigation from "@/components/navigation/MainNavigation";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainNavigation />
      
      <main data-testid="page-root" className="flex-1">
        {/* Skip link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded z-50"
        >
          Skip to content
        </a>

        <div className="container mx-auto px-4 py-16" id="main-content">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              EmotionsCare
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Votre plateforme de bien-être émotionnel propulsée par l'IA
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* B2C Card */}
            <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
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
            <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
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
                Se connecter
              </Button>
              <Button variant="ghost" onClick={() => navigate('/help')}>
                Aide
              </Button>
              <Button variant="ghost" onClick={() => navigate('/about')}>
                À propos
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}