// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePDFReportHistory } from '@/hooks/usePDFReportHistory';
import { 
  FileText, 
  Download, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  GitCompare,
  Clock
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

export const PDFReportHistory: React.FC = () => {
  const { reports, isLoading, deleteReport, compareReports } = usePDFReportHistory();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedReports, setSelectedReports] = useState<string[]>([]);

  const filteredReports = selectedType === 'all' 
    ? reports 
    : reports.filter(r => r.report_type === selectedType);

  const handleDelete = (reportId: string) => {
    setReportToDelete(reportId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (reportToDelete) {
      await deleteReport(reportToDelete);
      setDeleteDialogOpen(false);
      setReportToDelete(null);
    }
  };

  const toggleReportSelection = (reportId: string) => {
    setSelectedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : prev.length < 2 ? [...prev, reportId] : prev
    );
  };

  const getComparisonData = () => {
    if (selectedReports.length !== 2) return null;
    const report1 = reports.find(r => r.id === selectedReports[0]);
    const report2 = reports.find(r => r.id === selectedReports[1]);
    if (!report1 || !report2) return null;
    return compareReports(report1, report2);
  };

  const comparisonData = getComparisonData();

  const getReportTypeLabel = (type: string) => {
    const labels = {
      audit: 'Audit',
      violations: 'Violations',
      dsar: 'DSAR',
      full: 'Complet',
    };
    return labels[type] || type;
  };

  const getReportTypeColor = (type: string) => {
    const colors = {
      audit: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      violations: 'bg-red-500/10 text-red-500 border-red-500/20',
      dsar: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      full: 'bg-green-500/10 text-green-500 border-green-500/20',
    };
    return colors[type] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Historique des Rapports PDF
              </CardTitle>
              <CardDescription>
                Consultez, téléchargez et comparez vos rapports générés
              </CardDescription>
            </div>
            <Button
              variant={compareMode ? 'default' : 'outline'}
              onClick={() => {
                setCompareMode(!compareMode);
                setSelectedReports([]);
              }}
            >
              <GitCompare className="h-4 w-4 mr-2" />
              {compareMode ? 'Annuler comparaison' : 'Comparer'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedType} onValueChange={setSelectedType}>
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="audit">Audits</TabsTrigger>
              <TabsTrigger value="violations">Violations</TabsTrigger>
              <TabsTrigger value="dsar">DSAR</TabsTrigger>
              <TabsTrigger value="full">Complets</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedType}>
              <ScrollArea className="h-[500px] pr-4">
                {filteredReports.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun rapport généré pour le moment</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredReports.map((report) => (
                      <Card
                        key={report.id}
                        className={`transition-all ${
                          compareMode && selectedReports.includes(report.id)
                            ? 'ring-2 ring-primary'
                            : ''
                        } ${compareMode ? 'cursor-pointer hover:bg-accent' : ''}`}
                        onClick={() => compareMode && toggleReportSelection(report.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-3">
                                <Badge variant="outline" className={getReportTypeColor(report.report_type)}>
                                  {getReportTypeLabel(report.report_type)}
                                </Badge>
                                <span className="text-sm font-medium">v{report.report_version}</span>
                                {report.metadata?.scheduled && (
                                  <Badge variant="secondary" className="text-xs">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Automatique
                                  </Badge>
                                )}
                              </div>
                              
                              <h4 className="font-semibold text-foreground">{report.title}</h4>
                              
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(report.created_at).toLocaleString('fr-FR', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                                {report.score_global && (
                                  <span className="font-medium text-foreground">
                                    Score: {report.score_global}/100
                                  </span>
                                )}
                                {report.file_size && (
                                  <span>{(report.file_size / 1024).toFixed(1)} KB</span>
                                )}
                              </div>
                            </div>

                            {!compareMode && (
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" aria-label="Télécharger le rapport">
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(report.id)}
                                  aria-label="Supprimer le rapport"
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            )}

                            {compareMode && selectedReports.includes(report.id) && (
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                                {selectedReports.indexOf(report.id) + 1}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Comparaison */}
      {compareMode && comparisonData && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitCompare className="h-5 w-5" />
              Comparaison des Rapports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Évolution du Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center gap-3">
                    {comparisonData.scoreImproved !== null && (
                      <>
                        <div className={`text-3xl font-bold ${
                          comparisonData.scoreImproved ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {comparisonData.scoreImproved ? '+' : ''}{comparisonData.scoreDifference?.toFixed(1)}
                        </div>
                        {comparisonData.scoreImproved ? (
                          <TrendingUp className="h-6 w-6 text-green-500" />
                        ) : (
                          <TrendingDown className="h-6 w-6 text-red-500" />
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Écart Temporel</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground">
                      {comparisonData.timeDifference}
                    </div>
                    <div className="text-sm text-muted-foreground">jours</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Versions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground">
                      {comparisonData.versionDifference}
                    </div>
                    <div className="text-sm text-muted-foreground">versions d'écart</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce rapport ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};