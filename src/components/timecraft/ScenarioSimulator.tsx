/**
 * ScenarioSimulator - Simulateur de scénarios organisationnels B2B
 */
import React, { memo, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  GitCompare,
  Play,
  Target,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Save,
  RefreshCw,
  Zap,
  Moon,
  Heart,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScenarioParams {
  recoveryTimeChange: number;
  constraintReduction: number;
}

interface SimulationResult {
  projectedRecoveryHours: number;
  projectedConstraintHours: number;
  ratioImprovement: number;
  estimatedRiskReduction: number;
  estimatedEmotionalLoadChange: number;
}

interface OrgTimeScenario {
  id: string;
  name: string;
  description: string | null;
  scenario_type: 'current' | 'projected';
  parameters: Record<string, unknown>;
  projected_impact: {
    recoveryChange: number;
    constraintChange: number;
    emotionalLoadChange: number;
    riskReduction: number;
  } | null;
  created_at: string;
}

interface ScenarioSimulatorProps {
  scenarios: OrgTimeScenario[];
  currentStats: {
    avgRecoveryHours: number;
    avgConstraintHours: number;
    avgEmotionalLoad: number;
  } | null;
  onSimulate: (params: ScenarioParams) => SimulationResult | null;
  onSaveScenario: (input: {
    name: string;
    description?: string;
    scenario_type: 'current' | 'projected';
    parameters: Record<string, unknown>;
  }) => Promise<unknown>;
  hasEnoughData: boolean;
  isLoading?: boolean;
}

export const ScenarioSimulator = memo(function ScenarioSimulator({
  scenarios,
  currentStats,
  onSimulate,
  onSaveScenario,
  hasEnoughData,
  isLoading = false,
}: ScenarioSimulatorProps) {
  const [params, setParams] = useState<ScenarioParams>({
    recoveryTimeChange: 0,
    constraintReduction: 0,
  });
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [scenarioName, setScenarioName] = useState('');
  const [scenarioDescription, setScenarioDescription] = useState('');

  const simulationResult = useMemo(() => {
    if (!hasEnoughData) return null;
    return onSimulate(params);
  }, [params, hasEnoughData, onSimulate]);

  const handleSave = async () => {
    if (!scenarioName.trim() || !simulationResult) return;
    
    await onSaveScenario({
      name: scenarioName,
      description: scenarioDescription || undefined,
      scenario_type: 'projected',
      parameters: { ...params } as Record<string, unknown>,
    });
    
    setScenarioName('');
    setScenarioDescription('');
    setShowSaveDialog(false);
  };

  const handleReset = () => {
    setParams({ recoveryTimeChange: 0, constraintReduction: 0 });
  };

  if (!hasEnoughData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5 text-primary" />
            Simulation de scénarios
          </CardTitle>
          <CardDescription>
            "Et si on modifie le rythme ?" - Outil d'aide à la décision
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-2 gap-4">
            <Card className="border-dashed">
              <CardContent className="p-6 text-center">
                <Target className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                <h3 className="font-medium mb-1">Organisation actuelle</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  État présent de la structure temporelle
                </p>
                <Badge variant="outline">En attente de données</Badge>
              </CardContent>
            </Card>
            
            <Card className="border-dashed border-primary/30 bg-primary/5">
              <CardContent className="p-6 text-center">
                <Play className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-medium mb-1">Simuler un scénario</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Disponible avec plus de données
                </p>
                <Button size="sm" disabled>
                  Nouveau scénario
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <GitCompare className="h-5 w-5 text-primary" />
              Simulation de scénarios
            </CardTitle>
            <CardDescription>
              Modélisez l'impact de changements organisationnels
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Réinitialiser
            </Button>
            <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
              <DialogTrigger asChild>
                <Button size="sm" disabled={!simulationResult}>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Sauvegarder le scénario</DialogTitle>
                  <DialogDescription>
                    Enregistrez cette simulation pour comparaison future
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Nom du scénario</Label>
                    <Input
                      value={scenarioName}
                      onChange={(e) => setScenarioName(e.target.value)}
                      placeholder="Ex: Scénario été 2026"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description (optionnel)</Label>
                    <Textarea
                      value={scenarioDescription}
                      onChange={(e) => setScenarioDescription(e.target.value)}
                      placeholder="Notes sur ce scénario..."
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleSave} disabled={!scenarioName.trim()}>
                    Sauvegarder
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="flex items-center gap-2">
                  <Moon className="h-4 w-4 text-blue-500" />
                  Temps de récupération
                </Label>
                <Badge variant="outline">
                  {params.recoveryTimeChange > 0 ? '+' : ''}{params.recoveryTimeChange}%
                </Badge>
              </div>
              <Slider
                value={[params.recoveryTimeChange]}
                onValueChange={([v]) => setParams(p => ({ ...p, recoveryTimeChange: v }))}
                min={-50}
                max={100}
                step={5}
              />
              <p className="text-xs text-muted-foreground">
                Augmenter le temps de récupération prévu
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-orange-500" />
                  Réduction des contraintes
                </Label>
                <Badge variant="outline">
                  -{params.constraintReduction}%
                </Badge>
              </div>
              <Slider
                value={[params.constraintReduction]}
                onValueChange={([v]) => setParams(p => ({ ...p, constraintReduction: v }))}
                min={0}
                max={50}
                step={5}
              />
              <p className="text-xs text-muted-foreground">
                Réduire le temps de contrainte imposé
              </p>
            </div>
          </div>

          {/* Results */}
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="p-4 space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Play className="h-4 w-4 text-primary" />
                Impact projeté
              </h4>
              
              {simulationResult ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Amélioration ratio</span>
                    <div className="flex items-center gap-1">
                      {simulationResult.ratioImprovement > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <span className={cn(
                        'font-medium',
                        simulationResult.ratioImprovement > 0 ? 'text-green-600' : 'text-red-600'
                      )}>
                        {simulationResult.ratioImprovement > 0 ? '+' : ''}
                        {Math.round(simulationResult.ratioImprovement)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Réduction du risque</span>
                    <span className="font-medium text-green-600">
                      -{Math.round(simulationResult.estimatedRiskReduction)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Charge émotionnelle</span>
                    <span className={cn(
                      'font-medium',
                      simulationResult.estimatedEmotionalLoadChange < 0 ? 'text-green-600' : 'text-red-600'
                    )}>
                      {simulationResult.estimatedEmotionalLoadChange > 0 ? '+' : ''}
                      {Math.round(simulationResult.estimatedEmotionalLoadChange)}%
                    </span>
                  </div>

                  <div className="pt-3 border-t flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">
                      Récup: {currentStats?.avgRecoveryHours ?? 0}h
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-primary">
                      {Math.round(simulationResult.projectedRecoveryHours)}h
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Ajustez les paramètres pour voir l'impact
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Saved Scenarios */}
        {scenarios.length > 0 && (
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-3">Scénarios enregistrés</h4>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {scenarios.slice(0, 6).map((scenario) => (
                <Card key={scenario.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-3">
                    <div className="font-medium text-sm truncate">{scenario.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {scenario.scenario_type === 'current' ? 'Référence' : 'Projection'}
                    </div>
                    {scenario.projected_impact && (
                      <Badge 
                        variant="outline" 
                        className={cn(
                          'mt-2 text-xs',
                          scenario.projected_impact.riskReduction > 0 && 'text-green-600'
                        )}
                      >
                        -{Math.round(scenario.projected_impact.riskReduction)}% risque
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

export default ScenarioSimulator;
