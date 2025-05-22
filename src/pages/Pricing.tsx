
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleTryFree = (type: 'b2c' | 'b2b') => {
    if (type === 'b2c') {
      navigate('/b2c/register');
    } else {
      navigate('/b2b/selection');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Nos offres</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez nos formules adaptées à vos besoins pour un bien-être émotionnel optimal
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Offre Particulier (B2C) */}
          <Card className="relative overflow-hidden border-2 border-primary/20 hover:shadow-lg transition-all">
            <div className="absolute top-0 right-0 bg-primary/10 px-3 py-1 rounded-bl-lg font-medium text-sm">
              Particuliers
            </div>
            <CardHeader>
              <div className="flex items-baseline justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold mb-1">Offre Personnelle</CardTitle>
                  <CardDescription className="text-base">Pour votre bien-être quotidien</CardDescription>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold">15€</span>
                  <span className="text-muted-foreground text-sm">/mois</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Badge className="bg-primary/10 text-primary border-0 hover:bg-primary/20">5 jours d'essai gratuit</Badge>
              
              <div>
                <h3 className="font-medium mb-3">Toutes les fonctionnalités incluses :</h3>
                <ul className="space-y-3">
                  {[
                    "Journal émotionnel personnalisé",
                    "Scan émotionnel quotidien",
                    "Bibliothèque de musicothérapie",
                    "Séances d'audiothérapie illimitées",
                    "Coach virtuel IA",
                    "Accès à la communauté Social Cocon",
                    "Expériences de réalité virtuelle",
                    "Rapports de bien-être hebdomadaires"
                  ].map((feature) => (
                    <li key={feature} className="flex gap-2 items-start">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg" onClick={() => handleTryFree('b2c')}>
                Essayer gratuitement
              </Button>
            </CardFooter>
          </Card>
          
          {/* Offre Entreprise (B2B) */}
          <Card className="relative overflow-hidden border-2 border-primary hover:shadow-lg transition-all">
            <div className="absolute top-0 right-0 bg-primary px-3 py-1 rounded-bl-lg font-medium text-sm text-primary-foreground">
              Entreprises
            </div>
            <CardHeader>
              <div className="flex items-baseline justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold mb-1">Offre Entreprise</CardTitle>
                  <CardDescription className="text-base">Pour votre équipe</CardDescription>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold">10€</span>
                  <span className="text-muted-foreground text-sm">HT /utilisateur /mois</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Badge className="bg-primary/10 text-primary border-0 hover:bg-primary/20">5 jours d'essai gratuit</Badge>
              
              <div>
                <h3 className="font-medium mb-3">Tout de l'offre personnelle, plus :</h3>
                <ul className="space-y-3">
                  {[
                    "Console d'administration dédiée",
                    "Analytics et rapports d'équipe",
                    "Tableaux de bord RH",
                    "Gestion des utilisateurs",
                    "Programme bien-être personnalisable",
                    "Accompagnement d'onboarding",
                    "Sessions collectives",
                    "Support dédié"
                  ].map((feature) => (
                    <li key={feature} className="flex gap-2 items-start">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg" onClick={() => handleTryFree('b2b')}>
                Essayer gratuitement
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Vous avez des besoins spécifiques ? Contactez notre équipe commerciale
          </p>
          <Button variant="outline" className="mx-auto">
            Demander un devis personnalisé
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
