import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RefreshCw, TrendingUp, AlertCircle, DollarSign, Clock, Zap } from 'lucide-react';
import { adminService, ApiUsageStats, ApiUseActivity } from '@/services/admin';

interface ApiUsageMonitorProps {
  onRefresh?: () => void;
}

export default function ApiUsageMonitor({ onRefresh }: ApiUsageMonitorProps) {
  const [usageData, setUsageData] = useState<ApiUseActivity[]>([]);
  const [stats, setStats] = useState<ApiUsageStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');
  
  // Chargement des données via le service admin
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { stats, activities } = await adminService.getApiUsageStats(period);
        setUsageData(activities);
        setStats(stats);
      } catch (error) {
        console.error('Error fetching API usage data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [period]);
  
  const handleRefresh = async () => {
    if (onRefresh) {
      onRefresh();
    }
    
    setIsLoading(true);
    try {
      const { stats, activities } = await adminService.getApiUsageStats(period);
      setUsageData(activities);
      setStats(stats);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getApiColor = (apiName: string) => {
    const colors: Record<string, string> = {
      openai: '#10b981',
      whisper: '#3b82f6', 
      musicgen: '#8b5cf6',
      humeai: '#f59e0b',
      dalle: '#ef4444'
    };
    return colors[apiName] || '#6b7280';
  };

  const getApiName = (apiKey: string) => {
    const names: Record<string, string> = {
      openai: 'OpenAI GPT',
      whisper: 'Whisper STT',
      musicgen: 'Suno Music',
      humeai: 'Hume AI',
      dalle: 'DALL-E'
    };
    return names[apiKey] || apiKey;
  };

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Moniteur d'Usage API
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement des données...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec contrôles */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Moniteur d'Usage API
            </CardTitle>
            <div className="flex items-center gap-3">
              <Select value={period} onValueChange={(value: 'day' | 'week' | 'month') => setPeriod(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Aujourd'hui</SelectItem>
                  <SelectItem value="week">7 jours</SelectItem>
                  <SelectItem value="month">30 jours</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Appels</p>
                <p className="text-2xl font-bold">{stats.totalCalls.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Zap className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taux d'Erreur</p>
                <p className="text-2xl font-bold">{(stats.errorRate * 100).toFixed(1)}%</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Temps Moyen</p>
                <p className="text-2xl font-bold">{Math.round(stats.avgResponseTime)}ms</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Coût Estimé</p>
                <p className="text-2xl font-bold">${stats.costEstimate.toFixed(2)}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphique d'usage */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution de l'Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="openai" stroke={getApiColor('openai')} strokeWidth={2} />
                <Line type="monotone" dataKey="whisper" stroke={getApiColor('whisper')} strokeWidth={2} />
                <Line type="monotone" dataKey="musicgen" stroke={getApiColor('musicgen')} strokeWidth={2} />
                <Line type="monotone" dataKey="humeai" stroke={getApiColor('humeai')} strokeWidth={2} />
                <Line type="monotone" dataKey="dalle" stroke={getApiColor('dalle')} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Répartition par API */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition par API</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(stats.callsByApi).map(([api, count]) => {
              const percentage = stats.totalCalls > 0 ? (count / stats.totalCalls) * 100 : 0;
              return (
                <div key={api} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: getApiColor(api) }}
                      />
                      <span className="font-medium">{getApiName(api)}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold">{count.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Insights et recommandations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Insights et Recommandations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Tendances</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-green-600">
                    +12%
                  </Badge>
                  <span className="text-sm">Usage OpenAI cette semaine</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-blue-600">
                    +8%
                  </Badge>
                  <span className="text-sm">Génération musicale en hausse</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-orange-600">
                    Stable
                  </Badge>
                  <span className="text-sm">Performance système</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Recommandations</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Optimiser les requêtes OpenAI pour réduire les coûts</p>
                <p>• Surveiller l'usage Suno pour anticiper les limites</p>
                <p>• Considérer le cache pour les requêtes fréquentes</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}