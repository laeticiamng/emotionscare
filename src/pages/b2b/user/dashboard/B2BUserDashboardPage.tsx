
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const B2BUserDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="container mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Tableau de bord Collaborateur</h1>
          <Button onClick={handleLogout} variant="outline">
            Déconnexion
          </Button>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Bienvenue</CardTitle>
              <CardDescription>Votre espace collaborateur</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Bonjour {user?.user_metadata?.name || user?.email}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scanner d'émotions</CardTitle>
              <CardDescription>Analysez votre bien-être</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/b2b/user/scan')} className="w-full">
                Commencer un scan
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Espace social</CardTitle>
              <CardDescription>Interagissez avec vos collègues</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/b2b/user/social')} className="w-full">
                Accéder au social
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2BUserDashboardPage;
