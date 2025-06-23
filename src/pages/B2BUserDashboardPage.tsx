
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const B2BUserDashboardPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard Collaborateur</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Scan Équipe</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Participez au scan collectif</p>
              <Button asChild>
                <Link to="/scan">Participer</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Coach Professionnel</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Conseils pour le travail</p>
              <Button asChild>
                <Link to="/coach">Consulter</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Social Cocon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Connectez-vous avec vos collègues</p>
              <Button asChild>
                <Link to="/social-cocon">Rejoindre</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2BUserDashboardPage;
