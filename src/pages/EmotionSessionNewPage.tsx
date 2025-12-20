import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Brain, Loader2, Sparkles } from 'lucide-react';

import PageRoot from '@/components/common/PageRoot';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { routes } from '@/lib/routes';
import { usePageSEO } from '@/hooks/usePageSEO';
import { useToast } from '@/hooks/use-toast';
import {
  emotionContextTags,
  emotionInputSchema,
  type EmotionAnalysisResult,
  type EmotionPlanResult,
  type EmotionSessionInput,
} from '@/features/emotion-sessions/emotionSessionSchema';
import {
  analyzeEmotionSession,
  generateEmotionPlan,
  requestMusicGeneration,
  updatePrimaryEmotion,
} from '@/features/emotion-sessions/emotionSessionApi';
import { EmotionWheel, emotionWheelOptions } from '@/features/emotion-sessions/EmotionWheel';

const TEXT_SUGGESTIONS = [
  'Je me sens sous pression',
  'J\'ai du mal à me concentrer',
  'Je suis rempli(e) d\'énergie',
  'Je me sens submergé(e)',
];

const ENERGY_MAP: Record<string, string> = {
  joy: 'uplifting',
  trust: 'steady',
  fear: 'calming',
  surprise: 'bright',
  sadness: 'comforting',
  disgust: 'grounding',
  anger: 'release',
  anticipation: 'focused',
};

