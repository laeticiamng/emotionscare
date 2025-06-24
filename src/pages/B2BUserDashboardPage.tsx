
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const B2BUserDashboardPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard Collaborateur</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Mon Bien-être</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Suivez votre bien-être au travail
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Équipe</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Ambiance et cohésion d'équipe
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2BUserDashboardPage;
