import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Palette, Save, Eye } from 'lucide-react';
import { useState } from 'react';
import { TemplateVersioning } from './TemplateVersioning';

interface TemplateConfig {
  name: string;
  primaryColor: string;
  logo: string;
  sections: {
    cover: boolean;
    summary: boolean;
    charts: boolean;
    details: boolean;
    recommendations: boolean;
  };
}

export function TemplateEditor() {
  const [template, setTemplate] = useState<TemplateConfig>({
    name: 'Mon Template',
    primaryColor: '#3b82f6',
    logo: '',
    sections: {
      cover: true,
      summary: true,
      charts: true,
      details: true,
      recommendations: true,
    },
  });
  const [templateId] = useState('current-template-id'); // Replace with actual ID

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Configuration du Template
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Nom du template</Label>
            <Input
              value={template.name}
              onChange={(e) => setTemplate({ ...template, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Couleur principale</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={template.primaryColor}
                onChange={(e) => setTemplate({ ...template, primaryColor: e.target.value })}
                className="w-20"
              />
              <Input value={template.primaryColor} readOnly className="flex-1" />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Sections à inclure</Label>
            {Object.entries(template.sections).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={key}
                  checked={value}
                  onCheckedChange={(checked) =>
                    setTemplate({
                      ...template,
                      sections: { ...template.sections, [key]: checked as boolean },
                    })
                  }
                />
                <Label htmlFor={key} className="cursor-pointer capitalize">
                  {key}
                </Label>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Prévisualiser
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prévisualisation</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 rounded-lg p-6 space-y-4"
            style={{ borderColor: template.primaryColor }}
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold" style={{ color: template.primaryColor }}>
                {template.name}
              </h2>
              <div className="h-1 w-20 mx-auto rounded" style={{ backgroundColor: template.primaryColor }} />
            </div>

            {template.sections.summary && (
              <div className="p-4 bg-muted rounded">
                <div className="font-semibold mb-2">Résumé Exécutif</div>
                <div className="text-sm text-muted-foreground">
                  Contenu du résumé...
                </div>
              </div>
            )}

            {template.sections.charts && (
              <div className="h-32 bg-muted rounded flex items-center justify-center">
                <span className="text-muted-foreground">Graphiques</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      </div>

      <TemplateVersioning templateId={templateId} />
    </div>
  );
}
