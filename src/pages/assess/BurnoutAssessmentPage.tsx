// @ts-nocheck
/**
 * MBI-HSS Burnout Assessment Page
 * 22-item scientifically validated questionnaire
 */
import React, { useState, useCallback, useMemo } from 'react';
import { usePageSEO } from '@/hooks/usePageSEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, Brain, Shield, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MBI_ITEMS, MBI_FREQUENCY_OPTIONS, scoreMBI, MBIResult } from '@/components/assess/burnout/MBIQuestions';
import { BurnoutRadarChart } from '@/components/assess/burnout/BurnoutRadarChart';

const ITEMS_PER_PAGE = 5;

const LEVEL_LABEL = {
  low: { label: 'Faible', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', icon: CheckCircle2 },
  moderate: { label: 'Modéré', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: Info },
  high: { label: 'Élevé', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', icon: AlertTriangle },
};

const BurnoutAssessmentPage: React.FC = () => {
  usePageSEO({
    title: 'Évaluation Burnout MBI-HSS | EmotionsCare',
    description: 'Évaluation scientifiquement validée du burnout pour les professionnels de santé — Maslach Burnout Inventory.',
  });

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [page, setPage] = useState(0);
  const [result, setResult] = useState<MBIResult | null>(null);
  const [startTime] = useState(Date.now());

  const totalPages = Math.ceil(MBI_ITEMS.length / ITEMS_PER_PAGE);
  const currentItems = MBI_ITEMS.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / MBI_ITEMS.length) * 100;
  const allAnswered = answeredCount === MBI_ITEMS.length;

  const currentPageComplete = currentItems.every((item) => answers[item.id] !== undefined);

  const handleAnswer = useCallback((itemId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [itemId]: value }));
  }, []);

  const handleSubmit = useCallback(() => {
    const res = scoreMBI(answers);
    setResult(res);
  }, [answers]);

  const handleReset = useCallback(() => {
    setAnswers({});
    setPage(0);
    setResult(null);
  }, []);

  if (result) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/app/assess"><ArrowLeft className="h-4 w-4 mr-2" />Retour</Link>
            </Button>
          </div>

          <Card className="border-border">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Brain className="h-6 w-6 text-primary" />
                Résultats MBI-HSS
              </CardTitle>
              <CardDescription>Comparaison avec les normes des professionnels de santé</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall risk badge */}
              <div className="flex justify-center">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${LEVEL_LABEL[result.overallRisk].bg}`}>
                  {React.createElement(LEVEL_LABEL[result.overallRisk].icon, { className: `h-5 w-5 ${LEVEL_LABEL[result.overallRisk].color}` })}
                  <span className={`font-semibold ${LEVEL_LABEL[result.overallRisk].color}`}>
                    Risque de burnout : {LEVEL_LABEL[result.overallRisk].label}
                  </span>
                </div>
              </div>

              {/* Radar Chart */}
              <BurnoutRadarChart result={result} />

              {/* Subscale details */}
              <div className="grid gap-4 sm:grid-cols-3">
                {([
                  { key: 'EE' as const, label: 'Épuisement Émotionnel', max: 54, desc: 'Sentiment d\'être émotionnellement vidé' },
                  { key: 'DP' as const, label: 'Dépersonnalisation', max: 30, desc: 'Attitude détachée envers les patients' },
                  { key: 'PA' as const, label: 'Accomplissement Personnel', max: 48, desc: 'Sentiment d\'efficacité professionnelle' },
                ]).map(({ key, label, max, desc }) => {
                  const sub = result[key];
                  const lev = LEVEL_LABEL[sub.level];
                  return (
                    <Card key={key} className={`${lev.bg} border-none`}>
                      <CardContent className="p-4 text-center space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">{label}</p>
                        <p className={`text-3xl font-bold ${lev.color}`}>{sub.score}<span className="text-base text-muted-foreground">/{max}</span></p>
                        <Badge variant="outline" className={lev.color}>{lev.label}</Badge>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Ethical disclaimer */}
              <div className="p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground flex gap-3">
                <Shield className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium text-foreground mb-1">Note importante</p>
                  <p>Ce questionnaire est un outil de dépistage, pas un diagnostic. Si vos scores indiquent un risque élevé, nous vous recommandons de consulter un professionnel de santé mentale. Vos données restent anonymisées et confidentielles.</p>
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={handleReset}>Refaire l'évaluation</Button>
                <Button asChild><Link to="/app/home">Retour au tableau de bord</Link></Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/app/assess"><ArrowLeft className="h-4 w-4 mr-2" />Retour</Link>
          </Button>
        </div>

        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Brain className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Évaluation du Burnout — MBI-HSS</CardTitle>
                <CardDescription>Maslach Burnout Inventory for Human Services • 22 questions</CardDescription>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">{answeredCount} / {MBI_ITEMS.length} questions • Page {page + 1}/{totalPages}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
              Indiquez la fréquence à laquelle vous ressentez chaque situation dans votre travail.
            </p>

            {currentItems.map((item) => (
              <div key={item.id} className="space-y-3 p-4 rounded-lg border border-border hover:border-primary/30 transition-colors">
                <p className="font-medium text-sm leading-relaxed">
                  <span className="text-muted-foreground mr-2">{item.id}.</span>
                  {item.text}
                </p>
                <RadioGroup
                  value={answers[item.id]?.toString()}
                  onValueChange={(v) => handleAnswer(item.id, parseInt(v))}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-2"
                >
                  {MBI_FREQUENCY_OPTIONS.map((opt) => (
                    <div key={opt.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={opt.value.toString()} id={`q${item.id}-${opt.value}`} />
                      <Label htmlFor={`q${item.id}-${opt.value}`} className="text-xs cursor-pointer leading-tight">
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Précédent
              </Button>

              {page < totalPages - 1 ? (
                <Button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!currentPageComplete}
                >
                  Suivant <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!allAnswered}
                  className="bg-primary"
                >
                  Voir mes résultats
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BurnoutAssessmentPage;
