
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Shell from '@/Shell';

const Profile: React.FC = () => {
  return (
    <Shell>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Mon Profil</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nom</p>
                <p>Jean Dupont</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>jean.dupont@example.com</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rôle</p>
                <p>Utilisateur</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Membre depuis</p>
                <p>12 Mai 2023</p>
              </div>
            </div>
            
            <Button variant="outline" className="mt-4">Modifier</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Préférences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Gérez vos préférences et paramètres de compte.</p>
            <Button>Accéder aux paramètres</Button>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
};

export default Profile;
