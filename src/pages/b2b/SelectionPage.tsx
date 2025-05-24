
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const B2BSelectionPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="container max-w-4xl mx-auto p-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Solutions Entreprise</h1>
          <p className="text-muted-foreground">Choisissez votre profil d'accès</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Collaborateur</CardTitle>
              <CardDescription>Accès aux outils de bien-être émotionnel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                <li>✓ Scan émotionnel personnel</li>
                <li>✓ Coach IA personnalisé</li>
                <li>✓ Musicothérapie adaptative</li>
                <li>✓ Défis d'équipe</li>
                <li>✓ Cocon social sécurisé</li>
              </ul>
              <div className="space-y-2">
                <Link to="/b2b/user/login">
                  <Button className="w-full">Se connecter</Button>
                </Link>
                <Link to="/b2b/user/register">
                  <Button variant="outline" className="w-full">S'inscrire</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Administrateur RH</CardTitle>
              <CardDescription>Gestion et supervision du bien-être</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                <li>✓ Tableau de bord analytique</li>
                <li>✓ Gestion des équipes</li>
                <li>✓ Rapports de bien-être</li>
                <li>✓ Configuration des ressources</li>
                <li>✓ Optimisation organisationnelle</li>
              </ul>
              <Link to="/b2b/admin/login">
                <Button className="w-full">Accès Administrateur</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Link to="/choose-mode" className="text-muted-foreground hover:underline">
            ← Retour au choix du mode
          </Link>
        </div>
      </div>
    </div>
  );
};

export default B2BSelectionPage;
