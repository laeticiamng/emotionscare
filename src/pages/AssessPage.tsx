/**
 * AssessPage - Centre des Évaluations Cliniques
 * Accès aux 11 instruments psychométriques validés avec questionnaire interactif
 */

import React, { useState, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, ClipboardList, Brain, Heart, Activity, Moon, Shield, Smile, Check, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface InstrumentItem {
  id: string;
  prompt: string;
  type: 'scale' | 'slider';
  min: number;
  max: number;
  reversed?: boolean;
  labels?: string[];
}

interface InstrumentConfig {
  id: string;
  name: string;
  description: string;
  icon: typeof ClipboardList;
  color: string;
  items: InstrumentItem[];
  scaleLabels: string[];
  interpretation: (score: number, max: number) => { level: string; color: string; message: string };
}

const SCALE_LABELS_0_5 = ['Jamais', 'Rarement', 'Parfois', 'Souvent', 'Très souvent', 'Toujours'];
const SCALE_LABELS_0_3 = ['Pas du tout', 'Plusieurs jours', 'Plus de la moitié des jours', 'Presque tous les jours'];
const SCALE_LABELS_1_4 = ['Pas du tout', 'Un peu', 'Modérément', 'Beaucoup'];

const INSTRUMENTS: Record<string, InstrumentConfig> = {
  WHO5: {
    id: 'WHO5', name: 'WHO-5', description: 'Bien-être général (OMS)', icon: Smile, color: 'bg-green-500',
    scaleLabels: SCALE_LABELS_0_5,
    items: [
      { id: '1', prompt: 'Je me suis senti(e) gai(e) et de bonne humeur', type: 'scale', min: 0, max: 5 },
      { id: '2', prompt: 'Je me suis senti(e) calme et détendu(e)', type: 'scale', min: 0, max: 5 },
      { id: '3', prompt: 'Je me suis senti(e) actif/ve et énergique', type: 'scale', min: 0, max: 5 },
      { id: '4', prompt: 'Je me suis réveillé(e) en me sentant frais/fraîche et reposé(e)', type: 'scale', min: 0, max: 5 },
      { id: '5', prompt: 'Ma vie quotidienne a été remplie de choses qui m\'intéressent', type: 'scale', min: 0, max: 5 }
    ],
    interpretation: (score, max) => {
      const pct = (score / max) * 100;
      if (pct >= 52) return { level: 'Bon', color: 'text-green-600', message: 'Votre bien-être est satisfaisant.' };
      if (pct >= 28) return { level: 'Modéré', color: 'text-yellow-600', message: 'Attention, votre bien-être pourrait être amélioré.' };
      return { level: 'Faible', color: 'text-red-600', message: 'Un accompagnement pourrait vous être bénéfique.' };
    }
  },
  PHQ9: {
    id: 'PHQ9', name: 'PHQ-9', description: 'Dépression', icon: Heart, color: 'bg-blue-500',
    scaleLabels: SCALE_LABELS_0_3,
    items: [
      { id: '1', prompt: 'Peu d\'intérêt ou de plaisir à faire les choses', type: 'scale', min: 0, max: 3 },
      { id: '2', prompt: 'Se sentir triste, déprimé(e) ou désespéré(e)', type: 'scale', min: 0, max: 3 },
      { id: '3', prompt: 'Difficultés à s\'endormir ou à rester endormi(e), ou trop dormir', type: 'scale', min: 0, max: 3 },
      { id: '4', prompt: 'Se sentir fatigué(e) ou avoir peu d\'énergie', type: 'scale', min: 0, max: 3 },
      { id: '5', prompt: 'Peu d\'appétit ou manger trop', type: 'scale', min: 0, max: 3 },
      { id: '6', prompt: 'Mauvaise opinion de soi-même', type: 'scale', min: 0, max: 3 },
      { id: '7', prompt: 'Difficultés à se concentrer', type: 'scale', min: 0, max: 3 },
      { id: '8', prompt: 'Bouger ou parler lentement, ou au contraire être agité(e)', type: 'scale', min: 0, max: 3 },
      { id: '9', prompt: 'Penser qu\'il vaudrait mieux mourir ou se faire du mal', type: 'scale', min: 0, max: 3 }
    ],
    interpretation: (score) => {
      if (score <= 4) return { level: 'Minimal', color: 'text-green-600', message: 'Symptômes dépressifs minimes.' };
      if (score <= 9) return { level: 'Léger', color: 'text-yellow-600', message: 'Symptômes dépressifs légers.' };
      if (score <= 14) return { level: 'Modéré', color: 'text-orange-600', message: 'Symptômes dépressifs modérés.' };
      if (score <= 19) return { level: 'Modérément sévère', color: 'text-red-500', message: 'Envisagez de consulter un professionnel.' };
      return { level: 'Sévère', color: 'text-red-700', message: 'Une consultation professionnelle est recommandée.' };
    }
  },
  GAD7: {
    id: 'GAD7', name: 'GAD-7', description: 'Anxiété généralisée', icon: Activity, color: 'bg-purple-500',
    scaleLabels: SCALE_LABELS_0_3,
    items: [
      { id: '1', prompt: 'Se sentir nerveux/nerveuse, anxieux/anxieuse ou tendu(e)', type: 'scale', min: 0, max: 3 },
      { id: '2', prompt: 'Être incapable d\'arrêter de s\'inquiéter', type: 'scale', min: 0, max: 3 },
      { id: '3', prompt: 'S\'inquiéter trop de différentes choses', type: 'scale', min: 0, max: 3 },
      { id: '4', prompt: 'Avoir du mal à se détendre', type: 'scale', min: 0, max: 3 },
      { id: '5', prompt: 'Être si agité(e) qu\'il est difficile de tenir en place', type: 'scale', min: 0, max: 3 },
      { id: '6', prompt: 'Devenir facilement contrarié(e) ou irritable', type: 'scale', min: 0, max: 3 },
      { id: '7', prompt: 'Avoir peur que quelque chose d\'affreux puisse arriver', type: 'scale', min: 0, max: 3 }
    ],
    interpretation: (score) => {
      if (score <= 4) return { level: 'Minimal', color: 'text-green-600', message: 'Anxiété minimale.' };
      if (score <= 9) return { level: 'Léger', color: 'text-yellow-600', message: 'Anxiété légère.' };
      if (score <= 14) return { level: 'Modéré', color: 'text-orange-600', message: 'Anxiété modérée.' };
      return { level: 'Sévère', color: 'text-red-600', message: 'Anxiété sévère. Consultation recommandée.' };
    }
  },
  STAI6: {
    id: 'STAI6', name: 'STAI-6', description: 'Anxiété état/trait', icon: Activity, color: 'bg-red-500',
    scaleLabels: SCALE_LABELS_1_4,
    items: [
      { id: '1', prompt: 'Je me sens calme', type: 'scale', min: 1, max: 4, reversed: true },
      { id: '2', prompt: 'Je me sens tendu(e)', type: 'scale', min: 1, max: 4 },
      { id: '3', prompt: 'Je me sens contrarié(e)', type: 'scale', min: 1, max: 4 },
      { id: '4', prompt: 'Je me sens détendu(e)', type: 'scale', min: 1, max: 4, reversed: true },
      { id: '5', prompt: 'Je me sens inquiet/ète', type: 'scale', min: 1, max: 4 },
      { id: '6', prompt: 'Je me sens confus(e)', type: 'scale', min: 1, max: 4 }
    ],
    interpretation: (score) => {
      if (score <= 10) return { level: 'Faible', color: 'text-green-600', message: 'Niveau d\'anxiété faible.' };
      if (score <= 15) return { level: 'Modéré', color: 'text-yellow-600', message: 'Niveau d\'anxiété modéré.' };
      return { level: 'Élevé', color: 'text-red-600', message: 'Niveau d\'anxiété élevé.' };
    }
  },
  ISI: {
    id: 'ISI', name: 'ISI', description: 'Insomnie', icon: Moon, color: 'bg-indigo-500',
    scaleLabels: ['Aucun', 'Léger', 'Modéré', 'Sévère', 'Très sévère'],
    items: [
      { id: '1', prompt: 'Difficulté à vous endormir', type: 'scale', min: 0, max: 4 },
      { id: '2', prompt: 'Difficulté à rester endormi(e)', type: 'scale', min: 0, max: 4 },
      { id: '3', prompt: 'Réveil trop tôt le matin', type: 'scale', min: 0, max: 4 },
      { id: '4', prompt: 'Satisfaction par rapport à votre sommeil actuel', type: 'scale', min: 0, max: 4 },
      { id: '5', prompt: 'Impact de vos troubles du sommeil sur votre fonctionnement quotidien', type: 'scale', min: 0, max: 4 },
      { id: '6', prompt: 'Visibilité de vos troubles du sommeil pour les autres', type: 'scale', min: 0, max: 4 },
      { id: '7', prompt: 'Préoccupation/détresse causée par vos troubles du sommeil', type: 'scale', min: 0, max: 4 }
    ],
    interpretation: (score) => {
      if (score <= 7) return { level: 'Pas de problème', color: 'text-green-600', message: 'Pas d\'insomnie cliniquement significative.' };
      if (score <= 14) return { level: 'Insomnie légère', color: 'text-yellow-600', message: 'Insomnie légère.' };
      if (score <= 21) return { level: 'Insomnie modérée', color: 'text-orange-600', message: 'Insomnie modérée.' };
      return { level: 'Insomnie sévère', color: 'text-red-600', message: 'Insomnie sévère. Consultation recommandée.' };
    }
  },
  BRS: {
    id: 'BRS', name: 'BRS', description: 'Résilience', icon: Shield, color: 'bg-emerald-500',
    scaleLabels: ['Pas du tout d\'accord', 'En désaccord', 'Neutre', 'D\'accord', 'Tout à fait d\'accord'],
    items: [
      { id: '1', prompt: 'J\'ai tendance à rebondir rapidement après des moments difficiles', type: 'scale', min: 1, max: 5 },
      { id: '2', prompt: 'J\'ai du mal à traverser les événements stressants', type: 'scale', min: 1, max: 5, reversed: true },
      { id: '3', prompt: 'Il ne me faut pas longtemps pour me remettre d\'un événement stressant', type: 'scale', min: 1, max: 5 },
      { id: '4', prompt: 'Il m\'est difficile de rebondir quand quelque chose de mal arrive', type: 'scale', min: 1, max: 5, reversed: true },
      { id: '5', prompt: 'Je m\'en sors généralement bien dans les périodes difficiles', type: 'scale', min: 1, max: 5 },
      { id: '6', prompt: 'J\'ai tendance à mettre longtemps à me remettre des revers de la vie', type: 'scale', min: 1, max: 5, reversed: true }
    ],
    interpretation: (score) => {
      const avg = score / 6;
      if (avg >= 4.0) return { level: 'Haute', color: 'text-green-600', message: 'Excellente résilience.' };
      if (avg >= 3.0) return { level: 'Normale', color: 'text-yellow-600', message: 'Résilience normale.' };
      return { level: 'Faible', color: 'text-red-600', message: 'Résilience faible. Des exercices peuvent aider.' };
    }
  }
};

// Liste pour l'affichage de la grille
const INSTRUMENT_LIST = [
  { id: 'WHO5', name: 'WHO-5', description: 'Bien-être général (OMS)', icon: Smile, color: 'bg-green-500', items: 5 },
  { id: 'PHQ9', name: 'PHQ-9', description: 'Dépression', icon: Heart, color: 'bg-blue-500', items: 9 },
  { id: 'GAD7', name: 'GAD-7', description: 'Anxiété généralisée', icon: Activity, color: 'bg-purple-500', items: 7 },
  { id: 'STAI6', name: 'STAI-6', description: 'Anxiété état/trait', icon: Activity, color: 'bg-red-500', items: 6 },
  { id: 'ISI', name: 'ISI', description: 'Insomnie', icon: Moon, color: 'bg-indigo-500', items: 7 },
  { id: 'BRS', name: 'BRS', description: 'Résilience', icon: Shield, color: 'bg-emerald-500', items: 6 },
];

export default function AssessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const selectedInstrumentId = searchParams.get('instrument');
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<{ score: number; interpretation: { level: string; color: string; message: string } } | null>(null);

  const instrument = selectedInstrumentId ? INSTRUMENTS[selectedInstrumentId] : null;

  const handleAnswer = useCallback((questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  }, []);

  const calculateScore = useCallback(() => {
    if (!instrument) return 0;
    return instrument.items.reduce((total, item) => {
      const answer = answers[item.id] ?? 0;
      if (item.reversed) {
        return total + (item.max - answer + item.min);
      }
      return total + answer;
    }, 0);
  }, [instrument, answers]);

  const handleSubmit = useCallback(async () => {
    if (!instrument || !user) return;
    
    setIsSubmitting(true);
    try {
      const score = calculateScore();
      const maxScore = instrument.items.reduce((sum, item) => sum + item.max, 0);
      const interpretation = instrument.interpretation(score, maxScore);
      
      // Sauvegarder en base
      const { error } = await supabase.from('assessments').insert({
        user_id: user.id,
        instrument: instrument.id,
        score_json: {
          total: score,
          maxPossible: maxScore,
          percentage: Math.round((score / maxScore) * 100),
          answers,
          interpretation: interpretation.level
        },
        ts: new Date().toISOString()
      });

      if (error) throw error;

      setResult({ score, interpretation });
      setShowResults(true);
      
      toast({
        title: '✅ Évaluation terminée',
        description: `Score: ${score}/${maxScore} - ${interpretation.level}`,
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder l\'évaluation',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [instrument, user, answers, calculateScore]);

  const handleNextQuestion = () => {
    if (!instrument) return;
    if (currentQuestion < instrument.items.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setResult(null);
  };

  // Affichage des résultats
  if (showResults && result && instrument) {
    const maxScore = instrument.items.reduce((sum, item) => sum + item.max, 0);
    const percentage = Math.round((result.score / maxScore) * 100);
    
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl" data-testid="page-root">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10">
              <Check className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl">Évaluation Terminée</CardTitle>
            <CardDescription>{instrument.name} - {instrument.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-6 bg-muted rounded-lg">
              <div className="text-5xl font-bold mb-2">{result.score}<span className="text-2xl text-muted-foreground">/{maxScore}</span></div>
              <Progress value={percentage} className="h-3 mb-4" />
              <Badge className={`text-lg px-4 py-2 ${result.interpretation.color.replace('text-', 'bg-').replace('600', '100').replace('700', '100')}`}>
                {result.interpretation.level}
              </Badge>
              <p className="mt-4 text-muted-foreground">{result.interpretation.message}</p>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={resetAssessment}>
                Refaire le test
              </Button>
              <Button onClick={() => navigate('/app/assess')}>
                Autres évaluations
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Affichage du questionnaire
  if (instrument) {
    const item = instrument.items[currentQuestion];
    const progress = ((currentQuestion + 1) / instrument.items.length) * 100;
    const isAnswered = answers[item.id] !== undefined;
    const isLastQuestion = currentQuestion === instrument.items.length - 1;
    const allAnswered = instrument.items.every(i => answers[i.id] !== undefined);

    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl" data-testid="page-root">
        <Link to="/app/assess" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Retour aux évaluations
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${instrument.color} text-white`}>
                  <instrument.icon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>{instrument.name}</CardTitle>
                  <CardDescription>{instrument.description}</CardDescription>
                </div>
              </div>
              <Badge variant="outline">
                {currentQuestion + 1}/{instrument.items.length}
              </Badge>
            </div>
            <Progress value={progress} className="h-2" />
          </CardHeader>
          
          <CardContent className="space-y-8">
            <div className="min-h-[200px]">
              <p className="text-lg font-medium mb-6">{item.prompt}</p>
              
              <RadioGroup
                value={answers[item.id]?.toString() || ''}
                onValueChange={(value) => handleAnswer(item.id, parseInt(value))}
                className="space-y-3"
              >
                {instrument.scaleLabels.slice(0, item.max - item.min + 1).map((label, index) => {
                  const value = item.min + index;
                  return (
                    <div key={value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors">
                      <RadioGroupItem value={value.toString()} id={`q${item.id}-${value}`} />
                      <Label htmlFor={`q${item.id}-${value}`} className="flex-1 cursor-pointer">
                        <span className="font-medium">{value}</span> - {label}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>

            <div className="flex justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={handlePrevQuestion}
                disabled={currentQuestion === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Précédent
              </Button>

              {isLastQuestion ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!allAnswered || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Terminer
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  disabled={!isAnswered}
                >
                  Suivant
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Affichage de la grille des instruments
  return (
    <div className="container mx-auto px-4 py-8" data-testid="page-root">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-xl bg-primary/10">
          <ClipboardList className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Évaluations Cliniques</h1>
          <p className="text-muted-foreground">Instruments psychométriques validés scientifiquement</p>
        </div>
      </div>

      {!user && (
        <Card className="p-4 mb-6 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            ⚠️ Connectez-vous pour sauvegarder vos résultats et suivre votre évolution.
          </p>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {INSTRUMENT_LIST.map((inst) => (
          <Link key={inst.id} to={`/app/assess?instrument=${inst.id}`}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${inst.color} text-white`}>
                    <inst.icon className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary">{inst.items} Q</Badge>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {inst.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{inst.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
