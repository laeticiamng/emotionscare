import React, { useState } from 'react';
import { logger } from '@/lib/logger';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Search, Globe, AlertCircle, CheckCircle2, Loader2, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PageAudit {
  url: string;
  title?: string;
  description?: string;
  h1Count: number;
  h2Count: number;
  internalLinks: string[];
  externalLinks: string[];
  images: { total: number; withoutAlt: number };
  wordCount: number;
  issues: string[];
  score: number;
}

interface AuditResult {
  success: boolean;
  summary: {
    totalPages: number;
    auditedPages: number;
    overallScore: number;
    criticalIssues: number;
    warnings: number;
  };
  pages: PageAudit[];
  allUrls: string[];
}

const SEOAuditPage: React.FC = () => {
  const [url, setUrl] = useState('https://emotions-care.lovable.app');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);

  const handleAudit = async () => {
    if (!url) {
      toast.error('Veuillez entrer une URL');
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('seo-audit', {
        body: { url },
      });

      if (error) throw error;

      if (data.success) {
        setResult(data);
        toast.success(`Audit SEO terminé - Score: ${data.summary.overallScore}%`);
      } else {
        toast.error(data.error || 'Erreur lors de l\'audit');
      }
    } catch (error) {
      logger.error('Audit error:', error, 'SYSTEM');
      toast.error('Erreur lors de l\'audit SEO');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">🔍 Audit SEO</h1>
          <p className="text-muted-foreground">
            Analyse complète du référencement de votre site avec Firecrawl
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              URL à auditer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="flex-1"
              />
              <Button onClick={handleAudit} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyse...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Lancer l'audit
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <>
            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle>📊 Résumé</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className={`text-4xl font-bold ${getScoreColor(result.summary.overallScore)}`}>
                      {result.summary.overallScore}%
                    </div>
                    <div className="text-sm text-muted-foreground">Score global</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-4xl font-bold">{result.summary.totalPages}</div>
                    <div className="text-sm text-muted-foreground">Pages trouvées</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-4xl font-bold">{result.summary.auditedPages}</div>
                    <div className="text-sm text-muted-foreground">Pages analysées</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-4xl font-bold text-red-600">{result.summary.criticalIssues}</div>
                    <div className="text-sm text-muted-foreground">Erreurs critiques</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-4xl font-bold text-yellow-600">{result.summary.warnings}</div>
                    <div className="text-sm text-muted-foreground">Avertissements</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Page Details */}
            <Card>
              <CardHeader>
                <CardTitle>📄 Détails par page</CardTitle>
                <CardDescription>
                  Cliquez sur une page pour voir les détails de l'audit
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.pages.map((page, index) => (
                  <Collapsible key={index}>
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Badge className={getScoreBadge(page.score)}>
                            {page.score}%
                          </Badge>
                          <span className="truncate font-medium">
                            {page.url.replace(/^https?:\/\/[^/]+/, '')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {page.issues.filter(i => i.startsWith('❌')).length > 0 && (
                            <Badge variant="destructive" className="shrink-0">
                              {page.issues.filter(i => i.startsWith('❌')).length} erreur(s)
                            </Badge>
                          )}
                          <ChevronDown className="h-4 w-4 shrink-0" />
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="p-4 border border-t-0 rounded-b-lg space-y-4">
                        {/* Title & Description */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Titre</label>
                            <p className="text-sm">{page.title || <span className="text-red-500">Non défini</span>}</p>
                            <span className="text-xs text-muted-foreground">
                              {page.title?.length || 0}/60 caractères
                            </span>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Meta description</label>
                            <p className="text-sm">{page.description || <span className="text-red-500">Non définie</span>}</p>
                            <span className="text-xs text-muted-foreground">
                              {page.description?.length || 0}/160 caractères
                            </span>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="p-3 bg-background rounded border">
                            <div className="text-lg font-bold">{page.h1Count}</div>
                            <div className="text-xs text-muted-foreground">H1</div>
                          </div>
                          <div className="p-3 bg-background rounded border">
                            <div className="text-lg font-bold">{page.h2Count}</div>
                            <div className="text-xs text-muted-foreground">H2</div>
                          </div>
                          <div className="p-3 bg-background rounded border">
                            <div className="text-lg font-bold">{page.wordCount}</div>
                            <div className="text-xs text-muted-foreground">Mots</div>
                          </div>
                          <div className="p-3 bg-background rounded border">
                            <div className="text-lg font-bold">
                              {page.images.total - page.images.withoutAlt}/{page.images.total}
                            </div>
                            <div className="text-xs text-muted-foreground">Images avec alt</div>
                          </div>
                        </div>

                        {/* Links */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="p-3 bg-background rounded border">
                            <div className="flex items-center gap-2 mb-2">
                              <LinkIcon className="h-4 w-4" />
                              <span className="font-medium">{page.internalLinks.length} liens internes</span>
                            </div>
                          </div>
                          <div className="p-3 bg-background rounded border">
                            <div className="flex items-center gap-2 mb-2">
                              <ExternalLink className="h-4 w-4" />
                              <span className="font-medium">{page.externalLinks.length} liens externes</span>
                            </div>
                          </div>
                        </div>

                        {/* Issues */}
                        {page.issues.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-yellow-500" />
                              Problèmes détectés
                            </h4>
                            <ul className="space-y-1">
                              {page.issues.map((issue, i) => (
                                <li key={i} className="text-sm">{issue}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {page.issues.length === 0 && (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Aucun problème détecté</span>
                          </div>
                        )}

                        <a
                          href={page.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          Voir la page <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </CardContent>
            </Card>

            {/* All URLs */}
            <Card>
              <CardHeader>
                <CardTitle>🗺️ Sitemap ({result.allUrls.length} URLs)</CardTitle>
                <CardDescription>
                  Toutes les URLs découvertes sur le site
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-64 overflow-y-auto space-y-1">
                  {result.allUrls.map((pageUrl, index) => (
                    <a
                      key={index}
                      href={pageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-muted-foreground hover:text-foreground hover:underline truncate"
                    >
                      {pageUrl}
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default SEOAuditPage;
