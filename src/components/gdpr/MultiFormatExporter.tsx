import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, FileSpreadsheet, FileJson, Download } from 'lucide-react';
import { useMultiFormatExport } from '@/hooks/useMultiFormatExport';
import { useState } from 'react';
import { ReportSignature } from './ReportSignature';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExportAnalyticsDashboard } from './ExportAnalyticsDashboard';
import { TemplateEditor } from './TemplateEditor';
import { ReportValidation } from './ReportValidation';
import { WebhookManager } from './WebhookManager';
import { GDPRAssistantChat } from './GDPRAssistantChat';
import { SecurityPenetrationTest } from './SecurityPenetrationTest';
import { RealtimeComplianceScore } from './RealtimeComplianceScore';

export function MultiFormatExporter() {
  const { exportData, isExporting } = useMultiFormatExport();
  const [format, setFormat] = useState<'pdf' | 'excel' | 'json' | 'csv'>('pdf');
  const [template, setTemplate] = useState<'standard' | 'executive' | 'technical' | 'minimal'>('standard');
  const [includeHistory, setIncludeHistory] = useState(false);

  const handleExport = async () => {
    await exportData({
      format,
      template,
      include_history: includeHistory,
    });
  };

  const formatIcons = {
    pdf: FileText,
    excel: FileSpreadsheet,
    json: FileJson,
    csv: FileSpreadsheet,
  };

  const FormatIcon = formatIcons[format];

  return (
    <Tabs defaultValue="export" className="space-y-6">
      <TabsList className="grid w-full grid-cols-5 lg:grid-cols-9">
        <TabsTrigger value="export">Export</TabsTrigger>
        <TabsTrigger value="signature">Signature</TabsTrigger>
        <TabsTrigger value="validation">Validation</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="templates">Templates</TabsTrigger>
        <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        <TabsTrigger value="assistant">Assistant IA</TabsTrigger>
        <TabsTrigger value="security">Sécurité</TabsTrigger>
        <TabsTrigger value="realtime-score">Score Temps Réel</TabsTrigger>
      </TabsList>

      <TabsContent value="export">
        <Card className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <FormatIcon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">Export Multi-Format</h3>
          <p className="text-sm text-muted-foreground">
            Exportez vos rapports RGPD dans différents formats
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Format d'export</Label>
          <Select value={format} onValueChange={(v: any) => setFormat(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>PDF - Document complet</span>
                </div>
              </SelectItem>
              <SelectItem value="excel">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Excel - Feuilles de calcul</span>
                </div>
              </SelectItem>
              <SelectItem value="json">
                <div className="flex items-center gap-2">
                  <FileJson className="w-4 h-4" />
                  <span>JSON - Données structurées</span>
                </div>
              </SelectItem>
              <SelectItem value="csv">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>CSV - Données tabulaires</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Template de rapport</Label>
          <Select value={template} onValueChange={(v: any) => setTemplate(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">
                <div>
                  <div className="font-medium">Standard</div>
                  <div className="text-xs text-muted-foreground">Rapport complet avec toutes les sections</div>
                </div>
              </SelectItem>
              <SelectItem value="executive">
                <div>
                  <div className="font-medium">Exécutif</div>
                  <div className="text-xs text-muted-foreground">Résumé pour la direction</div>
                </div>
              </SelectItem>
              <SelectItem value="technical">
                <div>
                  <div className="font-medium">Technique</div>
                  <div className="text-xs text-muted-foreground">Détails techniques approfondis</div>
                </div>
              </SelectItem>
              <SelectItem value="minimal">
                <div>
                  <div className="font-medium">Minimal</div>
                  <div className="text-xs text-muted-foreground">Scores essentiels uniquement</div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="include-history"
            checked={includeHistory}
            onCheckedChange={(checked) => setIncludeHistory(checked as boolean)}
          />
          <Label htmlFor="include-history" className="cursor-pointer text-sm">
            Inclure l'historique des audits (graphiques d'évolution)
          </Label>
        </div>
      </div>

      <Button
        className="w-full"
        size="lg"
        onClick={handleExport}
        disabled={isExporting}
      >
        <Download className="mr-2 h-5 w-5" />
        {isExporting ? 'Export en cours...' : `Exporter en ${format.toUpperCase()}`}
      </Button>

      <div className="text-xs text-muted-foreground space-y-1">
        <p><strong>PDF:</strong> Rapport visuel avec graphiques vectoriels haute qualité</p>
        <p><strong>Excel:</strong> Tableaux avec feuilles multiples pour analyse</p>
        <p><strong>JSON:</strong> Format structuré pour intégrations API</p>
        <p><strong>CSV:</strong> Format tabulaire simple pour import</p>
      </div>
        </Card>
      </TabsContent>

      <TabsContent value="signature">
        <ReportSignature reportId="current-report" />
      </TabsContent>

      <TabsContent value="analytics">
        <ExportAnalyticsDashboard />
      </TabsContent>

      <TabsContent value="templates">
        <TemplateEditor />
      </TabsContent>

      <TabsContent value="validation">
        <ReportValidation reportData={{
          complianceScore: 75,
          totalConsents: 100,
          activeConsents: 80,
          pendingExports: 3,
          criticalAlerts: 1,
          completedDeletions: 15,
          dsarResponseRate: 95,
          reportId: 'current-report',
        }} />
      </TabsContent>

      <TabsContent value="webhooks">
        <WebhookManager />
      </TabsContent>

      <TabsContent value="assistant">
        <GDPRAssistantChat />
      </TabsContent>

      <TabsContent value="security">
        <SecurityPenetrationTest />
      </TabsContent>

      <TabsContent value="realtime-score">
        <RealtimeComplianceScore />
      </TabsContent>
    </Tabs>
  );
}
