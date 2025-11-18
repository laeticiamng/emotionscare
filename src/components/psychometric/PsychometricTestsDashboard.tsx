import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { ClipboardList, CheckCircle, TrendingUp, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { logger } from '@/lib/logger';

interface Instrument {
  id: string;
  name: string;
  fullName: string;
  description: string;
  questionCount: number;
}

interface InstrumentDetails {
  name: string;
  fullName: string;
  description: string;
  questions: string[];
  options: { label: string; value: number }[];
}

export const PsychometricTestsDashboard: React.FC = () => {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [selectedInstrument, setSelectedInstrument] = useState<string | null>(null);
  const [instrumentDetails, setInstrumentDetails] = useState<InstrumentDetails | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [trends, setTrends] = useState<any>({});
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    loadInstruments();
    loadHistory();
    loadTrends();
  }, []);

  const loadInstruments = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('psychometric-tests', {
        body: { action: 'get-instruments' }
      });

      if (error) throw error;
      setInstruments(data.instruments || []);
    } catch (error) {
      toast.error('Erreur lors du chargement des tests');
      logger.error('Error loading instruments', error as Error, 'UI');
    }
  };

  const loadHistory = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('psychometric-tests', {
        body: { action: 'get-history' }
      });

      if (error) throw error;
      setHistory(data.history || []);
    } catch (error) {
      logger.error('Error loading history', error as Error, 'UI');
    }
  };

  const loadTrends = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('psychometric-tests', {
        body: { action: 'get-trends' }
      });

      if (error) throw error;
      setTrends(data.trends || {});
    } catch (error) {
      logger.error('Error loading trends', error as Error, 'UI');
    }
  };

  const selectInstrument = async (instrumentId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('psychometric-tests', {
        body: { action: 'get-instrument-details', instrument: instrumentId }
      });

      if (error) throw error;
      
      setSelectedInstrument(instrumentId);
      setInstrumentDetails(data.instrument);
      setAnswers(new Array(data.instrument.questions.length).fill(-1));
      setShowResults(false);
      setTestResult(null);
    } catch (error) {
      toast.error('Erreur lors du chargement du test');
      logger.error('Error loading instrument details', error as Error, 'UI');
    }
  };

  const handleAnswerChange = (questionIndex: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = value;
    setAnswers(newAnswers);
  };

  const submitTest = async () => {
    if (answers.some(a => a === -1)) {
      toast.error('Veuillez répondre à toutes les questions');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('psychometric-tests', {
        body: {
          action: 'submit-test',
          instrument: selectedInstrument,
          answers
        }
      });

      if (error) throw error;

      setTestResult(data);
      setShowResults(true);
      toast.success('Test complété avec succès');
      
      // Reload history and trends
      loadHistory();
      loadTrends();
    } catch (error) {
      toast.error('Erreur lors de la soumission du test');
      logger.error('Error submitting test', error as Error, 'UI');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInterpretationText = (instrument: string, interpretation: string) => {
    const texts: Record<string, Record<string, string>> = {
      'PHQ-9': {
        minimal: 'Symptômes dépressifs minimaux',
        mild: 'Dépression légère',
        moderate: 'Dépression modérée',
        moderatelySevere: 'Dépression modérément sévère',
        severe: 'Dépression sévère'
      },
      'GAD-7': {
        minimal: 'Anxiété minimale',
        mild: 'Anxiété légère',
        moderate: 'Anxiété modérée',
        severe: 'Anxiété sévère'
      },
      'PSS-10': {
        low: 'Stress faible',
        moderate: 'Stress modéré',
        high: 'Stress élevé'
      },
      'WHO-5': {
        poor: 'Bien-être faible',
        moderate: 'Bien-être modéré',
        good: 'Bien-être bon'
      }
    };

    return texts[instrument]?.[interpretation] || interpretation;
  };

  const backToList = () => {
    setSelectedInstrument(null);
    setInstrumentDetails(null);
    setAnswers([]);
    setShowResults(false);
    setTestResult(null);
  };

  if (showResults && testResult) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Button onClick={backToList} variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Retour aux tests
        </Button>

        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <CardTitle>Test complété</CardTitle>
                <CardDescription>{instrumentDetails?.fullName}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary">
                <div className="text-sm text-muted-foreground mb-1">Score obtenu</div>
                <div className="text-3xl font-bold">{testResult.score}</div>
              </div>
              <div className="p-4 rounded-lg bg-primary/5 border border-primary">
                <div className="text-sm text-muted-foreground mb-1">Interprétation</div>
                <div className="text-lg font-semibold">
                  {getInterpretationText(selectedInstrument!, testResult.interpretation)}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">
                Ces résultats sont indicatifs et ne remplacent pas un diagnostic médical professionnel. 
                Si vous avez des préoccupations concernant votre santé mentale, consultez un professionnel de santé.
              </p>
            </div>
          </CardContent>
        </Card>

        {trends[selectedInstrument!] && trends[selectedInstrument!].length > 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Évolution dans le temps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trends[selectedInstrument!]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString('fr-FR')}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(date) => new Date(date).toLocaleDateString('fr-FR', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" name="Score" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  if (selectedInstrument && instrumentDetails) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Button onClick={backToList} variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Retour aux tests
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{instrumentDetails.fullName}</CardTitle>
            <CardDescription>{instrumentDetails.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm">
                Au cours des <strong>2 dernières semaines</strong>, à quelle fréquence avez-vous été gêné(e) par les problèmes suivants ?
              </p>
            </div>

            {instrumentDetails.questions.map((question, index) => (
              <div key={index} className="space-y-3 p-4 rounded-lg border">
                <div className="font-medium">
                  {index + 1}. {question}
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {instrumentDetails.options.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        answers[index] === option.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option.value}
                        checked={answers[index] === option.value}
                        onChange={() => handleAnswerChange(index, option.value)}
                        className="mr-3"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <Button
              onClick={submitTest}
              disabled={isSubmitting || answers.some(a => a === -1)}
              size="lg"
              className="w-full"
            >
              {isSubmitting ? 'Envoi en cours...' : 'Soumettre le test'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <ClipboardList className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Tests psychométriques validés</h1>
          <p className="text-muted-foreground">Évaluez votre bien-être mental avec des outils cliniques standardisés</p>
        </div>
      </div>

      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historique récent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {history.slice(0, 5).map((session) => (
                <div key={session.id} className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                  <div>
                    <div className="font-medium">{session.instrument}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(session.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{session.context?.score}</div>
                    <div className="text-sm text-muted-foreground">
                      {getInterpretationText(session.instrument, session.context?.interpretation)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {instruments.map((instrument) => (
          <button
            key={instrument.id}
            onClick={() => selectInstrument(instrument.id)}
            className="text-left w-full"
            aria-label={`Commencer le test ${instrument.name} - ${instrument.fullName}`}
          >
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle>{instrument.name}</CardTitle>
                <CardDescription>{instrument.fullName}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{instrument.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {instrument.questionCount} questions
                  </span>
                  <Button>Commencer</Button>
                </div>
              </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PsychometricTestsDashboard;
