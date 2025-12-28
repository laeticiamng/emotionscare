/**
 * CoachExportButton - Export de la conversation
 */

import { memo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileText, File, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

interface CoachExportButtonProps {
  messages: ChatMessage[];
  disabled?: boolean;
}

function generateTextExport(messages: ChatMessage[]): string {
  const header = `=== Conversation Coach IA ===
Date d'export : ${format(new Date(), 'PPPpp', { locale: fr })}
Nombre de messages : ${messages.length}
${'='.repeat(30)}

`;

  const content = messages
    .map((msg) => {
      const role = msg.role === 'assistant' ? '🤖 Coach' : '👤 Vous';
      const time = format(new Date(msg.createdAt), 'HH:mm', { locale: fr });
      return `[${time}] ${role}:\n${msg.content}\n`;
    })
    .join('\n');

  const footer = `
${'='.repeat(30)}
Généré par EmotionsCare Coach IA
Note : Ce document est confidentiel et destiné à votre usage personnel.`;

  return header + content + footer;
}

function generateMarkdownExport(messages: ChatMessage[]): string {
  const header = `# Conversation Coach IA

**Date d'export :** ${format(new Date(), 'PPPpp', { locale: fr })}  
**Messages :** ${messages.length}

---

`;

  const content = messages
    .map((msg) => {
      const role = msg.role === 'assistant' ? '**🤖 Coach**' : '**👤 Vous**';
      const time = format(new Date(msg.createdAt), 'HH:mm', { locale: fr });
      return `### ${role} — ${time}\n\n${msg.content}\n`;
    })
    .join('\n---\n\n');

  const footer = `
---

*Généré par EmotionsCare Coach IA*  
*Ce document est confidentiel et destiné à votre usage personnel.*`;

  return header + content + footer;
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export const CoachExportButton = memo(function CoachExportButton({
  messages,
  disabled = false,
}: CoachExportButtonProps) {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'txt' | 'md') => {
    if (messages.length === 0) {
      toast({
        title: 'Aucun message',
        description: 'Démarre une conversation pour pouvoir l\'exporter.',
        variant: 'destructive',
      });
      return;
    }

    setIsExporting(true);
    try {
      const dateStr = format === 'txt' ? 'conversation-coach' : 'conversation-coach';
      const timestamp = format === 'txt' 
        ? new Date().toISOString().slice(0, 10) 
        : new Date().toISOString().slice(0, 10);
      
      if (format === 'txt') {
        const content = generateTextExport(messages);
        downloadFile(content, `${dateStr}-${timestamp}.txt`, 'text/plain;charset=utf-8');
      } else {
        const content = generateMarkdownExport(messages);
        downloadFile(content, `${dateStr}-${timestamp}.md`, 'text/markdown;charset=utf-8');
      }

      toast({
        title: 'Export réussi',
        description: `Ta conversation a été exportée en ${format === 'txt' ? 'texte' : 'Markdown'}.`,
      });
    } catch (error) {
      toast({
        title: 'Erreur d\'export',
        description: 'Impossible d\'exporter la conversation.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled || isExporting || messages.length === 0}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Exporter
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('txt')}>
          <FileText className="mr-2 h-4 w-4" />
          Texte (.txt)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('md')}>
          <File className="mr-2 h-4 w-4" />
          Markdown (.md)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
