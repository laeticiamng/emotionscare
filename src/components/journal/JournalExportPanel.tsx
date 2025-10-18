import { memo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, FileJson, FileType } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { SanitizedNote } from '@/modules/journal/types';

interface JournalExportPanelProps {
  notes: SanitizedNote[];
}

export const JournalExportPanel = memo<JournalExportPanelProps>(({ notes }) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const exportAsJSON = () => {
    setIsExporting(true);
    try {
      const dataStr = JSON.stringify(notes, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `journal-export-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: 'Export réussi',
        description: `${notes.length} notes exportées en JSON`,
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

  const exportAsMarkdown = () => {
    setIsExporting(true);
    try {
      let markdown = `# Mon Journal\n\nExporté le ${new Date().toLocaleDateString('fr-FR')}\n\n---\n\n`;
      
      notes.forEach((note, index) => {
        const date = new Date(note.created_at).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
        
        markdown += `## Note ${index + 1} - ${date}\n\n`;
        markdown += `${note.text}\n\n`;
        
        if (note.tags.length > 0) {
          markdown += `**Tags:** ${note.tags.map(t => `#${t}`).join(', ')}\n\n`;
        }
        
        if (note.summary) {
          markdown += `**Résumé:** ${note.summary}\n\n`;
        }
        
        markdown += `---\n\n`;
      });

      const dataBlob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `journal-export-${new Date().toISOString().split('T')[0]}.md`;
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: 'Export réussi',
        description: `${notes.length} notes exportées en Markdown`,
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

  const exportAsText = () => {
    setIsExporting(true);
    try {
      let text = `MON JOURNAL\nExporté le ${new Date().toLocaleDateString('fr-FR')}\n\n${'='.repeat(60)}\n\n`;
      
      notes.forEach((note, index) => {
        const date = new Date(note.created_at).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
        
        text += `Note ${index + 1} - ${date}\n`;
        text += `${'-'.repeat(60)}\n\n`;
        text += `${note.text}\n\n`;
        
        if (note.tags.length > 0) {
          text += `Tags: ${note.tags.map(t => `#${t}`).join(', ')}\n\n`;
        }
        
        if (note.summary) {
          text += `Résumé: ${note.summary}\n\n`;
        }
        
        text += `${'='.repeat(60)}\n\n`;
      });

      const dataBlob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `journal-export-${new Date().toISOString().split('T')[0]}.txt`;
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: 'Export réussi',
        description: `${notes.length} notes exportées en texte brut`,
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
          <Download className="h-5 w-5 text-primary" />
          Export simple
        </CardTitle>
        <CardDescription>
          Exportez vos notes dans différents formats
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <Button
          onClick={exportAsJSON}
          disabled={!hasNotes || isExporting}
          className="w-full justify-start"
          variant="outline"
        >
          <FileJson className="h-4 w-4 mr-2" />
          Exporter en JSON
        </Button>

        <Button
          onClick={exportAsMarkdown}
          disabled={!hasNotes || isExporting}
          className="w-full justify-start"
          variant="outline"
        >
          <FileText className="h-4 w-4 mr-2" />
          Exporter en Markdown
        </Button>

        <Button
          onClick={exportAsText}
          disabled={!hasNotes || isExporting}
          className="w-full justify-start"
          variant="outline"
        >
          <FileType className="h-4 w-4 mr-2" />
          Exporter en Texte brut
        </Button>

        {!hasNotes && (
          <p className="text-xs text-muted-foreground text-center pt-2">
            Aucune note à exporter
          </p>
        )}
      </CardContent>
    </Card>
  );
});

JournalExportPanel.displayName = 'JournalExportPanel';
