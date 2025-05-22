
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardContent from '@/components/dashboard/DashboardContent';
import QuickAccessMenu from '@/components/dashboard/QuickAccessMenu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Users, LineChart } from 'lucide-react';

const B2BAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Bienvenue, {user?.name || 'Administrateur'}</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <ShieldCheck className="mr-2 h-5 w-5 text-primary" />
              Administration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Accès administrateur aux services de bien-être émotionnel
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Users className="mr-2 h-5 w-5 text-primary" />
              Collaborateurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              25 utilisateurs actifs
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <LineChart className="mr-2 h-5 w-5 text-primary" />
              Analyses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Rapport mensuel disponible
            </p>
          </CardContent>
        </Card>
      </div>
      
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Outils d'administration</h2>
        <QuickAccessMenu />
      </section>
      
      <section>
        <h2 className="text-xl font-bold mb-4">Contenu administrateur</h2>
        <DashboardContent />
      </section>
    </div>
  );
};

export default B2BAdminDashboard;
