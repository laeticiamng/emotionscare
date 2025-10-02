import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Download, FileSpreadsheet, LineChart, BarChart2, FileText, PieChart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { DateRange } from 'react-day-picker';

const CustomReportsBuilder = () => {
  const { toast } = useToast();
  const [reportFormat, setReportFormat] = useState<string>('pdf');
  const [reportType, setReportType] = useState<string>('emotional_climate');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    'emotional_score', 
    'team_satisfaction',
    'usage_stats'
  ]);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: new Date(new Date().setMonth(new Date().getMonth() + 1))
  });
  
  const metrics = [
    { id: 'emotional_score', label: 'Score émotionnel' },
    { id: 'team_satisfaction', label: 'Satisfaction d\'équipe' },
    { id: 'usage_stats', label: 'Statistiques d\'utilisation' },
    { id: 'burnout_risk', label: 'Risque de burnout' },
    { id: 'engagement', label: 'Engagement des collaborateurs' },
    { id: 'feedback', label: 'Retours des utilisateurs' },
    { id: 'action_items', label: 'Actions recommandées' }
  ];
  
  const handleMetricChange = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedMetrics([...selectedMetrics, id]);
    } else {
      setSelectedMetrics(selectedMetrics.filter(metric => metric !== id));
    }
  };
  
  const handleGenerateReport = () => {
    toast({
      title: "Rapport généré",
      description: `Votre rapport ${reportType} a été généré au format ${reportFormat}`,
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Générateur de Rapports RH</h2>
        <p className="text-muted-foreground">
          Créez des rapports personnalisés pour votre équipe RH
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Configuration du rapport</CardTitle>
            <CardDescription>
              Personnalisez les paramètres de votre rapport
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Report Type */}
            <div>
              <Label className="text-base">Type de rapport</Label>
              <RadioGroup
                value={reportType}
                onValueChange={setReportType}
                className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3"
              >
                <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted">
                  <RadioGroupItem value="emotional_climate" id="emotional_climate" />
                  <Label htmlFor="emotional_climate" className="cursor-pointer flex items-center">
                    <LineChart className="w-4 h-4 mr-2 text-primary" />
                    Climat émotionnel
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted">
                  <RadioGroupItem value="department_stats" id="department_stats" />
                  <Label htmlFor="department_stats" className="cursor-pointer flex items-center">
                    <BarChart2 className="w-4 h-4 mr-2 text-primary" />
                    Statistiques par département
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted">
                  <RadioGroupItem value="usage_analytics" id="usage_analytics" />
                  <Label htmlFor="usage_analytics" className="cursor-pointer flex items-center">
                    <PieChart className="w-4 h-4 mr-2 text-primary" />
                    Utilisation de la plateforme
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <Separator />
            
            {/* Date Range */}
            <div>
              <Label className="text-base mb-2 block">Période du rapport</Label>
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            </div>
            
            <Separator />
            
            {/* Metrics */}
            <div>
              <Label className="text-base mb-2 block">Métriques à inclure</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                {metrics.map((metric) => (
                  <div key={metric.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={metric.id} 
                      checked={selectedMetrics.includes(metric.id)}
                      onCheckedChange={(checked) => handleMetricChange(metric.id, Boolean(checked))}
                    />
                    <Label htmlFor={metric.id} className="cursor-pointer">
                      {metric.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            {/* Format Type */}
            <div>
              <Label className="text-base mb-2 block">Format de sortie</Label>
              <Select value={reportFormat} onValueChange={setReportFormat}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sélectionner un format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      PDF
                    </div>
                  </SelectItem>
                  <SelectItem value="excel">
                    <div className="flex items-center">
                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                      Excel
                    </div>
                  </SelectItem>
                  <SelectItem value="csv">
                    <div className="flex items-center">
                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                      CSV
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleGenerateReport} className="w-full md:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Générer le rapport
            </Button>
          </CardFooter>
        </Card>
        
        {/* Templates and Saved Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Modèles & Rapports sauvegardés</CardTitle>
            <CardDescription>
              Utilisez des modèles prédéfinis ou vos rapports sauvegardés
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Modèles prédéfinis</h4>
              <div className="space-y-2">
                {['Revue mensuelle', 'Analyse d\'équipe', 'Satisfaction globale', 'KPIs de bien-être'].map((template, i) => (
                  <Button key={i} variant="outline" className="w-full justify-start" size="sm">
                    <FileText className="mr-2 h-4 w-4 text-primary" />
                    {template}
                  </Button>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Rapports sauvegardés</h4>
              <div className="space-y-2">
                {['Rapport T1 2025', 'Analyse département Marketing', 'Suivi coach IA'].map((report, i) => (
                  <Button key={i} variant="ghost" className="w-full justify-start" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    {report}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Voir tous les rapports
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CustomReportsBuilder;
