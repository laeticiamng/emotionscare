
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Headphones, 
  Play, 
  Settings, 
  Clock, 
  Users,
  Star,
  ArrowRight
} from 'lucide-react';

const VRPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Headphones className="h-12 w-12 text-purple-600 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Réalité Virtuelle
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Plongez dans des expériences immersives pour votre bien-être émotionnel
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">47</div>
              <div className="text-sm text-gray-500">Sessions terminées</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">12</div>
              <div className="text-sm text-gray-500">Environnements explorés</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">4.8</div>
              <div className="text-sm text-gray-500">Satisfaction moyenne</div>
            </CardContent>
          </Card>
        </div>

        {/* VR Experiences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Relaxation Experience */}
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
              <Headphones className="h-16 w-16 text-white" />
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Plage Zen</CardTitle>
                <Badge variant="secondary">Relaxation</Badge>
              </div>
              <CardDescription>
                Détendez-vous sur une plage paradisiaque avec des sons apaisants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Durée: 15 min</span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="text-sm">4.9</span>
                </div>
              </div>
              <Button className="w-full" size="sm">
                <Play className="h-4 w-4 mr-2" />
                Démarrer
              </Button>
            </CardContent>
          </Card>

          {/* Meditation Experience */}
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
              <Headphones className="h-16 w-16 text-white" />
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Forêt Mystique</CardTitle>
                <Badge variant="secondary">Méditation</Badge>
              </div>
              <CardDescription>
                Méditez dans une forêt enchantée avec des sons de la nature
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Durée: 20 min</span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="text-sm">4.7</span>
                </div>
              </div>
              <Button className="w-full" size="sm">
                <Play className="h-4 w-4 mr-2" />
                Démarrer
              </Button>
            </CardContent>
          </Card>

          {/* Focus Experience */}
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
              <Headphones className="h-16 w-16 text-white" />
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Bureau Spatial</CardTitle>
                <Badge variant="secondary">Concentration</Badge>
              </div>
              <CardDescription>
                Travaillez dans un environnement futuriste pour améliorer votre focus
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Durée: 30 min</span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="text-sm">4.6</span>
                </div>
              </div>
              <Button className="w-full" size="sm">
                <Play className="h-4 w-4 mr-2" />
                Démarrer
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Mes Sessions</CardTitle>
              <CardDescription>Accédez à vos expériences VR précédentes</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <ArrowRight className="h-4 w-4 mr-2" />
                Voir l'historique
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Paramètres VR</CardTitle>
              <CardDescription>Configurez votre expérience de réalité virtuelle</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Configurer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VRPage;
