import { memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, FileJson, CalendarDays, TrendingUp } from 'lucide-react';
import { useJournalExport } from '@/hooks/useJournalExport';
import type { SanitizedNote } from '@/modules/journal/types';

interface JournalExportPanelProps {
  notes: SanitizedNote[];
  className?: string;
}

/**
 * Panneau d'export des notes de journal
 * Permet d'exporter en PDF, Markdown ou JSON
 */
export const JournalExportPanel = memo<JournalExportPanelProps>(({ notes, className = '' }) => {
  const { exportToPdf, exportToMarkdown, exportToJson, isExporting } = useJournalExport();

  const handleExportPdf = async () => {
    await exportToPdf(notes, {
      filename: `journal-export-${new Date().toISOString().split('T')[0]}.pdf`,
      includeMetadata: true,
    });
  };

  const handleExportMarkdown = async () => {
    await exportToMarkdown(notes, {
      filename: `journal-export-${new Date().toISOString().split('T')[0]}.md`,
      includeMetadata: true,
    });
  };

  const handleExportJson = async () => {
    await exportToJson(notes, {
      filename: `journal-export-${new Date().toISOString().split('T')[0]}.json`,
    });
  };

  const totalNotes = notes.length;
  const dateRange = notes.length > 0 
    ? `${new Date(notes[notes.length - 1].created_at).toLocaleDateString()} - ${new Date(notes[0].created_at).toLocaleDateString()}`
    : 'Aucune note';

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" aria-hidden="true" />
              Exporter mes notes
            </CardTitle>
            <CardDescription>
              Téléchargez vos notes dans différents formats
            </CardDescription>
          </div>
          <Badge variant="secondary">
            {totalNotes} note{totalNotes > 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {notes.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Aucune note à exporter. Créez des notes pour pouvoir les exporter.
          </p>
        ) : (
          <>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              <span>{dateRange}</span>
            </div>

            <div className="grid gap-3">
              <Button
                onClick={handleExportPdf}
                disabled={isExporting || notes.length === 0}
                variant="outline"
                className="w-full justify-start"
              >
                <FileText className="h-4 w-4 mr-2" aria-hidden="true" />
                Exporter en PDF
                <Badge variant="secondary" className="ml-auto">
                  Formaté
                </Badge>
              </Button>

              <Button
                onClick={handleExportMarkdown}
                disabled={isExporting || notes.length === 0}
                variant="outline"
                className="w-full justify-start"
              >
                <FileText className="h-4 w-4 mr-2" aria-hidden="true" />
                Exporter en Markdown
                <Badge variant="secondary" className="ml-auto">
                  Texte
                </Badge>
              </Button>

              <Button
                onClick={handleExportJson}
                disabled={isExporting || notes.length === 0}
                variant="outline"
                className="w-full justify-start"
              >
                <FileJson className="h-4 w-4 mr-2" aria-hidden="true" />
                Exporter en JSON
                <Badge variant="secondary" className="ml-auto">
                  Données
                </Badge>
              </Button>
            </div>

            {isExporting && (
              <p className="text-sm text-muted-foreground text-center">
                Export en cours...
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
});

JournalExportPanel.displayName = 'JournalExportPanel';
