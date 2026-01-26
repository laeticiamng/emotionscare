// @ts-nocheck

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter
} from 'recharts';
import { 
  BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, 
  TrendingUp, Eye, Download, Settings 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface DataVisualizationProps {
  filters: Record<string, any>;
  userRole?: string;
}

const DataVisualization: React.FC<DataVisualizationProps> = ({ filters, userRole }) => {
  const [selectedChart, setSelectedChart] = useState('emotional-trends');
  const [timeRange, setTimeRange] = useState('month');

  const emotionalTrendsData = [
    { date: '01/06', joie: 75, stress: 25, energie: 80, calme: 70, motivation: 85 },
    { date: '05/06', joie: 82, stress: 20, energie: 85, calme: 78, motivation: 88 },
    { date: '10/06', joie: 78, stress: 30, energie: 75, calme: 72, motivation: 82 },
    { date: '15/06', joie: 85, stress: 15, energie: 90, calme: 82, motivation: 90 },
    { date: '20/06', joie: 90, stress: 10, energie: 95, calme: 88, motivation: 95 },
  ];

  const departmentComparisonData = [
    { department: 'Dev', wellbeing: 85, productivity: 92, engagement: 78 },
    { department: 'Marketing', wellbeing: 78, productivity: 85, engagement: 82 },
    { department: 'RH', wellbeing: 90, productivity: 88, engagement: 95 },
    { department: 'Ventes', wellbeing: 72, productivity: 90, engagement: 75 },
    { department: 'Support', wellbeing: 82, productivity: 78, engagement: 88 },
  ];

  const activityDistributionData = [
    { name: 'Méditation', value: 35, color: '#22c55e' },
    { name: 'Musique', value: 25, color: '#3b82f6' },
    { name: 'Journal', value: 20, color: '#f59e0b' },
    { name: 'Coach IA', value: 15, color: '#8b5cf6' },
    { name: 'VR', value: 5, color: '#ef4444' },
  ];

  const radarData = [
    { metric: 'Bien-être', current: 85, target: 90 },
    { metric: 'Productivité', current: 78, target: 85 },
    { metric: 'Engagement', current: 82, target: 80 },
    { metric: 'Équilibre', current: 75, target: 85 },
    { metric: 'Innovation', current: 88, target: 85 },
    { metric: 'Collaboration', current: 80, target: 85 },
  ];

  const correlationData = [
    { wellbeing: 85, productivity: 88, engagement: 82 },
    { wellbeing: 72, productivity: 75, engagement: 70 },
    { wellbeing: 90, productivity: 92, engagement: 95 },
    { wellbeing: 78, productivity: 80, engagement: 75 },
    { wellbeing: 82, productivity: 85, engagement: 88 },
    { wellbeing: 76, productivity: 78, engagement: 80 },
    { wellbeing: 88, productivity: 90, engagement: 85 },
  ];

  const chartTypes = [
    { id: 'emotional-trends', name: 'Tendances Émotionnelles', icon: LineChartIcon },
    { id: 'department-comparison', name: 'Comparaison Départements', icon: BarChart3 },
    { id: 'activity-distribution', name: 'Distribution Activités', icon: PieChartIcon },
    { id: 'performance-radar', name: 'Radar Performance', icon: TrendingUp },
    { id: 'correlation-analysis', name: 'Analyse Corrélations', icon: Eye },
  ];

  const SelectedIcon = chartTypes.find(c => c.id === selectedChart)?.icon;

  const renderSelectedChart = () => {
    switch (selectedChart) {
      case 'emotional-trends':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={emotionalTrendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="joie" 
                stackId="1" 
                stroke="#22c55e" 
                fill="#22c55e" 
                fillOpacity={0.8}
              />
              <Area 
                type="monotone" 
                dataKey="calme" 
                stackId="1" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.8}
              />
              <Area 
                type="monotone" 
                dataKey="motivation" 
                stackId="1" 
                stroke="#f59e0b" 
                fill="#f59e0b" 
                fillOpacity={0.8}
              />
              <Area 
                type="monotone" 
                dataKey="stress" 
                stackId="1" 
                stroke="#ef4444" 
                fill="#ef4444" 
                fillOpacity={0.8}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'department-comparison':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={departmentComparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="wellbeing" fill="#22c55e" name="Bien-être" />
              <Bar dataKey="productivity" fill="#3b82f6" name="Productivité" />
              <Bar dataKey="engagement" fill="#f59e0b" name="Engagement" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'activity-distribution':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={activityDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {activityDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'performance-radar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar
                name="Actuel"
                dataKey="current"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
              />
              <Radar
                name="Objectif"
                dataKey="target"
                stroke="#22c55e"
                fill="#22c55e"
                fillOpacity={0.1}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        );

      case 'correlation-analysis':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={correlationData}>
              <CartesianGrid />
              <XAxis 
                type="number" 
                dataKey="wellbeing" 
                name="Bien-être" 
                domain={[60, 100]}
              />
              <YAxis 
                type="number" 
                dataKey="productivity" 
                name="Productivité" 
                domain={[60, 100]}
              />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter 
                name="Corrélation"
                dataKey="engagement" 
                fill="#8b5cf6"
              />
            </ScatterChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Contrôles de visualisation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Contrôles de Visualisation</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configurer
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type de graphique</label>
              <Select value={selectedChart} onValueChange={setSelectedChart}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {chartTypes.map((chart) => (
                    <SelectItem key={chart.id} value={chart.id}>
                      <div className="flex items-center gap-2">
                        <chart.icon className="h-4 w-4" />
                        {chart.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Période</label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Cette semaine</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                  <SelectItem value="quarter">Ce trimestre</SelectItem>
                  <SelectItem value="year">Cette année</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-2">
              <Badge variant="outline">
                Données en temps réel
              </Badge>
              <Badge variant="secondary">
                {userRole === 'b2b_admin' ? 'Vue équipe' : 'Vue personnelle'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Graphique principal */}
      <motion.div
        key={selectedChart}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {SelectedIcon && <SelectedIcon className="h-5 w-5" />}
              {chartTypes.find(c => c.id === selectedChart)?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderSelectedChart()}
          </CardContent>
        </Card>
      </motion.div>

      {/* Insights et recommandations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Insights Automatiques</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">Tendance positive</span>
              </div>
              <p className="text-sm text-green-700">
                Le niveau de bien-être a augmenté de 12% ce mois-ci
              </p>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">Corrélation détectée</span>
              </div>
              <p className="text-sm text-blue-700">
                Forte corrélation entre méditation et réduction du stress (r=0.84)
              </p>
            </div>

            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-orange-600" />
                <span className="font-medium text-orange-800">Point d'attention</span>
              </div>
              <p className="text-sm text-orange-700">
                Le département Ventes montre une baisse d'engagement
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recommandations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-medium">Actions suggérées :</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Organiser des sessions de méditation hebdomadaires</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Mettre en place un programme de mentoring pour les ventes</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Encourager l'utilisation du coach IA pour le stress</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataVisualization;
