import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Eye, Code, Mail, MessageSquare } from 'lucide-react';

interface TestData {
  error_message: string;
  error_type: string;
  severity: string;
  timestamp: string;
  stack_trace: string;
  user_id: string;
  page_url: string;
  browser: string;
  additional_context: string;
}

const defaultTestData: TestData = {
  error_message: 'Cannot read property "user" of undefined',
  error_type: 'TypeError',
  severity: 'high',
  timestamp: new Date().toISOString(),
  stack_trace: 'at UserProfile.render (UserProfile.tsx:45:12)\nat App.tsx:120:5',
  user_id: 'user_123456',
  page_url: '/app/profile',
  browser: 'Chrome 120.0.0',
  additional_context: 'User was editing their profile',
};

const templateVariables = [
  '{{error_message}}',
  '{{error_type}}',
  '{{severity}}',
  '{{timestamp}}',
  '{{stack_trace}}',
  '{{user_id}}',
  '{{page_url}}',
  '{{browser}}',
  '{{additional_context}}',
];

const defaultTemplates = {
  email: {
    subject: '[{{severity}}] Nouvelle erreur: {{error_type}}',
    body: `🚨 **Alerte Erreur**

**Type:** {{error_type}}
**Sévérité:** {{severity}}
**Message:** {{error_message}}

**Détails:**
- Timestamp: {{timestamp}}
- URL: {{page_url}}
- Utilisateur: {{user_id}}
- Navigateur: {{browser}}

**Stack Trace:**
\`\`\`
{{stack_trace}}
\`\`\`

**Contexte:**
{{additional_context}}`,
  },
  slack: `{
  "blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "🚨 Nouvelle Erreur Détectée"
      }
    },
    {
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": "*Type:*\\n{{error_type}}"
        },
        {
          "type": "mrkdwn",
          "text": "*Sévérité:*\\n{{severity}}"
        },
        {
          "type": "mrkdwn",
          "text": "*Message:*\\n{{error_message}}"
        },
        {
          "type": "mrkdwn",
          "text": "*URL:*\\n{{page_url}}"
        }
      ]
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Stack Trace:*\\n\`\`\`{{stack_trace}}\`\`\`"
      }
    }
  ]
}`,
  discord: `{
  "embeds": [{
    "title": "🚨 Nouvelle Erreur",
    "color": 15158332,
    "fields": [
      {
        "name": "Type",
        "value": "{{error_type}}",
        "inline": true
      },
      {
        "name": "Sévérité",
        "value": "{{severity}}",
        "inline": true
      },
      {
        "name": "Message",
        "value": "{{error_message}}"
      },
      {
        "name": "URL",
        "value": "{{page_url}}"
      },
      {
        "name": "Stack Trace",
        "value": "\`\`\`{{stack_trace}}\`\`\`"
      }
    ],
    "timestamp": "{{timestamp}}"
  }]
}`,
};

