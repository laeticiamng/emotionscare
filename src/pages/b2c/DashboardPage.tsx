
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Activity, 
  Music, 
  MessageCircle, 
  Book, 
  Camera, 
  Settings,
  Trophy,
  Users,
  Headphones
} from 'lucide-react';

const B2CDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-blue-950 dark:to-purple-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Bonjour ! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Bienvenue sur votre tableau de bord personnel EmotionsCare
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bien-être général</CardTitle>
              <Heart className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8.2/10</div>
              <p className="text-xs text-muted-foreground">+0.5 cette semaine</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessions VR</CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Ce mois-ci</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Niveau</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Niveau 3</div>
              <Progress value={65} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Streak quotidien</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7 jours</div>
              <p className="text-xs text-muted-foreground">Continue comme ça !</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Modules rapides */}
          <Card>
            <CardHeader>
              <CardTitle>Accès rapide</CardTitle>
              <CardDescription>Vos outils de bien-être préférés</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <Camera className="h-6 w-6 mb-2" />
                  <span>Scan émotionnel</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Headphones className="h-6 w-6 mb-2" />
                  <span>Musicothérapie</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <MessageCircle className="h-6 w-6 mb-2" />
                  <span>Coach IA</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Book className="h-6 w-6 mb-2" />
                  <span>Journal</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recommandations */}
          <Card>
            <CardHeader>
              <CardTitle>Recommandations du jour</CardTitle>
              <CardDescription>Basées sur votre profil émotionnel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Music className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Session de relaxation</p>
                  <p className="text-xs text-gray-600">15 minutes de méditation guidée</p>
                </div>
                <Badge variant="secondary">Nouveau</Badge>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Activity className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Exercice de respiration</p>
                  <p className="text-xs text-gray-600">Technique 4-7-8 pour réduire le stress</p>
                </div>
                <Badge variant="outline">5 min</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activité récente */}
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>Votre parcours de bien-être cette semaine</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Session VR - Forêt zen</p>
                  <p className="text-xs text-gray-600">Il y a 2 heures</p>
                </div>
                <Badge variant="outline">Complété</Badge>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Scan émotionnel quotidien</p>
                  <p className="text-xs text-gray-600">Hier à 19:30</p>
                </div>
                <Badge variant="outline">Score: 8.5</Badge>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Entrée journal</p>
                  <p className="text-xs text-gray-600">Avant-hier à 22:15</p>
                </div>
                <Badge variant="outline">Réflexion</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2CDashboardPage;
