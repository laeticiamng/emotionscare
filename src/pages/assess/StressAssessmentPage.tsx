// @ts-nocheck
/**
 * PSS-10 — Perceived Stress Scale (Cohen, 1983)
 * 10-item validated stress questionnaire
 */
import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageSEO } from '@/hooks/usePageSEO';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, Brain, CheckCircle2, AlertTriangle, Info, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const PSS_ITEMS = [
  { id: 1, text: 'Au cours du dernier mois, combien de fois avez-vous été dérangé(e) par un événement inattendu ?', reversed: false },
  { id: 2, text: 'Au cours du dernier mois, combien de fois avez-vous senti que vous étiez incapable de contrôler les choses importantes de votre vie ?', reversed: false },
  { id: 3, text: 'Au cours du dernier mois, combien de fois vous êtes-vous senti(e) nerveux(se) et stressé(e) ?', reversed: false },
  { id: 4, text: 'Au cours du dernier mois, combien de fois avez-vous traité avec succès les petits problèmes et ennuis quotidiens ?', reversed: true },
  { id: 5, text: 'Au cours du dernier mois, combien de fois avez-vous senti que vous faisiez face efficacement aux changements importants qui survenaient dans votre vie ?', reversed: true },
  { id: 6, text: 'Au cours du dernier mois, combien de fois vous êtes-vous senti(e) confiant(e) dans votre capacité à prendre en main vos problèmes personnels ?', reversed: true },
  { id: 7, text: 'Au cours du dernier mois, combien de fois avez-vous senti que les choses allaient comme vous le vouliez ?', reversed: true },
  { id: 8, text: 'Au cours du dernier mois, combien de fois avez-vous trouvé que vous ne pouviez pas assumer toutes les choses que vous deviez faire ?', reversed: false },
  { id: 9, text: 'Au cours du dernier mois, combien de fois avez-vous été capable de maîtriser votre énervement ?', reversed: true },
  { id: 10, text: 'Au cours du dernier mois, combien de fois avez-vous senti que les difficultés s\'accumulaient à un tel point que vous ne pouviez les surmonter ?', reversed: false },
];

const FREQUENCY_OPTIONS = [
  { value: 0, label: 'Jamais' },
  { value: 1, label: 'Presque jamais' },
  { value: 2, label: 'Parfois' },
  { value: 3, label: 'Assez souvent' },
  { value: 4, label: 'Très souvent' },
];

interface PSSResult {
  total: number;
  level: 'low' | 'moderate' | 'high';
  interpretation: string;
  recommendation: string;
}

function scorePSS(answers: Record<number, number>): PSSResult {
  let total = 0;
  for (const item of PSS_ITEMS) {
    const raw = answers[item.id] ?? 0;
    total += item.reversed ? (4 - raw) : raw;
  }

  if (total <= 13) {
    return {
      total,
      level: 'low',
      interpretation: 'Votre niveau de stress perçu est faible. Vous gérez bien les situations stressantes.',
      recommendation: 'Continuez vos bonnes habitudes. Le scan régulier vous aide à maintenir cet équilibre.',
    };
  }
  if (total <= 26) {
    return {
      total,
      level: 'moderate',
      interpretation: 'Votre niveau de stress perçu est modéré. Certaines situations vous pèsent.',
      recommendation: 'Les protocoles de respiration et le coaching IA peuvent vous aider à mieux réguler votre stress.',
    };
  }
  return {
    total,
    level: 'high',
    interpretation: 'Votre niveau de stress perçu est élevé. Il est important de prendre des mesures pour le réduire.',
    recommendation: 'Consultez un professionnel de santé. En attendant, utilisez le Protocole Stop et le Coach IA pour un soutien immédiat.',
  };
}

