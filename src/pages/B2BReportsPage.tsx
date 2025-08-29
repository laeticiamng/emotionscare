/**
 * Page des rapports B2B
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Users, Target, Download, Calendar } from "lucide-react";

const B2BReportsPage = () => {
  const metrics = [
    { label: "Bien-être Global", value: 78, change: "+12%", color: "text-green-600" },
    { label: "Engagement Employés", value: 85, change: "+8%", color: "text-blue-600" },
    { label: "Productivité", value: 92, change: "+15%", color: "text-purple-600" },
    { label: "Satisfaction RH", value: 89, change: "+5%", color: "text-orange-600" }
  ];

  const teamReports = [
    { team: "Développement", members: 12, wellnessScore: 82, engagement: 88, trend: "up" },
    { team: "Marketing", members: 8, wellnessScore: 75, engagement: 79, trend: "up" },
    { team: "Ventes", members: 15, wellnessScore: 71, engagement: 85, trend: "down" },
    { team: "Support", members: 6, wellnessScore: 86, engagement: 92, trend: "up" }
  ];

  const emotionalTrends = [
    { emotion: "Joie", percentage: 45, change: "+8%" },
    { emotion: "Sérénité", percentage: 32, change: "+12%" },
    { emotion: "Stress", percentage: 18, change: "-15%" },
    { emotion: "Fatigue", percentage: 25, change: "-8%" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              <BarChart3 className="inline-block mr-3 text-blue-600" />
              Rapports & Analytics
            </h1>
            <p className="text-xl text-gray-600">
              Analyses détaillées du bien-être et de la performance
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Exporter Rapport
          </Button>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <Card key={index} className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600">{metric.label}</h3>
                  <Badge variant="secondary" className={metric.color}>
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {metric.change}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-gray-900">{metric.value}%</div>
                  <Progress value={metric.value} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="teams" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="teams">Équipes</TabsTrigger>
            <TabsTrigger value="emotions">Émotions</TabsTrigger>
            <TabsTrigger value="usage">Utilisation</TabsTrigger>
            <TabsTrigger value="trends">Tendances</TabsTrigger>
          </TabsList>

          <TabsContent value="teams">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="text-blue-600" />
                  Performance par Équipe
                </CardTitle>
                <CardDescription>
                  Analyse détaillée du bien-être par équipe
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamReports.map((team, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{team.team}</h3>
                          <p className="text-sm text-gray-600">{team.members} membres</p>
                        </div>
                        <Badge variant={team.trend === "up" ? "secondary" : "destructive"}>
                          {team.trend === "up" ? "↗ Progression" : "↘ Attention"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">Score Bien-être</span>
                            <span className="text-sm font-medium">{team.wellnessScore}%</span>
                          </div>
                          <Progress value={team.wellnessScore} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">Engagement</span>
                            <span className="text-sm font-medium">{team.engagement}%</span>
                          </div>
                          <Progress value={team.engagement} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emotions">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="text-green-600" />
                  Analyse Émotionnelle
                </CardTitle>
                <CardDescription>
                  Distribution des émotions dans l'entreprise
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {emotionalTrends.map((emotion, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium">{emotion.emotion}</h3>
                        <Badge variant="outline">{emotion.change}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Prévalence</span>
                          <span className="font-medium">{emotion.percentage}%</span>
                        </div>
                        <Progress value={emotion.percentage} className="h-3" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Utilisation des Modules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-2">1,247</div>
                      <p className="text-sm text-gray-600">Scans d'émotions</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-2">856</div>
                      <p className="text-sm text-gray-600">Sessions VR</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 mb-2">432</div>
                      <p className="text-sm text-gray-600">Coach IA interactions</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="text-purple-600" />
                  Tendances Temporelles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-3">Évolution du bien-être (30j)</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Semaine 1</span>
                          <span className="font-medium">72%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Semaine 2</span>
                          <span className="font-medium">75%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Semaine 3</span>
                          <span className="font-medium">78%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Semaine 4</span>
                          <span className="font-medium">81%</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-3">Pics d'utilisation</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Lundi matin</span>
                          <Badge variant="secondary">+45%</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Mercredi 14h</span>
                          <Badge variant="secondary">+32%</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Vendredi 16h</span>
                          <Badge variant="secondary">+28%</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default B2BReportsPage;