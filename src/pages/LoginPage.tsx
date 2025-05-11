
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useUserMode } from '@/contexts/UserModeContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { setUserMode } = useUserMode();
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Déterminer le type d'accès en fonction du chemin
    const isAdminLogin = location.pathname.includes('admin');
    
    // Définir le mode utilisateur approprié
    if (isAdminLogin) {
      setUserMode('b2b-admin');
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur votre tableau de bord administrateur"
      });
      navigate('/admin/dashboard');
    } else {
      setUserMode('b2c');
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur votre tableau de bord personnel"
      });
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email">Email</label>
              <Input id="email" type="email" placeholder="email@exemple.com" />
            </div>
            <div className="space-y-2">
              <label htmlFor="password">Mot de passe</label>
              <Input id="password" type="password" />
            </div>
            <Button type="submit" className="w-full">Se connecter</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