export default function AlertTemplatePlayground() {
  const [channel, setChannel] = useState<'email' | 'slack' | 'discord'>('email');
  const [emailSubject, setEmailSubject] = useState(defaultTemplates.email.subject);
  const [emailBody, setEmailBody] = useState(defaultTemplates.email.body);
  const [slackTemplate, setSlackTemplate] = useState(defaultTemplates.slack);
  const [discordTemplate, setDiscordTemplate] = useState(defaultTemplates.discord);
  const [testData, setTestData] = useState<TestData>(defaultTestData);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');

  const replaceVariables = (template: string, data: TestData): string => {
    let result = template;
    Object.entries(data).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value);
    });
    return result;
  };

  const getCurrentTemplate = () => {
    switch (channel) {
      case 'email':
        return emailBody;
      case 'slack':
        return slackTemplate;
      case 'discord':
        return discordTemplate;
    }
  };

  const setCurrentTemplate = (value: string) => {
    switch (channel) {
      case 'email':
        setEmailBody(value);
        break;
      case 'slack':
        setSlackTemplate(value);
        break;
      case 'discord':
        setDiscordTemplate(value);
        break;
    }
  };

  const renderPreview = () => {
    const template = getCurrentTemplate();
    const rendered = replaceVariables(template, testData);

    if (channel === 'email') {
      return (
        <div className="space-y-4">
          <div className="border-b pb-2">
            <Label className="text-sm text-muted-foreground">Sujet</Label>
            <p className="font-semibold">{replaceVariables(emailSubject, testData)}</p>
          </div>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <pre className="whitespace-pre-wrap bg-muted p-4 rounded-lg">{rendered}</pre>
          </div>
        </div>
      );
    }

    if (channel === 'slack' || channel === 'discord') {
      try {
        const parsed = JSON.parse(rendered);
        return (
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <pre className="text-sm overflow-auto">{JSON.stringify(parsed, null, 2)}</pre>
            </div>
          </div>
        );
      } catch (e) {
        return (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
            <p className="font-semibold">Erreur JSON</p>
            <p className="text-sm">{(e as Error).message}</p>
          </div>
        );
      }
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Playground Templates d'Alerte</h1>
        <p className="text-muted-foreground mt-2">
          Testez vos templates avec des données personnalisées et visualisez le rendu en temps réel
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration et Éditeur */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Configuration du Template
            </CardTitle>
            <CardDescription>
              Éditez votre template et utilisez les variables dynamiques
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Canal de notification</Label>
              <Select value={channel} onValueChange={(v: any) => setChannel(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </div>
                  </SelectItem>
                  <SelectItem value="slack">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Slack
                    </div>
                  </SelectItem>
                  <SelectItem value="discord">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Discord
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Variables disponibles</Label>
              <div className="flex flex-wrap gap-2">
                {templateVariables.map((variable) => (
                  <Badge
                    key={variable}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => {
                      const current = getCurrentTemplate();
                      setCurrentTemplate(current + ' ' + variable);
                    }}
                  >
                    {variable}
                  </Badge>
                ))}
              </div>
            </div>

            {channel === 'email' && (
              <div className="space-y-2">
                <Label>Sujet de l'email</Label>
                <Input
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="[{{severity}}] Nouvelle erreur"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>{channel === 'email' ? 'Corps du message' : 'Template JSON'}</Label>
              <Textarea
                value={getCurrentTemplate()}
                onChange={(e) => setCurrentTemplate(e.target.value)}
                className="font-mono text-sm min-h-[300px]"
                placeholder="Votre template ici..."
              />
            </div>

            <Button
              onClick={() => {
                switch (channel) {
                  case 'email':
                    setEmailSubject(defaultTemplates.email.subject);
                    setEmailBody(defaultTemplates.email.body);
                    break;
                  case 'slack':
                    setSlackTemplate(defaultTemplates.slack);
                    break;
                  case 'discord':
                    setDiscordTemplate(defaultTemplates.discord);
                    break;
                }
              }}
              variant="outline"
              className="w-full"
            >
              Réinitialiser au template par défaut
            </Button>
          </CardContent>
        </Card>

        {/* Données de test et Prévisualisation */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Données de test</CardTitle>
              <CardDescription>
                Modifiez les données pour voir le rendu en temps réel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type d'erreur</Label>
                  <Input
                    value={testData.error_type}
                    onChange={(e) => setTestData({ ...testData, error_type: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sévérité</Label>
                  <Select
                    value={testData.severity}
                    onValueChange={(v) => setTestData({ ...testData, severity: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Message d'erreur</Label>
                <Input
                  value={testData.error_message}
                  onChange={(e) => setTestData({ ...testData, error_message: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Stack Trace</Label>
                <Textarea
                  value={testData.stack_trace}
                  onChange={(e) => setTestData({ ...testData, stack_trace: e.target.value })}
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label>URL de la page</Label>
                <Input
                  value={testData.page_url}
                  onChange={(e) => setTestData({ ...testData, page_url: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Prévisualisation
                </div>
                <Tabs value={viewMode} onValueChange={(v: any) => setViewMode(v)}>
                  <TabsList>
                    <TabsTrigger value="preview">Rendu</TabsTrigger>
                    <TabsTrigger value="code">Code</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {viewMode === 'preview' ? (
                renderPreview()
              ) : (
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm overflow-auto whitespace-pre-wrap">
                    {replaceVariables(getCurrentTemplate(), testData)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
