// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Music, Bell, Palette, Target, Heart, 
  Sunrise, Moon, Sun, Volume2, Vibrate, Calendar,
  Brain, Wind, BookOpen, Sparkles, CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface PersonalizationSectionProps {
  emotion: string;
  onResponse: (key: string, value: any) => void;
  onBack?: () => void;
  onContinue?: () => void;
}

interface WellnessGoal {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

const wellnessGoals: WellnessGoal[] = [
  { id: 'stress', icon: Brain, title: 'Réduire le stress', description: 'Techniques de relaxation et méditation' },
  { id: 'sleep', icon: Moon, title: 'Mieux dormir', description: 'Améliorer la qualité du sommeil' },
  { id: 'focus', icon: Target, title: 'Améliorer la concentration', description: 'Exercices de focus et productivité' },
  { id: 'energy', icon: Sunrise, title: 'Booster l\'énergie', description: 'Routines énergisantes' },
  { id: 'emotions', icon: Heart, title: 'Gérer les émotions', description: 'Intelligence émotionnelle' },
  { id: 'mindfulness', icon: Wind, title: 'Pratiquer la pleine conscience', description: 'Présence et attention' },
];

const reminderTimes = [
  { value: '07:00', label: '7h00 - Réveil', icon: Sunrise },
  { value: '12:00', label: '12h00 - Midi', icon: Sun },
  { value: '18:00', label: '18h00 - Fin de journée', icon: Sun },
  { value: '21:00', label: '21h00 - Soir', icon: Moon },
];

const PersonalizationSection: React.FC<PersonalizationSectionProps> = ({ 
  emotion, 
  onResponse,
  onBack,
  onContinue 
}) => {
  const [preferences, setPreferences] = useState({
    musicPreference: 'ambient',
    notificationFrequency: 'moderate',
    colorTheme: 'auto',
    reminderTime: '07:00',
    weeklyGoalMinutes: 30,
    hapticFeedback: true,
    soundEnabled: true,
    darkModeSchedule: false,
  });
  
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['stress', 'emotions']);
  const [selectedActivities, setSelectedActivities] = useState<string[]>(['breathing', 'journal']);
  const [completedSections, setCompletedSections] = useState<string[]>([]);

  const activities = [
    { id: 'breathing', label: 'Exercices de respiration', icon: Wind },
    { id: 'meditation', label: 'Méditation guidée', icon: Brain },
    { id: 'journal', label: 'Journal émotionnel', icon: BookOpen },
    { id: 'music', label: 'Thérapie musicale', icon: Music },
  ];

  useEffect(() => {
    // Mark sections as completed when values change
    if (selectedGoals.length > 0 && !completedSections.includes('goals')) {
      setCompletedSections(prev => [...prev, 'goals']);
    }
    if (selectedActivities.length > 0 && !completedSections.includes('activities')) {
      setCompletedSections(prev => [...prev, 'activities']);
    }
  }, [selectedGoals, selectedActivities]);

