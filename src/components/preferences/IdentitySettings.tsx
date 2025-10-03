
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const IdentitySettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Paramètres d'identité</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Gérez vos informations personnelles et votre identité sur la plateforme.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
          <CardDescription>
            Consultez et mettez à jour les informations liées à votre profil.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="default" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              Pour modifier votre nom, email ou mot de passe, veuillez accéder à votre profil complet.
            </AlertDescription>
          </Alert>
          
          <Button variant="outline">
            Accéder au profil complet
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Suppression de compte</CardTitle>
          <CardDescription>
            Options pour supprimer votre compte et vos données associées.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            La suppression de votre compte est définitive et supprimera toutes vos données personnelles 
            de notre système conformément à notre politique de confidentialité.
          </p>
          
          <Button variant="destructive">
            Demander la suppression de mon compte
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default IdentitySettings;
