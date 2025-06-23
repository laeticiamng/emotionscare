
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const B2CDashboardPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard Particulier</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Scan Émotionnel</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Analysez vos émotions du moment</p>
              <Button asChild>
                <Link to="/scan">Commencer un scan</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Coach Personnel</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Discutez avec votre coach IA</p>
              <Button asChild>
                <Link to="/coach">Ouvrir le coach</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Musicothérapie</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Écoutez de la musique adaptée</p>
              <Button asChild>
                <Link to="/music">Explorer la musique</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2CDashboardPage;
