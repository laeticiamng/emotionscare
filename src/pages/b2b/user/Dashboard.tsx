
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LogOut, Home, BookOpen, Music2, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const B2BUserDashboard = () => {
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
        <h1 className="text-3xl font-bold">Tableau de bord Collaborateur</h1>
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
              <BookOpen className="mr-2 h-5 w-5" />
              Journal professionnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Notez vos émotions et votre bien-être au travail.
            </p>
            <Button className="w-full">Ouvrir mon journal</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Music2 className="mr-2 h-5 w-5" />
              Pause musicale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Prenez une pause musicale pour vous ressourcer.
            </p>
            <Button className="w-full">Écouter de la musique</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Coach professionnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Discutez avec votre coach pour améliorer votre bien-être au travail.
            </p>
            <Button className="w-full">Parler à mon coach</Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          Vous êtes connecté en tant que <strong>Collaborateur</strong> avec le compte test: collaborateur@exemple.fr
        </p>
      </div>
    </div>
  );
};

export default B2BUserDashboard;
