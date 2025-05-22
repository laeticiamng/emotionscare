
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smile, Calendar, Music, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Shell from '@/Shell';

const B2CDashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <Shell>
      <div className="container mx-auto py-6 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Bonjour, {user?.name || 'Utilisateur'}</h1>
            <p className="text-muted-foreground">Bienvenue sur votre espace personnel EmotionsCare</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Smile className="mr-2 h-5 w-5 text-blue-500" />
                  État émotionnel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">Serein</p>
                <p className="text-sm text-muted-foreground">Basé sur vos dernières entrées</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-green-500" />
                  Journal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Entrées cette semaine</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Music className="mr-2 h-5 w-5 text-purple-500" />
                  Musicothérapie
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">15 min</p>
                <p className="text-sm text-muted-foreground">De détente aujourd'hui</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-orange-500" />
                  Discussions IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">2</p>
                <p className="text-sm text-muted-foreground">Sessions récentes</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Graphique d'humeur</CardTitle>
                <CardDescription>Évolution sur les 7 derniers jours</CardDescription>
              </CardHeader>
              <CardContent className="h-[200px] flex items-center justify-center bg-muted/20">
                <p className="text-muted-foreground">Graphique en cours de chargement...</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accès rapides</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Button variant="outline" size="sm" className="justify-start">
                  <Smile className="mr-2 h-4 w-4" />
                  Enregistrer mon humeur
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <Music className="mr-2 h-4 w-4" />
                  Séance de musicothérapie
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Parler à mon coach IA
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </Shell>
  );
};

export default B2CDashboardPage;
