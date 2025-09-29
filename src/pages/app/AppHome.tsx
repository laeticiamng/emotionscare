/**
 * App Home - Page d'accueil principale de l'application
 * Point d'entrée unifié avec dashboard moderne et navigation complète
 */

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import EnhancedDashboard from '@/components/modern-features/EnhancedDashboard';
import SmartNotificationCenter from '@/components/modern-features/SmartNotificationCenter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Bell, 
  Settings, 
  Activity, 
  User, 
  BarChart3,
  Calendar,
  MessageCircle,
  Heart,
  Sparkles
} from 'lucide-react';

const AppHome: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Accès restreint</h2>
          <p className="text-muted-foreground">Veuillez vous connecter pour accéder à l'application.</p>
          <Button asChild>
            <a href="/login">Se connecter</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Tableau de bord
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Activité
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Calendrier
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profil
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <EnhancedDashboard />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <SmartNotificationCenter />
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Historique d'activité
              </h3>
              <p className="text-sm text-muted-foreground">
                Suivez toutes vos sessions et interactions détaillées
              </p>
              <Button className="mt-4" disabled>
                Fonctionnalité en développement
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Analytics avancées
              </h3>
              <p className="text-sm text-muted-foreground">
                Analyses détaillées de votre progression et bien-être
              </p>
              <Button className="mt-4" disabled>
                Fonctionnalité en développement
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Calendrier de bien-être
              </h3>
              <p className="text-sm text-muted-foreground">
                Planifiez vos sessions et suivez votre routine
              </p>
              <Button className="mt-4" disabled>
                Fonctionnalité en développement
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div className="text-center py-12">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Profil utilisateur
              </h3>
              <p className="text-sm text-muted-foreground">
                Gérez votre profil et vos préférences personnelles
              </p>
              <Button className="mt-4" disabled>
                Fonctionnalité en développement
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AppHome;