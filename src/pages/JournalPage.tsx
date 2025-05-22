
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Edit2, Trash2, PlusCircle, BarChart2, BookOpen } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface JournalEntry {
  id: string;
  date: Date;
  content: string;
  mood: 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
  tags: string[];
}

const mockEntries: JournalEntry[] = [
  {
    id: '1',
    date: new Date(2025, 4, 21), // 21 mai 2025
    content: "Aujourd'hui, j'ai réussi à terminer le projet sur lequel je travaillais depuis des semaines. Je me sens vraiment satisfait de ce que j'ai accompli et la réaction de mon manager a été très positive.",
    mood: 'great',
    tags: ['travail', 'accomplissement']
  },
  {
    id: '2',
    date: new Date(2025, 4, 20), // 20 mai 2025
    content: "La journée a été assez standard. Quelques réunions, du travail sur mes tâches habituelles. Rien de spécial à signaler.",
    mood: 'neutral',
    tags: ['travail', 'routine']
  },
  {
    id: '3',
    date: new Date(2025, 4, 19), // 19 mai 2025
    content: "J'ai eu du mal à me concentrer aujourd'hui. Les interruptions constantes et la pression des délais m'ont causé beaucoup de stress. Je dois trouver une meilleure façon de gérer ces situations.",
    mood: 'bad',
    tags: ['stress', 'travail']
  }
];

const JournalPage: React.FC = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<JournalEntry['mood']>('neutral');
  const [entries, setEntries] = useState<JournalEntry[]>(mockEntries);
  
  const handleSaveEntry = () => {
    if (!date || !content || !mood) {
      toast({
        title: "Information manquante",
        description: "Veuillez remplir tous les champs requis",
        variant: "destructive"
      });
      return;
    }
    
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date,
      content,
      mood,
      tags: ['journal']
    };
    
    setEntries([newEntry, ...entries]);
    setContent('');
    setMood('neutral');
    
    toast({
      title: "Entrée enregistrée",
      description: "Votre entrée de journal a été sauvegardée"
    });
  };
  
  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
    
    toast({
      title: "Entrée supprimée",
      description: "L'entrée de journal a été supprimée"
    });
  };
  
  const handleEditEntry = (entry: JournalEntry) => {
    setDate(entry.date);
    setContent(entry.content);
    setMood(entry.mood);
    handleDeleteEntry(entry.id);
    
    toast({
      title: "Entrée prête à être modifiée",
      description: "Vous pouvez maintenant modifier et sauvegarder l'entrée"
    });
  };
  
  const getMoodEmoji = (mood: JournalEntry['mood']): string => {
    switch (mood) {
      case 'great': return '😁';
      case 'good': return '🙂';
      case 'neutral': return '😐';
      case 'bad': return '😟';
      case 'terrible': return '😩';
      default: return '😐';
    }
  };
  
  return (
    <div className="container px-4 py-6 mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Journal émotionnel</h1>
          <p className="text-muted-foreground">Suivez vos émotions et réflexions quotidiennes</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => toast({
            title: "Rapports",
            description: "Les rapports d'analyse seront disponibles prochainement"
          })}>
            <BarChart2 className="mr-2 h-4 w-4" />
            Rapports
          </Button>
          <Button variant="default">
            <BookOpen className="mr-2 h-4 w-4" />
            Guide
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="journal" className="space-y-6">
        <TabsList>
          <TabsTrigger value="journal">Mon journal</TabsTrigger>
          <TabsTrigger value="new">Nouvelle entrée</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="journal" className="space-y-4">
          {entries.length > 0 ? (
            <div className="space-y-4">
              {entries.map((entry) => (
                <Card key={entry.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                        <CardTitle className="text-lg">
                          {format(entry.date, 'EEEE d MMMM yyyy', { locale: fr })}
                        </CardTitle>
                      </div>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEditEntry(entry)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteEntry(entry.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{entry.content}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {entry.tags.map((tag, i) => (
                        <span 
                          key={i} 
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4 text-center">
                  Vous n'avez pas encore d'entrées dans votre journal.
                </p>
                <Button onClick={() => document.getElementById('new-tab')?.click()}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Créer une entrée
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle>Nouvelle entrée</CardTitle>
              <CardDescription>Exprimez vos pensées et émotions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP', { locale: fr }) : <span>Choisir une date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mood">Comment vous sentez-vous ?</Label>
                <Select value={mood} onValueChange={(value) => setMood(value as JournalEntry['mood'])}>
                  <SelectTrigger id="mood">
                    <SelectValue placeholder="Choisissez votre humeur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="great">Excellent 😁</SelectItem>
                    <SelectItem value="good">Bien 🙂</SelectItem>
                    <SelectItem value="neutral">Neutre 😐</SelectItem>
                    <SelectItem value="bad">Pas bien 😟</SelectItem>
                    <SelectItem value="terrible">Terrible 😩</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Votre journée</Label>
                <Textarea
                  id="content"
                  placeholder="Qu'avez-vous ressenti aujourd'hui ? Quels événements ont marqué votre journée ?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-32"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleSaveEntry}>Enregistrer</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tendances émotionnelles</CardTitle>
                <CardDescription>Évolution de votre humeur sur le temps</CardDescription>
              </CardHeader>
              <CardContent className="h-60 flex items-center justify-center">
                <p className="text-muted-foreground text-center">
                  Les graphiques d'analyse seront disponibles après quelques jours d'utilisation du journal.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Facteurs d'influence</CardTitle>
                <CardDescription>Ce qui affecte votre bien-être</CardDescription>
              </CardHeader>
              <CardContent className="h-60 flex items-center justify-center">
                <p className="text-muted-foreground text-center">
                  L'analyse des facteurs d'influence sera disponible après quelques semaines d'utilisation.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JournalPage;
