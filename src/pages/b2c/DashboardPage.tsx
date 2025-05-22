
import React from 'react';
import Shell from '@/Shell';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, ClockIcon, LineChart, Activity, Music, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const DashboardPage: React.FC = () => {
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
              <h1 className="text-3xl font-bold mb-1">Bonjour, {user?.name || 'Utilisateur'}</h1>
              <p className="text-muted-foreground">
                Voici votre tableau de bord personnel
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center gap-2 bg-accent/50 p-2 rounded-md">
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
            </div>
          </div>
          
          {/* Quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  Humeur moyenne
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">76/100</div>
                <p className="text-xs text-muted-foreground mt-1">+5% par rapport à la semaine dernière</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Entrées de journal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground mt-1">3 cette semaine</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <ClockIcon className="h-4 w-4 text-primary" />
                  Temps de méditation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45 min</div>
                <p className="text-xs text-muted-foreground mt-1">Cette semaine</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Mood chart */}
          <Card>
            <CardHeader>
              <CardTitle>Évolution de votre humeur</CardTitle>
              <CardDescription>Tendance des 30 derniers jours</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <div className="h-full w-full flex items-center justify-center border-2 border-dashed border-muted rounded-md">
                <LineChart className="h-8 w-8 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Graphique en cours de chargement</span>
              </div>
            </CardContent>
          </Card>
          
          {/* Recommendations section */}
          <h2 className="text-2xl font-semibold mt-8">Recommandations pour vous</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5 text-primary" />
                  Musique
                </CardTitle>
                <CardDescription>Basé sur votre humeur actuelle</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Playlist relaxante pour améliorer votre concentration</p>
                <div className="mt-4 text-sm text-primary">Écouter maintenant →</div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Journal
                </CardTitle>
                <CardDescription>Suggestion d'entrée</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Prenez un moment pour réfléchir à vos accomplissements de la semaine</p>
                <div className="mt-4 text-sm text-primary">Commencer à écrire →</div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Exercice
                </CardTitle>
                <CardDescription>Activité recommandée</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Méditation guidée de 10 minutes pour réduire votre niveau de stress</p>
                <div className="mt-4 text-sm text-primary">Commencer l'exercice →</div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </Shell>
  );
};

export default DashboardPage;
