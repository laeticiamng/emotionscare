
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, ArrowLeft } from 'lucide-react';
import { UNIFIED_ROUTES } from '@/utils/routeUtils';

const B2BAdminLoginPage = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de connexion ici
    navigate(UNIFIED_ROUTES.B2B_ADMIN_DASHBOARD);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center" data-testid="page-root">
      <div className="w-full max-w-md px-4">
        <Card className="shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Connexion Administrateur B2B
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300">
              Accédez à votre tableau de bord administrateur
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email administrateur</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@entreprise.com"
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
                  placeholder="Mot de passe administrateur"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
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

export default B2BAdminLoginPage;
