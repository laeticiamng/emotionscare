
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, Building2, ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            EmotionsCare
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Plateforme de bien-être émotionnel pour particuliers et entreprises
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/choose-mode">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                Commencer maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="lg">
                Se connecter
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <Heart className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Espace Particulier</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Prenez soin de votre bien-être émotionnel avec nos outils personnalisés
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Scanner d'émotions intelligent</li>
                <li>• Musique thérapeutique adaptative</li>
                <li>• Coach virtuel personnalisé</li>
                <li>• Journal émotionnel</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                  <Building2 className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl">Espace Entreprise</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Améliorez le bien-être et la productivité de vos équipes
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Tableau de bord RH avancé</li>
                <li>• Analyse du climat émotionnel</li>
                <li>• Outils de gestion d'équipe</li>
                <li>• Rapports et statistiques</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à commencer ?</h2>
          <p className="text-muted-foreground mb-8">
            Rejoignez des milliers d'utilisateurs qui ont amélioré leur bien-être émotionnel
          </p>
          <Link to="/choose-mode">
            <Button size="lg" className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
              Choisir votre mode d'accès
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
