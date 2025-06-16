import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyDashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">
        Tableau de Bord RGPD
      </h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gestion des données personnelles</CardTitle>
            <CardDescription>
              Exportation et suppression RGPD
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              🛡️ Page en cours de développement
              <br />
              Connexion API: /api/gdpr/*
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Préférences de confidentialité</CardTitle>
            <CardDescription>
              Gestion des paramètres de confidentialité
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              ⚙️ Paramètres de confidentialité
              <br />
              Connexion API: /api/privacy/*
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyDashboardPage;