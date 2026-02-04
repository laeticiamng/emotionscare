/**
 * ExportDashboard - Tableau de bord d'export de données
 * Exports personnalisés avec formats multiples et planification
 */

import { memo, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  FileSpreadsheet,
  FileText,
  FileJson,
  Calendar,
  Clock,
  CheckCircle,
  Loader2,
  History,
  Settings,
} from 'lucide-react';
import { toast } from 'sonner';

interface ExportConfig {
  format: 'csv' | 'xlsx' | 'json' | 'pdf';
  modules: string[];
  dateRange: { start: string; end: string };
  includeAnonymized: boolean;
  compression: boolean;
}

interface ExportHistory {
  id: string;
  filename: string;
  format: string;
  size: string;
  createdAt: Date;
  status: 'completed' | 'failed' | 'pending';
}

interface ScheduledExport {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  nextRun: Date;
  modules: string[];
  format: string;
  active: boolean;
}

interface ExportDashboardProps {
  className?: string;
}

const AVAILABLE_MODULES = [
  { id: 'mood', label: 'Humeur & Émotions' },
  { id: 'journal', label: 'Journal' },
  { id: 'scan', label: 'Scans émotionnels' },
  { id: 'activities', label: 'Activités' },
  { id: 'sessions', label: 'Sessions' },
  { id: 'community', label: 'Communauté' },
  { id: 'gamification', label: 'Gamification' },
];

const FORMAT_ICONS: Record<string, React.ReactNode> = {
  csv: <FileText className="h-4 w-4" />,
  xlsx: <FileSpreadsheet className="h-4 w-4" />,
  json: <FileJson className="h-4 w-4" />,
  pdf: <FileText className="h-4 w-4" />,
};

const MOCK_HISTORY: ExportHistory[] = [
  { id: 'e1', filename: 'export_mood_2026-02.xlsx', format: 'xlsx', size: '2.4 MB', createdAt: new Date(Date.now() - 3600000), status: 'completed' },
  { id: 'e2', filename: 'export_full_2026-01.csv', format: 'csv', size: '8.1 MB', createdAt: new Date(Date.now() - 86400000), status: 'completed' },
  { id: 'e3', filename: 'export_journal_2026-02.json', format: 'json', size: '1.2 MB', createdAt: new Date(Date.now() - 172800000), status: 'failed' },
];

const MOCK_SCHEDULED: ScheduledExport[] = [
  { id: 's1', name: 'Rapport hebdo humeur', frequency: 'weekly', nextRun: new Date(Date.now() + 259200000), modules: ['mood', 'scan'], format: 'xlsx', active: true },
  { id: 's2', name: 'Backup mensuel complet', frequency: 'monthly', nextRun: new Date(Date.now() + 1209600000), modules: AVAILABLE_MODULES.map(m => m.id), format: 'json', active: true },
];

