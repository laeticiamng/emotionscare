
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Monitor, Play, Clock, Star, Mountain, Waves, TreePine, Home } from 'lucide-react';

const VRPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Monitor className="h-16 w-16 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Expériences de Réalité Virtuelle
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Plongez dans des environnements immersifs conçus pour votre bien-être émotionnel et mental
          </p>
        </div>

        {/* Featured VR Experience */}
        <Card className="mb-8 bg-gradient-to-r from-purple-500 to-blue-600 text-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-white">Méditation au Coucher du Soleil</CardTitle>
                <CardDescription className="text-purple-100">
                  Une expérience immersive de 15 minutes dans un paysage océanique
                </CardDescription>
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white">
                Recommandé
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>15 min</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-current" />
                <span>4.8/5</span>
              </div>
            </div>
            <Button className="bg-white text-purple-600 hover:bg-purple-50">
              <Play className="h-4 w-4 mr-2" />
              Commencer l'expérience
            </Button>
          </CardContent>
        </Card>

        {/* VR Categories */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Mountain className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Paysages Naturels</CardTitle>
              <CardDescription>
                Forêts, montagnes et environnements naturels apaisants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Explorer (3 expériences)
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Waves className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Océan & Plages</CardTitle>
              <CardDescription>
                Sons des vagues et environnements marins relaxants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Explorer (4 expériences)
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <TreePine className="h-8 w-8 text-emerald-600 mb-2" />
              <CardTitle>Espaces Zen</CardTitle>
              <CardDescription>
                Jardins japonais et espaces de méditation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Explorer (2 expériences)
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Vos Sessions Récentes</CardTitle>
            <CardDescription>
              Reprenez là où vous vous êtes arrêté
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
                    <TreePine className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Forêt de Bambous</h3>
                    <p className="text-sm text-gray-600">Session de 10 min • Hier</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Continuer
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-lg flex items-center justify-center">
                    <Waves className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Plage Tropicale</h3>
                    <p className="text-sm text-gray-600">Session de 20 min • Il y a 3 jours</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Relancer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="flex justify-center gap-4 mt-8">
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
            <Monitor className="h-5 w-5 mr-2" />
            Nouvelle Session
          </Button>
          <Button variant="outline" size="lg">
            <Home className="h-5 w-5 mr-2" />
            Retour au Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VRPage;
