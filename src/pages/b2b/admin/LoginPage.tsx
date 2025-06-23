
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield } from 'lucide-react';

const B2BAdminLoginPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Connexion Administrateur</CardTitle>
          <CardDescription>
            Accédez au tableau de bord administrateur
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email administrateur</Label>
            <Input id="admin-email" type="email" placeholder="admin@entreprise.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Mot de passe</Label>
            <Input id="admin-password" type="password" />
          </div>
          <Button 
            onClick={() => navigate('/b2b/admin/dashboard')}
            className="w-full"
          >
            Se connecter
          </Button>
          <div className="text-center space-y-2">
            <Button 
              onClick={() => navigate('/b2b/selection')}
              variant="ghost"
              className="text-sm"
            >
              ← Retour à la sélection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BAdminLoginPage;
