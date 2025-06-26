
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, AlertTriangle, Download, Filter } from 'lucide-react';

const wellbeingData = [
  { department: 'Marketing', score: 78, trend: 5, employees: 12 },
  { department: 'Tech', score: 82, trend: -2, employees: 25 },
  { department: 'Sales', score: 75, trend: 8, employees: 18 },
  { department: 'HR', score: 85, trend: 3, employees: 8 },
  { department: 'Finance', score: 72, trend: -1, employees: 15 },
];

const engagementData = [
  { month: 'Jan', participation: 65, satisfaction: 72 },
  { month: 'Fév', participation: 68, satisfaction: 75 },
  { month: 'Mar', participation: 72, satisfaction: 78 },
  { month: 'Avr', participation: 75, satisfaction: 80 },
  { month: 'Mai', participation: 78, satisfaction: 82 },
  { month: 'Jun', participation: 82, satisfaction: 85 },
];

const riskData = [
  { name: 'Faible', value: 65, color: '#10b981' },
  { name: 'Modéré', value: 25, color: '#f59e0b' },
  { name: 'Élevé', value: 10, color: '#ef4444' },
];

export const AdvancedAnalyticsWidget: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Analytics Avancées
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="departments" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="departments">Départements</TabsTrigger>
            <TabsTrigger value="trends">Tendances</TabsTrigger>
            <TabsTrigger value="risks">Risques</TabsTrigger>
          </TabsList>
          
          <TabsContent value="departments" className="space-y-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wellbeingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${value}${name === 'score' ? '%' : ''}`, 
                      name === 'score' ? 'Score' : 'Employés'
                    ]}
                  />
                  <Bar dataKey="score" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {wellbeingData.map((dept, index) => (
                <div key={index} className="text-center p-2 border rounded">
                  <div className="font-medium text-sm">{dept.department}</div>
                  <div className="text-xs text-muted-foreground">{dept.employees} pers.</div>
                  <Badge variant={dept.trend >= 0 ? 'default' : 'destructive'} className="text-xs">
                    {dept.trend >= 0 ? '+' : ''}{dept.trend}%
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="trends" className="space-y-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="participation" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    name="Participation"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="satisfaction" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    name="Satisfaction"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="risks" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {riskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg bg-red-50 dark:bg-red-900/20">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="font-medium text-sm">Alertes Critiques</span>
                  </div>
                  <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                    <li>• 3 employés avec score < 50%</li>
                    <li>• Département Finance en baisse</li>
                    <li>• Absentéisme en hausse (Tech)</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
