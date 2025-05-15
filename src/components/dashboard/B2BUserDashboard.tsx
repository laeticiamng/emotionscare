
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const B2BUserDashboard: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord Collaborateur</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Journal émotionnel</CardTitle>
            <CardDescription>Suivi de votre bien-être professionnel</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Accédez à votre journal émotionnel de travail.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Musicothérapie</CardTitle>
            <CardDescription>Sons pour votre productivité</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Découvrez des playlists adaptées à votre environnement de travail.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Coach IA</CardTitle>
            <CardDescription>Votre assistant de bien-être</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Discutez avec votre coach émotionnel professionnel.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          Vous êtes connecté en tant que <strong>Collaborateur</strong> avec le compte: {user?.email || 'collaborateur@exemple.fr'}
        </p>
      </div>
    </div>
  );
};

export default B2BUserDashboard;
