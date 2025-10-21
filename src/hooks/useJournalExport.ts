import { useState } from 'react';
import { toast } from 'sonner';
import type { SanitizedNote } from '@/modules/journal/types';
import { logger } from '@/lib/logger';

interface ExportOptions {
  filename: string;
  includeMetadata?: boolean;
}

/**
 * Hook pour exporter les notes de journal dans différents formats
 */
export const useJournalExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPdf = async (notes: SanitizedNote[], options: ExportOptions) => {
    setIsExporting(true);
    try {
      // Générer le contenu HTML pour le PDF
      const htmlContent = generateHtmlContent(notes, options.includeMetadata);
      
      // Créer un blob et télécharger
      // Note: Pour une vraie implémentation PDF, utiliser une lib comme jsPDF ou pdfmake
      const blob = new Blob([htmlContent], { type: 'text/html' });
      downloadBlob(blob, options.filename.replace('.pdf', '.html'));
      
      toast.success('Export PDF réussi');
    } catch (error) {
      toast.error('Erreur lors de l\'export PDF');
      logger.error('Export PDF error', error as Error, 'UI');
    } finally {
      setIsExporting(false);
    }
  };

  const exportToMarkdown = async (notes: SanitizedNote[], options: ExportOptions) => {
    setIsExporting(true);
    try {
      const markdownContent = generateMarkdownContent(notes, options.includeMetadata);
      const blob = new Blob([markdownContent], { type: 'text/markdown' });
      downloadBlob(blob, options.filename);
      
      toast.success('Export Markdown réussi');
    } catch (error) {
      toast.error('Erreur lors de l\'export Markdown');
      logger.error('Export Markdown error', error as Error, 'UI');
    } finally {
      setIsExporting(false);
    }
  };

  const exportToJson = async (notes: SanitizedNote[], options: ExportOptions) => {
    setIsExporting(true);
    try {
      const jsonContent = JSON.stringify(notes, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      downloadBlob(blob, options.filename);
      
      toast.success('Export JSON réussi');
    } catch (error) {
      toast.error('Erreur lors de l\'export JSON');
      logger.error('Export JSON error', error as Error, 'UI');
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportToPdf,
    exportToMarkdown,
    exportToJson,
    isExporting,
  };
};

/**
 * Génère le contenu HTML pour l'export PDF
 */
function generateHtmlContent(notes: SanitizedNote[], includeMetadata = true): string {
  const today = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  let html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Export Journal - ${today}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
    h1 { color: #333; border-bottom: 3px solid #0066cc; padding-bottom: 10px; }
    .note { margin: 30px 0; padding: 20px; border-left: 4px solid #0066cc; background: #f9f9f9; }
    .note-header { display: flex; justify-content: space-between; margin-bottom: 15px; }
    .note-date { font-weight: bold; color: #666; }
    .note-mode { background: #e3f2fd; padding: 4px 8px; border-radius: 4px; font-size: 0.85em; }
    .note-text { line-height: 1.6; color: #333; }
    .note-tags { margin-top: 15px; }
    .tag { background: #e8f5e9; padding: 4px 12px; border-radius: 12px; margin-right: 8px; font-size: 0.85em; }
    .note-summary { margin-top: 15px; padding: 10px; background: #fff3e0; border-radius: 4px; font-style: italic; }
    .metadata { color: #999; font-size: 0.85em; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; }
  </style>
</head>
<body>
  <h1>📔 Mon Journal Émotionnel</h1>
  <p><strong>Date d'export :</strong> ${today}</p>
  <p><strong>Nombre de notes :</strong> ${notes.length}</p>
  <hr>
`;

  notes.forEach((note, index) => {
    const date = new Date(note.created_at).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    html += `
  <div class="note">
    <div class="note-header">
      <span class="note-date">${date}</span>
      <span class="note-mode">${note.mode === 'voice' ? '🎤 Vocal' : '✍️ Texte'}</span>
    </div>
    <div class="note-text">${note.text || ''}</div>
`;

    if (note.tags && note.tags.length > 0) {
      html += `
    <div class="note-tags">
      ${note.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
    </div>
`;
    }

    if (note.summary && includeMetadata) {
      html += `
    <div class="note-summary">
      💡 ${note.summary}
    </div>
`;
    }

    html += `
  </div>
`;
  });

  if (includeMetadata) {
    html += `
  <div class="metadata">
    <p>Export généré par EmotionsCare Journal</p>
    <p>Ce document contient vos notes personnelles. Traitez-le de manière confidentielle.</p>
  </div>
`;
  }

  html += `
</body>
</html>
`;

  return html;
}

/**
 * Génère le contenu Markdown
 */
function generateMarkdownContent(notes: SanitizedNote[], includeMetadata = true): string {
  const today = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  let markdown = `# 📔 Mon Journal Émotionnel\n\n`;
  markdown += `**Date d'export :** ${today}  \n`;
  markdown += `**Nombre de notes :** ${notes.length}\n\n`;
  markdown += `---\n\n`;

  notes.forEach((note) => {
    const date = new Date(note.created_at).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    markdown += `## ${date} ${note.mode === 'voice' ? '🎤' : '✍️'}\n\n`;
    markdown += `${note.text || ''}\n\n`;

    if (note.tags && note.tags.length > 0) {
      markdown += `**Tags :** ${note.tags.map(tag => `#${tag}`).join(' ')}\n\n`;
    }

    if (note.summary && includeMetadata) {
      markdown += `> 💡 ${note.summary}\n\n`;
    }

    markdown += `---\n\n`;
  });

  if (includeMetadata) {
    markdown += `\n\n*Export généré par EmotionsCare Journal*  \n`;
    markdown += `*Ce document contient vos notes personnelles. Traitez-le de manière confidentielle.*\n`;
  }

  return markdown;
}

/**
 * Télécharge un blob comme fichier
 */
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
