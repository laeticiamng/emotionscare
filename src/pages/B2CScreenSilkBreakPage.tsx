import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Monitor, Eye, Clock, Play, Settings, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

interface BreakSession {
  id: string;
  type: 'micro' | 'short' | 'long';
  name: string;
  duration: number;
  description: string;
  exercises: string[];
  color: string;
}

const B2CScreenSilkBreakPage: React.FC = () => {
  const [eyeStrain] = useState(65);
  const [todayBreaks] = useState(8);
  const [screenTime] = useState(4.2);

  const breakSessions: BreakSession[] = [
    {
      id: 'micro-break',
      type: 'micro',
      name: 'Micro-Pause',
      duration: 20,
      description: 'Pause ultra-rapide toutes les 20 minutes',
      exercises: ['Clignements', 'Regard au loin', 'Étirements légers'],
      color: 'from-green-400 to-emerald-500'
    },
    {
      id: 'short-break',
      type: 'short',
      name: 'Pause Courte',
      duration: 300,
      description: 'Repos complet des yeux et du corps',
      exercises: ['Exercices oculaires', 'Étirements du cou', 'Respiration'],
      color: 'from-blue-400 to-cyan-500'
    },
    {
      id: 'long-break',
      type: 'long',  
      name: 'Grande Pause',
      duration: 900,
      description: 'Récupération profonde et réénergisation',
      exercises: ['Marche', 'Exercices complets', 'Méditation'],
      color: 'from-purple-400 to-indigo-500'
    }
  ];

  const getStrainLevel = (level: number) => {
    if (level < 30) return { text: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (level < 50) return { text: 'Bon', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (level < 70) return { text: 'Modéré', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { text: 'Élevé', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const strainInfo = getStrainLevel(eyeStrain);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-green-50/20 to-muted/20 p-6" data-testid="page-root">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mb-4">
            <Monitor className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Screen-Silk Break
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Protégez vos yeux et préservez votre bien-être avec des pauses intelligentes et des exercices oculaires.
          </p>
        </motion.div>

        {/* Statistiques de la journée */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Eye className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{eyeStrain}%</div>
              <div className="text-sm text-muted-foreground">Fatigue Oculaire</div>
              <Badge className={`mt-1 ${strainInfo.bg} ${strainInfo.color}`}>
                {strainInfo.text}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{todayBreaks}</div>
              <div className="text-sm text-muted-foreground">Pauses Aujourd'hui</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Monitor className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{screenTime}h</div>
              <div className="text-sm text-muted-foreground">Temps d'Écran</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <TrendingDown className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <div className="text-2xl font-bold">-23%</div>
              <div className="text-sm text-muted-foreground">Réduction Fatigue</div>
            </CardContent>
          </Card>
        </div>

        {/* Sessions de pause */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {breakSessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className={`w-full h-24 bg-gradient-to-br ${session.color} rounded-lg mb-3 flex items-center justify-center`}>
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{session.name}</CardTitle>
                  <CardDescription>{session.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Durée:</span>
                    <Badge variant="outline">
                      {session.duration < 60 ? `${session.duration}s` : `${Math.floor(session.duration / 60)}min`}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Exercices inclus:</span>
                    <div className="flex flex-wrap gap-1">
                      {session.exercises.map((exercise, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {exercise}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full">
                    <Play className="w-4 h-4 mr-2" />
                    Commencer
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recommandations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Règle 20-20-20
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">Technique recommandée</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Toutes les 20 minutes, regardez un objet à 20 pieds (6m) pendant au moins 20 secondes.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conseils Santé</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="font-medium">Éclairage Optimal</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Évitez les reflets et assurez-vous d'un éclairage ambiant suffisant.
                </p>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-purple-600" />
                  <span className="font-medium">Hydratation</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Clignez consciemment et utilisez des gouttes si nécessaire.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2CScreenSilkBreakPage;