
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Building, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const ChooseModePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Choisir votre espace - EmotionsCare</title>
        <meta name="description" content="Choisissez votre type de compte EmotionsCare" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Link>
            <h1 className="text-3xl font-bold mb-2">Choisissez votre espace</h1>
            <p className="text-gray-600">
              Sélectionnez le type de compte qui correspond à vos besoins
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Account */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Heart className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <CardTitle className="text-2xl">Compte Personnel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Fonctionnalités incluses :</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Scanner d'émotions personnalisé</li>
                    <li>• Journal intime guidé</li>
                    <li>• Musique thérapeutique adaptée</li>
                    <li>• Coach IA personnel 24/7</li>
                    <li>• Communauté bienveillante</li>
                    <li>• Suivi de progression</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <Link to="/b2c/register" className="block">
                    <Button className="w-full" size="lg">
                      Créer un compte personnel
                    </Button>
                  </Link>
                  <Link to="/b2c/login" className="block">
                    <Button variant="outline" className="w-full">
                      J'ai déjà un compte
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Business Account */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Building className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <CardTitle className="text-2xl">Compte Entreprise</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Solutions professionnelles :</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Tableaux de bord RH complets</li>
                    <li>• Analyse du climat émotionnel</li>
                    <li>• Gestion des équipes</li>
                    <li>• Rapports détaillés</li>
                    <li>• Prévention des risques psychosociaux</li>
                    <li>• Support dédié</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <Link to="/b2b/selection" className="block">
                    <Button className="w-full bg-green-600 hover:bg-green-700" size="lg">
                      Accès espace entreprise
                    </Button>
                  </Link>
                  <p className="text-xs text-gray-500 text-center">
                    Collaborateur ou administrateur
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Besoin d'aide ? Contactez notre équipe support
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChooseModePage;
