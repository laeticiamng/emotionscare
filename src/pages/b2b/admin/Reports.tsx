
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Calendar, LineChart, PieChart, BarChart, Share2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const B2BAdminReports: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Rapports analytiques</h1>
          <p className="text-muted-foreground">
            Analyses des données de bien-être et d'engagement
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" /> Partager
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" /> Télécharger
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center md:items-end justify-between">
        <Tabs defaultValue="monthly" className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="weekly">Hebdomadaire</TabsTrigger>
            <TabsTrigger value="monthly">Mensuel</TabsTrigger>
            <TabsTrigger value="quarterly">Trimestriel</TabsTrigger>
            <TabsTrigger value="yearly">Annuel</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Select defaultValue="may2025">
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="may2025">Mai 2025</SelectItem>
              <SelectItem value="apr2025">Avril 2025</SelectItem>
              <SelectItem value="mar2025">Mars 2025</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="all">
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Département" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="tech">Technique</SelectItem>
              <SelectItem value="hr">RH</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Score moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72%</div>
            <div className="flex items-center gap-1 mt-1">
              <div className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-1 rounded">+3%</div>
              <p className="text-xs text-muted-foreground">vs mois précédent</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <div className="flex items-center gap-1 mt-1">
              <div className="text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-1 rounded">-2%</div>
              <p className="text-xs text-muted-foreground">vs mois précédent</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sessions complétées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245</div>
            <div className="flex items-center gap-1 mt-1">
              <div className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-1 rounded">+8%</div>
              <p className="text-xs text-muted-foreground">vs mois précédent</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Temps moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18 min</div>
            <div className="flex items-center gap-1 mt-1">
              <div className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-1 rounded">+1.5 min</div>
              <p className="text-xs text-muted-foreground">vs mois précédent</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Évolution du bien-être</CardTitle>
            <CardDescription>Tendance sur les 6 derniers mois</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] bg-muted/20 rounded flex items-center justify-center">
              <LineChart className="h-16 w-16 text-muted-foreground opacity-40" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Répartition des émotions</CardTitle>
            <CardDescription>Mois de mai 2025</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] bg-muted/20 rounded flex items-center justify-center">
              <PieChart className="h-16 w-16 text-muted-foreground opacity-40" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Analyse par département</CardTitle>
          <CardDescription>Comparaison des scores de bien-être</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] bg-muted/20 rounded flex items-center justify-center">
            <BarChart className="h-16 w-16 text-muted-foreground opacity-40" />
          </div>
          
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {['Marketing', 'Technique', 'Finance', 'RH'].map((dept, i) => (
              <div key={dept} className="border rounded p-3">
                <div className="text-sm font-medium mb-1">{dept}</div>
                <div className="text-2xl font-bold">{Math.round(65 + Math.random() * 20)}%</div>
                <div className="flex items-center gap-1 mt-1">
                  <div className={`text-xs ${i % 2 === 0 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'} px-1 rounded`}>
                    {i % 2 === 0 ? '+' : '-'}{Math.round(1 + Math.random() * 5)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-4 flex justify-end">
        <Button variant="outline">
          <Calendar className="h-4 w-4 mr-2" /> Planifier un rapport récurrent
        </Button>
      </div>
    </div>
  );
};

export default B2BAdminReports;
