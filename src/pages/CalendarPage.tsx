import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Calendar, 
  Plus, 
  Clock,
  Heart,
  Brain,
  Music,
  Target,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  X
} from 'lucide-react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface CalendarEvent {
  id: number;
  title: string;
  time: string;
  duration: string;
  type: 'meditation' | 'wellness' | 'journal' | 'music';
  status: 'completed' | 'upcoming' | 'scheduled';
  date: string;
}

const CalendarPage: React.FC = () => {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<{
    title: string;
    time: string;
    duration: string;
    type: 'meditation' | 'wellness' | 'journal' | 'music';
  }>({
    title: '',
    time: '09:00',
    duration: '15',
    type: 'meditation',
  });

  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: 1,
      title: 'Session de méditation matinale',
      time: '08:00',
      duration: '20 min',
      type: 'meditation',
      status: 'completed',
      date: new Date().toDateString(),
    },
    {
      id: 2,
      title: 'Pause bien-être',
      time: '14:30',
      duration: '15 min',
      type: 'wellness',
      status: 'upcoming',
      date: new Date().toDateString(),
    },
    {
      id: 3,
      title: 'Journal émotionnel',
      time: '19:00',
      duration: '10 min',
      type: 'journal',
      status: 'scheduled',
      date: new Date().toDateString(),
    },
  ]);

  const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({ date, isCurrentMonth: true });
    }
    
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({ date: nextDate, isCurrentMonth: false });
    }
    
    return days;
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'meditation': return <Brain className="h-4 w-4" />;
      case 'wellness': return <Heart className="h-4 w-4" />;
      case 'journal': return <Target className="h-4 w-4" />;
      case 'music': return <Music className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'upcoming': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(e => e.date === date.toDateString());
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

  const handleAddEvent = () => {
    if (!newEvent.title.trim()) {
      toast({ title: 'Erreur', description: 'Veuillez entrer un titre', variant: 'destructive' });
      return;
    }

    const event: CalendarEvent = {
      id: Date.now(),
      title: newEvent.title,
      time: newEvent.time,
      duration: `${newEvent.duration} min`,
      type: newEvent.type,
      status: 'scheduled',
      date: selectedDate.toDateString(),
    };

    setEvents(prev => [...prev, event]);
    setIsDialogOpen(false);
    setNewEvent({ title: '', time: '09:00', duration: '15', type: 'meditation' });
    toast({ title: 'Événement ajouté', description: `${event.title} a été planifié.` });
  };

  const handleDeleteEvent = (id: number) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    toast({ title: 'Événement supprimé' });
  };

  const handleCompleteEvent = (id: number) => {
    setEvents(prev => prev.map(e => 
      e.id === id ? { ...e, status: 'completed' as const } : e
    ));
    toast({ title: 'Bravo ! 🎉', description: 'Activité marquée comme terminée.' });
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="container mx-auto py-8 px-4" data-testid="page-root">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Calendrier Bien-être</h1>
          <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400">
            <Target className="h-3 w-3 mr-1" />
            Planifié
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Organisez vos sessions de bien-être et suivez vos habitudes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendrier principal */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={goToToday}>
                    Aujourd'hui
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {weekDays.map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                  const isToday = day.date.toDateString() === new Date().toDateString();
                  const isSelected = day.date.toDateString() === selectedDate.toDateString();
                  const dayEvents = getEventsForDate(day.date);
                  const hasEvents = dayEvents.length > 0;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(day.date)}
                      className={`
                        relative h-12 text-sm rounded-lg transition-colors
                        ${day.isCurrentMonth ? 'text-foreground hover:bg-muted' : 'text-muted-foreground'}
                        ${isToday ? 'bg-primary text-primary-foreground font-semibold' : ''}
                        ${isSelected && !isToday ? 'bg-muted ring-2 ring-primary' : ''}
                      `}
                    >
                      {day.date.getDate()}
                      {hasEvents && (
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                          {dayEvents.slice(0, 3).map((_, i) => (
                            <div key={i} className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-primary-foreground' : 'bg-primary'}`} />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panneau latéral */}
        <div>
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {selectedDate.toDateString() === new Date().toDateString() ? "Aujourd'hui" : 'Événements'}
                </CardTitle>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nouvel événement</DialogTitle>
                      <DialogDescription>
                        Planifiez une activité pour le {selectedDate.toLocaleDateString('fr-FR')}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Titre</Label>
                        <Input 
                          id="title"
                          value={newEvent.title}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Ex: Méditation du matin"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="time">Heure</Label>
                          <Input 
                            id="time"
                            type="time"
                            value={newEvent.time}
                            onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="duration">Durée (min)</Label>
                          <Select 
                            value={newEvent.duration}
                            onValueChange={(v) => setNewEvent(prev => ({ ...prev, duration: v }))}
                          >
                            <SelectTrigger id="duration">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5">5 min</SelectItem>
                              <SelectItem value="10">10 min</SelectItem>
                              <SelectItem value="15">15 min</SelectItem>
                              <SelectItem value="20">20 min</SelectItem>
                              <SelectItem value="30">30 min</SelectItem>
                              <SelectItem value="45">45 min</SelectItem>
                              <SelectItem value="60">1 heure</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label>Type d'activité</Label>
                        <Select 
                          value={newEvent.type}
                          onValueChange={(v) => setNewEvent(prev => ({ ...prev, type: v as CalendarEvent['type'] }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="meditation">🧘 Méditation</SelectItem>
                            <SelectItem value="wellness">💚 Bien-être</SelectItem>
                            <SelectItem value="journal">📔 Journal</SelectItem>
                            <SelectItem value="music">🎵 Musique</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                      <Button onClick={handleAddEvent}>Ajouter</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <CardDescription>
                {selectedDate.toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedDateEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg border group">
                  <div className="mt-1">
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{event.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {event.time} • {event.duration}
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {event.status !== 'completed' && (
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleCompleteEvent(event.id)}>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </Button>
                    )}
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleDeleteEvent(event.id)}>
                      <X className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="mt-1">
                    {getStatusIcon(event.status)}
                  </div>
                </div>
              ))}
              
              {selectedDateEvents.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucun événement prévu</p>
                  <Button variant="link" size="sm" onClick={() => setIsDialogOpen(true)}>
                    Ajouter une activité
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Actions Rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  setNewEvent(prev => ({ ...prev, type: 'meditation', title: 'Méditation' }));
                  setIsDialogOpen(true);
                }}
              >
                <Brain className="h-4 w-4 mr-2" />
                Planifier méditation
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  setNewEvent(prev => ({ ...prev, type: 'wellness', title: 'Pause bien-être' }));
                  setIsDialogOpen(true);
                }}
              >
                <Heart className="h-4 w-4 mr-2" />
                Pause bien-être
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  setNewEvent(prev => ({ ...prev, type: 'music', title: 'Session musicale' }));
                  setIsDialogOpen(true);
                }}
              >
                <Music className="h-4 w-4 mr-2" />
                Session musicale
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  setNewEvent(prev => ({ ...prev, type: 'journal', title: 'Journal émotionnel' }));
                  setIsDialogOpen(true);
                }}
              >
                <Target className="h-4 w-4 mr-2" />
                Journal émotionnel
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;