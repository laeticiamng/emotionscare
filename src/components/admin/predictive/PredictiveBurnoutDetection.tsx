import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ArrowUpRight, Bell, RefreshCw, Shield } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

// Risk level data for the chart
const riskData = [
  { date: 'Lun', équipeA: 25, équipeB: 30, équipeC: 45 },
  { date: 'Mar', équipeA: 30, équipeB: 28, équipeC: 48 },
  { date: 'Mer', équipeA: 35, équipeB: 32, équipeC: 52 },
  { date: 'Jeu', équipeA: 40, équipeB: 35, équipeC: 55 },
  { date: 'Ven', équipeA: 42, équipeB: 32, équipeC: 58 },
  { date: 'Sam', équipeA: 38, équipeB: 30, équipeC: 60 },
  { date: 'Dim', équipeA: 33, équipeB: 28, équipeC: 65 },
];

// Risk factors for employees
const riskFactors = [
  { factor: 'Heures supplémentaires', percentage: 35 },
  { factor: 'Changements rapides', percentage: 28 },
  { factor: 'Manque de reconnaissance', percentage: 22 },
  { factor: 'Surcharge de travail', percentage: 15 },
];

interface Employee {
  id: string;
  name: string;
  department: string;
  riskScore: number;
  indicators: string[];
}

// At-risk employees for the demonstration
const atRiskEmployees: Employee[] = [
  {
    id: 'emp-1',
    name: 'Jean Dupont',
    department: 'Marketing',
    riskScore: 78,
    indicators: ['Heures supplémentaires', 'Baisse de performance']
  },
  {
    id: 'emp-2',
    name: 'Marie Lambert',
    department: 'Développement',
    riskScore: 82,
    indicators: ['Connexions tardives', 'Absentéisme']
  },
  {
    id: 'emp-3',
    name: 'Thomas Leclerc',
    department: 'Ressources Humaines',
    riskScore: 75,
    indicators: ['Isolement', 'Réponses retardées']
  },
];

const PredictiveBurnoutDetection: React.FC = () => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Données actualisées",
        description: "Les indicateurs de risque ont été mis à jour"
      });
    }, 1500);
  };
  
  const handleSendAlert = (employee: Employee) => {
    toast({
      title: "Alerte envoyée",
      description: `Une alerte a été envoyée au responsable de ${employee.name}`
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Détection préventive de burnout</h2>
          <p className="text-muted-foreground">
            Anticipez les risques d'épuisement professionnel dans vos équipes
          </p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Risk Overview Card */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Évolution du risque par équipe</CardTitle>
            <CardDescription>
              Analyse de l'évolution du niveau de risque sur 7 jours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={riskData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="équipeA" 
                    stackId="1" 
                    stroke="#10b981" 
                    fill="#10b981" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="équipeB" 
                    stackId="2" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="équipeC" 
                    stackId="3" 
                    stroke="#f59e0b" 
                    fill="#f59e0b" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between text-sm text-muted-foreground">
            <div>Risque moyen: 45%</div>
            <div>Dernière actualisation: Aujourd'hui, 14:30</div>
          </CardFooter>
        </Card>
        
        {/* Risk Factors Card */}
        <Card>
          <CardHeader>
            <CardTitle>Facteurs de risque</CardTitle>
            <CardDescription>
              Principaux facteurs contribuant au risque
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskFactors.map((factor, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <div className="text-sm font-medium">{factor.factor}</div>
                    <div className="text-sm text-muted-foreground">{factor.percentage}%</div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary rounded-full h-2"
                      style={{ width: `${factor.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Shield className="mr-2 h-4 w-4" />
              Consulter le plan de prévention
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 text-destructive" />
            Collaborateurs à risque élevé
          </CardTitle>
          <CardDescription>
            Personnes identifiées par le système comme présentant des risques d'épuisement professionnel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {atRiskEmployees.map((employee) => (
              <div key={employee.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{employee.name}</h3>
                    <div className="text-sm text-muted-foreground">
                      {employee.department}
                    </div>
                  </div>
                  <Badge className="bg-red-500">{employee.riskScore}% de risque</Badge>
                </div>
                
                <Separator className="my-3" />
                
                <div className="mb-3">
                  <h4 className="text-sm font-medium mb-1">Indicateurs détectés:</h4>
                  <div className="flex flex-wrap gap-2">
                    {employee.indicators.map((indicator, index) => (
                      <Badge key={index} variant="outline">{indicator}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-2 justify-end mt-2">
                  <Button variant="outline" size="sm" onClick={() => handleSendAlert(employee)}>
                    <Bell className="mr-2 h-3.5 w-3.5" />
                    Alerter responsable
                  </Button>
                  <Button variant="default" size="sm">
                    <ArrowUpRight className="mr-2 h-3.5 w-3.5" />
                    Plan d'action
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictiveBurnoutDetection;
