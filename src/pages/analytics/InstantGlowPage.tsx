
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, TrendingUp, Clock, Target } from 'lucide-react';

const InstantGlowPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Instant Glow</h1>
          <p className="text-muted-foreground">Métriques de bien-être en temps réel</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Glow Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold">87</span>
                  <span className="text-green-500 text-sm">+12%</span>
                </div>
                <Progress value={87} className="h-2" />
                <p className="text-xs text-muted-foreground">Excellent niveau énergétique</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Tendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  En hausse
                </Badge>
                <p className="text-sm text-muted-foreground">+15% cette semaine</p>
                <div className="h-8 bg-gradient-to-r from-green-200 to-green-400 rounded"></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-500" />
                Prochaine Mesure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">14:30</div>
                <p className="text-sm text-muted-foreground">Dans 2h 15min</p>
                <Button size="sm" variant="outline" className="w-full">
                  Mesurer maintenant
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Objectifs Journaliers
              </CardTitle>
              <CardDescription>Votre progression aujourd'hui</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Sessions de méditation</span>
                  <span className="text-sm text-muted-foreground">2/3</span>
                </div>
                <Progress value={67} />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Minutes de respiration</span>
                  <span className="text-sm text-muted-foreground">12/15</span>
                </div>
                <Progress value={80} />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Scan émotionnel</span>
                  <span className="text-sm text-muted-foreground">1/1</span>
                </div>
                <Progress value={100} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommandations IA</CardTitle>
              <CardDescription>Actions pour optimiser votre glow</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <p className="text-sm font-medium">💧 Hydratation</p>
                <p className="text-xs text-muted-foreground">Pensez à boire un verre d'eau</p>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                <p className="text-sm font-medium">🌱 Mini-pause</p>
                <p className="text-xs text-muted-foreground">5 minutes de respiration consciente</p>
              </div>
              
              <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                <p className="text-sm font-medium">🎵 Musique</p>
                <p className="text-xs text-muted-foreground">Playlist "Energie Positive" recommandée</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InstantGlowPage;