export const ExportDashboard = memo(function ExportDashboard({
  className = '',
}: ExportDashboardProps) {
  const [config, setConfig] = useState<ExportConfig>({
    format: 'xlsx',
    modules: ['mood', 'journal'],
    dateRange: { 
      start: new Date(Date.now() - 2592000000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
    },
    includeAnonymized: false,
    compression: true,
  });
  const [isExporting, setIsExporting] = useState(false);

  const handleModuleToggle = useCallback((moduleId: string) => {
    setConfig((prev) => ({
      ...prev,
      modules: prev.modules.includes(moduleId)
        ? prev.modules.filter((m) => m !== moduleId)
        : [...prev.modules, moduleId],
    }));
  }, []);

  const handleExport = useCallback(async () => {
    if (config.modules.length === 0) {
      toast.error('Sélectionnez au moins un module');
      return;
    }

    setIsExporting(true);
    
    // Simulation export
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    toast.success('Export généré avec succès', {
      description: `Format: ${config.format.toUpperCase()} • ${config.modules.length} module(s)`,
    });
    
    setIsExporting(false);
  }, [config]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5 text-primary" />
          Centre d'export de données
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="manual" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="manual">
              <Download className="h-4 w-4 mr-1" />
              Export manuel
            </TabsTrigger>
            <TabsTrigger value="scheduled">
              <Calendar className="h-4 w-4 mr-1" />
              Planifiés
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="h-4 w-4 mr-1" />
              Historique
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4">
            {/* Format */}
            <div>
              <Label className="mb-2 block">Format d'export</Label>
              <div className="flex gap-2">
                {(['csv', 'xlsx', 'json', 'pdf'] as const).map((format) => (
                  <Button
                    key={format}
                    variant={config.format === format ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setConfig((p) => ({ ...p, format }))}
                    className="gap-1"
                  >
                    {FORMAT_ICONS[format]}
                    {format.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>

            {/* Modules */}
            <div>
              <Label className="mb-2 block">Modules à exporter</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {AVAILABLE_MODULES.map((module) => (
                  <div
                    key={module.id}
                    className={`flex items-center gap-2 rounded-lg border p-3 cursor-pointer transition-colors ${
                      config.modules.includes(module.id) 
                        ? 'border-primary bg-primary/5' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handleModuleToggle(module.id)}
                  >
                    <Checkbox 
                      checked={config.modules.includes(module.id)}
                      onCheckedChange={() => handleModuleToggle(module.id)}
                    />
                    <span className="text-sm">{module.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Période */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-date">Date début</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={config.dateRange.start}
                  onChange={(e) => setConfig((p) => ({
                    ...p,
                    dateRange: { ...p.dateRange, start: e.target.value },
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="end-date">Date fin</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={config.dateRange.end}
                  onChange={(e) => setConfig((p) => ({
                    ...p,
                    dateRange: { ...p.dateRange, end: e.target.value },
                  }))}
                />
              </div>
            </div>

            {/* Options */}
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox 
                  checked={config.includeAnonymized}
                  onCheckedChange={(c) => setConfig((p) => ({ ...p, includeAnonymized: !!c }))}
                />
                <span className="text-sm">Inclure données anonymisées</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox 
                  checked={config.compression}
                  onCheckedChange={(c) => setConfig((p) => ({ ...p, compression: !!c }))}
                />
                <span className="text-sm">Compression ZIP</span>
              </label>
            </div>

            {/* Bouton export */}
            <Button 
              onClick={handleExport} 
              disabled={isExporting || config.modules.length === 0}
              className="w-full"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Générer l'export
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-4">
            {MOCK_SCHEDULED.map((scheduled) => (
              <div
                key={scheduled.id}
                className="rounded-lg border p-4 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{scheduled.name}</h4>
                    <Badge variant={scheduled.active ? 'default' : 'secondary'}>
                      {scheduled.active ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {scheduled.frequency === 'daily' && 'Quotidien'}
                    {scheduled.frequency === 'weekly' && 'Hebdomadaire'}
                    {scheduled.frequency === 'monthly' && 'Mensuel'}
                    {' • '}
                    Prochain : {scheduled.nextRun.toLocaleDateString('fr-FR')}
                  </p>
                  <div className="flex gap-1 mt-2">
                    {scheduled.modules.slice(0, 3).map((m) => (
                      <Badge key={m} variant="outline" className="text-xs">
                        {AVAILABLE_MODULES.find((am) => am.id === m)?.label || m}
                      </Badge>
                    ))}
                    {scheduled.modules.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{scheduled.modules.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Planifier un nouvel export
            </Button>
          </TabsContent>

          <TabsContent value="history" className="space-y-3">
            {MOCK_HISTORY.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  {FORMAT_ICONS[item.format]}
                  <div>
                    <p className="text-sm font-medium">{item.filename}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.size} • {item.createdAt.toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.status === 'completed' && (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  {item.status === 'failed' && (
                    <Badge variant="destructive">Échec</Badge>
                  )}
                  {item.status === 'pending' && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
});

export default ExportDashboard;
