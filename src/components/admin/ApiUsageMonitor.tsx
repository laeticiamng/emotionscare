
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement,
  BarElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend
} from 'chart.js';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';
import { ApiUseActivity, ApiUsageStats } from '@/types/api';

// Enregistrement des composants Chart.js
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement,
  BarElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend
);

interface ApiUsageMonitorProps {
  onRefresh?: () => void;
}

const ApiUsageMonitor: React.FC<ApiUsageMonitorProps> = ({ onRefresh }) => {
  const [usageData, setUsageData] = useState<ApiUseActivity[]>([]);
  const [stats, setStats] = useState<ApiUsageStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');
  
  // Chargement des données (simulées ici)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Simulation de chargement - à remplacer par un vrai appel API
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Données simulées
        const currentDate = new Date();
        const mockData: ApiUseActivity[] = [];
        
        // Nombre de jours selon la période
        const days = period === 'day' ? 1 : period === 'week' ? 7 : 30;
        
        // Génération de données fictives
        for (let i = 0; i < days; i++) {
          const date = new Date();
          date.setDate(currentDate.getDate() - i);
          
          mockData.push({
            date: date.toISOString().split('T')[0],
            openai: Math.floor(Math.random() * 50) + 20,
            whisper: Math.floor(Math.random() * 15) + 5,
            musicgen: Math.floor(Math.random() * 10) + 1,
            humeai: Math.floor(Math.random() * 8) + 2,
            dalle: Math.floor(Math.random() * 12) + 3
          });
        }
        
        // Tri par date
        mockData.sort((a, b) => a.date.localeCompare(b.date));
        
        setUsageData(mockData);
        
        // Statistiques globales
        const totalOpenAI = mockData.reduce((sum, item) => sum + (item.openai || 0), 0);
        const totalWhisper = mockData.reduce((sum, item) => sum + (item.whisper || 0), 0);
        const totalMusicGen = mockData.reduce((sum, item) => sum + (item.musicgen || 0), 0);
        const totalHumeAI = mockData.reduce((sum, item) => sum + (item.humeai || 0), 0);
        const totalDalle = mockData.reduce((sum, item) => sum + (item.dalle || 0), 0);
        const totalCalls = totalOpenAI + totalWhisper + totalMusicGen + totalHumeAI + totalDalle;
        
        setStats({
          totalCalls,
          callsByApi: {
            openai: totalOpenAI,
            whisper: totalWhisper,
            musicgen: totalMusicGen,
            humeai: totalHumeAI,
            dalle: totalDalle
          },
          errorRate: Math.random() * 0.05, // 0-5% d'erreurs
          avgResponseTime: Math.random() * 500 + 200, // 200-700ms
          costEstimate: (totalOpenAI * 0.02 + totalWhisper * 0.006 + totalMusicGen * 0.03 + totalHumeAI * 0.01 + totalDalle * 0.04),
          period: {
            start: mockData[0]?.date || '',
            end: mockData[mockData.length - 1]?.date || ''
          }
        });
      } catch (error) {
        console.error('Error fetching API usage data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [period]);
  
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      setUsageData([]);
      setStats(null);
      setPeriod(period); // Déclenche le useEffect
    }
  };
  
  // Configuration pour le graphique d'utilisation quotidienne
  const lineChartData = {
    labels: usageData.map(item => item.date),
    datasets: [
      {
        label: 'OpenAI',
        data: usageData.map(item => item.openai || 0),
        borderColor: 'rgba(53, 162, 235, 1)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.3
      },
      {
        label: 'Whisper',
        data: usageData.map(item => item.whisper || 0),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3
      },
      {
        label: 'MusicGen',
        data: usageData.map(item => item.musicgen || 0),
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        tension: 0.3
      },
      {
        label: 'Hume AI',
        data: usageData.map(item => item.humeai || 0),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        tension: 0.3
      },
      {
        label: 'DALL-E',
        data: usageData.map(item => item.dalle || 0),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.3
      }
    ]
  };
  
  // Configuration pour le graphique de répartition par API
  const pieChartData = {
    labels: stats ? Object.keys(stats.callsByApi).map(key => 
      key === 'openai' ? 'OpenAI' :
      key === 'whisper' ? 'Whisper' :
      key === 'musicgen' ? 'MusicGen' :
      key === 'humeai' ? 'Hume AI' :
      key === 'dalle' ? 'DALL-E' : key
    ) : [],
    datasets: [
      {
        data: stats ? Object.values(stats.callsByApi) : [],
        backgroundColor: [
          'rgba(53, 162, 235, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 99, 132, 0.8)',
        ],
        borderWidth: 1
      }
    ]
  };
  
  // Options communes aux graphiques
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      }
    },
    maintainAspectRatio: false
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Monitoring des API</CardTitle>
        <div className="flex items-center gap-2">
          <Tabs 
            value={period} 
            onValueChange={(val) => setPeriod(val as 'day' | 'week' | 'month')}
            className="mr-4"
          >
            <TabsList>
              <TabsTrigger value="day">Jour</TabsTrigger>
              <TabsTrigger value="week">Semaine</TabsTrigger>
              <TabsTrigger value="month">Mois</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-[400px]">
            <div className="text-muted-foreground">Chargement des données...</div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-muted-foreground">Appels totaux</div>
                  <div className="text-2xl font-bold">{stats?.totalCalls || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-muted-foreground">Taux d'erreurs</div>
                  <div className="text-2xl font-bold">{(stats?.errorRate || 0) * 100}%</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-muted-foreground">Temps de réponse moyen</div>
                  <div className="text-2xl font-bold">{Math.round(stats?.avgResponseTime || 0)} ms</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-muted-foreground">Coût estimé</div>
                  <div className="text-2xl font-bold">{stats?.costEstimate?.toFixed(2) || 0} €</div>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="timeline">
              <TabsList className="w-full">
                <TabsTrigger value="timeline" className="flex-1">Utilisation journalière</TabsTrigger>
                <TabsTrigger value="distribution" className="flex-1">Répartition par API</TabsTrigger>
              </TabsList>
              <TabsContent value="timeline">
                <div className="h-[400px] mt-4">
                  <Line data={lineChartData} options={chartOptions} />
                </div>
              </TabsContent>
              <TabsContent value="distribution">
                <div className="h-[400px] flex justify-center items-center mt-4">
                  <div className="w-1/2 h-full">
                    <Pie data={pieChartData} options={chartOptions} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiUsageMonitor;
