import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Clock, Copy, CheckCircle2, AlertTriangle, Play, Database } from 'lucide-react';
import { toast } from 'sonner';

const CronJobsSetupPage: React.FC = () => {
  const [projectId, setProjectId] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [copiedScript, setCopiedScript] = useState<string | null>(null);

  const projectUrl = projectId ? `https://${projectId}.supabase.co` : 'https://YOUR_PROJECT_ID.supabase.co';

  const generateMainCronScript = () => {
    return `-- ════════════════════════════════════════════════════════════════════════════
-- CONFIGURATION DES CRON JOBS SUPABASE - SCRIPT GÉNÉRÉ
-- ════════════════════════════════════════════════════════════════════════════

-- 1. Activer les extensions
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- 2. Supprimer les anciens jobs s'ils existent
SELECT cron.unschedule('collect-system-metrics-job');
SELECT cron.unschedule('weekly-monitoring-report-job');

-- 3. Job: Collecte des métriques (toutes les 5 minutes)
SELECT cron.schedule(
  'collect-system-metrics-job',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url := '${projectUrl}/functions/v1/collect-system-metrics',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ${anonKey || 'YOUR_ANON_KEY'}'
    ),
    body := jsonb_build_object(
      'timestamp', now(),
      'source', 'cron_job'
    )
  ) as request_id;
  $$
);

-- 4. Job: Rapport hebdomadaire (chaque lundi à 9h UTC)
SELECT cron.schedule(
  'weekly-monitoring-report-job',
  '0 9 * * 1',
  $$
  SELECT net.http_post(
    url := '${projectUrl}/functions/v1/send-weekly-monitoring-report',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ${anonKey || 'YOUR_ANON_KEY'}'
    ),
    body := jsonb_build_object(
      'timestamp', now(),
      'source', 'cron_job'
    )
  ) as request_id;
  $$
);

-- 5. Vérifier les jobs créés
SELECT 
  jobid,
  jobname,
  schedule,
  active,
  database
FROM cron.job
WHERE jobname IN ('collect-system-metrics-job', 'weekly-monitoring-report-job')
ORDER BY jobname;`;
  };

  const generateProactiveCronScript = () => {
    return `-- ════════════════════════════════════════════════════════════════════════════
-- CONFIGURATION CRON JOB: DÉTECTEUR PROACTIF D'INCIDENTS
-- ════════════════════════════════════════════════════════════════════════════

-- 1. Supprimer l'ancien job s'il existe
SELECT cron.unschedule('proactive-incident-detector-job');

-- 2. Créer le job de détection proactive (toutes les 5 minutes)
SELECT cron.schedule(
  'proactive-incident-detector-job',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url := '${projectUrl}/functions/v1/proactive-incident-detector',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ${anonKey || 'YOUR_ANON_KEY'}'
    ),
    body := jsonb_build_object(
      'timestamp', now(),
      'source', 'cron_job'
    )
  ) as request_id;
  $$
);

-- 3. Vérifier la création du job
SELECT 
  jobid,
  jobname,
  schedule,
  active,
  database
FROM cron.job
WHERE jobname = 'proactive-incident-detector-job';

-- 4. Voir tous les jobs actifs
SELECT 
  jobid,
  jobname,
  schedule,
  active
FROM cron.job
ORDER BY jobname;`;
  };

  const copyToClipboard = (text: string, scriptName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(scriptName);
    toast.success(`Script ${scriptName} copié dans le presse-papiers`);
    setTimeout(() => setCopiedScript(null), 3000);
  };

  const hasConfiguration = projectId && anonKey;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Clock className="h-8 w-8 text-primary" />
          Configuration des Cron Jobs
        </h1>
        <p className="text-muted-foreground">
          Configurez les tâches automatiques Supabase pour la collecte de métriques et la détection d'incidents
        </p>
      </div>

      {/* Configuration Section */}
      <Card>
        <CardHeader>
          <CardTitle>Étape 1: Configuration du Projet</CardTitle>
          <CardDescription>
            Entrez les informations de votre projet Supabase pour générer les scripts SQL personnalisés
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectId">Project ID Supabase</Label>
              <Input
                id="projectId"
                placeholder="yaincoxihiqdksxgrsrk"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Trouvez votre Project ID dans: Dashboard → Settings → General
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="anonKey">Clé Anon (publique)</Label>
              <Input
                id="anonKey"
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Trouvez votre Anon Key dans: Dashboard → Settings → API
              </p>
            </div>
          </div>

          {hasConfiguration && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Configuration prête! Les scripts SQL sont maintenant personnalisés avec vos informations.
              </AlertDescription>
            </Alert>
          )}

          {!hasConfiguration && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Veuillez remplir les deux champs ci-dessus pour générer les scripts personnalisés.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Scripts Generation */}
      <Tabs defaultValue="main">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="main">
            <Database className="h-4 w-4 mr-2" />
            Métriques & Rapports
          </TabsTrigger>
          <TabsTrigger value="proactive">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Détection Proactive
          </TabsTrigger>
        </TabsList>

        <TabsContent value="main">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Script 1: Métriques Système & Rapports Hebdomadaires</span>
                <Badge variant="outline">Toutes les 5 min + Lundi 9h</Badge>
              </CardTitle>
              <CardDescription>
                Configure deux cron jobs: collecte des métriques système (toutes les 5 minutes) et envoi du rapport hebdomadaire (chaque lundi à 9h UTC)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={generateMainCronScript()}
                readOnly
                className="font-mono text-sm min-h-[400px]"
              />
              
              <div className="flex gap-2">
                <Button
                  onClick={() => copyToClipboard(generateMainCronScript(), 'main')}
                  disabled={!hasConfiguration}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {copiedScript === 'main' ? 'Copié!' : 'Copier le script'}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => window.open('https://supabase.com/dashboard/project/_/sql/new', '_blank')}
                >
                  <Database className="h-4 w-4 mr-2" />
                  Ouvrir SQL Editor Supabase
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="proactive">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Script 2: Détecteur Proactif d'Incidents</span>
                <Badge variant="outline">Toutes les 5 min</Badge>
              </CardTitle>
              <CardDescription>
                Configure un cron job qui surveille les alertes critiques et génère automatiquement des rapports d'incident et des tickets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={generateProactiveCronScript()}
                readOnly
                className="font-mono text-sm min-h-[400px]"
              />
              
              <div className="flex gap-2">
                <Button
                  onClick={() => copyToClipboard(generateProactiveCronScript(), 'proactive')}
                  disabled={!hasConfiguration}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {copiedScript === 'proactive' ? 'Copié!' : 'Copier le script'}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => window.open('https://supabase.com/dashboard/project/_/sql/new', '_blank')}
                >
                  <Database className="h-4 w-4 mr-2" />
                  Ouvrir SQL Editor Supabase
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Étape 2: Exécution des Scripts</CardTitle>
          <CardDescription>Suivez ces étapes pour activer les cron jobs dans votre projet Supabase</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 list-decimal list-inside">
            <li className="text-sm">
              <strong>Copiez le script</strong> en cliquant sur le bouton "Copier le script" ci-dessus
            </li>
            <li className="text-sm">
              <strong>Ouvrez l'éditeur SQL Supabase</strong> en cliquant sur "Ouvrir SQL Editor Supabase" ou en allant dans:
              <br />
              <code className="text-xs bg-muted px-2 py-1 rounded mt-1 inline-block">
                Dashboard → SQL Editor → New Query
              </code>
            </li>
            <li className="text-sm">
              <strong>Collez le script</strong> dans l'éditeur SQL
            </li>
            <li className="text-sm">
              <strong>Exécutez le script</strong> en cliquant sur "Run" ou Ctrl+Enter
            </li>
            <li className="text-sm">
              <strong>Vérifiez l'installation</strong> avec la requête ci-dessous
            </li>
          </ol>

          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm font-semibold mb-2">Commande de vérification:</p>
            <code className="text-xs block bg-background p-3 rounded">
              SELECT * FROM cron.job ORDER BY jobname;
            </code>
          </div>
        </CardContent>
      </Card>

      {/* Status Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle>Étape 3: Monitoring & Tests</CardTitle>
          <CardDescription>Vérifiez que les cron jobs fonctionnent correctement</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Button variant="outline" onClick={() => window.location.href = '/admin/unified'}>
              <Play className="h-4 w-4 mr-2" />
              Voir Dashboard Unifié
            </Button>

            <Button variant="outline" onClick={() => window.location.href = '/admin/alert-tester'}>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Tester avec Alerte Critique
            </Button>
          </div>

          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Les métriques seront collectées dans les 5 prochaines minutes. Vérifiez le dashboard pour voir les résultats.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default CronJobsSetupPage;
