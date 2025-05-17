
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Radio, RadioGroup, RadioIndicator, RadioItem } from '@/components/ui/radio';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import TeamOverview from './TeamOverview';

type Period = 'day' | 'week' | 'month';

const TeamTabContent: React.FC = () => {
  const [selectedTeamId, setSelectedTeamId] = useState<string>('all');
  const [period, setPeriod] = useState<Period>('week');
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    new Date(new Date().setDate(new Date().getDate() - 7)),
    new Date()
  ]);
  const [anonymized, setAnonymized] = useState(false);
  const [showNames, setShowNames] = useState(true);
  
  // Données de démonstration
  const teams = [
    { id: 'team1', name: 'Équipe Marketing' },
    { id: 'team2', name: 'Équipe Développement' },
    { id: 'team3', name: 'Équipe RH' }
  ];
  
  const mockUsers = [
    {
      id: 'user1',
      name: 'Jean Dupont',
      teamId: 'team1',
      emotionalScore: 85,
      lastActive: '2023-05-15'
    },
    {
      id: 'user2',
      name: 'Marie Martin',
      teamId: 'team1',
      emotionalScore: 72,
      lastActive: '2023-05-16'
    },
    {
      id: 'user3',
      name: 'Pierre Bernard',
      teamId: 'team2',
      emotionalScore: 90,
      lastActive: '2023-05-14'
    },
    {
      id: 'user4',
      name: 'Sophie Petit',
      teamId: 'team2',
      emotionalScore: 68,
      lastActive: '2023-05-17'
    },
    {
      id: 'user5',
      name: 'Thomas Robert',
      teamId: 'team3',
      emotionalScore: 79,
      lastActive: '2023-05-15'
    }
  ];
  
  // Filtrer les utilisateurs par équipe sélectionnée
  const filteredUsers = selectedTeamId === 'all'
    ? mockUsers
    : mockUsers.filter(user => user.teamId === selectedTeamId);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="analytics">Analytique</TabsTrigger>
              <TabsTrigger value="charts">Graphiques</TabsTrigger>
            </TabsList>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="team-select">Équipe</Label>
                  <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
                    <SelectTrigger id="team-select">
                      <SelectValue placeholder="Sélectionner une équipe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les équipes</SelectItem>
                      {teams.map(team => (
                        <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Période</Label>
                  <RadioGroup value={period} onValueChange={(value) => setPeriod(value as Period)} className="flex flex-col space-y-1 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioItem value="day" id="period-day" />
                      <Label htmlFor="period-day">Jour</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioItem value="week" id="period-week" />
                      <Label htmlFor="period-week">Semaine</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioItem value="month" id="period-month" />
                      <Label htmlFor="period-month">Mois</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label>Plage de dates</Label>
                  <DateRangePicker 
                    value={dateRange} 
                    onChange={setDateRange} 
                    className="w-full mt-1"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="anonymize" 
                      checked={anonymized}
                      onCheckedChange={setAnonymized}
                    />
                    <Label htmlFor="anonymize">Anonymiser les données</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="showNames" 
                      checked={showNames}
                      onCheckedChange={setShowNames}
                      disabled={anonymized}
                    />
                    <Label htmlFor="showNames">Afficher les noms</Label>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-3">
                <TabsContent value="overview">
                  <TeamOverview 
                    teamId={selectedTeamId !== 'all' ? selectedTeamId : undefined}
                    dateRange={dateRange}
                    users={filteredUsers}
                    period={period}
                    anonymized={false}
                    showNames={true}
                  />
                </TabsContent>
                
                <TabsContent value="analytics">
                  <div className="text-muted-foreground text-center py-12">
                    Module d'analytique en développement
                  </div>
                </TabsContent>
                
                <TabsContent value="charts">
                  <div className="text-muted-foreground text-center py-12">
                    Module de graphiques en développement
                  </div>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamTabContent;
