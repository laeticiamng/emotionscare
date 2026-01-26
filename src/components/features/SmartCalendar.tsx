// @ts-nocheck
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';


import { 
  Calendar as CalendarIcon, 
  Plus, 
  Bell, 
  Target, 
  Heart,
  Music,
  Brain,
  Activity,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  Users
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'session' | 'reminder' | 'goal' | 'appointment';
  date: Date;
  time: string;
  duration?: number;
  description?: string;
  color: string;
  completed?: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface WellnessGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  color: string;
  icon: React.ElementType;
}

const SmartCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedView, setSelectedView] = useState<'calendar' | 'agenda' | 'goals'>('calendar');

  const events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Méditation matinale',
      type: 'session',
      date: new Date(),
      time: '08:00',
      duration: 20,
      description: 'Session de méditation guidée pour commencer la journée',
      color: 'bg-green-500',
      completed: true,
      priority: 'high'
    },
    {
      id: '2',
      title: 'Rappel: Check émotionnel',
      type: 'reminder',
      date: new Date(),
      time: '14:00',
      color: 'bg-blue-500',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Session avec Coach IA',
      type: 'appointment',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      time: '16:30',
      duration: 30,
      color: 'bg-purple-500',
      priority: 'high'
    },
    {
      id: '4',
      title: 'Écoute musicale thérapeutique',
      type: 'session',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      time: '19:00',
      duration: 45,
      color: 'bg-pink-500',
      priority: 'medium'
    },
    {
      id: '5',
      title: 'Objectif: 7 entrées journal',
      type: 'goal',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      time: 'Toute la journée',
      color: 'bg-yellow-500',
      priority: 'low'
    }
  ];

  const wellnessGoals: WellnessGoal[] = [
    {
      id: '1',
      title: 'Sessions de méditation',
      target: 7,
      current: 5,
      unit: 'sessions/semaine',
      color: 'text-green-500',
      icon: Heart
    },
    {
      id: '2',
      title: 'Check émotionnels',
      target: 14,
      current: 12,
      unit: 'entrées/semaine',
      color: 'text-blue-500',
      icon: Activity
    },
    {
      id: '3',
      title: 'Temps d\'écoute musical',
      target: 300,
      current: 180,
      unit: 'minutes/semaine',
      color: 'text-purple-500',
      icon: Music
    },
    {
      id: '4',
      title: 'Sessions coach IA',
      target: 3,
      current: 2,
      unit: 'sessions/semaine',
      color: 'text-orange-500',
      icon: Brain
    }
  ];

  const todayEvents = events.filter(event => 
    event.date.toDateString() === new Date().toDateString()
  );

  const upcomingEvents = events.filter(event => 
    event.date > new Date() && event.date <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  ).sort((a, b) => a.date.getTime() - b.date.getTime());

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'session': return Heart;
      case 'reminder': return Bell;
      case 'goal': return Target;
      case 'appointment': return Users;
      default: return CalendarIcon;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive" className="text-xs">Haute</Badge>;
      case 'medium': return <Badge variant="default" className="text-xs">Moyenne</Badge>;
      case 'low': return <Badge variant="secondary" className="text-xs">Basse</Badge>;
      default: return null;
    }
  };

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 100) return 'text-green-500 bg-green-100';
    if (percentage >= 70) return 'text-yellow-500 bg-yellow-100';
    return 'text-red-500 bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Navigation des vues */}
      <Card className="border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedView === 'calendar' ? 'default' : 'outline'}
              onClick={() => setSelectedView('calendar')}
              className="gap-2"
            >
              <CalendarIcon className="h-4 w-4" />
              Calendrier
            </Button>
            <Button
              variant={selectedView === 'agenda' ? 'default' : 'outline'}
              onClick={() => setSelectedView('agenda')}
              className="gap-2"
            >
              <Clock className="h-4 w-4" />
              Agenda
            </Button>
            <Button
              variant={selectedView === 'goals' ? 'default' : 'outline'}
              onClick={() => setSelectedView('goals')}
              className="gap-2"
            >
              <Target className="h-4 w-4" />
              Objectifs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Vue Calendrier */}
      {selectedView === 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                Calendrier de Bien-être
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                locale={fr}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <div className="space-y-4">
            {/* Événements du jour */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-500" />
                  Aujourd'hui
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todayEvents.length > 0 ? (
                    todayEvents.map((event) => {
                      const Icon = getEventIcon(event.type);
                      return (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-3 rounded-lg border-l-4 ${event.color.replace('bg-', 'border-')} bg-muted/20`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              <div>
                                <div className="font-medium text-sm">{event.title}</div>
                                <div className="text-xs text-muted-foreground">
                                  {event.time} {event.duration && `(${event.duration}min)`}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {event.completed && <CheckCircle className="h-4 w-4 text-green-500" />}
                              {getPriorityBadge(event.priority)}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="text-center text-muted-foreground text-sm py-4">
                      Aucun événement aujourd'hui
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <Plus className="h-4 w-4" />
                    Planifier une session
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <Bell className="h-4 w-4" />
                    Créer un rappel
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <Target className="h-4 w-4" />
                    Définir un objectif
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Vue Agenda */}
      {selectedView === 'agenda' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                Événements à venir
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => {
                  const Icon = getEventIcon(event.type);
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-lg border bg-gradient-to-r from-background to-muted/20 hover:to-muted/40 transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{event.title}</span>
                        </div>
                        {getPriorityBadge(event.priority)}
                      </div>
                      
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-3 w-3" />
                          {format(event.date, 'EEEE d MMMM', { locale: fr })}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {event.time} {event.duration && `(${event.duration}min)`}
                        </div>
                      </div>
                      
                      {event.description && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {event.description}
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-green-500" />
                Recommandations IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="font-medium text-sm">Excellente progression!</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Vos sessions régulières portent leurs fruits. Continuez ainsi!
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-blue-500" />
                    <span className="font-medium text-sm">Suggestion</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Planifiez une session de relaxation ce soir pour optimiser votre récupération.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Vue Objectifs */}
      {selectedView === 'goals' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {wellnessGoals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <goal.icon className={`h-5 w-5 ${goal.color}`} />
                      <CardTitle className="text-base">{goal.title}</CardTitle>
                    </div>
                    <Badge className={getProgressColor(goal.current, goal.target)}>
                      {Math.round((goal.current / goal.target) * 100)}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progression</span>
                      <span className="font-medium">{goal.current}/{goal.target} {goal.unit.split('/')[0]}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <motion.div
                        className="h-2 rounded-full bg-gradient-to-r from-primary to-primary/80"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                      />
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Objectif: {goal.unit}
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <Plus className="h-3 w-3" />
                    Ajouter une session
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SmartCalendar;