
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LogOut, Home, Users, BarChart, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const B2BAdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogout = () => {
    // Clear session
    localStorage.removeItem('auth_session');
    localStorage.removeItem('user_role');
    localStorage.removeItem('userMode');
    
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt !",
    });
    
    navigate('/');
  };
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tableau de bord Administration</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/')}>
            <Home className="mr-2 h-4 w-4" />
            Accueil
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Gestion des équipes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Gérez les membres de votre organisation.
            </p>
            <Button className="w-full">Gérer les équipes</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="mr-2 h-5 w-5" />
              Statistiques de bien-être
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Analysez les tendances de bien-être de vos équipes.
            </p>
            <Button className="w-full">Voir les rapports</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Événements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Planifiez des ateliers de bien-être pour vos équipes.
            </p>
            <Button className="w-full">Planifier un événement</Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          Vous êtes connecté en tant qu'<strong>Administrateur</strong> avec le compte test: admin@exemple.fr
        </p>
      </div>
    </div>
  );
};

export default B2BAdminDashboard;
