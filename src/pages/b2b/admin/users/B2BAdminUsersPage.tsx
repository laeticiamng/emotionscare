
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, Settings, Shield } from 'lucide-react';

const B2BAdminUsersPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            Gestion des Utilisateurs
          </h1>
          <p className="text-muted-foreground">
            Administration des comptes collaborateurs
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Inviter un utilisateur
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Collaborateurs</CardTitle>
          <CardDescription>Tous les utilisateurs de votre organisation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Interface de gestion des utilisateurs en développement</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BAdminUsersPage;
