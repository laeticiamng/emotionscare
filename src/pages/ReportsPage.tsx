
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { BarChart3, Download, FileText, TrendingUp, Users, Calendar, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ReportsPage: React.FC = () => {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedTeam, setSelectedTeam] = useState('all');

  const reports = [
    {
      id: 1,
      title: "Rapport Mensuel - Janvier 2024",
      type: "Bien-être Global",
      generatedDate: "2024-01-31",
      status: "Terminé",
      format: "PDF",
      size: "2.3 MB",
      insights: ["Amélioration de 12%", "3 équipes à surveiller", "Recommandations actionnables"]
    },
    {
      id: 2,
      title: "Analyse Trimestrielle Q4 2023",
      type: "Performance Équipes",
      generatedDate: "2023-12-31",
      status: "Terminé",
      format: "Excel",
      size: "4.7 MB",
      insights: ["ROI de 23%", "Réduction absentéisme 15%", "Satisfaction +18%"]
    },
    {
      id: 3,
      title: "Rapport Intervention - Service Urgences",
      type: "Analyse Ciblée",
      generatedDate: "2024-01-15",
      status: "En cours",
      format: "PDF",
      size: "1.8 MB",
      insights: ["Actions correctives", "Suivi personnalisé", "Plan d'amélioration"]
    }
  ];

  const metrics = {
    totalReports: 47,
    avgWellbeingImprovement: 12.5,
    teamsAnalyzed: 12,
    actionableInsights: 156,
    costSavings: "€89,400",
    roi: "23%"
  };

  const templates = [
    {
      id: 1,
      name: "Rapport Bien-être Mensuel",
      description: "Vue d'ensemble complète du bien-être organisationnel",
      frequency: "Mensuel",
      sections: ["Metrics globales", "Analyse par équipe", "Recommandations", "Tendances"]
    },
    {
      id: 2,
      name: "Analyse d'Intervention",
      description: "Rapport détaillé post-intervention ou crise",
      frequency: "À la demande",
      sections: ["Contexte", "Actions menées", "Résultats", "Suivi"]
    },
    {
      id: 3,
      name: "Tableau de Bord Exécutif",
      description: "Synthèse pour la direction générale",
      frequency: "Trimestriel",
      sections: ["KPIs clés", "ROI", "Recommandations stratégiques"]
    },
    {
      id: 4,
      name: "Compliance & Audit",
      description: "Rapport de conformité pour audits externes",
      frequency: "Annuel",
      sections: ["Conformité RGPD", "Certifications", "Procédures", "Documentation"]
    }
  ];

  const generateReport = (templateId: number) => {
    toast({
      title: "Génération en cours",
      description: "Votre rapport sera prêt dans quelques minutes.",
    });
  };

  const downloadReport = (reportId: number) => {
    toast({
      title: "Téléchargement démarré",
      description: "Le fichier va être téléchargé automatiquement.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6" data-testid="page-root">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Rapports & Analytics</h1>
          <p className="text-gray-600">Analyses complètes et insights actionnables</p>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{metrics.totalReports}</div>
              <p className="text-sm text-gray-600">Rapports générés</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">+{metrics.avgWellbeingImprovement}%</div>
              <p className="text-sm text-gray-600">Amélioration moyenne</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{metrics.teamsAnalyzed}</div>
              <p className="text-sm text-gray-600">Équipes analysées</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{metrics.actionableInsights}</div>
              <p className="text-sm text-gray-600">Insights générés</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">{metrics.costSavings}</div>
              <p className="text-sm text-gray-600">Économies réalisées</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-cyan-600 mb-2">{metrics.roi}</div>
              <p className="text-sm text-gray-600">ROI global</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="reports">Rapports Existants</TabsTrigger>
            <TabsTrigger value="generate">Générer Nouveau</TabsTrigger>
            <TabsTrigger value="templates">Modèles</TabsTrigger>
            <TabsTrigger value="scheduled">Rapports Programmés</TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-6">
            <div className="flex flex-wrap gap-4 mb-6">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Cette semaine</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                  <SelectItem value="quarter">Ce trimestre</SelectItem>
                  <SelectItem value="year">Cette année</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Équipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les équipes</SelectItem>
                  <SelectItem value="urgences">Service Urgences</SelectItem>
                  <SelectItem value="chirurgie">Équipe Chirurgie</SelectItem>
                  <SelectItem value="admin">Administration</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Plus de filtres
              </Button>
            </div>

            <div className="space-y-4">
              {reports.map((report) => (
                <Card key={report.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">{report.title}</h3>
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="secondary">{report.type}</Badge>
                            <Badge variant={report.status === 'Terminé' ? 'default' : 'destructive'}>
                              {report.status}
                            </Badge>
                            <span className="text-sm text-gray-500">{report.format} • {report.size}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">Généré le {report.generatedDate}</p>
                          <div className="flex flex-wrap gap-2">
                            {report.insights.map((insight, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {insight}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => downloadReport(report.id)}>
                          <Download className="h-4 w-4 mr-1" />
                          Télécharger
                        </Button>
                        <Button size="sm">
                          Voir détails
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="generate" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Générer un Nouveau Rapport
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Type de rapport</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wellbeing">Bien-être Global</SelectItem>
                          <SelectItem value="team">Analyse d'Équipe</SelectItem>
                          <SelectItem value="intervention">Rapport d'Intervention</SelectItem>
                          <SelectItem value="compliance">Conformité & Audit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Période d'analyse</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner la période" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="last-week">Semaine dernière</SelectItem>
                          <SelectItem value="last-month">Mois dernier</SelectItem>
                          <SelectItem value="last-quarter">Trimestre dernier</SelectItem>
                          <SelectItem value="custom">Période personnalisée</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Équipes incluses</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner les équipes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes les équipes</SelectItem>
                          <SelectItem value="specific">Équipes spécifiques</SelectItem>
                          <SelectItem value="department">Par département</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Format de sortie</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF (Présentation)</SelectItem>
                          <SelectItem value="excel">Excel (Données)</SelectItem>
                          <SelectItem value="powerpoint">PowerPoint</SelectItem>
                          <SelectItem value="dashboard">Dashboard interactif</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Niveau de détail</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Niveau" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="executive">Exécutif (synthèse)</SelectItem>
                          <SelectItem value="detailed">Détaillé (complet)</SelectItem>
                          <SelectItem value="technical">Technique (analytics)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">⏱️ Temps de génération estimé</h4>
                      <p className="text-sm text-blue-700">
                        Environ 3-5 minutes selon la complexité et la période sélectionnée.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline">Aperçu des données</Button>
                  <Button onClick={() => generateReport(1)}>
                    Générer le rapport
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {templates.map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge variant="outline">{template.frequency}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm">{template.description}</p>
                    
                    <div>
                      <h4 className="font-medium text-sm mb-2">Sections incluses:</h4>
                      <div className="flex flex-wrap gap-1">
                        {template.sections.map((section, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {section}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Personnaliser
                      </Button>
                      <Button size="sm" className="flex-1" onClick={() => generateReport(template.id)}>
                        Utiliser ce modèle
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Rapports Programmés</h2>
              <Button>
                <Calendar className="h-4 w-4 mr-2" />
                Programmer nouveau rapport
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun rapport programmé</h3>
                  <p className="text-gray-600 mb-4">
                    Programmez vos rapports pour les recevoir automatiquement
                  </p>
                  <Button>Créer votre premier rapport programmé</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReportsPage;
