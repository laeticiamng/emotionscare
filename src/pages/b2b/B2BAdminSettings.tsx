
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Shield, Database, Bell } from 'lucide-react';

const B2BAdminSettings: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Paramètres Administrateur</h1>
        <p className="text-muted-foreground">
          Configurez les paramètres de votre organisation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Paramètres Généraux
            </CardTitle>
            <CardDescription>
              Configuration générale de l'organisation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              Informations de l'organisation
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Préférences système
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Configuration des modules
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Sécurité et Permissions
            </CardTitle>
            <CardDescription>
              Gestion de la sécurité et des accès
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              Politiques de sécurité
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Gestion des rôles
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Authentification
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Données et Sauvegarde
            </CardTitle>
            <CardDescription>
              Gestion des données et sauvegardes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              Sauvegarde automatique
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Export des données
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Rétention des données
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configuration des notifications système
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              Notifications email
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Alertes système
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Rapports automatiques
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BAdminSettings;
