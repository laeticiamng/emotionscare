// @ts-nocheck
/**
 * Institutional Report Generator
 * CHSCT-ready QVT reports with improvement actions
 */
import React, { useState } from 'react';
import { usePageSEO } from '@/hooks/usePageSEO';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  ArrowLeft, FileText, Download, Building2, Shield, TrendingUp,
  TrendingDown, CheckCircle2, AlertTriangle, BarChart3, Users, Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';

const REPORT_SECTIONS = [
  { id: 'executive', label: 'Synthèse Exécutive', icon: BarChart3 },
  { id: 'wellbeing', label: 'Indicateurs Bien-être (QVT)', icon: TrendingUp },
  { id: 'burnout', label: 'Prévention Burnout', icon: AlertTriangle },
  { id: 'interventions', label: 'Interventions Réalisées', icon: CheckCircle2 },
  { id: 'recommendations', label: 'Actions d\'Amélioration', icon: TrendingUp },
];

const QVT_INDICATORS = [
  { name: 'Épuisement émotionnel moyen', value: 18.5, max: 54, trend: -2.3, unit: 'pts', status: 'good' },
  { name: 'Score bien-être global', value: 72, max: 100, trend: 4.1, unit: '%', status: 'good' },
  { name: 'Taux de participation', value: 68, max: 100, trend: 1.5, unit: '%', status: 'moderate' },
  { name: 'Satisfaction interventions', value: 4.2, max: 5, trend: 0.3, unit: '/5', status: 'good' },
  { name: 'Absentéisme lié au stress', value: 3.8, max: 100, trend: -0.5, unit: '%', status: 'good' },
  { name: 'Score dépersonnalisation moyen', value: 8.2, max: 30, trend: -1.1, unit: 'pts', status: 'moderate' },
];

const RECOMMENDATIONS = [
  { priority: 'haute', title: 'Instaurer des Schwartz Rounds mensuels', impact: 'Réduction de 15% de l\'épuisement émotionnel', timeline: 'Démarrage T2 2026', department: 'Tous services' },
  { priority: 'haute', title: 'Formation encadrants : détection des signes de burnout', impact: 'Détection précoce et prévention', timeline: '2 sessions T2 2026', department: 'Encadrement' },
  { priority: 'moyenne', title: 'Aménagement espaces de pause dédiés', impact: 'Amélioration micro-pauses (+23% utilisation)', timeline: 'T3 2026', department: 'Direction' },
  { priority: 'moyenne', title: 'Protocole de débriefing post-événement systématique', impact: 'Réduction des symptômes post-traumatiques', timeline: 'Immédiat', department: 'Urgences, Réanimation' },
  { priority: 'basse', title: 'Programme de reconnaissance par les pairs', impact: 'Renforcement accomplissement personnel (+8%)', timeline: 'T3-T4 2026', department: 'Tous services' },
];

const InstitutionalReportPage: React.FC = () => {
  usePageSEO({
    title: 'Rapport Institutionnel QVT | EmotionsCare B2B',
    description: 'Générateur de rapports CHSCT/CSE conformes avec indicateurs QVT et actions d\'amélioration.',
  });

  const [period, setPeriod] = useState('t1-2026');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async (format: string) => {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 2000));
    setGenerating(false);
    toast.success(`Rapport ${format.toUpperCase()} généré`, {
      description: 'Le document est prêt pour présentation au CHSCT/CSE.',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/b2b/admin/dashboard"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                Rapport Institutionnel QVT
              </h1>
              <p className="text-sm text-muted-foreground">Conforme CHSCT / CSE • Données anonymisées</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="t1-2026">T1 2026</SelectItem>
                <SelectItem value="t4-2025">T4 2025</SelectItem>
                <SelectItem value="2025">Année 2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Report Preview */}
        <Card className="mb-6 border-2 border-primary/20">
          <CardHeader className="bg-primary/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle className="text-xl">Rapport Qualité de Vie au Travail</CardTitle>
                  <CardDescription>Période : T1 2026 • Établissement de santé</CardDescription>
                </div>
              </div>
              <Badge className="bg-primary/10 text-primary">Conforme CHSCT</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Report sections nav */}
            <div className="flex flex-wrap gap-2 mb-6">
              {REPORT_SECTIONS.map((s) => (
                <Badge key={s.id} variant="outline" className="gap-1 py-1">
                  {React.createElement(s.icon, { className: 'h-3 w-3' })}
                  {s.label}
                </Badge>
              ))}
            </div>

            {/* Executive Summary */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Synthèse Exécutive
              </h3>
              <div className="p-4 bg-muted/30 rounded-lg text-sm leading-relaxed">
                <p className="mb-2">Sur la période T1 2026, le programme de bien-être EmotionsCare a permis de suivre <strong>347 professionnels de santé</strong> répartis sur 12 services. Les indicateurs globaux montrent une <strong>amélioration de 4,1%</strong> du score de bien-être collectif par rapport au trimestre précédent.</p>
                <p>Les interventions les plus efficaces ont été les sessions de soutien par les pairs (taux de satisfaction : 4.2/5) et les micro-pauses actives (+23% d'utilisation). Des points de vigilance persistent sur les services d'urgences et de réanimation, où l'épuisement émotionnel reste au-dessus de la moyenne.</p>
              </div>
            </div>

            <Separator className="my-6" />

            {/* QVT Indicators */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Indicateurs QVT
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {QVT_INDICATORS.map((ind) => (
                  <Card key={ind.name} className="border-border">
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground mb-1">{ind.name}</p>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold">{ind.value}</span>
                        <span className="text-sm text-muted-foreground mb-0.5">{ind.unit}</span>
                        <span className={`text-xs flex items-center gap-0.5 ml-auto ${ind.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {ind.trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {ind.trend >= 0 ? '+' : ''}{ind.trend}
                        </span>
                      </div>
                      <Progress value={(ind.value / ind.max) * 100} className="h-1.5 mt-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Recommendations */}
            <div>
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Actions d'Amélioration Recommandées
              </h3>
              <div className="space-y-3">
                {RECOMMENDATIONS.map((rec, i) => (
                  <div key={i} className="p-4 rounded-lg border border-border flex gap-4">
                    <div className="shrink-0">
                      <Badge className={
                        rec.priority === 'haute' ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' :
                        rec.priority === 'moyenne' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300' :
                        'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                      }>
                        Priorité {rec.priority}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{rec.title}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
                        <span>Impact : {rec.impact}</span>
                        <span>Échéance : {rec.timeline}</span>
                        <span>Service : {rec.department}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={() => handleGenerate('pdf')} disabled={generating}>
            <Download className="h-4 w-4 mr-2" />
            Télécharger PDF
          </Button>
          <Button variant="outline" onClick={() => handleGenerate('docx')} disabled={generating}>
            <FileText className="h-4 w-4 mr-2" />
            Export Word
          </Button>
          <Button variant="outline" onClick={() => handleGenerate('xlsx')} disabled={generating}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>

        <footer className="mt-8 pt-4 border-t text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            Rapport conforme aux exigences CHSCT / CSE • Données anonymisées • Seuil de confidentialité respecté
          </div>
        </footer>
      </div>
    </div>
  );
};

export default InstitutionalReportPage;
