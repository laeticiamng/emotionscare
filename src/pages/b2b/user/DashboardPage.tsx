
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Building, 
  Users, 
  Heart, 
  Activity, 
  Music, 
  MessageCircle, 
  Book, 
  Camera, 
  Trophy,
  Calendar,
  Target
} from 'lucide-react';

const B2BUserDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 dark:from-green-950 dark:to-blue-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Building className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Tableau de bord Collaborateur
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Espace bien-être - TechCorp Inc.
              </p>
            </div>
          </div>
          <Badge variant="outline" className="mb-4">
            Collaborateur actif depuis 45 jours
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bien-être général</CardTitle>
              <Heart className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7.8/10</div>
              <p className="text-xs text-muted-foreground">+0.3 cette semaine</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Objectifs équipe</CardTitle>
              <Target className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3/5</div>
              <Progress value={60} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Niveau équipe</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Niveau 2</div>
              <p className="text-xs text-muted-foreground">Équipe Marketing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Participation</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89%</div>
              <p className="text-xs text-muted-foreground">Ce mois-ci</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Outils personnels */}
          <Card>
            <CardHeader>
              <CardTitle>Mes outils bien-être</CardTitle>
              <CardDescription>Accès rapide à vos ressources personnelles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <Camera className="h-6 w-6 mb-2" />
                  <span>Scan quotidien</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Music className="h-6 w-6 mb-2" />
                  <span>Musicothérapie</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <MessageCircle className="h-6 w-6 mb-2" />
                  <span>Coach IA</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Book className="h-6 w-6 mb-2" />
                  <span>Journal privé</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Équipe et événements */}
          <Card>
            <CardHeader>
              <CardTitle>Activités d'équipe</CardTitle>
              <CardDescription>Participez aux initiatives de votre équipe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Défi bien-être équipe</p>
                  <p className="text-xs text-gray-600">30 minutes d'activité quotidienne - 7 jours restants</p>
                </div>
                <Badge variant="secondary">Actif</Badge>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Session VR collective</p>
                  <p className="text-xs text-gray-600">Demain 14h - Salle de réunion A</p>
                </div>
                <Badge variant="outline">S'inscrire</Badge>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Heart className="h-5 w-5 text-purple-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Atelier gestion du stress</p>
                  <p className="text-xs text-gray-600">Vendredi 16h - Formation RH</p>
                </div>
                <Badge variant="outline">Nouveau</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activité récente et équipe */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Mon activité récente</CardTitle>
              <CardDescription>Votre parcours bien-être cette semaine</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Scan émotionnel</p>
                    <p className="text-xs text-gray-600">Aujourd'hui 9:15 - Score: 8.2</p>
                  </div>
                  <Badge variant="outline">Complété</Badge>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Session VR - Plage tropicale</p>
                    <p className="text-xs text-gray-600">Hier 17:30 - 20 min</p>
                  </div>
                  <Badge variant="outline">Relaxant</Badge>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Coach IA - Gestion du stress</p>
                    <p className="text-xs text-gray-600">Avant-hier 13:45</p>
                  </div>
                  <Badge variant="outline">Utile</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Climat d'équipe</CardTitle>
              <CardDescription>Bien-être général de votre équipe Marketing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Moral général</span>
                  <Badge variant="secondary">Bon</Badge>
                </div>
                <Progress value={75} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Participation</span>
                  <Badge variant="secondary">85%</Badge>
                </div>
                <Progress value={85} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Objectifs atteints</span>
                  <Badge variant="secondary">3/5</Badge>
                </div>
                <Progress value={60} className="h-2" />
                
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    🎉 Votre équipe est dans le top 3 des équipes les plus actives !
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default B2BUserDashboardPage;
