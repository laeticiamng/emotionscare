
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LogOut, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const B2CDashboard = () => {
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
        <h1 className="text-3xl font-bold">Tableau de bord Particulier</h1>
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
            <CardTitle>Journal émotionnel</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Accédez à votre journal émotionnel personnel.
            </p>
            <Button className="w-full">Ouvrir mon journal</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Musicothérapie</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Découvrez des playlists adaptées à vos états émotionnels.
            </p>
            <Button className="w-full">Écouter de la musique</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Coach IA</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Discutez avec votre coach émotionnel personnalisé.
            </p>
            <Button className="w-full">Parler à mon coach</Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          Vous êtes connecté en tant que <strong>Particulier</strong> avec le compte test: user@exemple.fr
        </p>
      </div>
    </div>
  );
};

export default B2CDashboard;
