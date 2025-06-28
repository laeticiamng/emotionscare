
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Building2, ArrowLeft, ArrowRight } from 'lucide-react';

const ChooseModePage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Choisissez votre mode d'accès
            </h1>
            <p className="text-xl text-muted-foreground">
              Sélectionnez l'option qui correspond le mieux à vos besoins
            </p>
          </div>

          {/* Mode Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* B2C Card */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300">
              <CardHeader className="pb-4">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/30 group-hover:scale-110 transition-transform">
                    <Heart className="h-12 w-12 text-blue-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-center">Particulier (B2C)</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">
                  Pour votre bien-être personnel et celui de votre famille
                </p>
                
                <div className="space-y-3 mb-8 text-left">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm">Accès complet aux outils personnels</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm">Scanner d'émotions avancé</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm">Coach virtuel personnalisé</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm">Musique thérapeutique adaptée</span>
                  </div>
                </div>

                <Link to="/b2c/login" className="block">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                    Commencer en tant que Particulier
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* B2B Card */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-300">
              <CardHeader className="pb-4">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-purple-100 dark:bg-purple-900/30 group-hover:scale-110 transition-transform">
                    <Building2 className="h-12 w-12 text-purple-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-center">Entreprise (B2B)</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">
                  Pour améliorer le bien-être de vos équipes
                </p>
                
                <div className="space-y-3 mb-8 text-left">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-sm">Dashboard RH complet</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-sm">Analyse du climat émotionnel</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-sm">Gestion d'équipes</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-sm">Rapports et statistiques</span>
                  </div>
                </div>

                <Link to="/b2b" className="block">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    Accéder à l'Espace Entreprise
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Vous hésitez ? Découvrez nos fonctionnalités
            </p>
            <Button variant="outline">
              En savoir plus
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseModePage;
