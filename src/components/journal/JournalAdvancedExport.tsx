import { memo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { SanitizedNote } from '@/modules/journal/types';

interface JournalAdvancedExportProps {
  notes: SanitizedNote[];
}

type ExportFormat = 'json' | 'markdown' | 'text' | 'csv';
type DateRange = 'all' | 'last7' | 'last30' | 'last90' | 'thisYear';

export const JournalAdvancedExport = memo<JournalAdvancedExportProps>(({ notes }) => {
  const { toast } = useToast();
  const [format, setFormat] = useState<ExportFormat>('json');
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [includeTags, setIncludeTags] = useState(true);
  const [includeSummary, setIncludeSummary] = useState(true);
  const [includeTimestamps, setIncludeTimestamps] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const filterNotesByDateRange = (notes: SanitizedNote[], range: DateRange): SanitizedNote[] => {
    if (range === 'all') return notes;

    const now = Date.now();
    const ranges: Record<Exclude<DateRange, 'all'>, number> = {
      last7: 7 * 24 * 60 * 60 * 1000,
      last30: 30 * 24 * 60 * 60 * 1000,
      last90: 90 * 24 * 60 * 60 * 1000,
      thisYear: now - new Date(new Date().getFullYear(), 0, 1).getTime(),
    };

    const cutoff = now - ranges[range as Exclude<DateRange, 'all'>];
    return notes.filter(note => new Date(note.created_at).getTime() >= cutoff);
  };

  const exportAsCSV = (filteredNotes: SanitizedNote[]) => {
    let csv = 'Date,Texte';
    if (includeTags) csv += ',Tags';
    if (includeSummary) csv += ',Résumé';
    csv += '\n';

    filteredNotes.forEach(note => {
      const date = includeTimestamps
        ? new Date(note.created_at).toLocaleString('fr-FR')
        : new Date(note.created_at).toLocaleDateString('fr-FR');
      
      const text = `"${note.text.replace(/"/g, '""')}"`;
      const tags = includeTags ? `"${note.tags.join(', ')}"` : '';
      const summary = includeSummary && note.summary ? `"${note.summary.replace(/"/g, '""')}"` : '';

      csv += `${date},${text}`;
      if (includeTags) csv += `,${tags}`;
      if (includeSummary) csv += `,${summary}`;
      csv += '\n';
    });

    return csv;
  };

  const handleExport = () => {
    setIsExporting(true);
    try {
      const filteredNotes = filterNotesByDateRange(notes, dateRange);
      
      if (filteredNotes.length === 0) {
        toast({
          title: 'Aucune note',
          description: 'Aucune note ne correspond aux filtres sélectionnés',
          variant: 'destructive',
        });
        return;
      }

      let content: string;
      let mimeType: string;
      let extension: string;

      switch (format) {
        case 'json': {
          const exportData = filteredNotes.map(note => ({
            text: note.text,
            ...(includeTags && { tags: note.tags }),
            ...(includeSummary && note.summary && { summary: note.summary }),
            ...(includeTimestamps && { created_at: note.created_at }),
          }));
          content = JSON.stringify(exportData, null, 2);
          mimeType = 'application/json';
          extension = 'json';
          break;
        }

        case 'markdown': {
          content = `# Mon Journal\n\nExporté le ${new Date().toLocaleDateString('fr-FR')}\n\n---\n\n`;
          filteredNotes.forEach((note, index) => {
            const date = includeTimestamps
              ? new Date(note.created_at).toLocaleString('fr-FR')
              : new Date(note.created_at).toLocaleDateString('fr-FR');
            content += `## Note ${index + 1} - ${date}\n\n${note.text}\n\n`;
            if (includeTags && note.tags.length > 0) {
              content += `**Tags:** ${note.tags.map(t => `#${t}`).join(', ')}\n\n`;
            }
            if (includeSummary && note.summary) {
              content += `**Résumé:** ${note.summary}\n\n`;
            }
            content += `---\n\n`;
          });
          mimeType = 'text/markdown';
          extension = 'md';
          break;
        }

        case 'csv':
          content = exportAsCSV(filteredNotes);
          mimeType = 'text/csv';
          extension = 'csv';
          break;

        case 'text':
        default: {
          content = `MON JOURNAL\nExporté le ${new Date().toLocaleDateString('fr-FR')}\n\n${'='.repeat(60)}\n\n`;
          filteredNotes.forEach((note, index) => {
            const date = includeTimestamps
              ? new Date(note.created_at).toLocaleString('fr-FR')
              : new Date(note.created_at).toLocaleDateString('fr-FR');
            content += `Note ${index + 1} - ${date}\n${'-'.repeat(60)}\n\n${note.text}\n\n`;
            if (includeTags && note.tags.length > 0) {
              content += `Tags: ${note.tags.map(t => `#${t}`).join(', ')}\n\n`;
            }
            if (includeSummary && note.summary) {
              content += `Résumé: ${note.summary}\n\n`;
            }
            content += `${'='.repeat(60)}\n\n`;
          });
          mimeType = 'text/plain';
          extension = 'txt';
          break;
        }
      }

      const dataBlob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `journal-export-advanced-${new Date().toISOString().split('T')[0]}.${extension}`;
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: 'Export réussi',
        description: `${filteredNotes.length} notes exportées en ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: 'Erreur d\'export',
        description: 'Impossible d\'exporter les notes',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const hasNotes = notes.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          Export avancé
        </CardTitle>
        <CardDescription>
          Personnalisez votre export avec des filtres et options
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="export-format">Format d'export</Label>
          <Select value={format} onValueChange={(v) => setFormat(v as ExportFormat)}>
            <SelectTrigger id="export-format">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="json">JSON</SelectItem>
              <SelectItem value="markdown">Markdown</SelectItem>
              <SelectItem value="text">Texte brut</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date-range">Période</Label>
          <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
            <SelectTrigger id="date-range">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les notes</SelectItem>
              <SelectItem value="last7">7 derniers jours</SelectItem>
              <SelectItem value="last30">30 derniers jours</SelectItem>
              <SelectItem value="last90">90 derniers jours</SelectItem>
              <SelectItem value="thisYear">Cette année</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Options d'export</Label>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-tags"
              checked={includeTags}
              onCheckedChange={(checked) => setIncludeTags(checked as boolean)}
            />
            <label htmlFor="include-tags" className="text-sm cursor-pointer">
              Inclure les tags
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-summary"
              checked={includeSummary}
              onCheckedChange={(checked) => setIncludeSummary(checked as boolean)}
            />
            <label htmlFor="include-summary" className="text-sm cursor-pointer">
              Inclure les résumés
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-timestamps"
              checked={includeTimestamps}
              onCheckedChange={(checked) => setIncludeTimestamps(checked as boolean)}
            />
            <label htmlFor="include-timestamps" className="text-sm cursor-pointer">
              Inclure les horodatages complets
            </label>
          </div>
        </div>

        <Button
          onClick={handleExport}
          disabled={!hasNotes || isExporting}
          className="w-full"
        >
          <Download className="h-4 w-4 mr-2" />
          Exporter ({filterNotesByDateRange(notes, dateRange).length} notes)
        </Button>

        {!hasNotes && (
          <p className="text-xs text-muted-foreground text-center">
            Aucune note à exporter
          </p>
        )}
      </CardContent>
    </Card>
  );
});

JournalAdvancedExport.displayName = 'JournalAdvancedExport';
