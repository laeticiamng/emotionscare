
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardAccessErrorProps {
  error?: string;
}

const DashboardAccessError: React.FC<DashboardAccessErrorProps> = ({ 
  error = "Il y a eu un problème d'accès au tableau de bord."
}) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Accès au tableau de bord</CardTitle>
          <CardDescription>Un problème est survenu lors de l'accès</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive mb-4">{error}</p>
          
          <div className="p-4 bg-secondary/20 rounded-md">
            <h3 className="font-medium mb-2">Informations de diagnostic:</h3>
            <ul className="text-sm space-y-1">
              <li>Authentifié: {isAuthenticated ? 'Oui' : 'Non'}</li>
              <li>Rôle: {user?.role || 'Non défini'}</li>
              <li>Chemin actuel: {window.location.pathname}</li>
              <li>Mode: {import.meta.env.MODE || 'production'}</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate('/')}>
            Retour à l'accueil
          </Button>
          <Button onClick={() => navigate('/b2c/login')}>
            Se connecter
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DashboardAccessError;
