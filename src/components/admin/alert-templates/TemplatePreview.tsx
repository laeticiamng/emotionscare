import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EXAMPLE_DATA } from './types';

interface TemplatePreviewProps {
  body: string;
  subject?: string;
}

export const TemplatePreview = ({ body, subject }: TemplatePreviewProps) => {
  const renderPreview = (text: string): string => {
    if (!text) return '';

    let preview = text;

    try {
      // Simple variable replacement for preview
      Object.entries(EXAMPLE_DATA).forEach(([key, value]) => {
        try {
          const regex = new RegExp(`{{${key}}}`, 'g');
          if (Array.isArray(value)) {
            preview = preview.replace(regex, value.join(', '));
          } else {
            preview = preview.replace(regex, String(value));
          }
        } catch (error) {
          console.error(`Error replacing variable ${key}:`, error);
        }
      });

      // Handle conditionals (simplified)
      try {
        preview = preview.replace(/{{#if \w+}}[\s\S]*?{{\/if}}/g, (match) => {
          return match.replace(/{{#if \w+}}|{{\/if}}/g, '');
        });
      } catch (error) {
        console.error('Error handling conditionals:', error);
      }

      // Handle loops (simplified)
      try {
        preview = preview.replace(/{{#each preventionTips}}[\s\S]*?{{\/each}}/g,
          EXAMPLE_DATA.preventionTips.map((tip, i) => `${i + 1}. ${tip}`).join('\n')
        );
      } catch (error) {
        console.error('Error handling loops:', error);
      }
    } catch (error) {
      console.error('Error rendering preview:', error);
      return 'Erreur lors de la prévisualisation du template';
    }

    return preview;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Prévisualisation</CardTitle>
      </CardHeader>
      <CardContent>
        {subject && (
          <div className="mb-4">
            <div className="text-sm font-semibold text-muted-foreground mb-1">Sujet:</div>
            <div className="text-sm font-medium">{renderPreview(subject)}</div>
            <div className="border-b mt-2 mb-4" />
          </div>
        )}
        <div className="prose prose-sm max-w-none">
          <pre className="whitespace-pre-wrap">{renderPreview(body)}</pre>
        </div>
      </CardContent>
    </Card>
  );
};
