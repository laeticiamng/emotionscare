// @ts-nocheck

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

interface Activity {
  id: string;
  name: string;
  type: 'Intérieur' | 'Extérieur';
  description: string;
}

// Données démo
const initialActivities: Activity[] = [
  { 
    id: '1', 
    name: 'Yoga en plein air', 
    type: 'Extérieur',
    description: 'Session de yoga à l\'extérieur pour profiter du beau temps et se reconnecter avec la nature.'
  },
  { 
    id: '2', 
    name: 'Méditation guidée', 
    type: 'Intérieur',
    description: 'Session de méditation guidée pour favoriser le calme et la concentration.'
  },
  { 
    id: '3', 
    name: 'Séance de lecture', 
    type: 'Intérieur',
    description: 'Moment de détente avec un livre pour stimuler l\'esprit et réduire le stress.'
  },
  { 
    id: '4', 
    name: 'Marche rapide', 
    type: 'Extérieur',
    description: 'Marche à rythme soutenu pour améliorer la circulation et la santé cardiovasculaire.'
  },
  { 
    id: '5', 
    name: 'Exercices d\'étirement', 
    type: 'Intérieur',
    description: 'Série d\'étirements pour améliorer la souplesse et réduire les tensions musculaires.'
  },
];

const ActivitiesCatalog: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'Tous' | 'Intérieur' | 'Extérieur'>('Tous');
  const [newActivity, setNewActivity] = useState<Omit<Activity, 'id'>>({
    name: '',
    type: 'Intérieur',
    description: ''
  });

  const handleAddActivity = () => {
    if (!newActivity.name || !newActivity.description) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const activityToSave = {
      ...newActivity,
      id: Date.now().toString()
    };

    setActivities([...activities, activityToSave]);
    toast.success('Activité ajoutée avec succès');
    setIsAddDialogOpen(false);
    setNewActivity({
      name: '',
      type: 'Intérieur',
      description: ''
    });
  };

  const handleDeleteActivity = (id: string) => {
    setActivities(activities.filter(activity => activity.id !== id));
    toast.success('Activité supprimée avec succès');
  };

  // Filtrage des activités
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'Tous' || activity.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Catalogue d'Activités</CardTitle>
            <CardDescription>
              Gérez les activités qui peuvent être suggérées en fonction des conditions météorologiques
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle activité
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Ajouter une activité</DialogTitle>
                <DialogDescription>
                  Créez une nouvelle activité qui pourra être suggérée aux utilisateurs
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nom de l'activité</Label>
                  <Input
                    id="name"
                    value={newActivity.name}
                    onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                    placeholder="Ex: Yoga en plein air"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Type d'activité</Label>
                  <Tabs 
                    defaultValue={newActivity.type} 
                    onValueChange={(value) => setNewActivity({ ...newActivity, type: value as 'Intérieur' | 'Extérieur' })}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="Intérieur">Intérieur</TabsTrigger>
                      <TabsTrigger value="Extérieur">Extérieur</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newActivity.description}
                    onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                    placeholder="Décrivez brièvement cette activité..."
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddActivity}>
                  Ajouter l'activité
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une activité..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Tabs 
              defaultValue="Tous" 
              value={filter}
              onValueChange={(value) => setFilter(value as 'Tous' | 'Intérieur' | 'Extérieur')}
            >
              <TabsList>
                <TabsTrigger value="Tous">Tous</TabsTrigger>
                <TabsTrigger value="Intérieur">Intérieur</TabsTrigger>
                <TabsTrigger value="Extérieur">Extérieur</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <Table>
            <TableCaption>Liste des activités disponibles</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="w-[400px]">Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">{activity.name}</TableCell>
                  <TableCell>
                    <Badge variant={activity.type === 'Extérieur' ? 'default' : 'outline'}>
                      {activity.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {activity.description}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button size="icon" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => handleDeleteActivity(activity.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredActivities.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    Aucune activité ne correspond à votre recherche.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivitiesCatalog;
