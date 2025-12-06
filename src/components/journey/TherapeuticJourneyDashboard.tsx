// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Map, Sparkles, Target, Calendar, CheckCircle2, Circle, 
  TrendingUp, Lightbulb, Activity, Brain, Heart 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

interface Journey {
  id: string;
  title: string;
  description: string;
  goal: string;
  duration_weeks: number;
  difficulty: string;
  status: string;
  current_phase: number;
  progress_percentage: number;
  phases: any[];
  recommended_activities: any;
  checkpoints: any[];
  adaptations?: any;
  created_at: string;
  updated_at: string;
}

const TherapeuticJourneyDashboard: React.FC = () => {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [activeJourney, setActiveJourney] = useState<Journey | null>(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [adapting, setAdapting] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const [newJourneyData, setNewJourneyData] = useState({
    goal: '',
    currentState: '',
    preferences: {
      pace: 'moderate',
      focus: 'balanced',
      style: 'structured'
    }
  });

  useEffect(() => {
    loadJourneys();
  }, []);

  const loadJourneys = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('therapeutic-journey', {
        body: { action: 'get_journeys' }
      });

      if (error) throw error;
      
      const journeyList = data.journeys || [];
      setJourneys(journeyList);
      
      const active = journeyList.find((j: Journey) => j.status === 'active');
      if (active) setActiveJourney(active);
    } catch (error) {
      logger.error('Erreur chargement parcours', error as Error, 'UI');
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const createJourney = async () => {
    if (!newJourneyData.goal || !newJourneyData.currentState) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setCreating(true);
    try {
      const { data, error } = await supabase.functions.invoke('therapeutic-journey', {
        body: {
          action: 'create_journey',
          journeyData: newJourneyData
        }
      });

      if (error) throw error;

      toast.success('Parcours thérapeutique créé ! 🎉');
      setShowCreateDialog(false);
      setNewJourneyData({
        goal: '',
        currentState: '',
        preferences: { pace: 'moderate', focus: 'balanced', style: 'structured' }
      });
      await loadJourneys();
    } catch (error: any) {
      logger.error('Erreur création', error as Error, 'UI');
      toast.error('Erreur lors de la création');
    } finally {
      setCreating(false);
    }
  };

  const adaptJourney = async () => {
    if (!activeJourney) return;

    setAdapting(true);
    try {
      const { data, error } = await supabase.functions.invoke('therapeutic-journey', {
        body: {
          action: 'adapt_journey',
          journeyData: {
            journeyId: activeJourney.id,
            recentProgress: {
              current_phase: activeJourney.current_phase,
              progress: activeJourney.progress_percentage
            }
          }
        }
      });

      if (error) throw error;

      toast.success('Parcours adapté selon vos progrès ! 🎯');
      await loadJourneys();
    } catch (error: any) {
      logger.error('Erreur adaptation', error as Error, 'UI');
      toast.error('Erreur lors de l\'adaptation');
    } finally {
      setAdapting(false);
    }
  };

  const updateProgress = async (phaseNumber: number, progressPercentage: number) => {
    if (!activeJourney) return;

    try {
      await supabase.functions.invoke('therapeutic-journey', {
        body: {
          action: 'update_progress',
          journeyData: {
            journeyId: activeJourney.id,
            phaseNumber,
            progressPercentage
          }
        }
      });

      toast.success('Progrès mis à jour !');
      await loadJourneys();
    } catch (error) {
      logger.error('Erreur mise à jour', error as Error, 'UI');
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-6 w-6 text-primary" />
                Parcours Thérapeutique
              </CardTitle>
              <CardDescription>
                Votre chemin personnalisé vers le bien-être
              </CardDescription>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Créer un parcours IA
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Créer votre parcours personnalisé</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Quel est votre objectif principal ?</Label>
                    <Input
                      placeholder="Ex: Gérer mon stress, améliorer mon sommeil..."
                      value={newJourneyData.goal}
                      onChange={(e) => setNewJourneyData({ ...newJourneyData, goal: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Comment vous sentez-vous actuellement ?</Label>
                    <Textarea
                      placeholder="Décrivez votre état émotionnel actuel..."
                      value={newJourneyData.currentState}
                      onChange={(e) => setNewJourneyData({ ...newJourneyData, currentState: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Rythme</Label>
                      <Select
                        value={newJourneyData.preferences.pace}
                        onValueChange={(value) => 
                          setNewJourneyData({
                            ...newJourneyData,
                            preferences: { ...newJourneyData.preferences, pace: value }
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="slow">Lent</SelectItem>
                          <SelectItem value="moderate">Modéré</SelectItem>
                          <SelectItem value="fast">Rapide</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Focus</Label>
                      <Select
                        value={newJourneyData.preferences.focus}
                        onValueChange={(value) => 
                          setNewJourneyData({
                            ...newJourneyData,
                            preferences: { ...newJourneyData.preferences, focus: value }
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="emotional">Émotionnel</SelectItem>
                          <SelectItem value="behavioral">Comportemental</SelectItem>
                          <SelectItem value="balanced">Équilibré</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Style</Label>
                      <Select
                        value={newJourneyData.preferences.style}
                        onValueChange={(value) => 
                          setNewJourneyData({
                            ...newJourneyData,
                            preferences: { ...newJourneyData.preferences, style: value }
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="flexible">Flexible</SelectItem>
                          <SelectItem value="structured">Structuré</SelectItem>
                          <SelectItem value="adaptive">Adaptatif</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    onClick={createJourney}
                    disabled={creating}
                    className="w-full"
                  >
                    {creating ? 'Création en cours...' : 'Créer mon parcours'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {activeJourney ? (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="phases">Phases</TabsTrigger>
            <TabsTrigger value="activities">Activités</TabsTrigger>
            <TabsTrigger value="adaptations">Adaptations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{activeJourney.title}</CardTitle>
                    <CardDescription>{activeJourney.description}</CardDescription>
                  </div>
                  <Button onClick={adaptJourney} disabled={adapting} variant="outline" className="gap-2">
                    <Brain className="h-4 w-4" />
                    {adapting ? 'Adaptation...' : 'Adapter le parcours'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Badge className={getDifficultyColor(activeJourney.difficulty)}>
                    {activeJourney.difficulty}
                  </Badge>
                  <Badge variant="outline">
                    <Calendar className="h-3 w-3 mr-1" />
                    {activeJourney.duration_weeks} semaines
                  </Badge>
                  <Badge variant="outline">
                    Phase {activeJourney.current_phase}/{activeJourney.phases?.length || 0}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progrès global</span>
                    <span className="font-semibold">{activeJourney.progress_percentage}%</span>
                  </div>
                  <Progress value={activeJourney.progress_percentage} />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <div className="text-2xl font-bold">{activeJourney.phases?.length || 0}</div>
                      <div className="text-xs text-muted-foreground">Phases</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Activity className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <div className="text-2xl font-bold">
                        {activeJourney.recommended_activities?.daily?.length || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Activités quotidiennes</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <div className="text-2xl font-bold">{activeJourney.checkpoints?.length || 0}</div>
                      <div className="text-xs text-muted-foreground">Points de contrôle</div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Target className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <div className="font-semibold mb-1">Objectif</div>
                        <p className="text-sm text-muted-foreground">{activeJourney.goal}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="phases" className="space-y-4">
            {activeJourney.phases?.map((phase: any, index: number) => (
              <Card key={index} className={index + 1 === activeJourney.current_phase ? 'border-primary' : ''}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`rounded-full p-3 ${index + 1 === activeJourney.current_phase ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      {index + 1 <= activeJourney.current_phase ? (
                        <CheckCircle2 className="h-6 w-6" />
                      ) : (
                        <Circle className="h-6 w-6" />
                      )}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg">Phase {phase.phase_number}: {phase.title}</h3>
                        <p className="text-sm text-muted-foreground">{phase.description}</p>
                        <Badge variant="outline" className="mt-2">
                          {phase.duration_days} jours
                        </Badge>
                      </div>

                      {phase.milestones && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Jalons</h4>
                          {phase.milestones.map((milestone: any, mIndex: number) => (
                            <Card key={mIndex} className="bg-muted/50">
                              <CardContent className="p-3">
                                <div className="font-medium text-sm">{milestone.title}</div>
                                <p className="text-xs text-muted-foreground mt-1">{milestone.description}</p>
                                {milestone.activities && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {milestone.activities.map((activity: string, aIndex: number) => (
                                      <Badge key={aIndex} variant="secondary" className="text-xs">
                                        {activity}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}

                      {index + 1 === activeJourney.current_phase && (
                        <Button
                          onClick={() => updateProgress(index + 2, Math.min(100, activeJourney.progress_percentage + 20))}
                          className="w-full"
                        >
                          Marquer comme complétée
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="activities" className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    Activités quotidiennes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {activeJourney.recommended_activities?.daily?.map((activity: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{activity}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    Activités hebdomadaires
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {activeJourney.recommended_activities?.weekly?.map((activity: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{activity}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                    Activités mensuelles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {activeJourney.recommended_activities?.monthly?.map((activity: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{activity}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4 text-orange-500" />
                  Points de contrôle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeJourney.checkpoints?.map((checkpoint: any, index: number) => (
                    <Card key={index} className="bg-muted/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-sm">Semaine {checkpoint.week}</div>
                            <p className="text-xs text-muted-foreground mt-1">{checkpoint.description}</p>
                          </div>
                          <Badge variant="outline">{checkpoint.type}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="adaptations" className="space-y-4">
            {activeJourney.adaptations ? (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-yellow-500" />
                      Adaptations IA
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {activeJourney.adaptations.encouragement && (
                      <Card className="bg-green-50 dark:bg-green-950 border-green-200">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Heart className="h-5 w-5 text-green-600 mt-1" />
                            <p className="text-sm">{activeJourney.adaptations.encouragement}</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {activeJourney.adaptations.recommended_changes && (
                      <div>
                        <h3 className="font-semibold mb-2">Changements recommandés</h3>
                        <ul className="space-y-2">
                          {activeJourney.adaptations.recommended_changes.map((change: string, index: number) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                              <span>{change}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {activeJourney.adaptations.focus_areas && (
                      <div>
                        <h3 className="font-semibold mb-2">Zones de focus</h3>
                        <div className="flex flex-wrap gap-2">
                          {activeJourney.adaptations.focus_areas.map((area: string, index: number) => (
                            <Badge key={index} variant="secondary">{area}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeJourney.adaptations.next_steps && (
                      <div>
                        <h3 className="font-semibold mb-2">Prochaines étapes</h3>
                        <ul className="space-y-2">
                          {activeJourney.adaptations.next_steps.map((step: string, index: number) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Brain className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">Aucune adaptation pour le moment</p>
                  <Button onClick={adaptJourney} disabled={adapting}>
                    {adapting ? 'Adaptation en cours...' : 'Générer des adaptations'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Map className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Aucun parcours actif</p>
            <Button onClick={() => setShowCreateDialog(true)}>
              Créer votre premier parcours
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TherapeuticJourneyDashboard;
