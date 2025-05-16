
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Music, BookOpen, Activity, Settings } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Musique
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Accédez à la bibliothèque musicale, créez vos propres compositions ou ajustez vos préférences.
            </p>
            <div className="space-y-2">
              <Link to="/music">
                <Button variant="default" className="w-full">Bibliothèque musicale</Button>
              </Link>
              <Link to="/music/create">
                <Button variant="outline" className="w-full">Créer une musique</Button>
              </Link>
              <Link to="/music/preferences">
                <Button variant="outline" className="w-full">Préférences musicales</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Journal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Consultez votre journal émotionnel et suivez votre bien-être au fil du temps.
            </p>
            <Button variant="default" className="w-full">
              Accéder au journal
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Activités
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Découvrez des activités recommandées basées sur votre état émotionnel.
            </p>
            <Button variant="default" className="w-full">
              Explorer les activités
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              B2B Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Accédez aux fonctionnalités B2B pour les utilisateurs et administrateurs.
            </p>
            <div className="space-y-2">
              <Link to="/b2b/user/music">
                <Button variant="default" className="w-full">B2B User Music</Button>
              </Link>
              <Link to="/b2b/admin/music">
                <Button variant="outline" className="w-full">B2B Admin Music</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
