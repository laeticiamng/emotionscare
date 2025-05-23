
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Heart, Users, Shield, ArrowRight, Star } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center space-y-8">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <Brain className="h-12 w-12 text-primary" />
            <span className="text-4xl font-bold">EmotionsCare</span>
          </div>
          
          <h1 className="text-6xl font-bold tracking-tight">
            Votre bien-être émotionnel,
            <span className="text-primary block">notre priorité</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez une plateforme innovante qui combine intelligence artificielle et 
            accompagnement personnalisé pour améliorer votre santé mentale et émotionnelle.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => navigate('/choose-mode')}
            >
              Commencer maintenant
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6"
            >
              En savoir plus
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Pourquoi choisir EmotionsCare ?
          </h2>
          <p className="text-xl text-muted-foreground">
            Des outils avancés pour votre épanouissement personnel et professionnel
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <Brain className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Scanner IA Émotionnel</CardTitle>
              <CardDescription>
                Analysez vos émotions en temps réel grâce à notre IA avancée
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Analyse textuelle et vocale</li>
                <li>• Détection d'émotions précise</li>
                <li>• Recommandations personnalisées</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <Heart className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Coach IA Personnel</CardTitle>
              <CardDescription>
                Un accompagnement sur mesure 24h/24 et 7j/7
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Conversations naturelles</li>
                <li>• Conseils adaptés à votre profil</li>
                <li>• Suivi de progression</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Solutions Entreprise</CardTitle>
              <CardDescription>
                Améliorez le bien-être de vos équipes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Tableau de bord RH</li>
                <li>• Analytics d'équipe</li>
                <li>• Prévention du burnout</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Ils nous font confiance
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-background">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    "EmotionsCare a transformé notre approche du bien-être en entreprise. 
                    Les outils sont intuitifs et les résultats remarquables."
                  </p>
                  <div className="font-semibold">Marie D.</div>
                  <div className="text-sm text-muted-foreground">DRH, TechCorp</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center space-y-8">
          <h2 className="text-4xl font-bold">
            Prêt à commencer votre parcours ?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui ont déjà amélioré 
            leur bien-être avec EmotionsCare
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-6"
            onClick={() => navigate('/choose-mode')}
          >
            Commencer gratuitement
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-primary" />
              <span className="font-bold">EmotionsCare</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 EmotionsCare. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
