import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, HeatMap } from "recharts";
import { TrendingUp, Users, Calendar, Activity } from "lucide-react";

const mockData = [
  { name: "Lun", stress: 75, wellbeing: 65, productivity: 80 },
  { name: "Mar", stress: 60, wellbeing: 75, productivity: 85 },
  { name: "Mer", stress: 45, wellbeing: 85, productivity: 90 },
  { name: "Jeu", stress: 55, wellbeing: 80, productivity: 88 },
  { name: "Ven", stress: 40, wellbeing: 90, productivity: 95 }
];

const heatmapData = [
  { hour: "9h", monday: 85, tuesday: 78, wednesday: 92, thursday: 88, friday: 95 },
  { hour: "10h", monday: 90, tuesday: 85, wednesday: 88, thursday: 92, friday: 90 },
  { hour: "11h", monday: 75, tuesday: 80, wednesday: 85, thursday: 82, friday: 88 },
  { hour: "14h", monday: 70, tuesday: 75, wednesday: 80, thursday: 78, friday: 85 },
  { hour: "15h", monday: 65, tuesday: 70, wednesday: 75, thursday: 72, friday: 80 },
  { hour: "16h", monday: 80, tuesday: 85, wednesday: 90, thursday: 88, friday: 92 }
];

const B2BReportsHeatmapPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Tableau de Bord Analytics B2B
            </h1>
            <p className="text-muted-foreground mt-2">
              Analyse des performances de bien-être de votre équipe
            </p>
          </div>
          <div className="flex gap-2">
            <Card className="px-4 py-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">47 employés actifs</span>
              </div>
            </Card>
          </div>
        </div>

        {/* KPIs Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bien-être Moyen</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">79%</div>
              <p className="text-xs text-muted-foreground">+5.2% vs semaine passée</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Niveau de Stress</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">55%</div>
              <p className="text-xs text-muted-foreground">-3.1% vs semaine passée</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Productivité</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">88%</div>
              <p className="text-xs text-muted-foreground">+2.4% vs semaine passée</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Participation</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">94%</div>
              <p className="text-xs text-muted-foreground">+1.8% vs semaine passée</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Tendances Hebdomadaires</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="wellbeing" fill="hsl(var(--primary))" />
                  <Bar dataKey="stress" fill="hsl(var(--destructive))" />
                  <Bar dataKey="productivity" fill="hsl(var(--accent))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle>Carte de Chaleur - Performance par Créneau</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-6 gap-2 text-xs font-medium">
                  <div>Heure</div>
                  <div>Lun</div>
                  <div>Mar</div>
                  <div>Mer</div>
                  <div>Jeu</div>
                  <div>Ven</div>
                </div>
                {heatmapData.map((row, index) => (
                  <div key={index} className="grid grid-cols-6 gap-2">
                    <div className="text-xs font-medium py-2">{row.hour}</div>
                    <div 
                      className="h-8 rounded flex items-center justify-center text-xs font-medium text-white"
                      style={{ backgroundColor: `hsl(var(--primary) / ${row.monday / 100})` }}
                    >
                      {row.monday}%
                    </div>
                    <div 
                      className="h-8 rounded flex items-center justify-center text-xs font-medium text-white"
                      style={{ backgroundColor: `hsl(var(--primary) / ${row.tuesday / 100})` }}
                    >
                      {row.tuesday}%
                    </div>
                    <div 
                      className="h-8 rounded flex items-center justify-center text-xs font-medium text-white"
                      style={{ backgroundColor: `hsl(var(--primary) / ${row.wednesday / 100})` }}
                    >
                      {row.wednesday}%
                    </div>
                    <div 
                      className="h-8 rounded flex items-center justify-center text-xs font-medium text-white"
                      style={{ backgroundColor: `hsl(var(--primary) / ${row.thursday / 100})` }}
                    >
                      {row.thursday}%
                    </div>
                    <div 
                      className="h-8 rounded flex items-center justify-center text-xs font-medium text-white"
                      style={{ backgroundColor: `hsl(var(--primary) / ${row.friday / 100})` }}
                    >
                      {row.friday}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Analyse Détaillée</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium mb-3 text-primary">Points Forts</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Productivité en hausse constante</li>
                  <li>• Taux de participation élevé</li>
                  <li>• Amélioration du bien-être</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-3 text-accent">Opportunités</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Réduction du stress en après-midi</li>
                  <li>• Optimisation des créneaux 11h-14h</li>
                  <li>• Formation en gestion du stress</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-3 text-destructive">Points d'Attention</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Pic de stress en début de semaine</li>
                  <li>• Baisse d'énergie en milieu d'après-midi</li>
                  <li>• Variabilité inter-équipes</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BReportsHeatmapPage;