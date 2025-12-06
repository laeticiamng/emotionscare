// @ts-nocheck
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, Zap, Heart, TrendingUp, Clock, Star, Target, RefreshCw } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'stress' | 'setback' | 'failure' | 'rejection';
  difficulty: number;
  resilience: number;
  timeLimit: number;
  status: 'available' | 'active' | 'completed';
}

const B2CBounceBackBattlePage: React.FC = () => {
  const [resilienceStats] = useState({
    overall: 75,
    stress: 68,
    emotional: 82,
    mental: 71,
    streak: 5
  });

  const challenges: Challenge[] = [
    {
      id: 'morning-setback',
      title: 'Revers Matinal',
      description: 'Gérez un contretemps dès le réveil',
      type: 'setback',
      difficulty: 2,
      resilience: 10,
      timeLimit: 300,
      status: 'available'
    },
    {
      id: 'work-stress',
      title: 'Pression Professionnelle',
      description: 'Surmontez une situation stressante au travail',
      type: 'stress',
      difficulty: 3,
      resilience: 15,
      timeLimit: 600,
      status: 'available'
    },
    {
      id: 'social-rejection',
      title: 'Rejet Social',
      description: 'Rebondissez après un refus ou une critique',
      type: 'rejection',
      difficulty: 4,
      resilience: 20,
      timeLimit: 900,
      status: 'available'
    },
    {
      id: 'major-failure',
      title: 'Échec Majeur',
      description: 'Transformez un échec en opportunité d\'apprentissage',
      type: 'failure',
      difficulty: 5,
      resilience: 25,
      timeLimit: 1200,
      status: 'available'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'stress': return 'bg-destructive/10 text-destructive';
      case 'setback': return 'bg-warning/10 text-warning';
      case 'failure': return 'bg-accent/10 text-accent';
      case 'rejection': return 'bg-info/10 text-info';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-red-50/20 to-muted/20 p-6" data-testid="page-root">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-destructive to-warning rounded-full mb-4">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Bounce-Back Battle
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Développez votre résilience en relevant des défis simulés. Plus vous rebondissez, plus vous devenez fort !
          </p>
        </motion.div>

        {/* Stats de résilience */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Shield className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{resilienceStats.overall}%</div>
              <div className="text-sm text-muted-foreground">Résilience Globale</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Zap className="w-8 h-8 mx-auto mb-2 text-destructive" />
              <div className="text-2xl font-bold">{resilienceStats.stress}%</div>
              <div className="text-sm text-muted-foreground">Anti-Stress</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Heart className="w-8 h-8 mx-auto mb-2 text-accent" />
              <div className="text-2xl font-bold">{resilienceStats.emotional}%</div>
              <div className="text-sm text-muted-foreground">Émotionnel</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-info" />
              <div className="text-2xl font-bold">{resilienceStats.mental}%</div>
              <div className="text-sm text-muted-foreground">Mental</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Star className="w-8 h-8 mx-auto mb-2 text-warning" />
              <div className="text-2xl font-bold">{resilienceStats.streak}</div>
              <div className="text-sm text-muted-foreground">Série</div>
            </CardContent>
          </Card>
        </div>

        {/* Défis disponibles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Défis de Résilience
            </CardTitle>
            <CardDescription>
              Choisissez un défi adapté à votre niveau
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {challenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge className={getTypeColor(challenge.type)}>
                          {challenge.type}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: challenge.difficulty }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-warning text-warning" />
                          ))}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ⏱️ {Math.floor(challenge.timeLimit / 60)} min
                      </div>
                    </div>
                    
                    <h3 className="font-semibold mb-1">{challenge.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {challenge.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <Shield className="w-4 h-4 inline mr-1" />
                        +{challenge.resilience} résilience
                      </div>
                      <Button size="sm">
                        Commencer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2CBounceBackBattlePage;