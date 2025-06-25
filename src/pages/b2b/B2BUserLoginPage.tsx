
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, ArrowLeft } from 'lucide-react';
import { UNIFIED_ROUTES } from '@/utils/routeUtils';

const B2BUserLoginPage = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de connexion ici
    navigate(UNIFIED_ROUTES.B2B_USER_DASHBOARD);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center" data-testid="page-root">
      <div className="w-full max-w-md px-4">
        <Card className="shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Connexion Utilisateur B2B
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300">
              Accédez à votre espace personnel professionnel
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email professionnel</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre.email@entreprise.com"
                  value={credentials.email}
                  onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Votre mot de passe"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Se connecter
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => navigate(UNIFIED_ROUTES.B2B_SELECTION)}
                className="text-gray-600 dark:text-gray-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à la sélection
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BUserLoginPage;
