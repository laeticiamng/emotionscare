
import React from 'react';
import Shell from '@/Shell';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Activity, Bell, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const B2BUserDashboard: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <Shell>
      <div className="container mx-auto py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Header with welcome message */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">Bienvenue, {user?.name || 'Collaborateur'}</h1>
              <p className="text-muted-foreground">
                Tableau de bord collaborateur
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center gap-2 bg-accent/50 p-2 rounded-md">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
            </div>
          </div>
          
          {/* Team wellness summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Bien-être de l'équipe
              </CardTitle>
              <CardDescription>Aperçu du bien-être émotionnel dans votre équipe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-40 flex items-center justify-center border-2 border-dashed border-muted rounded-md mb-4">
                <span className="text-muted-foreground">Visualisation du bien-être en cours de chargement</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-accent/30 p-3 rounded-md">
                  <p className="text-sm font-medium mb-1">Niveau d'énergie</p>
                  <p className="text-xl font-bold">78%</p>
                </div>
                <div className="bg-accent/30 p-3 rounded-md">
                  <p className="text-sm font-medium mb-1">Satisfaction</p>
                  <p className="text-xl font-bold">82%</p>
                </div>
                <div className="bg-accent/30 p-3 rounded-md">
                  <p className="text-sm font-medium mb-1">Engagement</p>
                  <p className="text-xl font-bold">75%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Personal stats and notifications */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Votre bien-être
                </CardTitle>
                <CardDescription>Évolution sur les 7 derniers jours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60 flex items-center justify-center border-2 border-dashed border-muted rounded-md">
                  <span className="text-muted-foreground">Graphique en cours de chargement</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription>Dernières mises à jour</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-3 py-1">
                    <p className="text-sm font-medium">Nouvelle ressource disponible</p>
                    <p className="text-xs text-muted-foreground">Il y a 2 heures</p>
                  </div>
                  <div className="border-l-4 border-primary pl-3 py-1">
                    <p className="text-sm font-medium">Atelier bien-être demain</p>
                    <p className="text-xs text-muted-foreground">Il y a 1 jour</p>
                  </div>
                  <div className="border-l-4 border-primary pl-3 py-1">
                    <p className="text-sm font-medium">Rappel: check-in hebdomadaire</p>
                    <p className="text-xs text-muted-foreground">Il y a 2 jours</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Ressources recommandées
              </CardTitle>
              <CardDescription>Sélectionnées pour vous aider dans votre parcours de bien-être</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-4 hover:bg-accent/30 transition-colors cursor-pointer">
                  <p className="font-medium">Guide de gestion du stress</p>
                  <p className="text-sm text-muted-foreground mt-1">Techniques pratiques pour gérer le stress au quotidien</p>
                </div>
                <div className="border rounded-md p-4 hover:bg-accent/30 transition-colors cursor-pointer">
                  <p className="font-medium">Méditations guidées</p>
                  <p className="text-sm text-muted-foreground mt-1">5 méditations courtes pour la journée de travail</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Shell>
  );
};

export default B2BUserDashboard;
