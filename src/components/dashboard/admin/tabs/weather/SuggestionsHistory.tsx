// @ts-nocheck

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Download, Search, CloudSun, Sun, CloudRain, BarChart2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Types pour l'historique des suggestions
interface SuggestionHistoryEntry {
  id: string;
  date: Date;
  userId?: string;
  userName?: string;
  weatherCondition: string;
  temperature: number;
  activity: string;
  activityType: string;
  userFeedback?: 'positive' | 'neutral' | 'negative';
}

// Données démo pour l'historique
const mockHistoryData: SuggestionHistoryEntry[] = [
  {
    id: '1',
    date: new Date(2025, 4, 5, 9, 35),
    userId: 'u123',
    userName: 'Sophie Martin',
    weatherCondition: 'sunny',
    temperature: 24,
    activity: 'Yoga en plein air',
    activityType: 'Extérieur',
    userFeedback: 'positive'
  },
  {
    id: '2',
    date: new Date(2025, 4, 5, 10, 12),
    userId: 'u456',
    userName: 'Thomas Dubois',
    weatherCondition: 'cloudy',
    temperature: 18,
    activity: 'Méditation guidée',
    activityType: 'Intérieur',
    userFeedback: 'neutral'
  },
  {
    id: '3',
    date: new Date(2025, 4, 4, 14, 20),
    userId: 'u789',
    userName: 'Émilie Bernard',
    weatherCondition: 'rainy',
    temperature: 15,
    activity: 'Séance de lecture',
    activityType: 'Intérieur',
    userFeedback: 'positive'
  },
  {
    id: '4',
    date: new Date(2025, 4, 4, 11, 5),
    userId: 'u234',
    userName: 'Lucas Petit',
    weatherCondition: 'sunny',
    temperature: 22,
    activity: 'Marche rapide',
    activityType: 'Extérieur',
    userFeedback: 'negative'
  },
  {
    id: '5',
    date: new Date(2025, 4, 3, 16, 45),
    userId: 'u567',
    userName: 'Julie Moreau',
    weatherCondition: 'cloudy',
    temperature: 19,
    activity: 'Exercices d\'étirement',
    activityType: 'Intérieur',
    userFeedback: 'positive'
  }
];

const SuggestionsHistory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [activityTypeFilter, setActivityTypeFilter] = useState('all');
  const [feedbackFilter, setFeedbackFilter] = useState('all');

  // Icône pour la condition météo
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="w-4 h-4 text-yellow-500" />;
      case 'cloudy':
        return <CloudSun className="w-4 h-4 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="w-4 h-4 text-blue-500" />;
      default:
        return <CloudSun className="w-4 h-4" />;
    }
  };

  // Badge pour le feedback
  const getFeedbackBadge = (feedback?: 'positive' | 'neutral' | 'negative') => {
    switch (feedback) {
      case 'positive':
        return <Badge className="bg-green-500">Positif</Badge>;
      case 'neutral':
        return <Badge variant="outline">Neutre</Badge>;
      case 'negative':
        return <Badge variant="destructive">Négatif</Badge>;
      default:
        return <Badge variant="outline">Non évalué</Badge>;
    }
  };

  // Filtrage des données
  const filteredHistory = mockHistoryData.filter(entry => {
    const matchesSearch = !searchQuery || 
      entry.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.activity.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDate = !dateFilter || 
      (entry.date.getDate() === dateFilter.getDate() && 
       entry.date.getMonth() === dateFilter.getMonth() &&
       entry.date.getFullYear() === dateFilter.getFullYear());
    
    const matchesActivityType = activityTypeFilter === 'all' || 
      entry.activityType.toLowerCase() === activityTypeFilter.toLowerCase();
    
    const matchesFeedback = feedbackFilter === 'all' || 
      entry.userFeedback === feedbackFilter || 
      (feedbackFilter === 'none' && !entry.userFeedback);
    
    return matchesSearch && matchesDate && matchesActivityType && matchesFeedback;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Historique des suggestions</CardTitle>
            <CardDescription>
              Suivez les suggestions d'activités faites aux utilisateurs et leurs retours
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Recherche */}
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par utilisateur ou activité..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Filtre par date */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-shrink-0 w-[240px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFilter ? format(dateFilter, 'PPP', { locale: fr }) : "Filtrer par date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateFilter}
                    onSelect={setDateFilter}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              {/* Filtre par type d'activité */}
              <Select 
                value={activityTypeFilter} 
                onValueChange={setActivityTypeFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Type d'activité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="intérieur">Intérieur</SelectItem>
                  <SelectItem value="extérieur">Extérieur</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Filtre par feedback */}
              <Select 
                value={feedbackFilter} 
                onValueChange={setFeedbackFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Feedback utilisateur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les feedbacks</SelectItem>
                  <SelectItem value="positive">Positif</SelectItem>
                  <SelectItem value="neutral">Neutre</SelectItem>
                  <SelectItem value="negative">Négatif</SelectItem>
                  <SelectItem value="none">Non évalué</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {dateFilter && (
              <div className="flex items-center">
                <Badge variant="outline" className="mr-2">
                  {format(dateFilter, 'dd/MM/yyyy', { locale: fr })}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setDateFilter(undefined)}
                  className="h-7 px-2 text-xs"
                >
                  Effacer
                </Button>
              </div>
            )}
            
            <div className="rounded-md border">
              <Table>
                <TableCaption>Historique des suggestions d'activités</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date et heure</TableHead>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Conditions météo</TableHead>
                    <TableHead>Activité suggérée</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Feedback</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        {format(entry.date, 'dd/MM/yyyy HH:mm', { locale: fr })}
                      </TableCell>
                      <TableCell>{entry.userName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getWeatherIcon(entry.weatherCondition)}
                          <span>{entry.temperature}°C</span>
                        </div>
                      </TableCell>
                      <TableCell>{entry.activity}</TableCell>
                      <TableCell>
                        <Badge variant={entry.activityType === 'Extérieur' ? 'default' : 'outline'}>
                          {entry.activityType}
                        </Badge>
                      </TableCell>
                      <TableCell>{getFeedbackBadge(entry.userFeedback)}</TableCell>
                    </TableRow>
                  ))}
                  
                  {filteredHistory.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Aucun résultat trouvé pour ces critères de recherche.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline" size="sm" className="gap-1">
                <BarChart2 className="h-4 w-4" />
                Voir les statistiques
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuggestionsHistory;
