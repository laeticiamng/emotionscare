
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield } from 'lucide-react';

const B2BAdminLoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation de connexion admin
    navigate('/b2b/admin/dashboard');
  };

  return (
    <main data-testid="page-root" className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-green-500" />
          <CardTitle className="text-2xl">Connexion Administrateur</CardTitle>
          <p className="text-muted-foreground">
            Accès réservé aux administrateurs EmotionsCare
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email administrateur</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@entreprise.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Connexion Admin
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Button 
              onClick={() => navigate('/b2b/selection')}
              variant="ghost"
              size="sm"
            >
              ← Retour à la sélection
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default B2BAdminLoginPage;
