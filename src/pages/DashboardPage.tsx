
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import B2CDashboardPage from './b2c/DashboardPage';
import AdminDashboardPage from './admin/DashboardPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MusicProvider } from '@/contexts/music';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  const renderDashboard = () => {
    if (!user) {
      return <WelcomeDashboard />;
    }
    
    switch (user.role) {
      case 'admin':
        return <AdminDashboardPage />;
      case 'b2c':
        return <B2CDashboardPage />;
      case 'b2b_user':
        return <B2BUserDashboard />;
      case 'b2b_admin':
        return <B2BAdminDashboard />;
      default:
        return <B2CDashboardPage />;
    }
  };
  
  return (
    <MusicProvider>
      <div className="container mx-auto py-6 px-4">
        {renderDashboard()}
      </div>
    </MusicProvider>
  );
};

// Page d'accueil par défaut
const WelcomeDashboard: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Bienvenue sur EmotionsCare</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Connectez-vous pour commencer</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Pour accéder à toutes les fonctionnalités d'EmotionsCare, veuillez vous connecter ou créer un compte.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

// Dashboard pour les utilisateurs B2B
const B2BUserDashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Espace Collaborateur</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mon état émotionnel</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Visualisation de votre état émotionnel au fil du temps.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Mes objectifs</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Suivi de vos objectifs de bien-être.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Dashboard pour les administrateurs B2B
const B2BAdminDashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard Administrateur</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Vue d'ensemble de l'équipe</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Statistiques générales sur l'état émotionnel de l'équipe.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Alertes</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Signalements et alertes de bien-être.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Rapports</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Rapports et analyses détaillées.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
