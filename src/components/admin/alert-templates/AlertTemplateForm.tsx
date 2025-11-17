import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Save } from 'lucide-react';
import { AlertTemplate } from './types';
import { VariableSelector } from './VariableSelector';
import { TemplatePreview } from './TemplatePreview';

interface AlertTemplateFormProps {
  template: Partial<AlertTemplate>;
  onTemplateChange: (template: Partial<AlertTemplate>) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  previewMode: boolean;
  onTogglePreview: () => void;
}

export const AlertTemplateForm = ({
  template,
  onTemplateChange,
  onSave,
  onCancel,
  isSaving,
  previewMode,
  onTogglePreview,
}: AlertTemplateFormProps) => {
  const bodyTextareaRef = useRef<HTMLTextAreaElement>(null);

  const insertVariable = (variableName: string) => {
    if (!template.body) {
      onTemplateChange({
        ...template,
        body: `{{${variableName}}}`,
      });
      return;
    }

    const textarea = bodyTextareaRef.current;
    const cursorPos = textarea?.selectionStart || template.body.length;
    const textBefore = template.body.substring(0, cursorPos);
    const textAfter = template.body.substring(cursorPos);

    const newBody = `${textBefore}{{${variableName}}}${textAfter}`;
    onTemplateChange({
      ...template,
      body: newBody,
    });

    // Restore focus and cursor position after state update
    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        const newCursorPos = cursorPos + variableName.length + 4; // +4 for {{}}
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-4 py-4">
        {/* Left: Form */}
        <div className="col-span-2 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom *</Label>
            <Input
              id="name"
              value={template.name || ''}
              onChange={(e) => onTemplateChange({ ...template, name: e.target.value })}
              placeholder="Ex: Email critique personnalisé"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="template_type">Type *</Label>
            <Select
              value={template.template_type}
              onValueChange={(value) => onTemplateChange({ ...template, template_type: value as any })}
            >
              <SelectTrigger id="template_type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="slack">Slack</SelectItem>
                <SelectItem value="discord">Discord</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {template.template_type === 'email' && (
            <div className="space-y-2">
              <Label htmlFor="subject">Sujet</Label>
              <Input
                id="subject"
                value={template.subject || ''}
                onChange={(e) => onTemplateChange({ ...template, subject: e.target.value })}
                placeholder="Ex: 🚨 {{category}} - {{priority}}"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="template-body">Corps du message *</Label>
            <Textarea
              id="template-body"
              ref={bodyTextareaRef}
              value={template.body || ''}
              onChange={(e) => onTemplateChange({ ...template, body: e.target.value })}
              placeholder="Utilisez {{variableName}} pour les variables dynamiques"
              rows={12}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onTogglePreview}
            >
              <Eye className="w-4 h-4 mr-2" />
              {previewMode ? 'Éditer' : 'Prévisualiser'}
            </Button>
          </div>

          {previewMode && (
            <TemplatePreview
              body={template.body || ''}
              subject={template.template_type === 'email' ? template.subject : undefined}
            />
          )}
        </div>

        {/* Right: Variables */}
        <div className="space-y-4">
          <VariableSelector onInsertVariable={insertVariable} />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button onClick={onSave} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          Enregistrer
        </Button>
      </div>
    </>
  );
};