  const handleChange = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
    onResponse(key, value);
  };

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => {
      const newGoals = prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId];
      onResponse('wellness_goals', newGoals);
      return newGoals;
    });
  };

  const toggleActivity = (activityId: string) => {
    setSelectedActivities(prev => {
      const newActivities = prev.includes(activityId)
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId];
      onResponse('preferred_activities', newActivities);
      return newActivities;
    });
  };

  const handleContinue = () => {
    onResponse('personalization_preferences', {
      ...preferences,
      wellness_goals: selectedGoals,
      preferred_activities: selectedActivities,
    });
    onContinue?.();
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <Badge variant="secondary" className="mb-2">
            <Sparkles className="h-3 w-3 mr-1" />
            Personnalisation
          </Badge>
          <h2 className="text-2xl font-bold">Configurez votre expérience</h2>
          <p className="text-muted-foreground">
            Adaptez EmotionsCare à vos besoins et préférences
          </p>
        </motion.div>

        {/* Wellness Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Objectifs bien-être
                </CardTitle>
                {completedSections.includes('goals') && (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Sélectionnez vos priorités (plusieurs choix possibles)
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {wellnessGoals.map((goal) => (
                  <Tooltip key={goal.id}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => toggleGoal(goal.id)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          selectedGoals.includes(goal.id)
                            ? 'border-primary bg-primary/10'
                            : 'border-muted hover:border-primary/50'
                        }`}
                      >
                        <goal.icon className={`h-6 w-6 mb-2 ${
                          selectedGoals.includes(goal.id) ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                        <p className="font-medium text-sm">{goal.title}</p>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{goal.description}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Preferred Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Activités préférées
                </CardTitle>
                {completedSections.includes('activities') && (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <activity.icon className="h-5 w-5 text-muted-foreground" />
                    <span>{activity.label}</span>
                  </div>
                  <Checkbox
                    checked={selectedActivities.includes(activity.id)}
                    onCheckedChange={() => toggleActivity(activity.id)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Music & Audio Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Music className="h-5 w-5 text-primary" />
                Préférences audio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Style musical préféré</Label>
                <RadioGroup 
                  value={preferences.musicPreference}
                  onValueChange={(value) => handleChange('musicPreference', value)}
                  className="grid grid-cols-3 gap-2"
                >
                  {[
                    { value: 'ambient', label: 'Ambient', emoji: '🌊' },
                    { value: 'upbeat', label: 'Énergique', emoji: '⚡' },
                    { value: 'focus', label: 'Focus', emoji: '🎯' },
                  ].map((option) => (
                    <Label
                      key={option.value}
                      htmlFor={option.value}
                      className={`flex flex-col items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        preferences.musicPreference === option.value
                          ? 'border-primary bg-primary/10'
                          : 'border-muted hover:border-primary/50'
                      }`}
                    >
                      <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                      <span className="text-2xl mb-1">{option.emoji}</span>
                      <span className="text-sm">{option.label}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  <Label>Sons activés</Label>
                </div>
                <Switch
                  checked={preferences.soundEnabled}
                  onCheckedChange={(checked) => handleChange('soundEnabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Vibrate className="h-4 w-4 text-muted-foreground" />
                  <Label>Retour haptique</Label>
                </div>
                <Switch
                  checked={preferences.hapticFeedback}
                  onCheckedChange={(checked) => handleChange('hapticFeedback', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications & Reminders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Rappels & Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Fréquence des notifications</Label>
                <RadioGroup 
                  value={preferences.notificationFrequency}
                  onValueChange={(value) => handleChange('notificationFrequency', value)}
                >
                  {[
                    { value: 'low', label: 'Minimale', desc: '1-2 par semaine' },
                    { value: 'moderate', label: 'Modérée', desc: '1 par jour' },
                    { value: 'high', label: 'Fréquente', desc: '2-3 par jour' },
                  ].map((option) => (
                    <Label
                      key={option.value}
                      htmlFor={`notif-${option.value}`}
                      className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value={option.value} id={`notif-${option.value}`} />
                        <span>{option.label}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{option.desc}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Heure de rappel quotidien</Label>
                <Select
                  value={preferences.reminderTime}
                  onValueChange={(value) => handleChange('reminderTime', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {reminderTimes.map((time) => (
                      <SelectItem key={time.value} value={time.value}>
                        <div className="flex items-center gap-2">
                          <time.icon className="h-4 w-4" />
                          {time.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Goal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Objectif hebdomadaire
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Temps de pratique par semaine</Label>
                  <span className="font-bold text-primary">{preferences.weeklyGoalMinutes} min</span>
                </div>
                <Slider
                  value={[preferences.weeklyGoalMinutes]}
                  onValueChange={(values) => handleChange('weeklyGoalMinutes', values[0])}
                  min={10}
                  max={120}
                  step={5}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>10 min</span>
                  <span>Recommandé: 30 min</span>
                  <span>2h</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Theme */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Apparence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup 
                value={preferences.colorTheme}
                onValueChange={(value) => handleChange('colorTheme', value)}
                className="grid grid-cols-3 gap-2"
              >
                {[
                  { value: 'light', label: 'Clair', icon: Sun },
                  { value: 'dark', label: 'Sombre', icon: Moon },
                  { value: 'auto', label: 'Auto', icon: Palette },
                ].map((option) => (
                  <Label
                    key={option.value}
                    htmlFor={`theme-${option.value}`}
                    className={`flex flex-col items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      preferences.colorTheme === option.value
                        ? 'border-primary bg-primary/10'
                        : 'border-muted hover:border-primary/50'
                    }`}
                  >
                    <RadioGroupItem value={option.value} id={`theme-${option.value}`} className="sr-only" />
                    <option.icon className="h-6 w-6 mb-1" />
                    <span className="text-sm">{option.label}</span>
                  </Label>
                ))}
              </RadioGroup>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Mode sombre automatique</Label>
                  <p className="text-xs text-muted-foreground">Activer le mode sombre au coucher du soleil</p>
                </div>
                <Switch
                  checked={preferences.darkModeSchedule}
                  onCheckedChange={(checked) => handleChange('darkModeSchedule', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex justify-between pt-2"
        >
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              Retour
            </Button>
          )}
          {onContinue && (
            <Button onClick={handleContinue} className="ml-auto">
              Continuer
            </Button>
          )}
        </motion.div>
      </div>
    </TooltipProvider>
  );
};

export default PersonalizationSection;
