
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Building2 } from 'lucide-react';

const ChooseModePage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="container max-w-4xl mx-auto p-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Choisissez votre expérience</h1>
          <p className="text-xl text-muted-foreground">
            EmotionsCare s'adapte à vos besoins, que vous soyez un particulier ou une entreprise
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <User className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Particulier</CardTitle>
              <CardDescription className="text-base">
                Votre bien-être émotionnel personnel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-sm">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Scan émotionnel personnalisé
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Coach IA personnel
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Musicothérapie adaptative
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Journal émotionnel
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Communauté de soutien
                </li>
              </ul>
              <div className="space-y-2 pt-4">
                <Link to="/b2c/login">
                  <Button className="w-full" size="lg">
                    Se connecter
                  </Button>
                </Link>
                <Link to="/b2c/register">
                  <Button variant="outline" className="w-full" size="lg">
                    Créer un compte
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Entreprise</CardTitle>
              <CardDescription className="text-base">
                Solutions pour le bien-être en entreprise
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-sm">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Tableau de bord RH avancé
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Gestion des équipes
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Analytics du bien-être
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Défis collaboratifs
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Cocon social sécurisé
                </li>
              </ul>
              <div className="pt-4">
                <Link to="/b2b/selection">
                  <Button className="w-full" size="lg">
                    Accéder aux solutions entreprise
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Link to="/" className="text-muted-foreground hover:underline">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChooseModePage;
