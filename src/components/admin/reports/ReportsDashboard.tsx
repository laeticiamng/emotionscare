import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, Download, Filter, Plus } from 'lucide-react';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { DateRange } from 'react-day-picker';

const ReportsDashboard: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('recent');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });

  const handleGenerateReport = () => {
    toast({
      title: "Rapport en cours de création",
      description: "Votre rapport sera généré dans quelques instants."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Rapports RH</h2>
          <p className="text-muted-foreground">
            Générez des rapports personnalisés pour votre organisation
          </p>
        </div>
        <Button onClick={handleGenerateReport} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Créer un rapport
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Filtres</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <span className="text-sm font-medium">Période</span>
              <DatePickerWithRange 
                date={dateRange}
                setDate={setDateRange}
              />
            </div>
            
            <div className="pt-4">
              <Button variant="outline" className="w-full flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Appliquer les filtres
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-3 space-y-6">
          <Tabs defaultValue="recent" className="space-y-4">
            <TabsList>
              <TabsTrigger value="recent">Récents</TabsTrigger>
              <TabsTrigger value="favorites">Favoris</TabsTrigger>
              <TabsTrigger value="templates">Modèles</TabsTrigger>
            </TabsList>
            
            <TabsContent value="recent" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Rapports récents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <div>
                          <div className="font-medium">Rapport d'absentéisme Q{i} 2025</div>
                          <div className="text-sm text-muted-foreground">Créé le {new Date().toLocaleDateString('fr-FR')}</div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Rapports planifiés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <div>
                          <div className="font-medium">Rapport mensuel - Santé émotionnelle</div>
                          <div className="flex items-center text-sm text-muted-foreground gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Prochain: {new Date(new Date().setDate(new Date().getDate() + i * 15)).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Modifier</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="favorites">
              <Card>
                <CardContent className="py-10 flex flex-col items-center justify-center">
                  <p className="text-muted-foreground">Aucun rapport favori pour le moment</p>
                  <Button variant="outline" className="mt-4">Parcourir les rapports</Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="templates">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Modèles disponibles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["Bien-être au travail", "Détection burnout", "Turnover prédictif", "Climat social"].map((template) => (
                      <div key={template} className="flex flex-col p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <div className="font-medium">{template}</div>
                        <div className="text-sm text-muted-foreground mt-1">Modèle prêt à l'emploi</div>
                        <Button variant="outline" size="sm" className="mt-auto self-end">Utiliser</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;
