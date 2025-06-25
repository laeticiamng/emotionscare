
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Building2, Users, ArrowLeft } from 'lucide-react';

const ChooseModePage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-center mb-4">
            Choisissez votre mode d'accès
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            EmotionsCare propose deux parcours adaptés à vos besoins
          </p>
        </div>

        {/* Mode Selection */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* B2C Card */}
          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center pb-6">
              <Heart className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-2xl">Particulier (B2C)</CardTitle>
              <CardDescription className="text-lg">
                Parcours personnel de bien-être émotionnel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Fonctionnalités incluses :</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Scan émotionnel personnel</li>
                  <li>• Journal de bord interactif</li>
                  <li>• Coach IA personnalisé</li>
                  <li>• Musique thérapeutique</li>
                  <li>• Exercices de relaxation VR</li>
                </ul>
              </div>
              <Button asChild className="w-full" size="lg">
                <Link to="/b2c/login">
                  Accéder à l'espace particulier
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* B2B Card */}
          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center pb-6">
              <Building2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-2xl">Entreprise (B2B)</CardTitle>
              <CardDescription className="text-lg">
                Solutions pour équipes et organisations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Fonctionnalités incluses :</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Tableau de bord RH</li>
                  <li>• Analytics d'équipe</li>
                  <li>• Gestion multi-utilisateurs</li>
                  <li>• Rapports personnalisés</li>
                  <li>• Support dédié</li>
                </ul>
              </div>
              <Button asChild className="w-full" size="lg">
                <Link to="/b2b/selection">
                  Accéder à l'espace entreprise
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <div className="text-center mt-12">
          <Card className="max-w-xl mx-auto">
            <CardContent className="p-6">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Besoin d'aide ?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Notre équipe est là pour vous accompagner dans le choix de la solution la plus adaptée.
              </p>
              <Button asChild variant="outline">
                <Link to="/contact">
                  Nous contacter
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChooseModePage;
