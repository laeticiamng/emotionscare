
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Shield, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const B2BRoleSelectionPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Sélection du rôle - EmotionsCare Entreprise</title>
        <meta name="description" content="Choisissez votre rôle dans l'espace entreprise" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <Link to="/choose-mode" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au choix du mode
            </Link>
            <h1 className="text-3xl font-bold mb-2">Espace Entreprise</h1>
            <p className="text-gray-600">
              Choisissez votre rôle pour accéder à votre espace
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Collaborator Access */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Users className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <CardTitle className="text-2xl">Collaborateur</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Accès collaborateur :</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Scanner d'émotions personnel</li>
                    <li>• Suivi de votre bien-être</li>
                    <li>• Accès aux ressources d'entreprise</li>
                    <li>• Communauté d'équipe</li>
                    <li>• Musique de travail</li>
                    <li>• Coach IA adapté au travail</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <Link to="/b2b/user/login" className="block">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                      Se connecter
                    </Button>
                  </Link>
                  <Link to="/b2b/user/register" className="block">
                    <Button variant="outline" className="w-full">
                      Créer un compte
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Admin Access */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <CardTitle className="text-2xl">Administrateur RH</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Tableau de bord RH :</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Vue d'ensemble des équipes</li>
                    <li>• Analyse du climat émotionnel</li>
                    <li>• Rapports et statistiques</li>
                    <li>• Gestion des utilisateurs</li>
                    <li>• Alertes et notifications</li>
                    <li>• Outils de prévention RPS</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <Link to="/b2b/admin/login" className="block">
                    <Button className="w-full bg-red-600 hover:bg-red-700" size="lg">
                      Accès administrateur
                    </Button>
                  </Link>
                  <p className="text-xs text-gray-500 text-center">
                    Réservé aux administrateurs RH
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Votre entreprise n'est pas encore inscrite ? Contactez notre équipe commerciale
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default B2BRoleSelectionPage;
