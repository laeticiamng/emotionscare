// @ts-nocheck

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CloudSun, CloudRain, Sun, Trash2, Edit, Plus, ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';

// Types pour les règles météo-activité
interface WeatherRule {
  id: string;
  condition: string;
  minTemp?: number;
  maxTemp?: number;
  rainProbability?: number;
  activityId: string;
  priority: number;
  isActive: boolean;
}

// Données démo
const initialRules: WeatherRule[] = [
  {
    id: '1',
    condition: 'sunny',
    minTemp: 20,
    activityId: '1',
    priority: 1,
    isActive: true
  },
  {
    id: '2',
    condition: 'rainy',
    rainProbability: 80,
    activityId: '3',
    priority: 2,
    isActive: true
  },
  {
    id: '3',
    condition: 'cold',
    maxTemp: 10,
    activityId: '5',
    priority: 3,
    isActive: false
  }
];

// Données démo activités disponibles
const availableActivities = [
  { id: '1', name: 'Yoga en plein air', type: 'Extérieur' },
  { id: '2', name: 'Méditation guidée', type: 'Intérieur' },
  { id: '3', name: 'Séance de lecture', type: 'Intérieur' },
  { id: '4', name: 'Marche rapide', type: 'Extérieur' },
  { id: '5', name: 'Exercices d\'étirement', type: 'Intérieur' },
];

// Conditions météo disponibles
const weatherConditions = [
  { value: 'sunny', label: 'Ensoleillé', icon: <Sun className="w-4 h-4" /> },
  { value: 'cloudy', label: 'Nuageux', icon: <CloudSun className="w-4 h-4" /> },
  { value: 'rainy', label: 'Pluvieux', icon: <CloudRain className="w-4 h-4" /> },
  { value: 'cold', label: 'Froid', icon: <CloudSun className="w-4 h-4" /> },
];

const ActivityRulesList: React.FC = () => {
  const [rules, setRules] = useState<WeatherRule[]>(initialRules);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newRule, setNewRule] = useState<Partial<WeatherRule>>({
    condition: '',
    activityId: '',
    priority: 5,
    isActive: true
  });

  // Fonction pour récupérer l'icône de la condition météo
  const getWeatherIcon = (condition: string) => {
    const found = weatherConditions.find(c => c.value === condition);
    return found?.icon || <CloudSun className="w-4 h-4" />;
  };

  // Fonction pour récupérer le nom de l'activité
  const getActivityName = (id: string) => {
    const activity = availableActivities.find(a => a.id === id);
    return activity ? activity.name : 'Activité inconnue';
  };

  const handleAddRule = () => {
    if (!newRule.condition || !newRule.activityId) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const ruleToBeSaved = {
      ...newRule,
      id: Date.now().toString(),
      condition: newRule.condition,
      activityId: newRule.activityId,
      priority: newRule.priority || 5,
      isActive: newRule.isActive || true
    } as WeatherRule;

    setRules([...rules, ruleToBeSaved]);
    toast.success('Règle ajoutée avec succès');
    setIsAddDialogOpen(false);
    setNewRule({
      condition: '',
      activityId: '',
      priority: 5,
      isActive: true
    });
  };

  const toggleRuleStatus = (id: string) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
    ));
    toast.success('Statut de la règle mis à jour');
  };

  const deleteRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
    toast.success('Règle supprimée avec succès');
  };

  // Formatage des conditions pour affichage
  const formatCondition = (rule: WeatherRule) => {
    const parts = [];
    
    if (rule.minTemp !== undefined) {
      parts.push(`Temp. min: ${rule.minTemp}°C`);
    }
    
    if (rule.maxTemp !== undefined) {
      parts.push(`Temp. max: ${rule.maxTemp}°C`);
    }
    
    if (rule.rainProbability !== undefined) {
      parts.push(`Pluie: ${rule.rainProbability}%`);
    }
    
    return parts.join(', ');
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Règles météo-activité</CardTitle>
            <CardDescription>
              Définissez quand suggérer chaque activité en fonction des conditions météorologiques
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle règle
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Ajouter une règle météo</DialogTitle>
                <DialogDescription>
                  Définissez une nouvelle règle pour suggérer des activités en fonction de la météo.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Condition</FormLabel>
                  <div className="col-span-3">
                    <Select 
                      value={newRule.condition} 
                      onValueChange={(value) => setNewRule({ ...newRule, condition: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une condition" />
                      </SelectTrigger>
                      <SelectContent>
                        {weatherConditions.map(condition => (
                          <SelectItem key={condition.value} value={condition.value}>
                            <div className="flex items-center">
                              {condition.icon}
                              <span className="ml-2">{condition.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {(newRule.condition === 'sunny' || newRule.condition === 'cold') && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">
                      {newRule.condition === 'sunny' ? 'Temp. minimale (°C)' : 'Temp. maximale (°C)'}
                    </FormLabel>
                    <div className="col-span-3">
                      <Input 
                        type="number"
                        value={newRule.condition === 'sunny' ? newRule.minTemp || '' : newRule.maxTemp || ''} 
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (newRule.condition === 'sunny') {
                            setNewRule({ ...newRule, minTemp: value });
                          } else {
                            setNewRule({ ...newRule, maxTemp: value });
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
                {newRule.condition === 'rainy' && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Probabilité pluie (%)</FormLabel>
                    <div className="col-span-3">
                      <Input 
                        type="number"
                        min="0"
                        max="100"
                        value={newRule.rainProbability || ''} 
                        onChange={(e) => setNewRule({ ...newRule, rainProbability: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Activité</FormLabel>
                  <div className="col-span-3">
                    <Select 
                      value={newRule.activityId} 
                      onValueChange={(value) => setNewRule({ ...newRule, activityId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une activité" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableActivities.map(activity => (
                          <SelectItem key={activity.id} value={activity.id}>
                            {activity.name} ({activity.type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Priorité</FormLabel>
                  <div className="col-span-3">
                    <Input 
                      type="number"
                      min="1"
                      max="10"
                      value={newRule.priority || ''} 
                      onChange={(e) => setNewRule({ ...newRule, priority: parseInt(e.target.value) })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      1 = haute priorité, 10 = basse priorité
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Activer</FormLabel>
                  <div className="col-span-3">
                    <Switch 
                      checked={newRule.isActive} 
                      onCheckedChange={(checked) => setNewRule({ ...newRule, isActive: checked })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddRule}>
                  Ajouter la règle
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Liste des règles pour les suggestions météo</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">
                  <div className="flex items-center">
                    Condition
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Seuils</TableHead>
                <TableHead>Activité suggérée</TableHead>
                <TableHead className="text-center">Priorité</TableHead>
                <TableHead className="text-center">Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getWeatherIcon(rule.condition)}
                      <span className="capitalize">
                        {weatherConditions.find(c => c.value === rule.condition)?.label || rule.condition}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{formatCondition(rule)}</TableCell>
                  <TableCell>{getActivityName(rule.activityId)}</TableCell>
                  <TableCell className="text-center">{rule.priority}</TableCell>
                  <TableCell className="text-center">
                    <Switch 
                      checked={rule.isActive} 
                      onCheckedChange={() => toggleRuleStatus(rule.id)}
                      aria-label={rule.isActive ? "Désactiver cette règle" : "Activer cette règle"}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button size="icon" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => deleteRule(rule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {rules.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    Aucune règle définie. Cliquez sur "Nouvelle règle" pour en ajouter une.
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

export default ActivityRulesList;
