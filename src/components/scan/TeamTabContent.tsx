
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-range-picker'; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User } from '@/types/user';
import TeamOverview from './TeamOverview';

interface TeamTabContentProps {
  companyId?: string;
}

const TeamTabContent: React.FC<TeamTabContentProps> = ({ companyId }) => {
  const [selectedView, setSelectedView] = useState('overview');
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    new Date()
  ]);
  const [teamUsers, setTeamUsers] = useState<any[]>([]);
  
  useEffect(() => {
    // Simulated API call to get users
    const fetchTeamUsers = async () => {
      // In a real app, this would fetch from an API
      setTimeout(() => {
        setTeamUsers([
          {
            id: 'user1',
            name: 'Alice Martin',
            email: 'alice@example.com',
            avatar_url: '',
            role: 'b2b_user',
            emotional_score: { joy: 0.8, calm: 0.6, focus: 0.7, anxiety: 0.2 }
          },
          {
            id: 'user2',
            name: 'Thomas Durand',
            email: 'thomas@example.com',
            avatar_url: '',
            role: 'b2b_user',
            emotional_score: { joy: 0.5, calm: 0.4, focus: 0.8, anxiety: 0.4 }
          },
          {
            id: 'user3',
            name: 'Emma Bernard',
            email: 'emma@example.com',
            avatar_url: '',
            role: 'b2b_user',
            emotional_score: { joy: 0.7, calm: 0.8, focus: 0.6, anxiety: 0.1 }
          }
        ]);
      }, 500);
    };
    
    fetchTeamUsers();
  }, [companyId]);
  
  return (
    <Card className="p-6">
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="space-y-1">
          <label className="text-sm font-medium">Période</label>
          <DateRangePicker 
            value={dateRange}
            onChange={setDateRange}
          />
        </div>
        
        <div className="space-y-1">
          <label className="text-sm font-medium">Type de données</label>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue placeholder="Type de données" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les émotions</SelectItem>
              <SelectItem value="happiness">Bonheur uniquement</SelectItem>
              <SelectItem value="stress">Stress uniquement</SelectItem>
              <SelectItem value="focus">Concentration uniquement</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-1">
          <label className="text-sm font-medium">Anonymiser les données</label>
          <div className="flex items-center mt-2">
            <input type="checkbox" id="anonymize" className="mr-2" />
            <label htmlFor="anonymize">Masquer les identités</label>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="overview" value={selectedView} onValueChange={setSelectedView}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="detailed">Vue détaillée</TabsTrigger>
          <TabsTrigger value="trends">Tendances</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <TeamOverview 
            dateRange={dateRange}
            users={teamUsers}
            period={`${dateRange[0].toLocaleDateString()} - ${dateRange[1].toLocaleDateString()}`}
            anonymized={false}
            showNames={true}
          />
        </TabsContent>
        
        <TabsContent value="detailed">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Vue détaillée des données émotionnelles de l'équipe</p>
          </div>
        </TabsContent>
        
        <TabsContent value="trends">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Analyse des tendances émotionnelles</p>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default TeamTabContent;
