
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { CalendarIcon, Clock, Check } from 'lucide-react';
import { toast } from 'sonner';

// Mock data for VR environments
const vrEnvironments = [
  { id: 'forest', name: 'Forêt apaisante', description: 'Un environnement forestier calme avec des sons de la nature', duration: 15 },
  { id: 'beach', name: 'Plage tranquille', description: 'Une plage déserte avec le bruit apaisant des vagues', duration: 20 },
  { id: 'mountain', name: 'Montagne paisible', description: 'Un panorama montagneux avec une vue dégagée', duration: 15 },
  { id: 'garden', name: 'Jardin zen', description: 'Un jardin japonais traditionnel avec un étang', duration: 25 },
  { id: 'space', name: 'Cosmos relaxant', description: 'Une expérience spatiale calme avec des nébuleuses', duration: 20 },
];

// Mock scheduled sessions
const scheduledSessions = [
  { id: 1, date: new Date('2025-05-25'), time: '14:30', environment: 'Forêt apaisante', duration: 15 },
  { id: 2, date: new Date('2025-05-28'), time: '10:00', environment: 'Plage tranquille', duration: 20 },
];

const SessionsPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState('14:00');
  const [selectedEnvironment, setSelectedEnvironment] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(15);
  const [withMusic, setWithMusic] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  
  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  // Handle booking confirmation
  const handleBookSession = () => {
    if (!selectedDate || !selectedTime || !selectedEnvironment) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }
    
    setBookingConfirmed(true);
    setTimeout(() => {
      toast.success('Session réservée avec succès');
      setActiveTab('upcoming');
      setBookingConfirmed(false);
    }, 1500);
  };
  
  // Handle session cancellation
  const handleCancelSession = (sessionId: number) => {
    toast.success('Session annulée avec succès');
  };
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Mes Sessions</h1>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Sessions à venir</TabsTrigger>
          <TabsTrigger value="book">Réserver une session</TabsTrigger>
          <TabsTrigger value="past">Sessions passées</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          {scheduledSessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scheduledSessions.map(session => (
                <Card key={session.id}>
                  <CardHeader>
                    <CardTitle>{session.environment}</CardTitle>
                    <CardDescription>
                      {formatDate(session.date)} à {session.time}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{session.duration} minutes</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => handleCancelSession(session.id)}>
                      Annuler
                    </Button>
                    <Button>
                      Modifier
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8">
                <div className="text-center space-y-2">
                  <p className="text-muted-foreground">Vous n'avez pas de sessions à venir.</p>
                  <Button onClick={() => setActiveTab('book')}>
                    Réserver une session
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="book" className="space-y-4">
          {bookingConfirmed ? (
            <Card>
              <CardContent className="py-12 text-center space-y-4">
                <div className="mx-auto bg-green-100 dark:bg-green-900/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold">Réservation confirmée</h2>
                <p>Votre session VR a été planifiée avec succès.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Choisir une date et heure</CardTitle>
                    <CardDescription>
                      Sélectionnez quand vous souhaitez avoir votre session VR
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <Label>Date</Label>
                      </div>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 2))}
                        className="border rounded-md p-3"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        <Label htmlFor="session-time">Heure</Label>
                      </div>
                      <Select
                        value={selectedTime}
                        onValueChange={setSelectedTime}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une heure" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }).map((_, i) => {
                            const hour = 8 + i;
                            const time = `${hour < 10 ? '0' + hour : hour}:00`;
                            const time2 = `${hour < 10 ? '0' + hour : hour}:30`;
                            return (
                              <React.Fragment key={hour}>
                                <SelectItem value={time}>{time}</SelectItem>
                                <SelectItem value={time2}>{time2}</SelectItem>
                              </React.Fragment>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Choisir un environnement</CardTitle>
                    <CardDescription>
                      Sélectionnez l'environnement VR qui vous convient
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      {vrEnvironments.map((env) => (
                        <div 
                          key={env.id} 
                          className={`border rounded-md p-3 cursor-pointer transition-all ${selectedEnvironment === env.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
                          onClick={() => {
                            setSelectedEnvironment(env.id);
                            setSelectedDuration(env.duration);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{env.name}</h3>
                            <span className="text-sm text-muted-foreground">{env.duration} min</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{env.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Options supplémentaires</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="music-toggle">Musique d'ambiance</Label>
                        <p className="text-sm text-muted-foreground">Ajouter une musique relaxante</p>
                      </div>
                      <Switch
                        id="music-toggle"
                        checked={withMusic}
                        onCheckedChange={setWithMusic}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Durée de la session (minutes)</Label>
                        <span>{selectedDuration} min</span>
                      </div>
                      <Slider
                        value={[selectedDuration]}
                        min={5}
                        max={60}
                        step={5}
                        onValueChange={(value) => setSelectedDuration(value[0])}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={handleBookSession}
                      disabled={!selectedDate || !selectedTime || !selectedEnvironment}
                    >
                      Réserver cette session
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sessions passées</CardTitle>
              <CardDescription>
                Historique de vos sessions précédentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="font-medium">Forêt apaisante</h3>
                      <p className="text-sm text-muted-foreground">15 mai 2025, 14:30</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => window.location.href = '/vr-session/1'}>
                      Voir détails
                    </Button>
                  </div>
                  <div className="text-sm">Durée: 15 minutes</div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="font-medium">Plage tranquille</h3>
                      <p className="text-sm text-muted-foreground">12 mai 2025, 10:15</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => window.location.href = '/vr-session/2'}>
                      Voir détails
                    </Button>
                  </div>
                  <div className="text-sm">Durée: 20 minutes</div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="font-medium">Montagne paisible</h3>
                      <p className="text-sm text-muted-foreground">8 mai 2025, 16:45</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => window.location.href = '/vr-session/3'}>
                      Voir détails
                    </Button>
                  </div>
                  <div className="text-sm">Durée: 10 minutes</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SessionsPage;
