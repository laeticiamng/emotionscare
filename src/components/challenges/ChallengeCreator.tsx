// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Target,
  Trophy,
  Clock,
  Users,
  Zap,
  Heart,
  Brain,
  Sparkles,
  Plus,
  Trash2,
  Save,
  Eye,
  Calendar,
  Star,
  Flame,
  CheckCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface ChallengeStep {
  id: string;
  title: string;
  description: string;
  points: number;
  duration: number;
  type: 'action' | 'reflection' | 'meditation' | 'social';
}

interface ChallengeConfig {
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  duration: number;
  durationUnit: 'days' | 'weeks';
  isPublic: boolean;
  isTeamChallenge: boolean;
  maxParticipants: number;
  rewards: {
    points: number;
    badge: string;
    achievement: string;
  };
  steps: ChallengeStep[];
  tags: string[];
}

const defaultConfig: ChallengeConfig = {
  title: '',
  description: '',
  category: 'wellness',
  difficulty: 'medium',
  duration: 7,
  durationUnit: 'days',
  isPublic: true,
  isTeamChallenge: false,
  maxParticipants: 50,
  rewards: {
    points: 100,
    badge: '',
    achievement: '',
  },
  steps: [],
  tags: [],
};

const categories = [
  { value: 'wellness', label: 'Bien-tre', icon: Heart, color: 'text-pink-500' },
  { value: 'mindfulness', label: 'Pleine conscience', icon: Brain, color: 'text-purple-500' },
  { value: 'productivity', label: 'Productivit', icon: Zap, color: 'text-yellow-500' },
  { value: 'social', label: 'Social', icon: Users, color: 'text-blue-500' },
  { value: 'fitness', label: 'Forme physique', icon: Flame, color: 'text-orange-500' },
  { value: 'creativity', label: 'Crativit', icon: Sparkles, color: 'text-cyan-500' },
];

const difficultyLevels = [
  { value: 'easy', label: 'Facile', color: 'bg-green-500', points: 50 },
  { value: 'medium', label: 'Moyen', color: 'bg-yellow-500', points: 100 },
  { value: 'hard', label: 'Difficile', color: 'bg-orange-500', points: 200 },
  { value: 'expert', label: 'Expert', color: 'bg-red-500', points: 500 },
];

const stepTypes = [
  { value: 'action', label: 'Action', icon: Target },
  { value: 'reflection', label: 'Rflexion', icon: Brain },
  { value: 'meditation', label: 'Mditation', icon: Heart },
  { value: 'social', label: 'Social', icon: Users },
];

const badges = [
  { value: 'wellness-warrior', label: 'Guerrier du Bien-tre' },
  { value: 'mindful-master', label: 'Matre Pleine Conscience' },
  { value: 'productivity-pro', label: 'Pro de la Productivit' },
  { value: 'social-star', label: 'toile Sociale' },
  { value: 'fitness-champion', label: 'Champion Fitness' },
  { value: 'creative-genius', label: 'Gnie Cratif' },
];

