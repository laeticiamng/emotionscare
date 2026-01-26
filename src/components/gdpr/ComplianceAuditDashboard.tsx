// @ts-nocheck
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, Play, AlertTriangle, CheckCircle, 
  XCircle, FileText, Clock
} from 'lucide-react';
import PDFExportButton from './PDFExportButton';
import {
  RadialBarChart, RadialBar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';

const SEVERITY_CONFIG = {
  critical: { color: 'bg-red-500', label: 'Critique', icon: XCircle },
  high: { color: 'bg-orange-500', label: 'Élevée', icon: AlertTriangle },
  medium: { color: 'bg-yellow-500', label: 'Moyenne', icon: AlertTriangle },
  low: { color: 'bg-blue-500', label: 'Faible', icon: CheckCircle },
};

export const ComplianceAuditDashboard = () => {
  const {
    latestAudit,
    auditHistory,
    isLoading,
    runAudit,
    updateRecommendation,
    isRunning,
  } = useComplianceAudit();

  const [activeTab, setActiveTab] = useState('overview');

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-60">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const audit = latestAudit?.audit;
  const categories = latestAudit?.categories || [];
  const recommendations = latestAudit?.recommendations || [];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Bon';
    if (score >= 60) return 'Acceptable';
    if (score >= 40) return 'Insuffisant';
    return 'Critique';
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Audit de Conformité RGPD</h2>
          {audit && (
            <p className="text-muted-foreground">
              Dernier audit : {format(new Date(audit.audit_date), 'Pp', { locale: fr })}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <PDFExportButton auditId={audit?.id} variant="outline" />
          <Button onClick={() => runAudit()} disabled={isRunning}>
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? 'Audit en cours...' : 'Lancer un audit'}
          </Button>
        </div>
      </div>

      {!audit ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucun audit disponible</h3>
              <p className="text-muted-foreground mb-6">
                Lancez votre premier audit de conformité RGPD
              </p>
              <Button onClick={() => runAudit()} disabled={isRunning}>
                <Play className="h-4 w-4 mr-2" />
                Lancer un audit
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="categories">Catégories</TabsTrigger>
            <TabsTrigger value="recommendations">
              Recommandations
              {recommendations.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {recommendations.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Score global */}
              <Card>
                <CardHeader>
                  <CardTitle>Score de Conformité Global</CardTitle>
                  <CardDescription>Évaluation générale de la conformité RGPD</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="relative">
                      <ResponsiveContainer width={200} height={200}>
                        <RadialBarChart
                          cx="50%"
                          cy="50%"
                          innerRadius="70%"
                          outerRadius="100%"
                          data={[{ value: audit.overall_score, fill: audit.overall_score >= 80 ? '#10b981' : audit.overall_score >= 60 ? '#f59e0b' : '#ef4444' }]}
                          startAngle={90}
                          endAngle={-270}
                        >
                          <RadialBar dataKey="value" cornerRadius={10} />
                        </RadialBarChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className={`text-4xl font-bold ${getScoreColor(audit.overall_score)}`}>
                            {audit.overall_score.toFixed(0)}
                          </p>
                          <p className="text-sm text-muted-foreground">/ 100</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-lg font-semibold mt-4">
                      {getScoreLabel(audit.overall_score)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Statistiques */}
              <Card>
                <CardHeader>
                  <CardTitle>Statistiques de l'audit</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Catégories conformes</span>
                    </div>
                    <span className="text-2xl font-bold">
                      {categories.filter(c => c.score >= 80).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      <span className="font-medium">À améliorer</span>
                    </div>
                    <span className="text-2xl font-bold">
                      {categories.filter(c => c.score < 80 && c.score >= 60).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <XCircle className="h-5 w-5 text-red-500" />
                      <span className="font-medium">Non conformes</span>
                    </div>
                    <span className="text-2xl font-bold">
                      {categories.filter(c => c.score < 60).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">Recommandations</span>
                    </div>
                    <span className="text-2xl font-bold">{recommendations.length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Graphique des catégories */}
            <Card>
              <CardHeader>
                <CardTitle>Scores par catégorie</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categories}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category_name" angle={-45} textAnchor="end" height={100} />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Catégories détaillées */}
          <TabsContent value="categories">
            <div className="space-y-4">
              {categories.map(category => (
                <Card key={category.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{category.category_name}</CardTitle>
                        <CardDescription>
                          {category.checks_passed}/{category.checks_total} contrôles réussis
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <p className={`text-3xl font-bold ${getScoreColor(category.score)}`}>
                          {category.score.toFixed(0)}
                        </p>
                        <p className="text-sm text-muted-foreground">/ {category.max_score}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Progress value={category.score} className="h-2" />
                    {category.findings && category.findings.length > 0 && (
                      <div className="space-y-2">
                        {category.findings.map((finding: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between text-sm p-2 border rounded">
                            <span>{finding.metric}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{finding.value}{finding.unit || ''}</span>
                              <Badge variant={finding.status === 'pass' ? 'default' : 'destructive'}>
                                {finding.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Recommandations */}
          <TabsContent value="recommendations">
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {recommendations.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-8">
                        <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                        <p className="text-lg font-medium">Aucune recommandation</p>
                        <p className="text-muted-foreground">Toutes les catégories sont conformes</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  recommendations.map(rec => {
                    const config = SEVERITY_CONFIG[rec.severity];
                    const Icon = config.icon;

                    return (
                      <Card key={rec.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-full ${config.color}/10`}>
                                <Icon className={`h-5 w-5 ${config.color.replace('bg-', 'text-')}`} />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <CardTitle className="text-lg">{rec.title}</CardTitle>
                                  <Badge variant="outline">{rec.category_name}</Badge>
                                </div>
                                <CardDescription>{rec.description}</CardDescription>
                              </div>
                            </div>
                            <Badge className={config.color}>{config.label}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <p className="text-sm font-medium mb-1">Impact :</p>
                            <p className="text-sm text-muted-foreground">{rec.impact}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-1">Remédiation :</p>
                            <p className="text-sm text-muted-foreground whitespace-pre-line">{rec.remediation}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => updateRecommendation({ id: rec.id, status: 'in_progress' })}
                              disabled={rec.status !== 'open'}
                            >
                              En cours
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateRecommendation({ id: rec.id, status: 'resolved' })}
                            >
                              Résolu
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Historique */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Historique des audits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {auditHistory.map(audit => (
                    <div 
                      key={audit.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            {format(new Date(audit.audit_date), 'Pp', { locale: fr })}
                          </p>
                          <p className="text-sm text-muted-foreground">{audit.audit_type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${getScoreColor(audit.overall_score)}`}>
                          {audit.overall_score.toFixed(0)}
                        </p>
                        <p className="text-xs text-muted-foreground">{getScoreLabel(audit.overall_score)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
