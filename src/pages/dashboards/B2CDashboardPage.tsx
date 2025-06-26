
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Brain, 
  Music, 
  MessageSquare, 
  BookOpen, 
  VrHeadset,
  Trophy,
  TrendingUp,
  Calendar,
  Target
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';

const B2CDashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div data-testid="page-root" className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tableau de bord
          </h1>
          <p className="text-gray-600">
            Bonjour {user?.email?.split('@')[0] || 'Utilisateur'} ! Voici votre résumé bien-être aujourd'hui.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Score bien-être</p>
                  <p className="text-2xl font-bold text-green-600">82%</p>
                </div>
                <Heart className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Séances cette semaine</p>
                  <p className="text-2xl font-bold text-blue-600">12</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Objectifs atteints</p>
                  <p className="text-2xl font-bold text-purple-600">8/10</p>
                </div>
                <Target className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Progression</p>
                  <p className="text-2xl font-bold text-orange-600">+15%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Emotion Scan */}
          <Card data-testid="emotion-scan-card" className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Scan Émotionnel</CardTitle>
                  <CardDescription>Analysez vos émotions actuelles</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link to="/scan">
                <Button className="w-full">Commencer le scan</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Music Therapy */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Music className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Musicothérapie</CardTitle>
                  <CardDescription>Musique adaptée à votre humeur</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link to="/music">
                <Button className="w-full" variant="outline">Écouter maintenant</Button>
              </Link>
            </CardContent>
          </Card>

          {/* AI Coach */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Coach IA</CardTitle>
                  <CardDescription>Accompagnement personnalisé</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link to="/coach">
                <Button className="w-full" variant="outline">Discuter avec le coach</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Journal */}
          <Card data-testid="journal-card" className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Journal Émotionnel</CardTitle>
                  <CardDescription>Suivez votre progression</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link to="/journal">
                <Button className="w-full" variant="outline">Ouvrir le journal</Button>
              </Link>
            </CardContent>
          </Card>

          {/* VR Experience */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <VrHeadset className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Réalité Virtuelle</CardTitle>
                  <CardDescription>Expériences immersives</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link to="/vr">
                <Button className="w-full" variant="outline">Explorer la VR</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Gamification */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Trophy className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Récompenses</CardTitle>
                  <CardDescription>Badges et achievements</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link to="/gamification">
                <Button className="w-full" variant="outline">Voir mes badges</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Progression hebdomadaire</CardTitle>
              <CardDescription>Vos objectifs bien-être cette semaine</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Séances de relaxation</span>
                  <span>8/10</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Journal quotidien</span>
                  <span>5/7</span>
                </div>
                <Progress value={71} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Scans émotionnels</span>
                  <span>12/14</span>
                </div>
                <Progress value={86} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
              <CardDescription>Vos dernières interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                  <Brain className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Scan émotionnel terminé</p>
                    <p className="text-xs text-gray-500">Il y a 2 heures</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 bg-purple-50 rounded-lg">
                  <Music className="h-5 w-5 text-purple-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Session musicothérapie</p>
                    <p className="text-xs text-gray-500">Hier</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Conversation avec le coach</p>
                    <p className="text-xs text-gray-500">Il y a 2 jours</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2CDashboardPage;
