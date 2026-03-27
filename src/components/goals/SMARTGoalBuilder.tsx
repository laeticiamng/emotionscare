// @ts-nocheck
/**
 * SMARTGoalBuilder - Créateur d'objectifs selon framework SMART
 * S = Spécifique, M = Mesurable, A = Atteignable, R = Réaliste, T = Temporel
 */

import React, { useState } from 'react';
import { Target, Calendar, TrendingUp, Award, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface SMARTGoal {
  // Spécifique
  title: string;
  description: string;
  category: string;

  // Mesurable
  metric: string;
  currentValue: number;
  targetValue: number;
  unit: string;

  // Atteignable
  difficulty: number; // 1-10
  resources: string[];

  // Réaliste
  motivation: number; // 1-10
  obstacles: string[];

  // Temporel
  deadline: string;
  milestones: Milestone[];
}

interface Milestone {
  title: string;
  deadline: string;
  completed: boolean;
}

interface SMARTGoalBuilderProps {
  onGoalCreated: (goal: SMARTGoal) => void;
  initialData?: Partial<SMARTGoal>;
}

export const SMARTGoalBuilder: React.FC<SMARTGoalBuilderProps> = ({
  onGoalCreated,
  initialData,
}) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [goal, setGoal] = useState<Partial<SMARTGoal>>({
    difficulty: 5,
    motivation: 5,
    resources: [],
    obstacles: [],
    milestones: [],
    ...initialData,
  });

  const [newResource, setNewResource] = useState('');
  const [newObstacle, setNewObstacle] = useState('');
  const [newMilestone, setNewMilestone] = useState({ title: '', deadline: '' });

  const totalSteps = 5;

  const categories = [
    { value: 'bien-etre', label: 'Bien-être', icon: '🧘' },
    { value: 'emotions', label: 'Gestion émotions', icon: '💖' },
    { value: 'social', label: 'Relations sociales', icon: '👥' },
    { value: 'carriere', label: 'Carrière', icon: '💼' },
    { value: 'sante', label: 'Santé', icon: '🏃' },
    { value: 'creativite', label: 'Créativité', icon: '🎨' },
    { value: 'apprentissage', label: 'Apprentissage', icon: '📚' },
    { value: 'autre', label: 'Autre', icon: '✨' },
  ];

  const units = ['fois/semaine', 'heures', 'minutes', 'jours', 'pages', 'km', '%', 'points'];

  const addResource = () => {
    if (newResource.trim()) {
      setGoal({ ...goal, resources: [...(goal.resources || []), newResource.trim()] });
      setNewResource('');
    }
  };

  const addObstacle = () => {
    if (newObstacle.trim()) {
      setGoal({ ...goal, obstacles: [...(goal.obstacles || []), newObstacle.trim()] });
      setNewObstacle('');
    }
  };

  const addMilestone = () => {
    if (newMilestone.title.trim() && newMilestone.deadline) {
      setGoal({
        ...goal,
        milestones: [
          ...(goal.milestones || []),
          { ...newMilestone, completed: false }
        ]
      });
      setNewMilestone({ title: '', deadline: '' });
    }
  };

  const removeResource = (index: number) => {
    setGoal({
      ...goal,
      resources: goal.resources?.filter((_, i) => i !== index)
    });
  };

  const removeObstacle = (index: number) => {
    setGoal({
      ...goal,
      obstacles: goal.obstacles?.filter((_, i) => i !== index)
    });
  };

  const removeMilestone = (index: number) => {
    setGoal({
      ...goal,
      milestones: goal.milestones?.filter((_, i) => i !== index)
    });
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Spécifique
        return !!(goal.title && goal.description && goal.category);
      case 2: // Mesurable
        return !!(goal.metric && goal.unit && goal.targetValue !== undefined);
      case 3: // Atteignable
        return !!(goal.difficulty && goal.resources && goal.resources.length > 0);
      case 4: // Réaliste
        return !!(goal.motivation);
      case 5: // Temporel
        return !!(goal.deadline);
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        submitGoal();
      }
    } else {
      toast({
        title: 'Champs manquants',
        description: 'Veuillez remplir tous les champs requis avant de continuer.',
        variant: 'destructive',
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitGoal = () => {
    if (Object.values(goal).some(v => !v)) {
      toast({
        title: 'Objectif incomplet',
        description: 'Certaines informations sont manquantes.',
        variant: 'destructive',
      });
      return;
    }

    onGoalCreated(goal as SMARTGoal);
    logger.info('Objectif SMART créé', { goal }, 'GOALS');

    toast({
      title: 'Objectif créé !',
      description: 'Votre objectif SMART a été créé avec succès.',
    });
  };

  const getSmartScore = (): number => {
    let score = 0;
    if (goal.title && goal.description && goal.category) score += 20; // Spécifique
    if (goal.metric && goal.unit && goal.targetValue !== undefined) score += 20; // Mesurable
    if (goal.difficulty && goal.resources && goal.resources.length > 0) score += 20; // Atteignable
    if (goal.motivation && goal.obstacles !== undefined) score += 20; // Réaliste
    if (goal.deadline && goal.milestones && goal.milestones.length > 0) score += 20; // Temporel
    return score;
  };

  const smartScore = getSmartScore();

  return (
    <div className="space-y-6">
      {/* En-tête avec progression */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Créer un Objectif SMART
          </CardTitle>
          <CardDescription>
            Suivez les 5 étapes pour créer un objectif efficace et atteignable
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                Étape {currentStep} sur {totalSteps}
              </span>
              <Badge variant={smartScore === 100 ? 'default' : 'secondary'}>
                Score SMART: {smartScore}%
              </Badge>
            </div>
            <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className={currentStep >= 1 ? 'text-primary font-medium' : ''}>Spécifique</span>
              <span className={currentStep >= 2 ? 'text-primary font-medium' : ''}>Mesurable</span>
              <span className={currentStep >= 3 ? 'text-primary font-medium' : ''}>Atteignable</span>
              <span className={currentStep >= 4 ? 'text-primary font-medium' : ''}>Réaliste</span>
              <span className={currentStep >= 5 ? 'text-primary font-medium' : ''}>Temporel</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Étape 1: Spécifique */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
              1. Spécifique - Définissez clairement votre objectif
            </CardTitle>
            <CardDescription>
              Soyez précis sur ce que vous voulez accomplir
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre de l'objectif *</Label>
              <Input
                id="title"
                placeholder="Ex: Pratiquer la méditation quotidienne"
                value={goal.title || ''}
                onChange={(e) => setGoal({ ...goal, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description détaillée *</Label>
              <Textarea
                id="description"
                placeholder="Décrivez en détail ce que vous voulez accomplir, pourquoi c'est important pour vous..."
                rows={4}
                value={goal.description || ''}
                onChange={(e) => setGoal({ ...goal, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Catégorie *</Label>
              <Select
                value={goal.category}
                onValueChange={(value) => setGoal({ ...goal, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Étape 2: Mesurable */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              2. Mesurable - Comment mesurer votre progrès
            </CardTitle>
            <CardDescription>
              Définissez des indicateurs quantifiables pour suivre votre progression
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="metric">Métrique à suivre *</Label>
              <Input
                id="metric"
                placeholder="Ex: Nombre de séances de méditation"
                value={goal.metric || ''}
                onChange={(e) => setGoal({ ...goal, metric: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentValue">Valeur actuelle</Label>
                <Input
                  id="currentValue"
                  type="number"
                  placeholder="0"
                  value={goal.currentValue || 0}
                  onChange={(e) => setGoal({ ...goal, currentValue: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetValue">Valeur cible *</Label>
                <Input
                  id="targetValue"
                  type="number"
                  placeholder="Ex: 7"
                  value={goal.targetValue || ''}
                  onChange={(e) => setGoal({ ...goal, targetValue: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unité de mesure *</Label>
              <Select
                value={goal.unit}
                onValueChange={(value) => setGoal({ ...goal, unit: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une unité" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {goal.metric && goal.targetValue && goal.unit && (
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200">
                <p className="text-sm text-green-800 dark:text-green-200">
                  📊 Votre objectif: Passer de <strong>{goal.currentValue || 0}</strong> à{' '}
                  <strong>{goal.targetValue}</strong> {goal.unit}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Étape 3: Atteignable */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-orange-600" />
              3. Atteignable - Évaluez la faisabilité
            </CardTitle>
            <CardDescription>
              Identifiez les ressources nécessaires et le niveau de difficulté
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Niveau de difficulté: {goal.difficulty}/10</Label>
              <Slider
                value={[goal.difficulty || 5]}
                onValueChange={(value) => setGoal({ ...goal, difficulty: value[0] })}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Très facile</span>
                <span>Modéré</span>
                <span>Très difficile</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Ressources nécessaires *</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Ex: 15 minutes par jour, app de méditation..."
                  value={newResource}
                  onChange={(e) => setNewResource(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addResource()}
                />
                <Button type="button" onClick={addResource}>Ajouter</Button>
              </div>
              {goal.resources && goal.resources.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-2">
                  {goal.resources.map((resource, i) => (
                    <Badge 
                      key={i} 
                      variant="secondary" 
                      className="cursor-pointer" 
                      onClick={() => removeResource(i)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && removeResource(i)}
                      aria-label={`Supprimer la ressource ${resource}`}
                    >
                      {resource} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Étape 4: Réaliste */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-purple-600" />
              4. Réaliste - Motivation et obstacles
            </CardTitle>
            <CardDescription>
              Évaluez votre motivation et anticipez les obstacles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Niveau de motivation: {goal.motivation}/10</Label>
              <Slider
                value={[goal.motivation || 5]}
                onValueChange={(value) => setGoal({ ...goal, motivation: value[0] })}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Peu motivé</span>
                <span>Motivé</span>
                <span>Très motivé</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Obstacles potentiels</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Ex: Manque de temps, stress au travail..."
                  value={newObstacle}
                  onChange={(e) => setNewObstacle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addObstacle()}
                />
                <Button type="button" onClick={addObstacle}>Ajouter</Button>
              </div>
              {goal.obstacles && goal.obstacles.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-2">
                  {goal.obstacles.map((obstacle, i) => (
                    <Badge 
                      key={i} 
                      variant="outline" 
                      className="cursor-pointer" 
                      onClick={() => removeObstacle(i)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && removeObstacle(i)}
                      aria-label={`Supprimer l'obstacle ${obstacle}`}
                    >
                      {obstacle} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Étape 5: Temporel */}
      {currentStep === 5 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-red-600" />
              5. Temporel - Définissez une échéance
            </CardTitle>
            <CardDescription>
              Fixez une date limite et des jalons intermédiaires
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deadline">Date limite *</Label>
              <Input
                id="deadline"
                type="date"
                value={goal.deadline || ''}
                onChange={(e) => setGoal({ ...goal, deadline: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label>Jalons intermédiaires (optionnel)</Label>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Titre du jalon"
                    value={newMilestone.title}
                    onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                  />
                  <Input
                    type="date"
                    value={newMilestone.deadline}
                    onChange={(e) => setNewMilestone({ ...newMilestone, deadline: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    max={goal.deadline}
                  />
                </div>
                <Button type="button" onClick={addMilestone} variant="outline" className="w-full">
                  Ajouter un jalon
                </Button>
              </div>

              {goal.milestones && goal.milestones.length > 0 && (
                <div className="space-y-2 mt-3">
                  {goal.milestones.map((milestone, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div>
                        <div className="text-sm font-medium">{milestone.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(milestone.deadline).toLocaleDateString()}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeMilestone(i)}>
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between gap-4">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          Précédent
        </Button>

        <div className="flex gap-2">
          <Button
            variant={currentStep === totalSteps ? 'default' : 'outline'}
            onClick={nextStep}
            disabled={!validateStep(currentStep)}
          >
            {currentStep === totalSteps ? 'Créer l\'objectif' : 'Suivant'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SMARTGoalBuilder;
