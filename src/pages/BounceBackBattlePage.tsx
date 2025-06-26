
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, Zap, Heart, Trophy, Target, ArrowUp } from 'lucide-react';

const BounceBackBattlePage: React.FC = () => {
  const [resilience, setResilience] = useState(75);
  const [activeChallenge, setActiveChallenge] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6" data-testid="page-root">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Badge className="bg-emerald-100 text-emerald-800 px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Bataille de Résilience
            </Badge>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Bounce Back Battle
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transformez les défis en opportunités et développez votre capacité de rebond
          </p>
        </div>

        {/* Resilience Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-emerald-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <Shield className="w-4 h-4 mr-2 text-emerald-600" />
                Résilience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{resilience}%</div>
              <Progress value={resilience} className="mt-2" />
              <div className="text-xs text-muted-foreground mt-1">+5% cette semaine</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-teal-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <Zap className="w-4 h-4 mr-2 text-teal-600" />
                Défis Surmontés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-600">18</div>
              <div className="text-sm text-muted-foreground">Ce mois-ci</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-cyan-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <Heart className="w-4 h-4 mr-2 text-cyan-600" />
                Force Mentale
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-600">Niveau 4</div>
              <div className="text-sm text-muted-foreground">Guerrier</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <Trophy className="w-4 h-4 mr-2 text-blue-600" />
                Victoires
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">127</div>
              <div className="text-sm text-muted-foreground">Record personnel</div>
            </CardContent>
          </Card>
        </div>

        {/* Active Challenges */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-emerald-600" />
              Défis Actifs
            </CardTitle>
            <CardDescription>
              Choisissez votre bataille pour développer votre résilience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 hover:shadow-md transition-all duration-300 cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-emerald-100 text-emerald-800">Facile</Badge>
                    <div className="text-right">
                      <div className="text-sm font-medium">30 min</div>
                      <div className="text-xs text-muted-foreground">Durée</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-2">Défi du Stress Quotidien</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Gérez 3 situations stressantes avec des techniques de respiration
                  </p>
                  <Progress value={60} className="mb-2" />
                  <div className="text-xs text-muted-foreground">2/3 situations gérées</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200 hover:shadow-md transition-all duration-300 cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-teal-100 text-teal-800">Moyen</Badge>
                    <div className="text-right">
                      <div className="text-sm font-medium">1h</div>
                      <div className="text-xs text-muted-foreground">Durée</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-2">Bataille de l'Échec</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Transformez un échec récent en apprentissage positif
                  </p>
                  <Progress value={0} className="mb-2" />
                  <div className="text-xs text-muted-foreground">Prêt à commencer</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200 hover:shadow-md transition-all duration-300 cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-cyan-100 text-cyan-800">Difficile</Badge>
                    <div className="text-right">
                      <div className="text-sm font-medium">2h</div>
                      <div className="text-xs text-muted-foreground">Durée</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-2">Défi de la Critique</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Affrontez et dépassez les critiques constructives
                  </p>
                  <Progress value={0} className="mb-2" />
                  <div className="text-xs text-muted-foreground">Niveau requis: 3</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Resilience Training */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowUp className="w-5 h-5 mr-2 text-emerald-600" />
                Entraînement de Résilience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Exercices quotidiens</span>
                  <Badge variant="outline" className="text-emerald-600">3/5 complétés</Badge>
                </div>
                <Progress value={60} />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Méditation de résilience</span>
                  <Badge variant="outline" className="text-teal-600">10 min</Badge>
                </div>
                <Button variant="outline" className="w-full">
                  Commencer la session
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Journal de rebond</span>
                  <Badge variant="outline" className="text-cyan-600">Aujourd'hui</Badge>
                </div>
                <Button variant="outline" className="w-full">
                  Écrire une entrée
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-100 to-teal-100 border-emerald-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="w-5 h-5 mr-2 text-emerald-600" />
                Conseil de Résilience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <blockquote className="text-lg italic text-emerald-800 mb-4">
                "La résilience n'est pas la capacité d'éviter les tempêtes, 
                mais d'apprendre à danser sous la pluie."
              </blockquote>
              <div className="bg-white/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Technique du jour :</h4>
                <p className="text-sm text-muted-foreground">
                  Lorsque vous faites face à un défi, posez-vous cette question : 
                  "Qu'est-ce que cette situation peut m'apprendre ?" 
                  Cette simple question transforme l'obstacle en opportunité d'apprentissage.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BounceBackBattlePage;
