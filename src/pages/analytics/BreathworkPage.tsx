
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Wind, Play, Pause, RotateCcw } from 'lucide-react';

const BreathworkPage: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('inspire');
  const [cycleCount, setCycleCount] = useState(0);
  const [sessionProgress, setSessionProgress] = useState(0);

  const breathPatterns = [
    { name: '4-7-8 Relaxation', inhale: 4, hold: 7, exhale: 8, cycles: 8 },
    { name: 'Box Breathing', inhale: 4, hold: 4, exhale: 4, cycles: 10 },
    { name: 'Énergie Matinale', inhale: 6, hold: 2, exhale: 4, cycles: 12 },
    { name: 'Détente Soir', inhale: 4, hold: 6, exhale: 8, cycles: 6 }
  ];

  const [selectedPattern, setSelectedPattern] = useState(breathPatterns[0]);

  const startBreathing = () => {
    setIsActive(true);
    setCycleCount(0);
    setSessionProgress(0);
    // Simulation de l'exercice de respiration
  };

  const stopBreathing = () => {
    setIsActive(false);
    setCurrentPhase('inspire');
  };

  const resetSession = () => {
    setIsActive(false);
    setCycleCount(0);
    setSessionProgress(0);
    setCurrentPhase('inspire');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Breathwork Analytics</h1>
          <p className="text-muted-foreground">Analyse avancée de vos techniques de respiration</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wind className="h-5 w-5" />
                Session Active
              </CardTitle>
              <CardDescription>
                {selectedPattern.name} - {selectedPattern.inhale}:{selectedPattern.hold}:{selectedPattern.exhale}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className={`h-32 w-32 mx-auto rounded-full border-4 flex items-center justify-center transition-all duration-1000 ${
                  isActive 
                    ? currentPhase === 'inspire' 
                      ? 'border-blue-500 bg-blue-50 scale-110' 
                      : currentPhase === 'hold'
                      ? 'border-purple-500 bg-purple-50 scale-105'
                      : 'border-green-500 bg-green-50 scale-100'
                    : 'border-muted'
                }`}>
                  <span className="text-2xl font-bold">
                    {isActive ? currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1) : 'Prêt'}
                  </span>
                </div>
                
                {isActive && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Cycle {cycleCount + 1} / {selectedPattern.cycles}
                    </p>
                    <Progress value={(cycleCount / selectedPattern.cycles) * 100} />
                  </div>
                )}
                
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={isActive ? stopBreathing : startBreathing}
                    className="flex-1"
                  >
                    {isActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    {isActive ? 'Pause' : 'Démarrer'}
                  </Button>
                  
                  <Button variant="outline" onClick={resetSession}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Patterns de Respiration</CardTitle>
              <CardDescription>Choisissez votre technique</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {breathPatterns.map((pattern, index) => (
                <div
                  key={index}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedPattern.name === pattern.name 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted hover:border-muted-foreground'
                  }`}
                  onClick={() => !isActive && setSelectedPattern(pattern)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{pattern.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {pattern.inhale}s inspire - {pattern.hold}s pause - {pattern.exhale}s expire
                      </p>
                    </div>
                    <Badge variant="outline">{pattern.cycles} cycles</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques Aujourd'hui</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center p-3 bg-accent rounded-lg">
                <p className="text-2xl font-bold text-primary">23</p>
                <p className="text-xs text-muted-foreground">Minutes pratiquées</p>
              </div>
              
              <div className="text-center p-3 bg-accent rounded-lg">
                <p className="text-2xl font-bold text-primary">156</p>
                <p className="text-xs text-muted-foreground">Cycles complétés</p>
              </div>
              
              <div className="text-center p-3 bg-accent rounded-lg">
                <p className="text-2xl font-bold text-primary">5</p>
                <p className="text-xs text-muted-foreground">Sessions terminées</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Progression Hebdomadaire</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Régularité</span>
                  <span>6/7 jours</span>
                </div>
                <Progress value={85} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Durée moyenne</span>
                  <span>18 min</span>
                </div>
                <Progress value={72} />
              </div>
              
              <Badge className="w-full justify-center">
                +12% vs semaine précédente
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bénéfices Mesurés</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                <p className="text-sm font-medium">Stress -15%</p>
                <p className="text-xs text-muted-foreground">Amélioration cette semaine</p>
              </div>
              
              <div className="p-2 bg-green-50 rounded border-l-4 border-green-400">
                <p className="text-sm font-medium">Focus +22%</p>
                <p className="text-xs text-muted-foreground">Concentration améliorée</p>
              </div>
              
              <div className="p-2 bg-purple-50 rounded border-l-4 border-purple-400">
                <p className="text-sm font-medium">Sommeil +18%</p>
                <p className="text-xs text-muted-foreground">Qualité du repos</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BreathworkPage;
