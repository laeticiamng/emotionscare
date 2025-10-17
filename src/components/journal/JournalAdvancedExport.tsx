import { useState } from 'react';
import { Download, FileText, FileJson, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { format as formatDate } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { SanitizedNote } from '@/modules/journal/types';

interface JournalAdvancedExportProps {
  notes: SanitizedNote[];
}

type ExportFormat = 'markdown' | 'json' | 'txt' | 'csv';
type DateRange = 'all' | 'today' | 'week' | 'month' | 'custom';

/**
 * Composant d'export avancé avec filtres et formats multiples
 * Permet d'exporter les notes avec options de personnalisation
 */
export function JournalAdvancedExport({ notes }: JournalAdvancedExportProps) {
  const { toast } = useToast();
  const [format, setFormat] = useState<ExportFormat>('markdown');
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [includeTags, setIncludeTags] = useState(true);

  // Extraire tous les tags uniques
  const allTags = Array.from(new Set(notes.flatMap(note => note.tags))).sort();

  const filterNotes = (): SanitizedNote[] => {
    let filtered = [...notes];

    // Filtrer par plage de dates
    if (dateRange !== 'all') {
      const now = new Date();
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));

      switch (dateRange) {
        case 'today':
          filtered = filtered.filter(note => 
            new Date(note.created_at) >= startOfDay
          );
          break;
        case 'week':
          const weekAgo = new Date(startOfDay);
          weekAgo.setDate(weekAgo.getDate() - 7);
          filtered = filtered.filter(note => 
            new Date(note.created_at) >= weekAgo
          );
          break;
        case 'month':
          const monthAgo = new Date(startOfDay);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          filtered = filtered.filter(note => 
            new Date(note.created_at) >= monthAgo
          );
          break;
        case 'custom':
          if (dateFrom) {
            filtered = filtered.filter(note => 
              new Date(note.created_at) >= dateFrom
            );
          }
          if (dateTo) {
            const endDate = new Date(dateTo);
            endDate.setHours(23, 59, 59, 999);
            filtered = filtered.filter(note => 
              new Date(note.created_at) <= endDate
            );
          }
          break;
      }
    }

    // Filtrer par tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(note =>
        selectedTags.some(tag => note.tags.includes(tag))
      );
    }

    return filtered;
  };

  const generateMarkdown = (notesToExport: SanitizedNote[]): string => {
    let markdown = '# Mon Journal\n\n';

    if (includeMetadata) {
      markdown += `Exporté le: ${formatDate(new Date(), 'PPP', { locale: fr })}\n`;
      markdown += `Nombre de notes: ${notesToExport.length}\n\n`;
      markdown += '---\n\n';
    }

    notesToExport.forEach(note => {
      const date = formatDate(new Date(note.created_at), 'PPP', { locale: fr });
      markdown += `## ${date}\n\n`;
      
      if (includeTags && note.tags.length > 0) {
        markdown += `**Tags**: ${note.tags.join(', ')}\n\n`;
      }
      
      markdown += `${note.text}\n\n`;
      markdown += '---\n\n';
    });

    return markdown;
  };

  const generateJSON = (notesToExport: SanitizedNote[]): string => {
    const data = {
      exported_at: new Date().toISOString(),
      count: notesToExport.length,
      notes: notesToExport.map(note => ({
        id: note.id,
        text: note.text,
        tags: includeTags ? note.tags : undefined,
        created_at: includeMetadata ? note.created_at : undefined,
      })),
    };

    return JSON.stringify(data, null, 2);
  };

  const generateText = (notesToExport: SanitizedNote[]): string => {
    let text = 'MON JOURNAL\n';
    text += '='.repeat(50) + '\n\n';

    if (includeMetadata) {
      text += `Exporté le: ${formatDate(new Date(), 'PPP', { locale: fr })}\n`;
      text += `Nombre de notes: ${notesToExport.length}\n\n`;
    }

    notesToExport.forEach(note => {
      const date = formatDate(new Date(note.created_at), 'PPP', { locale: fr });
      text += `${date}\n`;
      text += '-'.repeat(50) + '\n';
      
      if (includeTags && note.tags.length > 0) {
        text += `Tags: ${note.tags.join(', ')}\n\n`;
      }
      
      text += `${note.text}\n\n`;
      text += '\n';
    });

    return text;
  };

  const generateCSV = (notesToExport: SanitizedNote[]): string => {
    const headers = ['Date', 'Texte'];
    if (includeTags) headers.push('Tags');
    if (includeMetadata) headers.push('ID');

    let csv = headers.join(',') + '\n';

    notesToExport.forEach(note => {
      const row = [
        `"${formatDate(new Date(note.created_at), 'yyyy-MM-dd HH:mm')}"`,
        `"${note.text.replace(/"/g, '""')}"`,
      ];
      
      if (includeTags) {
        row.push(`"${note.tags.join(', ')}"`);
      }
      
      if (includeMetadata) {
        row.push(`"${note.id}"`);
      }

      csv += row.join(',') + '\n';
    });

    return csv;
  };

  const handleExport = () => {
    const notesToExport = filterNotes();

    if (notesToExport.length === 0) {
      toast({
        title: 'Aucune note à exporter',
        description: 'Aucune note ne correspond aux critères sélectionnés.',
        variant: 'destructive',
      });
      return;
    }

    let content: string;
    let filename: string;
    let mimeType: string;

    switch (format) {
      case 'markdown':
        content = generateMarkdown(notesToExport);
        filename = `journal-${formatDate(new Date(), 'yyyy-MM-dd')}.md`;
        mimeType = 'text/markdown';
        break;
      case 'json':
        content = generateJSON(notesToExport);
        filename = `journal-${formatDate(new Date(), 'yyyy-MM-dd')}.json`;
        mimeType = 'application/json';
        break;
      case 'txt':
        content = generateText(notesToExport);
        filename = `journal-${formatDate(new Date(), 'yyyy-MM-dd')}.txt`;
        mimeType = 'text/plain';
        break;
      case 'csv':
        content = generateCSV(notesToExport);
        filename = `journal-${formatDate(new Date(), 'yyyy-MM-dd')}.csv`;
        mimeType = 'text/csv';
        break;
      default:
        return;
    }

    // Créer et télécharger le fichier
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Export réussi',
      description: `${notesToExport.length} note(s) exportée(s) au format ${format.toUpperCase()}.`,
    });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filteredCount = filterNotes().length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5 text-primary" />
          Export avancé
        </CardTitle>
        <CardDescription>
          Exportez vos notes avec des options de personnalisation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Format d'export */}
        <div className="space-y-2">
          <Label htmlFor="format">Format d'export</Label>
          <Select value={format} onValueChange={(v: ExportFormat) => setFormat(v)}>
            <SelectTrigger id="format">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="markdown">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Markdown (.md)
                </div>
              </SelectItem>
              <SelectItem value="json">
                <div className="flex items-center gap-2">
                  <FileJson className="h-4 w-4" />
                  JSON (.json)
                </div>
              </SelectItem>
              <SelectItem value="txt">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Texte brut (.txt)
                </div>
              </SelectItem>
              <SelectItem value="csv">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  CSV (.csv)
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Plage de dates */}
        <div className="space-y-2">
          <Label htmlFor="date-range">Période</Label>
          <Select value={dateRange} onValueChange={(v: DateRange) => setDateRange(v)}>
            <SelectTrigger id="date-range">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les notes</SelectItem>
              <SelectItem value="today">Aujourd'hui</SelectItem>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="custom">Personnalisée</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sélecteur de dates personnalisé */}
        {dateRange === 'custom' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Du</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !dateFrom && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? formatDate(dateFrom, 'P', { locale: fr }) : 'Sélectionner'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    initialFocus
                    className={cn('p-3 pointer-events-auto')}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Au</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !dateTo && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? formatDate(dateTo, 'P', { locale: fr }) : 'Sélectionner'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    initialFocus
                    className={cn('p-3 pointer-events-auto')}
                    disabled={(date) => dateFrom ? date < dateFrom : false}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}

        {/* Filtres par tags */}
        {allTags.length > 0 && (
          <div className="space-y-2">
            <Label>
              <Filter className="inline h-4 w-4 mr-1" />
              Filtrer par tags
            </Label>
            <div className="flex flex-wrap gap-2">
              {allTags.slice(0, 8).map(tag => (
                <Button
                  key={tag}
                  variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleTag(tag)}
                  className="text-xs"
                >
                  {tag}
                </Button>
              ))}
            </div>
            {selectedTags.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTags([])}
                className="text-xs"
              >
                Réinitialiser les tags
              </Button>
            )}
          </div>
        )}

        {/* Options d'export */}
        <div className="space-y-3 pt-4 border-t">
          <Label>Options d'export</Label>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="metadata"
              checked={includeMetadata}
              onCheckedChange={(checked) => setIncludeMetadata(checked === true)}
            />
            <label
              htmlFor="metadata"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Inclure les métadonnées (date, ID)
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="tags"
              checked={includeTags}
              onCheckedChange={(checked) => setIncludeTags(checked === true)}
            />
            <label
              htmlFor="tags"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Inclure les tags
            </label>
          </div>
        </div>

        {/* Bouton d'export */}
        <div className="pt-4 space-y-2">
          <Button onClick={handleExport} className="w-full" size="lg">
            <Download className="mr-2 h-4 w-4" />
            Exporter {filteredCount} note{filteredCount > 1 ? 's' : ''}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Sur {notes.length} note{notes.length > 1 ? 's' : ''} au total
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
