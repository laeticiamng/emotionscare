
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, Zap, Star, ArrowRight } from 'lucide-react';

const BossLevelGritPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-6" data-testid="page-root">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Badge className="bg-orange-100 text-orange-800 px-4 py-2">
              <Trophy className="w-4 h-4 mr-2" />
              Niveau Boss
            </Badge>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Boss Level Grit
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Développez votre résilience et votre détermination avec des défis progressifs
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <Target className="w-4 h-4 mr-2 text-orange-600" />
                Défis Complétés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">12/20</div>
              <Progress value={60} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-red-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <Zap className="w-4 h-4 mr-2 text-red-600" />
                Niveau de Grit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">Niveau 3</div>
              <div className="text-sm text-muted-foreground">Expert</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-pink-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <Star className="w-4 h-4 mr-2 text-pink-600" />
                Points Gagnés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-600">2,450</div>
              <div className="text-sm text-muted-foreground">+120 aujourd'hui</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-yellow-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <Trophy className="w-4 h-4 mr-2 text-yellow-600" />
                Série Actuelle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">7 jours</div>
              <div className="text-sm text-muted-foreground">Record: 12 jours</div>
            </CardContent>
          </Card>
        </div>

        {/* Défis Disponibles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Défi Mental
                <Badge variant="outline" className="text-orange-600">Difficile</Badge>
              </CardTitle>
              <CardDescription>
                Surmontez 5 obstacles mentaux en 24h
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={40} />
              <div className="text-sm text-muted-foreground">2/5 obstacles</div>
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                Continuer <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Endurance Émotionnelle
                <Badge variant="outline" className="text-red-600">Expert</Badge>
              </CardTitle>
              <CardDescription>
                Maintenez votre équilibre pendant 1 semaine
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={85} />
              <div className="text-sm text-muted-foreground">6/7 jours</div>
              <Button className="w-full bg-red-600 hover:bg-red-700">
                Finaliser <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Boss Final
                <Badge variant="outline" className="text-pink-600">Légendaire</Badge>
              </CardTitle>
              <CardDescription>
                Le défi ultime de résilience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={0} />
              <div className="text-sm text-muted-foreground">Débloqué au niveau 5</div>
              <Button variant="outline" className="w-full" disabled>
                Bientôt Disponible
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Coach Tips */}
        <Card className="bg-gradient-to-r from-orange-100 to-red-100 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-orange-600" />
              Conseil du Coach IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              "Votre progression est excellente ! Concentrez-vous sur la constance plutôt que sur l'intensité. 
              Les petites victoires quotidiennes construisent une résilience durable."
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BossLevelGritPage;
