import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Heart, BarChart3, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const B2BCollabDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6" data-testid="page-root">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Dashboard Collaborateur
          </h1>
          <p className="text-muted-foreground mt-2">Votre espace bien-être en équipe</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Équipe Marketing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18/24</div>
              <p className="text-sm text-muted-foreground">Membres actifs aujourd'hui</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Bien-être Équipe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7.8/10</div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">Excellent</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Objectif Semaine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">72%</div>
              <p className="text-sm text-muted-foreground">Sur 85% visé</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link to="/app/scan">
            <Button variant="outline" className="w-full h-20 flex-col gap-2">
              <Heart className="h-6 w-6" />
              Scan d'équipe
            </Button>
          </Link>
          <Link to="/app/music">
            <Button variant="outline" className="w-full h-20 flex-col gap-2">
              <MessageSquare className="h-6 w-6" />
              Session groupe
            </Button>
          </Link>
          <Link to="/messages">
            <Button variant="outline" className="w-full h-20 flex-col gap-2">
              <MessageSquare className="h-6 w-6" />
              Chat équipe
            </Button>
          </Link>
          <Link to="/app/teams">
            <Button variant="outline" className="w-full h-20 flex-col gap-2">
              <Users className="h-6 w-6" />
              Gestion équipe
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default B2BCollabDashboard;