export default function EmotionSessionNewPage() {
  usePageSEO({
    title: 'Nouvelle session émotionnelle',
    description: 'Exprimez votre émotion, recevez une analyse IA et un plan personnalisé.',
  });

  const { toast } = useToast();
  const [analysis, setAnalysis] = useState<EmotionAnalysisResult | null>(null);
  const [plan, setPlan] = useState<EmotionPlanResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [correctedEmotion, setCorrectedEmotion] = useState<string | null>(null);

  const form = useForm<EmotionSessionInput>({
    resolver: zodResolver(emotionInputSchema),
    defaultValues: {
      inputType: 'text',
      text: '',
      selectedEmotion: undefined,
      intensity: 5,
      contextTags: [],
    },
  });

  const intensityValue = form.watch('intensity');
  const inputType = form.watch('inputType');

  const headerBadge = useMemo(() => {
    const label = inputType === 'choice' ? 'Choix guidé' : 'Texte libre';
    return `${label} · ${intensityValue}/10`;
  }, [inputType, intensityValue]);

  const handleSuggestionClick = (suggestion: string) => {
    const current = form.getValues('text') ?? '';
    const next = current ? `${current}\n${suggestion}` : suggestion;
    form.setValue('text', next, { shouldValidate: true });
  };

  const handleContextToggle = (tag: typeof emotionContextTags[number]) => {
    const current = form.getValues('contextTags') ?? [];
    const exists = current.includes(tag);
    const next = exists ? current.filter(item => item !== tag) : [...current, tag];
    form.setValue('contextTags', next, { shouldValidate: true });
  };

  const handleAnalyze = async (values: EmotionSessionInput) => {
    setErrorMessage(null);
    setIsAnalyzing(true);
    setAnalysis(null);
    setPlan(null);

    try {
      const analysisResult = await analyzeEmotionSession(values);
      setAnalysis(analysisResult);
      setCorrectedEmotion(analysisResult.primaryEmotion);
      toast({
        title: 'Analyse terminée',
        description: 'Votre analyse émotionnelle est prête.',
        variant: 'success',
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Une erreur est survenue lors de l\'analyse.';
      setErrorMessage(message);
      toast({
        title: 'Analyse impossible',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirmAnalysis = async () => {
    if (!analysis || !correctedEmotion) return;

    try {
      if (correctedEmotion !== analysis.primaryEmotion) {
        await updatePrimaryEmotion(analysis.sessionId, correctedEmotion);
        setAnalysis({ ...analysis, primaryEmotion: correctedEmotion });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors de la correction.';
      setErrorMessage(message);
    }
  };

  const handleGeneratePlan = async () => {
    if (!analysis) return;

    setIsGeneratingPlan(true);
    setErrorMessage(null);

    try {
      const planResult = await generateEmotionPlan(analysis.sessionId, analysis);
      setPlan(planResult);
      toast({
        title: 'Plan généré',
        description: 'Votre plan personnalisé est disponible.',
        variant: 'success',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors de la génération du plan.';
      setErrorMessage(message);
      toast({
        title: 'Plan indisponible',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleMusicLaunch = async () => {
    if (!analysis) return;
    const emotionKey = analysis.primaryEmotion;
    try {
      await requestMusicGeneration({
        emotion: emotionKey,
        target_energy: ENERGY_MAP[emotionKey] ?? 'calming',
        duration_seconds: 60,
        session_id: analysis.sessionId,
      });
      toast({
        title: 'Musique lancée',
        description: 'La génération musicale a été ajoutée à la file d\'attente.',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors de la musique.';
      toast({
        title: 'Musique indisponible',
        description: message,
        variant: 'destructive',
      });
    }
  };

  const textLength = (form.watch('text') ?? '').length;

  return (
    <PageRoot>
      <section className="container mx-auto px-4 py-10 space-y-8" aria-labelledby="emotion-session-heading">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Brain className="h-7 w-7 text-primary" aria-hidden="true" />
            <div>
              <h1 id="emotion-session-heading" className="text-3xl font-semibold">
                Nouvelle session émotionnelle
              </h1>
              <p className="text-sm text-muted-foreground">
                Exprimez votre émotion, obtenez une analyse IA et un plan immédiat.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="px-3 py-1">
              {headerBadge}
            </Badge>
            <Button variant="outline" asChild>
              <Link to={routes.b2c.emotionSessions()}>
                Voir l\'historique
              </Link>
            </Button>
          </div>
        </header>

        {errorMessage && (
          <Alert variant="destructive" role="alert">
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
              Saisir votre émotion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAnalyze)} className="space-y-6" noValidate>
                <FormField
                  control={form.control}
                  name="inputType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mode de saisie</FormLabel>
                      <Tabs
                        value={field.value}
                        onValueChange={value => field.onChange(value as 'text' | 'choice')}
                      >
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="text">Écrire</TabsTrigger>
                          <TabsTrigger value="choice">Choisir</TabsTrigger>
                        </TabsList>
                        <TabsContent value="text" className="mt-4 space-y-4">
                          <FormField
                            control={form.control}
                            name="text"
                            render={({ field: textField }) => (
                              <FormItem>
                                <FormLabel>Votre description</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Comment vous sentez-vous ?"
                                    rows={4}
                                    maxLength={500}
                                    {...textField}
                                  />
                                </FormControl>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span>{textLength}/500</span>
                                  <span>Suggestions rapides</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {TEXT_SUGGESTIONS.map(suggestion => (
                                    <Button
                                      key={suggestion}
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                      {suggestion}
                                    </Button>
                                  ))}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TabsContent>
                        <TabsContent value="choice" className="mt-4 space-y-4">
                          <FormField
                            control={form.control}
                            name="selectedEmotion"
                            render={({ field: emotionField }) => (
                              <FormItem>
                                <FormLabel>Roue des émotions (Plutchik)</FormLabel>
                                <FormControl>
                                  <EmotionWheel
                                    value={emotionField.value as any}
                                    onChange={emotionField.onChange}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TabsContent>
                      </Tabs>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="intensity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Intensité ressentie</FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          <Slider
                            min={1}
                            max={10}
                            step={1}
                            value={[field.value]}
                            onValueChange={value => field.onChange(value[0])}
                            aria-label="Intensité émotionnelle"
                          />
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Légère</span>
                            <span className="text-primary font-semibold">{field.value}/10</span>
                            <span>Intense</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel>Contexte (optionnel)</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {emotionContextTags.map(tag => (
                      <Button
                        key={tag}
                        type="button"
                        variant={form.getValues('contextTags')?.includes(tag) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleContextToggle(tag)}
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button type="submit" disabled={isAnalyzing} className="w-full sm:w-auto">
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    'Analyser mon émotion'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analyse IA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!analysis ? (
              <div className="rounded-lg border border-dashed border-muted-foreground/40 p-6 text-sm text-muted-foreground">
                Lancez une analyse pour afficher les émotions détectées.
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Résumé</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {analysis.summary}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Émotions détectées</h3>
                  <div className="space-y-3">
                    {analysis.detectedEmotions.map(emotion => (
                      <div key={emotion.label} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium capitalize">{emotion.label}</span>
                          <span className="text-muted-foreground">
                            {(emotion.intensity * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${emotion.intensity * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <FormLabel>Corriger l\'émotion principale</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {emotionWheelOptions.map(option => (
                      <Button
                        key={option.value}
                        type="button"
                        variant={correctedEmotion === option.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCorrectedEmotion(option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={handleConfirmAnalysis}>
                    Confirmer la correction
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plan personnalisé</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              type="button"
              onClick={handleGeneratePlan}
              disabled={!analysis || isGeneratingPlan}
            >
              {isGeneratingPlan ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération du plan...
                </>
              ) : (
                'Générer mon plan'
              )}
            </Button>

            {!plan ? (
              <div className="rounded-lg border border-dashed border-muted-foreground/40 p-6 text-sm text-muted-foreground">
                Générez un plan pour accéder aux recommandations personnalisées.
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Durée estimée: {plan.estimatedDurationMin} min
                </p>
                <div className="space-y-3">
                  {plan.recommendations.map((rec, index) => (
                    <div key={`${rec.type}-${index}`} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{rec.title}</h4>
                        <Badge variant="secondary">Priorité {rec.priority}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{rec.description}</p>
                      {rec.durationMin && (
                        <p className="text-xs text-muted-foreground mt-2">Durée: {rec.durationMin} min</p>
                      )}
                      {rec.type === 'music' && (
                        <Button type="button" size="sm" className="mt-3" onClick={handleMusicLaunch}>
                          Lancer la musique IA
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </PageRoot>
  );
}