const LEVEL_STYLE = {
  low: { label: 'Faible', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', icon: CheckCircle2 },
  moderate: { label: 'Modéré', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: Info },
  high: { label: 'Élevé', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', icon: AlertTriangle },
};

const ITEMS_PER_PAGE = 5;

const StressAssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  usePageSEO({
    title: 'Évaluation Stress PSS-10 | EmotionsCare',
    description: 'Évaluez votre niveau de stress perçu avec le questionnaire PSS-10, validé scientifiquement.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Évaluation Stress PSS-10',
      applicationCategory: 'HealthApplication',
      operatingSystem: 'Web',
    },
  });

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [page, setPage] = useState(0);
  const [result, setResult] = useState<PSSResult | null>(null);

  const totalPages = Math.ceil(PSS_ITEMS.length / ITEMS_PER_PAGE);
  const currentItems = PSS_ITEMS.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / PSS_ITEMS.length) * 100;
  const allAnswered = answeredCount === PSS_ITEMS.length;
  const currentPageComplete = currentItems.every((item) => answers[item.id] !== undefined);

  const handleAnswer = useCallback((itemId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [itemId]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    const res = scorePSS(answers);
    setResult(res);

    if (user) {
      try {
        await supabase.from('assessments').insert({
          user_id: user.id,
          instrument: 'PSS-10',
          score_json: {
            total: res.total,
            level: res.level,
            answers,
          },
          submitted_at: new Date().toISOString(),
        });
        toast.success('Résultat sauvegardé');
      } catch {
        // Silent
      }
    }
  }, [answers, user]);

  const handleReset = useCallback(() => {
    setAnswers({});
    setPage(0);
    setResult(null);
  }, []);

  if (result) {
    const style = LEVEL_STYLE[result.level];
    const Icon = style.icon;
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container max-w-2xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-8">
              <Badge variant="outline" className="mb-4">PSS-10 — Résultat</Badge>
              <h1 className="text-3xl font-bold mb-2">Votre niveau de stress perçu</h1>
            </div>

            <Card className="mb-6">
              <CardContent className="p-8 text-center">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${style.bg} ${style.color} text-sm font-semibold mb-4`}>
                  <Icon className="h-4 w-4" />
                  Stress {style.label}
                </div>
                <p className="text-5xl font-bold mb-2">{result.total}<span className="text-lg text-muted-foreground">/40</span></p>
                <p className="text-muted-foreground mt-4">{result.interpretation}</p>
                <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm text-left">
                  <strong>💡 Recommandation :</strong> {result.recommendation}
                </div>
              </CardContent>
            </Card>

            {/* Score gauge */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" /> Échelle de stress
                </h3>
                <div className="relative h-4 bg-muted rounded-full overflow-hidden mb-2">
                  <div className="absolute inset-y-0 left-0 w-1/3 bg-green-400/40" />
                  <div className="absolute inset-y-0 left-1/3 w-1/3 bg-yellow-400/40" />
                  <div className="absolute inset-y-0 right-0 w-1/3 bg-red-400/40" />
                  <motion.div
                    className="absolute top-0 w-1 h-full bg-foreground rounded-full"
                    initial={{ left: 0 }}
                    animate={{ left: `${(result.total / 40) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0 — Faible</span>
                  <span>13 — Modéré</span>
                  <span>27 — Élevé</span>
                  <span>40</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button onClick={handleReset} variant="outline" className="flex-1">Refaire le test</Button>
              <Button onClick={() => navigate('/app/breath')} className="flex-1">Protocole de respiration</Button>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-6">
              Cohen, S., Kamarck, T., & Mermelstein, R. (1983). PSS-10 — Perceived Stress Scale.
              Ce test ne remplace pas un diagnostic médical.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <Link to="/dashboard/assessments" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" /> Retour aux évaluations
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Brain className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Stress perçu — PSS-10</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            10 questions · ~3 minutes · Validé scientifiquement (Cohen, 1983)
          </p>
        </div>

        <Progress value={progress} className="mb-6 h-2" />
        <p className="text-xs text-muted-foreground mb-6">
          {answeredCount}/{PSS_ITEMS.length} questions répondues
        </p>

        <div className="space-y-6">
          {currentItems.map((item, idx) => (
            <Card key={item.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium leading-relaxed">
                  {page * ITEMS_PER_PAGE + idx + 1}. {item.text}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={answers[item.id]?.toString()}
                  onValueChange={(val) => handleAnswer(item.id, parseInt(val))}
                  className="space-y-2"
                >
                  {FREQUENCY_OPTIONS.map((opt) => (
                    <div key={opt.value} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value={opt.value.toString()} id={`q${item.id}-${opt.value}`} />
                      <Label htmlFor={`q${item.id}-${opt.value}`} className="cursor-pointer text-sm flex-1">
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-between mt-8">
          <Button
            onClick={() => setPage((p) => p - 1)}
            variant="outline"
            disabled={page === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Précédent
          </Button>
          {page < totalPages - 1 ? (
            <Button
              onClick={() => setPage((p) => p + 1)}
              disabled={!currentPageComplete}
              className="gap-2"
            >
              Suivant <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!allAnswered} className="gap-2">
              Voir les résultats <CheckCircle2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StressAssessmentPage;
