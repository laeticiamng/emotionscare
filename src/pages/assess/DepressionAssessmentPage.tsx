// @ts-nocheck
/**
 * PHQ-9 — Patient Health Questionnaire (Kroenke et al., 2001)
 * 9-item depression screening validated in French
 */
import React, { useState, useCallback } from 'react';
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
import { ArrowLeft, ArrowRight, Heart, CheckCircle2, AlertTriangle, Info, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const PHQ9_ITEMS = [
  { id: 1, text: 'Peu d\'intérêt ou de plaisir à faire les choses' },
  { id: 2, text: 'Se sentir triste, déprimé(e) ou désespéré(e)' },
  { id: 3, text: 'Difficultés à s\'endormir ou à rester endormi(e), ou dormir trop' },
  { id: 4, text: 'Se sentir fatigué(e) ou avoir peu d\'énergie' },
  { id: 5, text: 'Avoir peu d\'appétit ou manger trop' },
  { id: 6, text: 'Avoir une mauvaise opinion de soi-même — ou sentir qu\'on est un(e) raté(e) ou qu\'on s\'est laissé(e) aller, ou avoir laissé sa famille tomber' },
  { id: 7, text: 'Avoir du mal à se concentrer, par exemple pour lire le journal ou regarder la télévision' },
  { id: 8, text: 'Bouger ou parler si lentement que les autres ont pu le remarquer — ou au contraire, être si agité(e) qu\'on a bougé beaucoup plus que d\'habitude' },
  { id: 9, text: 'Avoir des pensées que vous seriez mieux mort(e) ou des idées de vous faire du mal' },
];

const FREQUENCY_OPTIONS = [
  { value: 0, label: 'Pas du tout' },
  { value: 1, label: 'Plusieurs jours' },
  { value: 2, label: 'Plus de la moitié des jours' },
  { value: 3, label: 'Presque tous les jours' },
];

interface PHQ9Result {
  total: number;
  level: 'minimal' | 'mild' | 'moderate' | 'moderately_severe' | 'severe';
  label: string;
  interpretation: string;
  recommendation: string;
  urgent: boolean;
}

function scorePHQ9(answers: Record<number, number>): PHQ9Result {
  const total = Object.values(answers).reduce((s, v) => s + v, 0);
  const item9 = answers[9] ?? 0;
  const urgent = item9 >= 1;

  if (total <= 4) {
    return { total, level: 'minimal', label: 'Minimal', interpretation: 'Symptômes dépressifs minimes ou absents.', recommendation: 'Pas d\'intervention spécifique nécessaire. Continuez votre suivi régulier.', urgent };
  }
  if (total <= 9) {
    return { total, level: 'mild', label: 'Léger', interpretation: 'Symptômes dépressifs légers. Certains domaines de votre vie quotidienne peuvent être affectés.', recommendation: 'Un suivi régulier est recommandé. Les techniques de respiration et le journal émotionnel peuvent aider.', urgent };
  }
  if (total <= 14) {
    return { total, level: 'moderate', label: 'Modéré', interpretation: 'Symptômes dépressifs modérés. Un accompagnement professionnel est recommandé.', recommendation: 'Consultez votre médecin traitant. En complément, utilisez le Coach IA et les protocoles de bien-être.', urgent };
  }
  if (total <= 19) {
    return { total, level: 'moderately_severe', label: 'Modérément sévère', interpretation: 'Symptômes dépressifs modérément sévères nécessitant une prise en charge.', recommendation: 'Consultez rapidement un professionnel de santé mentale. Ce questionnaire ne remplace pas un diagnostic.', urgent };
  }
  return { total, level: 'severe', label: 'Sévère', interpretation: 'Symptômes dépressifs sévères. Une prise en charge urgente est nécessaire.', recommendation: 'Consultez immédiatement un professionnel de santé. En cas d\'urgence, appelez le 3114 (numéro national de prévention du suicide).', urgent };
}

const LEVEL_STYLE = {
  minimal: { color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', icon: CheckCircle2 },
  mild: { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', icon: Info },
  moderate: { color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: Info },
  moderately_severe: { color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30', icon: AlertTriangle },
  severe: { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', icon: AlertTriangle },
};

const DepressionAssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  usePageSEO({
    title: 'Évaluation PHQ-9 Dépression | EmotionsCare',
    description: 'Dépistage des symptômes dépressifs avec le questionnaire PHQ-9, validé scientifiquement.',
  });

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<PHQ9Result | null>(null);

  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / PHQ9_ITEMS.length) * 100;
  const allAnswered = answeredCount === PHQ9_ITEMS.length;

  const handleAnswer = useCallback((itemId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [itemId]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    const res = scorePHQ9(answers);
    setResult(res);

    if (user) {
      try {
        await supabase.from('assessments').insert({
          user_id: user.id,
          instrument: 'PHQ-9',
          score_json: { total: res.total, level: res.level, answers, urgent: res.urgent },
          submitted_at: new Date().toISOString(),
        });
        toast.success('Résultat sauvegardé');
      } catch { /* silent */ }
    }
  }, [answers, user]);

  const handleReset = useCallback(() => {
    setAnswers({});
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
              <Badge variant="outline" className="mb-4">PHQ-9 — Résultat</Badge>
              <h1 className="text-3xl font-bold mb-2">Dépistage dépression</h1>
            </div>

            {result.urgent && (
              <Card className="mb-6 border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-red-700 dark:text-red-400">Besoin d'aide immédiate ?</p>
                      <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                        Si vous avez des pensées suicidaires, appelez le <strong>3114</strong> (24h/24, 7j/7) ou rendez-vous aux urgences les plus proches.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="mb-6">
              <CardContent className="p-8 text-center">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${style.bg} ${style.color} text-sm font-semibold mb-4`}>
                  <Icon className="h-4 w-4" />
                  {result.label}
                </div>
                <p className="text-5xl font-bold mb-2">{result.total}<span className="text-lg text-muted-foreground">/27</span></p>
                <p className="text-muted-foreground mt-4">{result.interpretation}</p>
                <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm text-left">
                  <strong>💡 Recommandation :</strong> {result.recommendation}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button onClick={handleReset} variant="outline" className="flex-1">Refaire le test</Button>
              <Button onClick={() => navigate('/app/coach')} className="flex-1">Coach IA</Button>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-6">
              Kroenke, K., Spitzer, R. L., & Williams, J. B. (2001). PHQ-9.
              Ce test est un outil de dépistage et ne remplace pas un diagnostic médical professionnel.
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
            <Heart className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Dépistage dépression — PHQ-9</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            9 questions · ~2 minutes · Validé scientifiquement (Kroenke, 2001)
          </p>
          <p className="text-xs text-muted-foreground mt-2 italic">
            Au cours des 2 dernières semaines, à quelle fréquence avez-vous été gêné(e) par les problèmes suivants ?
          </p>
        </div>

        <Progress value={progress} className="mb-6 h-2" />

        <div className="space-y-6">
          {PHQ9_ITEMS.map((item, idx) => (
            <Card key={item.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium leading-relaxed">
                  {idx + 1}. {item.text}
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
                      <RadioGroupItem value={opt.value.toString()} id={`phq-q${item.id}-${opt.value}`} />
                      <Label htmlFor={`phq-q${item.id}-${opt.value}`} className="cursor-pointer text-sm flex-1">
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end mt-8">
          <Button onClick={handleSubmit} disabled={!allAnswered} className="gap-2">
            Voir les résultats <CheckCircle2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DepressionAssessmentPage;
