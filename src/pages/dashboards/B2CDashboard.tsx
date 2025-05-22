
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardContent from '@/components/dashboard/DashboardContent';
import QuickAccessMenu from '@/components/dashboard/QuickAccessMenu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, User } from 'lucide-react';

const B2CDashboard: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Bienvenue, {user?.name || 'Utilisateur'}</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <User className="mr-2 h-5 w-5 text-primary" />
              Profil particulier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Espace dédié au bien-être émotionnel personnel.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-primary" />
              Journal émotionnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Dernière entrée : Il y a 2 jours
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <User className="mr-2 h-5 w-5 text-primary" />
              Statistiques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Séances complétées : 12
            </p>
          </CardContent>
        </Card>
      </div>
      
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Accès rapide</h2>
        <QuickAccessMenu />
      </section>
      
      <section>
        <h2 className="text-xl font-bold mb-4">Contenu personnalisé</h2>
        <DashboardContent />
      </section>
    </div>
  );
};

export default B2CDashboard;
