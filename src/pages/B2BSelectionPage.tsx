// @ts-nocheck

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const B2BSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div data-testid="page-root" className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Espace Entreprise</h1>
          <p className="text-muted-foreground">Sélectionnez votre type d'accès</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Collaborateur</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Accès aux outils de bien-être pour les employés
              </p>
              <Button 
                className="w-full" 
                onClick={() => navigate('/b2b/user/login')}
              >
                Se connecter
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Administrateur RH</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Gestion des équipes et rapports de bien-être
              </p>
              <Button 
                className="w-full" 
                onClick={() => navigate('/b2b/admin/login')}
              >
                Accès Admin
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2BSelectionPage;
