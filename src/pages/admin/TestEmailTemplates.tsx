// @ts-nocheck
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Mail, CheckCircle2, XCircle } from 'lucide-react';

interface TestResult {
  template: string;
  status: 'pending' | 'success' | 'error';
  message?: string;
  messageId?: string;
}

export default function TestEmailTemplates() {
  const [email, setEmail] = useState('test@emotionscare.com');
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const templates = [
    {
      name: 'alert',
      label: 'Alert',
      subject: 'Test Alert Template',
      data: {
        title: 'Alerte système',
        message: 'Détection d\'une anomalie dans les données utilisateur',
        severity: 'high',
        timestamp: new Date().toISOString(),
      },
    },
    {
      name: 'compliance',
      label: 'Compliance',
      subject: 'Test Compliance Template',
      data: {
        companyName: 'EmotionsCare',
        reportType: 'RGPD',
        score: 92,
        period: 'Décembre 2024',
        dashboardUrl: 'https://app.emotionscare.com/compliance',
      },
    },
    {
      name: 'welcome',
      label: 'Welcome',
      subject: 'Test Welcome Template',
      data: {
        userName: 'Jean Dupont',
        activationUrl: 'https://app.emotionscare.com/activate',
      },
    },
    {
      name: 'export_ready',
      label: 'Export Ready',
      subject: 'Test Export Ready Template',
      data: {
        userName: 'Jean Dupont',
        exportUrl: 'https://app.emotionscare.com/exports/download/abc123',
        expiresIn: '48 heures',
        fileSize: '2.5 MB',
      },
    },
    {
      name: 'delete_request',
      label: 'Delete Request',
      subject: 'Test Delete Request Template',
      data: {
        userName: 'Jean Dupont',
        confirmationUrl: 'https://app.emotionscare.com/delete/confirm/xyz789',
        expiresIn: '7 jours',
      },
    },
  ];

  const testSingleTemplate = async (template: typeof templates[0]): Promise<TestResult> => {
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: email,
          subject: template.subject,
          template: template.name,
          data: template.data,
        },
      });

      if (error) throw error;

      return {
        template: template.name,
        status: 'success',
        message: 'Email envoyé avec succès',
        messageId: data?.messageId,
      };
    } catch (error: unknown) {
      return {
        template: template.name,
        status: 'error',
        message: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  };

  const testAllTemplates = async () => {
    if (!email) {
      toast.error('Veuillez entrer une adresse email');
      return;
    }

    setTesting(true);
    setResults([]);
    toast.info('Test des templates en cours...');

    const testResults: TestResult[] = [];

    for (const template of templates) {
      setResults((prev) => [
        ...prev,
        { template: template.name, status: 'pending' },
      ]);

      const result = await testSingleTemplate(template);
      
      testResults.push(result);
      setResults((prev) =>
        prev.map((r) =>
          r.template === template.name ? result : r
        )
      );

      // Délai entre les envois
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setTesting(false);

    const successCount = testResults.filter((r) => r.status === 'success').length;
    const errorCount = testResults.filter((r) => r.status === 'error').length;

    if (errorCount === 0) {
      toast.success(`✅ Tous les templates testés avec succès (${successCount}/${templates.length})`);
    } else {
      toast.warning(`⚠️ ${successCount} réussis, ${errorCount} échoués`);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-destructive" />;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Test Email Templates</h1>
          <p className="text-muted-foreground">
            Testez l'envoi d'emails pour tous les templates disponibles
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>
              Entrez l'adresse email de destination pour les tests
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Adresse email de test</Label>
              <Input
                id="email"
                type="email"
                placeholder="test@emotionscare.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={testing}
              />
            </div>

            <Button
              onClick={testAllTemplates}
              disabled={testing || !email}
              className="w-full"
            >
              {testing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Test en cours...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Tester tous les templates
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Résultats des tests</CardTitle>
              <CardDescription>
                État de l'envoi pour chaque template
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.map((result) => {
                  const template = templates.find((t) => t.name === result.template);
                  return (
                    <div
                      key={result.template}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(result.status)}
                        <div>
                          <p className="font-medium">{template?.label}</p>
                          <p className="text-sm text-muted-foreground">
                            {template?.subject}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {result.messageId && (
                          <p className="text-xs text-muted-foreground">
                            ID: {result.messageId.substring(0, 8)}...
                          </p>
                        )}
                        {result.message && result.status === 'error' && (
                          <p className="text-xs text-destructive">
                            {result.message}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Templates disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <div
                  key={template.name}
                  className="p-4 border rounded-lg"
                >
                  <h3 className="font-semibold mb-1">{template.label}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {template.subject}
                  </p>
                  <div className="text-xs bg-muted p-2 rounded">
                    <pre className="overflow-x-auto">
                      {JSON.stringify(template.data, null, 2)}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
