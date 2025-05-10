
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Calendar, FileText, Download, BarChart } from 'lucide-react';
import { DateRangePicker } from '@/components/ui/date-range-picker';

interface ReportGeneratorProps {
  title?: string;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ title = "Générateur de Rapports" }) => {
  const [reportType, setReportType] = useState<string>("emotional_analytics");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  const reportTypes = [
    { value: "emotional_analytics", label: "Analyse Émotionnelle" },
    { value: "user_engagement", label: "Engagement Utilisateur" },
    { value: "feature_usage", label: "Utilisation des Fonctionnalités" },
    { value: "cohort_analysis", label: "Analyse de Cohorte" },
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Type de Rapport</label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le type de rapport" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1.5 block">Période</label>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="w-full justify-start text-left">
                <Calendar className="mr-2 h-4 w-4" />
                Derniers 30 jours
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Button onClick={handleGenerate} disabled={isGenerating} className="flex items-center">
            {isGenerating ? 
              <BarChart className="mr-2 h-4 w-4 animate-pulse" /> : 
              <BarChart className="mr-2 h-4 w-4" />
            }
            Générer Aperçu
          </Button>
          <Button variant="outline" disabled={isGenerating} className="flex items-center">
            <Download className="mr-2 h-4 w-4" />
            Exporter PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportGenerator;
