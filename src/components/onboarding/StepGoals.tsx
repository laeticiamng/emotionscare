// @ts-nocheck
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Brain, Zap, Shield, Moon, Mountain } from 'lucide-react';
import { GoalsDraft } from '@/store/onboarding.store';

interface StepGoalsProps {
  onSubmit: (goals: GoalsDraft) => Promise<boolean>;
  onBack: () => void;
  initialData?: GoalsDraft;
}

const OBJECTIVES = [
  {
    id: 'focus',
    title: 'Focus',
    description: 'Améliorer ma concentration au travail',
    icon: Brain,
    color: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-100'
  },
  {
    id: 'energy',
    title: 'Énergie',
    description: 'Retrouver de la vitalité au quotidien',
    icon: Zap,
    color: 'bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-100'
  },
  {
    id: 'resilience',
    title: 'Résilience',
    description: 'Mieux gérer le stress et l\'anxiété',
    icon: Shield,
    color: 'bg-green-50 border-green-200 text-green-900 dark:bg-green-900/20 dark:border-green-800 dark:text-green-100'
  },
  {
    id: 'sleep',
    title: 'Sommeil',
    description: 'Améliorer la qualité de mon repos',
    icon: Moon,
    color: 'bg-purple-50 border-purple-200 text-purple-900 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-100'
  },
  {
    id: 'ambition',
    title: 'Ambition',
    description: 'Développer mes projets personnels',
    icon: Mountain,
    color: 'bg-red-50 border-red-200 text-red-900 dark:bg-red-900/20 dark:border-red-800 dark:text-red-100'
  }
] as const;

export const StepGoals: React.FC<StepGoalsProps> = ({ 
  onSubmit, 
  onBack,
  initialData 
}) => {
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>(
    initialData?.objectives || []
  );
  const [loading, setLoading] = useState(false);

  const toggleObjective = (objectiveId: string) => {
    setSelectedObjectives(prev => {
      if (prev.includes(objectiveId)) {
        return prev.filter(id => id !== objectiveId);
      } else {
        // Limit to 3 selections
        if (prev.length >= 3) {
          return [...prev.slice(1), objectiveId];
        }
        return [...prev, objectiveId];
      }
    });
  };

  const handleSubmit = async () => {
    if (selectedObjectives.length === 0) return;
    
    setLoading(true);
    const success = await onSubmit({ objectives: selectedObjectives });
    if (success) {
      // onSubmit will handle navigation
    }
    setLoading(false);
  };

  const canSubmit = selectedObjectives.length > 0;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Tes objectifs
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Choisis 1 à 3 domaines que tu veux améliorer (tu peux changer plus tard)
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Objectives Grid */}
        <div className="grid gap-3 sm:grid-cols-2">
          {OBJECTIVES.map((objective) => {
            const IconComponent = objective.icon;
            const isSelected = selectedObjectives.includes(objective.id);
            
            return (
              <button
                key={objective.id}
                onClick={() => toggleObjective(objective.id)}
                className={`
                  p-4 border-2 rounded-lg text-left transition-all
                  hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
                  ${isSelected 
                    ? `${objective.color} border-current shadow-md scale-[1.02]` 
                    : 'border-border hover:border-primary/50'
                  }
                `}
                aria-pressed={isSelected}
                aria-label={`${objective.title}: ${objective.description}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`
                    p-2 rounded-full 
                    ${isSelected ? 'bg-white/20' : 'bg-muted'}
                  `}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm mb-1">
                      {objective.title}
                    </h3>
                    <p className={`text-xs leading-relaxed ${
                      isSelected ? 'opacity-90' : 'text-muted-foreground'
                    }`}>
                      {objective.description}
                    </p>
                  </div>

                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-current" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selection count */}
        {selectedObjectives.length > 0 && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {selectedObjectives.length} objectif{selectedObjectives.length > 1 ? 's' : ''} sélectionné{selectedObjectives.length > 1 ? 's' : ''}
              {selectedObjectives.length >= 3 && (
                <span className="block text-xs">
                  Maximum atteint - sélectionne un autre pour remplacer
                </span>
              )}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="w-full"
          >
            Précédent
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!canSubmit || loading}
            className="w-full"
          >
            {loading ? 'Sauvegarde...' : 'Suivant'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};