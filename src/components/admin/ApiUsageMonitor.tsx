
/**
 * Composant ApiUsageMonitor
 * 
 * Tableau de bord pour surveiller l'utilisation des différentes API.
 * Fonctionnalité premium pour les administrateurs.
 */
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar
} from 'recharts';
import { ApiUseActivity } from '@/types';

// Données simulées pour démonstration
const mockApiUsage: ApiUseActivity[] = [
  { date: '2023-01-01', openai: 120, whisper: 45, musicgen: 22, humeai: 15, dalle: 30 },
  { date: '2023-01-02', openai: 145, whisper: 50, musicgen: 28, humeai: 18, dalle: 35 },
  { date: '2023-01-03', openai: 130, whisper: 42, musicgen: 25, humeai: 20, dalle: 28 },
  { date: '2023-01-04', openai: 150, whisper: 48, musicgen: 30, humeai: 22, dalle: 32 },
  { date: '2023-01-05', openai: 160, whisper: 52, musicgen: 35, humeai: 25, dalle: 40 },
  { date: '2023-01-06', openai: 175, whisper: 58, musicgen: 38, humeai: 30, dalle: 45 },
  { date: '2023-01-07', openai: 190, whisper: 62, musicgen: 42, humeai: 32, dalle: 48 },
];

interface ApiQuota {
  api: string;
  used: number;
  limit: number;
  percentage: number;
  status: 'good' | 'warning' | 'critical';
}

// Quotas simulés pour démonstration
const quotas: ApiQuota[] = [
  { api: 'OpenAI', used: 8500, limit: 10000, percentage: 85, status: 'warning' },
  { api: 'Whisper', used: 2200, limit: 5000, percentage: 44, status: 'good' },
  { api: 'MusicGen', used: 950, limit: 1000, percentage: 95, status: 'critical' },
  { api: 'Hume AI', used: 1800, limit: 3000, percentage: 60, status: 'good' },
  { api: 'DALL-E', used: 2800, limit: 5000, percentage: 56, status: 'good' },
];

const errorRates = [
  { api: 'OpenAI', success: 97.5, error: 2.5 },
  { api: 'Whisper', success: 96.2, error: 3.8 },
  { api: 'MusicGen', success: 94.8, error: 5.2 },
  { api: 'Hume AI', success: 98.1, error: 1.9 },
  { api: 'DALL-E', success: 95.5, error: 4.5 },
];

interface ApiUsageMonitorProps {
  className?: string;
}

const ApiUsageMonitor: React.FC<ApiUsageMonitorProps> = ({ className = '' }) => {
  const [timeRange, setTimeRange] = useState('7d');
  
  // Obtenir la couleur en fonction du statut de quota
  const getQuotaColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-500';
      case 'warning': return 'bg-amber-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  return (
    <Card className={`${className} overflow-hidden`}>
      <CardHeader>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <CardTitle className="text-xl">Surveillance des API</CardTitle>
            <CardDescription>
              Moniteur d'utilisation, quotas et performances des API
            </CardDescription>
          </div>
          <Select defaultValue={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Dernières 24h</SelectItem>
              <SelectItem value="7d">7 derniers jours</SelectItem>
              <SelectItem value="30d">30 derniers jours</SelectItem>
              <SelectItem value="90d">90 derniers jours</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="px-2 sm:px-6">
        <Tabs defaultValue="usage">
          <TabsList className="mb-6">
            <TabsTrigger value="usage">Utilisation</TabsTrigger>
            <TabsTrigger value="quotas">Quotas</TabsTrigger>
            <TabsTrigger value="errors">Erreurs</TabsTrigger>
            <TabsTrigger value="costs">Coûts</TabsTrigger>
          </TabsList>
          
          {/* Onglet d'utilisation */}
          <TabsContent value="usage" className="space-y-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={mockApiUsage}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="openai" stroke="#3b82f6" name="OpenAI" />
                  <Line type="monotone" dataKey="whisper" stroke="#10b981" name="Whisper" />
                  <Line type="monotone" dataKey="musicgen" stroke="#8b5cf6" name="MusicGen" />
                  <Line type="monotone" dataKey="humeai" stroke="#f59e0b" name="Hume AI" />
                  <Line type="monotone" dataKey="dalle" stroke="#ef4444" name="DALL-E" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {mockApiUsage.reduce((acc, curr) => {
                const total = Object.entries(curr)
                  .filter(([key]) => key !== 'date')
                  .reduce((sum, [, value]) => sum + (value as number), 0);
                
                return acc + total;
              }, 0)}
            </div>
          </TabsContent>
          
          {/* Onglet des quotas */}
          <TabsContent value="quotas" className="space-y-6">
            {quotas.map((quota) => (
              <div key={quota.api} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{quota.api}</span>
                  <span className="text-sm">
                    {quota.used.toLocaleString()} / {quota.limit.toLocaleString()}
                  </span>
                </div>
                <Progress 
                  value={quota.percentage} 
                  className={`h-2 ${getQuotaColor(quota.status)}`} 
                />
              </div>
            ))}
            
            <div className="bg-muted p-4 rounded-md mt-6">
              <h3 className="font-medium mb-2">Informations sur les quotas</h3>
              <ul className="text-sm space-y-1">
                <li className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <span>Bon (moins de 75% utilisé)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span>Attention (75-90% utilisé)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span>Critique (plus de 90% utilisé)</span>
                </li>
              </ul>
            </div>
          </TabsContent>
          
          {/* Onglet des erreurs */}
          <TabsContent value="errors">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={errorRates}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="api" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="success" name="Succès (%)" stackId="a" fill="#10b981" />
                  <Bar dataKey="error" name="Erreur (%)" stackId="a" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 space-y-4">
              <h3 className="font-medium">Erreurs les plus courantes</h3>
              <div className="space-y-2">
                <div className="p-3 rounded-md bg-muted">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Timeout</span>
                    <span className="text-sm">38%</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Délai d'attente dépassé lors de l'appel API
                  </p>
                </div>
                <div className="p-3 rounded-md bg-muted">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Rate Limit</span>
                    <span className="text-sm">27%</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Limite de requêtes par minute dépassée
                  </p>
                </div>
                <div className="p-3 rounded-md bg-muted">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Auth Error</span>
                    <span className="text-sm">18%</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Problème d'authentification avec la clé API
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Onglet des coûts */}
          <TabsContent value="costs">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'OpenAI', cost: 256.78 },
                    { name: 'Whisper', cost: 87.25 },
                    { name: 'MusicGen', cost: 120.50 },
                    { name: 'Hume AI', cost: 75.30 },
                    { name: 'DALL-E', cost: 102.45 }
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, 'Coût']}
                  />
                  <Bar dataKey="cost" name="Coût ($)" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Total du mois</span>
                <span className="font-bold">$642.28</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Projection annuelle</span>
                <span>$7,707.36</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Budget alloué</span>
                <span>$10,000.00</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium">Reste disponible</span>
                <span className="text-green-600 font-medium">$2,292.64</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ApiUsageMonitor;
