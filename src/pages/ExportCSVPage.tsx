// @ts-nocheck
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FileSpreadsheet, Download, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { format, subDays, startOfYear } from 'date-fns';

const DATA_TYPES = {
  emotions: { label: 'Scans émotionnels', table: 'emotion_scans', columns: ['created_at', 'emotion', 'intensity', 'context', 'notes'] },
  journal: { label: 'Journal', table: 'journal_entries', columns: ['created_at', 'title', 'content', 'mood_score', 'tags'] },
  sessions: { label: 'Sessions d\'activité', table: 'activity_sessions', columns: ['started_at', 'completed_at', 'duration_seconds', 'mood_before', 'mood_after', 'rating'] },
  goals: { label: 'Objectifs', table: 'user_goals', columns: ['created_at', 'title', 'target_value', 'current_value', 'status'] },
};

const PERIODS = {
  week: { label: '7 derniers jours', days: 7 },
  month: { label: '30 derniers jours', days: 30 },
  quarter: { label: '90 derniers jours', days: 90 },
  year: { label: 'Cette année', days: null },
  all: { label: 'Toutes les données', days: null },
};

function toCsvString(rows: Record<string, any>[], columns: string[]): string {
  if (rows.length === 0) return '';
  const header = columns.join(',');
  const body = rows.map(row =>
    columns.map(col => {
      const val = row[col];
      if (val === null || val === undefined) return '';
      const str = String(val).replace(/"/g, '""');
      return str.includes(',') || str.includes('"') || str.includes('\n') ? `"${str}"` : str;
    }).join(',')
  ).join('\n');
  return `${header}\n${body}`;
}

function downloadCsv(csv: string, filename: string) {
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ExportCSVPage() {
  const { user } = useAuth();
  const [dataType, setDataType] = useState<string>('');
  const [period, setPeriod] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExport = async () => {
    if (!dataType || !period) {
      toast.error('Veuillez sélectionner un type de données et une période');
      return;
    }
    if (!user) {
      toast.error('Vous devez être connecté pour exporter vos données');
      return;
    }

    setIsExporting(true);
    setExported(false);

    try {
      const config = DATA_TYPES[dataType as keyof typeof DATA_TYPES];
      const periodConfig = PERIODS[period as keyof typeof PERIODS];

      let query = supabase
        .from(config.table)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (period === 'year') {
        query = query.gte('created_at', startOfYear(new Date()).toISOString());
      } else if (periodConfig.days) {
        query = query.gte('created_at', subDays(new Date(), periodConfig.days).toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;

      if (!data || data.length === 0) {
        toast.info('Aucune donnée trouvée pour cette sélection');
        return;
      }

      const csv = toCsvString(data, config.columns);
      const filename = `emotionscare_${dataType}_${format(new Date(), 'yyyy-MM-dd')}.csv`;
      downloadCsv(csv, filename);

      setExported(true);
      toast.success(`${data.length} enregistrements exportés avec succès`);
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Erreur lors de l\'export. Veuillez réessayer.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto p-6 space-y-6">
      <Link to="/app/home" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Retour au dashboard
      </Link>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Export CSV</h1>
        <p className="text-muted-foreground">
          Exportez vos données au format CSV pour analyse
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileSpreadsheet className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Configuration d'export</h3>
            <p className="text-sm text-muted-foreground">
              Choisissez les données à exporter
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Type de données</Label>
            <Select value={dataType} onValueChange={setDataType}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DATA_TYPES).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Période</Label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez la période" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PERIODS).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={handleExport}
          disabled={isExporting || !dataType || !period}
        >
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Export en cours...
            </>
          ) : exported ? (
            <>
              <CheckCircle className="mr-2 h-5 w-5" />
              Exporté ! Cliquez pour re-télécharger
            </>
          ) : (
            <>
              <Download className="mr-2 h-5 w-5" />
              Télécharger le CSV
            </>
          )}
        </Button>
      </Card>
    </div>
  );
}
