import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { TeamOverview } from './TeamOverview';
import { addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from "@/components/ui/button";
import { Download, Filter } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TeamTabContent: React.FC = () => {
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    startOfWeek(new Date(), { weekStartsOn: 1 }),
    endOfWeek(new Date(), { weekStartsOn: 1 })
  ]);
  
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');
  const [anonymized, setAnonymized] = useState(false);
  
  // Mock team data
  const mockUsers = [
    { id: '1', name: 'Sophie Martin', emotionalScore: 85, department: 'Marketing' },
    { id: '2', name: 'Thomas Dubois', emotionalScore: 72, department: 'Engineering' },
    { id: '3', name: 'Emma Lefebvre', emotionalScore: 91, department: 'Design' },
    { id: '4', name: 'Lucas Bernard', emotionalScore: 68, department: 'Sales' },
    { id: '5', name: 'Chloé Moreau', emotionalScore: 79, department: 'HR' },
    { id: '6', name: 'Hugo Petit', emotionalScore: { joy: 0.8, calm: 0.7, anxiety: 0.2 }, department: 'Product' },
  ];
  
  const handlePeriodChange = (value: string) => {
    const newPeriod = value as 'day' | 'week' | 'month';
    setPeriod(newPeriod);
    
    // Update date range based on period
    const today = new Date();
    switch (newPeriod) {
      case 'day':
        setDateRange([today, today]);
        break;
      case 'week':
        setDateRange([
          startOfWeek(today, { weekStartsOn: 1 }),
          endOfWeek(today, { weekStartsOn: 1 })
        ]);
        break;
      case 'month':
        setDateRange([startOfMonth(today), endOfMonth(today)]);
        break;
    }
  };
  
  const formatDateRange = (range: [Date, Date]) => {
    if (period === 'day') {
      return format(range[0], 'PPP', { locale: fr });
    }
    return `${format(range[0], 'PPP', { locale: fr })} - ${format(range[1], 'PPP', { locale: fr })}`;
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Vue d'ensemble de l'équipe</CardTitle>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Filtrer</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Filtres</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Tous les départements</DropdownMenuItem>
                  <DropdownMenuItem>Marketing</DropdownMenuItem>
                  <DropdownMenuItem>Engineering</DropdownMenuItem>
                  <DropdownMenuItem>Design</DropdownMenuItem>
                  <DropdownMenuItem>Sales</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Exporter</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <TabsList>
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="details">Détails</TabsTrigger>
                <TabsTrigger value="trends">Tendances</TabsTrigger>
              </TabsList>
              
              <div className="flex flex-wrap items-center gap-4">
                <Select value={period} onValueChange={handlePeriodChange}>
                  <SelectTrigger className="w-[120px] h-8">
                    <SelectValue placeholder="Période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Jour</SelectItem>
                    <SelectItem value="week">Semaine</SelectItem>
                    <SelectItem value="month">Mois</SelectItem>
                  </SelectContent>
                </Select>
                
                <DateRangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  align="end"
                  className="h-8"
                />
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="anonymize"
                    checked={anonymized}
                    onCheckedChange={setAnonymized}
                  />
                  <Label htmlFor="anonymize">Anonymiser</Label>
                </div>
              </div>
            </div>
            
            <TabsContent value="overview" className="space-y-4 pt-2">
              <TeamOverview
                teamId="team1"
                dateRange={dateRange}
                users={mockUsers}
                period={period}
                anonymized={anonymized}
                showNames={true}
              />
            </TabsContent>
            
            <TabsContent value="details">
              <div className="h-[300px] grid place-items-center border rounded-md">
                <p className="text-muted-foreground">Détails de l'équipe à venir</p>
              </div>
            </TabsContent>
            
            <TabsContent value="trends">
              <div className="h-[300px] grid place-items-center border rounded-md">
                <p className="text-muted-foreground">Tendances émotionnelles à venir</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Membres de l'équipe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {mockUsers.map(user => (
              <Card key={user.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 grid place-items-center">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{anonymized ? `Utilisateur ${user.id}` : user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.department}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamTabContent;