export const ChallengeCreator: React.FC = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<ChallengeConfig>(defaultConfig);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const addStep = () => {
    const newStep: ChallengeStep = {
      id: `step-${Date.now()}`,
      title: '',
      description: '',
      points: 10,
      duration: 5,
      type: 'action',
    };
    setConfig((prev) => ({
      ...prev,
      steps: [...prev.steps, newStep],
    }));
  };

  const updateStep = (stepId: string, updates: Partial<ChallengeStep>) => {
    setConfig((prev) => ({
      ...prev,
      steps: prev.steps.map((step) =>
        step.id === stepId ? { ...step, ...updates } : step
      ),
    }));
  };

  const removeStep = (stepId: string) => {
    setConfig((prev) => ({
      ...prev,
      steps: prev.steps.filter((step) => step.id !== stepId),
    }));
  };

  const addTag = () => {
    if (currentTag.trim() && !config.tags.includes(currentTag.trim())) {
      setConfig((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tag: string) => {
    setConfig((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const calculateTotalPoints = () => {
    const basePoints =
      difficultyLevels.find((d) => d.value === config.difficulty)?.points || 100;
    const stepPoints = config.steps.reduce((sum, step) => sum + step.points, 0);
    return basePoints + stepPoints;
  };

  const handleSave = async () => {
    if (!config.title || !config.description) {
      toast({
        title: 'Champs requis',
        description: 'Veuillez remplir le titre et la description.',
        variant: 'destructive',
      });
      return;
    }

    if (config.steps.length === 0) {
      toast({
        title: 'tapes requises',
        description: 'Ajoutez au moins une tape au dfi.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      logger.info('Challenge created', { config }, 'CHALLENGE');

      toast({
        title: 'Dfi cr avec succs!',
        description: `Le dfi "${config.title}" a t enregistr.`,
      });

      // Reset form
      setConfig(defaultConfig);
    } catch (error) {
      logger.error('Failed to create challenge', error as Error, 'CHALLENGE');
      toast({
        title: 'Erreur',
        description: 'Impossible de crer le dfi.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const selectedCategory = categories.find((c) => c.value === config.category);
  const CategoryIcon = selectedCategory?.icon || Target;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Crateur de Dfis
          </h1>
          <p className="text-muted-foreground mt-1">
            Concevez des dfis personnaliss pour vous ou votre quipe
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {isPreviewMode ? 'diter' : 'Aperu'}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </div>

      {isPreviewMode ? (
        // Preview Mode
        <ChallengePreview config={config} totalPoints={calculateTotalPoints()} />
      ) : (
        // Edit Mode
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Informations de base
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre du dfi</Label>
                  <Input
                    id="title"
                    placeholder="Ex: 7 jours de pleine conscience"
                    value={config.title}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, title: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Dcrivez votre dfi en dtail..."
                    value={config.description}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Catgorie</Label>
                    <Select
                      value={config.category}
                      onValueChange={(value) =>
                        setConfig((prev) => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => {
                          const Icon = cat.icon;
                          return (
                            <SelectItem key={cat.value} value={cat.value}>
                              <div className="flex items-center gap-2">
                                <Icon className={`h-4 w-4 ${cat.color}`} />
                                {cat.label}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Difficult</Label>
                    <Select
                      value={config.difficulty}
                      onValueChange={(value: any) =>
                        setConfig((prev) => ({ ...prev, difficulty: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {difficultyLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-3 h-3 rounded-full ${level.color}`}
                              />
                              {level.label} ({level.points} pts)
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Dure</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min={1}
                        max={365}
                        value={config.duration}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            duration: parseInt(e.target.value) || 1,
                          }))
                        }
                        className="flex-1"
                      />
                      <Select
                        value={config.durationUnit}
                        onValueChange={(value: 'days' | 'weeks') =>
                          setConfig((prev) => ({
                            ...prev,
                            durationUnit: value,
                          }))
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="days">Jours</SelectItem>
                          <SelectItem value="weeks">Semaines</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Badge de rcompense</Label>
                    <Select
                      value={config.rewards.badge}
                      onValueChange={(value) =>
                        setConfig((prev) => ({
                          ...prev,
                          rewards: { ...prev.rewards, badge: value },
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Slectionner un badge" />
                      </SelectTrigger>
                      <SelectContent>
                        {badges.map((badge) => (
                          <SelectItem key={badge.value} value={badge.value}>
                            {badge.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ajouter un tag..."
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button variant="outline" onClick={addTag}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {config.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer hover:bg-destructive/20"
                        onClick={() => removeTag(tag)}
                      >
                        {tag}
                        <Trash2 className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Challenge Steps */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    tapes du dfi
                  </CardTitle>
                  <CardDescription>
                    Dfinissez les tapes que les participants devront
                    accomplir
                  </CardDescription>
                </div>
                <Button onClick={addStep} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une tape
                </Button>
              </CardHeader>
              <CardContent>
                <AnimatePresence>
                  {config.steps.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Aucune tape dfinie</p>
                      <p className="text-sm">
                        Cliquez sur "Ajouter une tape" pour commencer
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {config.steps.map((step, index) => (
                        <motion.div
                          key={step.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="p-4 border rounded-lg space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">tape {index + 1}</Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeStep(step.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label>Titre</Label>
                              <Input
                                placeholder="Titre de l'tape"
                                value={step.title}
                                onChange={(e) =>
                                  updateStep(step.id, { title: e.target.value })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Type</Label>
                              <Select
                                value={step.type}
                                onValueChange={(value: any) =>
                                  updateStep(step.id, { type: value })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {stepTypes.map((type) => {
                                    const Icon = type.icon;
                                    return (
                                      <SelectItem
                                        key={type.value}
                                        value={type.value}
                                      >
                                        <div className="flex items-center gap-2">
                                          <Icon className="h-4 w-4" />
                                          {type.label}
                                        </div>
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                              placeholder="Instructions pour cette tape..."
                              value={step.description}
                              onChange={(e) =>
                                updateStep(step.id, {
                                  description: e.target.value,
                                })
                              }
                              rows={2}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Points: {step.points}</Label>
                              <Slider
                                value={[step.points]}
                                onValueChange={([value]) =>
                                  updateStep(step.id, { points: value })
                                }
                                min={5}
                                max={100}
                                step={5}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Dure (min): {step.duration}</Label>
                              <Slider
                                value={[step.duration]}
                                onValueChange={([value]) =>
                                  updateStep(step.id, { duration: value })
                                }
                                min={1}
                                max={60}
                                step={1}
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-accent" />
                  Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dfi public</Label>
                    <p className="text-xs text-muted-foreground">
                      Visible par tous les utilisateurs
                    </p>
                  </div>
                  <Switch
                    checked={config.isPublic}
                    onCheckedChange={(checked) =>
                      setConfig((prev) => ({ ...prev, isPublic: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dfi d'quipe</Label>
                    <p className="text-xs text-muted-foreground">
                      Permet la participation en groupe
                    </p>
                  </div>
                  <Switch
                    checked={config.isTeamChallenge}
                    onCheckedChange={(checked) =>
                      setConfig((prev) => ({ ...prev, isTeamChallenge: checked }))
                    }
                  />
                </div>

                {config.isTeamChallenge && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2"
                  >
                    <Label>Participants max: {config.maxParticipants}</Label>
                    <Slider
                      value={[config.maxParticipants]}
                      onValueChange={([value]) =>
                        setConfig((prev) => ({
                          ...prev,
                          maxParticipants: value,
                        }))
                      }
                      min={2}
                      max={100}
                      step={1}
                    />
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Summary */}
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-warning" />
                  Rsum
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Catgorie
                  </span>
                  <div className="flex items-center gap-2">
                    <CategoryIcon
                      className={`h-4 w-4 ${selectedCategory?.color}`}
                    />
                    <span className="font-medium">
                      {selectedCategory?.label}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Dure</span>
                  <span className="font-medium">
                    {config.duration}{' '}
                    {config.durationUnit === 'days' ? 'jours' : 'semaines'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">tapes</span>
                  <span className="font-medium">{config.steps.length}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Points totaux
                  </span>
                  <span className="font-bold text-primary text-lg">
                    {calculateTotalPoints()} pts
                  </span>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Clock className="h-4 w-4" />
                    Temps estim
                  </div>
                  <p className="font-medium">
                    {config.steps.reduce((sum, step) => sum + step.duration, 0)}{' '}
                    minutes au total
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

// Preview Component
const ChallengePreview: React.FC<{
  config: ChallengeConfig;
  totalPoints: number;
}> = ({ config, totalPoints }) => {
  const selectedCategory = categories.find((c) => c.value === config.category);
  const CategoryIcon = selectedCategory?.icon || Target;
  const difficulty = difficultyLevels.find((d) => d.value === config.difficulty);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="overflow-hidden">
        <div
          className={`h-2 ${
            difficulty?.color || 'bg-primary'
          }`}
        />
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20`}
              >
                <CategoryIcon className={`h-8 w-8 ${selectedCategory?.color}`} />
              </div>
              <div>
                <CardTitle className="text-2xl">
                  {config.title || 'Titre du dfi'}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{selectedCategory?.label}</Badge>
                  <Badge className={difficulty?.color}>
                    {difficulty?.label}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-2xl font-bold text-primary">
                <Trophy className="h-6 w-6 text-warning" />
                {totalPoints}
              </div>
              <p className="text-sm text-muted-foreground">points</p>
            </div>
          </div>

          <CardDescription className="text-base">
            {config.description || 'Description du dfi...'}
          </CardDescription>

          <div className="flex flex-wrap gap-2">
            {config.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                {config.duration}{' '}
                {config.durationUnit === 'days' ? 'jours' : 'semaines'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
              <span>{config.steps.length} tapes</span>
            </div>
            {config.isTeamChallenge && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Max {config.maxParticipants} participants</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Star className="h-5 w-5 text-warning" />
              tapes du dfi
            </h3>
            {config.steps.map((step, index) => {
              const StepIcon =
                stepTypes.find((t) => t.value === step.type)?.icon || Target;
              return (
                <div
                  key={step.id}
                  className="flex items-start gap-3 p-3 border rounded-lg"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <StepIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {step.title || `tape ${index + 1}`}
                      </span>
                      <Badge variant="outline" className="ml-auto">
                        +{step.points} pts
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {step.description || 'Description de l\'tape...'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {step.duration} min
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <Button className="w-full" size="lg">
            <Flame className="h-5 w-5 mr-2" />
            Rejoindre le dfi
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChallengeCreator;
