// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { ClipboardList, TrendingUp, AlertCircle, CheckCircle, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Test {
  id: string;
  name: string;
  description: string;
  question_count: number;
}

interface TestQuestion {
  id: string;
  text: string;
  value: number;
  subscale?: string;
}

interface TestScale {
  value: number;
  label: string;
}

interface TestData {
  id: string;
  name: string;
  description: string;
  questions: TestQuestion[];
  scale: TestScale[];
}

interface TestResult {
  id: string;
  test_type: string;
  score: number;
  severity_level: string;
  interpretation: string;
  recommendations: string[];
  created_at: string;
}

const PsychometricTestDashboard: React.FC = () => {
  const [availableTests, setAvailableTests] = useState<Test[]>([]);
  const [selectedTest, setSelectedTest] = useState<TestData | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [history, setHistory] = useState<TestResult[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadAvailableTests();
    loadHistory();
  }, []);

  const loadAvailableTests = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('psychometric-tests/available');
      
      if (error) throw error;
      
      setAvailableTests(data || []);
    } catch (error) {
      logger.error('Error loading tests', error as Error, 'UI');
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les tests disponibles',
        variant: 'destructive'
      });
    }
  };

  const loadHistory = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('psychometric-tests/history');
      
      if (error) throw error;
      
      setHistory(data || []);
    } catch (error) {
      logger.error('Error loading history', error as Error, 'UI');
    }
  };

  const startTest = async (testId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke(`psychometric-tests/test/${testId}`);
      
      if (error) throw error;
      
      setSelectedTest(data);
      setAnswers({});
      setCurrentQuestion(0);
      setResult(null);
    } catch (error) {
      logger.error('Error loading test', error as Error, 'UI');
      toast({
        title: 'Erreur',
        description: 'Impossible de charger le test',
        variant: 'destructive'
      });
    }
  };

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const goToNextQuestion = () => {
    if (selectedTest && currentQuestion < selectedTest.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const submitTest = async () => {
    if (!selectedTest) return;

    setIsSubmitting(true);
    try {
      const formattedAnswers = Object.entries(answers).map(([question_id, value]) => ({
        question_id,
        value
      }));

      const { data, error } = await supabase.functions.invoke('psychometric-tests/submit', {
        body: {
          test_type: selectedTest.id,
          answers: formattedAnswers
        }
      });

      if (error) throw error;

      setResult(data);
      setSelectedTest(null);
      loadHistory();
      
      toast({
        title: 'Test terminé',
        description: 'Vos résultats ont été enregistrés',
      });
    } catch (error) {
      logger.error('Error submitting test', error as Error, 'UI');
      toast({
        title: 'Erreur',
        description: 'Impossible de soumettre le test',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSeverityColor = (level: string) => {
    if (level.includes('severe') || level.includes('extremely')) return 'text-red-600';
    if (level.includes('moderate')) return 'text-orange-600';
    if (level.includes('mild')) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getSeverityIcon = (level: string) => {
    if (level.includes('severe') || level.includes('extremely')) return <AlertCircle className="h-5 w-5" />;
    return <CheckCircle className="h-5 w-5" />;
  };

  const progress = selectedTest ? ((currentQuestion + 1) / selectedTest.questions.length) * 100 : 0;
  const isQuestionAnswered = selectedTest ? answers[selectedTest.questions[currentQuestion]?.id] !== undefined : false;
  const allQuestionsAnswered = selectedTest ? selectedTest.questions.every(q => answers[q.id] !== undefined) : false;

  // Préparer les données pour le graphique d'historique
  const chartData = history.slice(0, 10).reverse().map(result => ({
    date: new Date(result.created_at).toLocaleDateString('fr-FR'),
    score: result.score,
    test: result.test_type.toUpperCase()
  }));

  if (showHistory) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Historique de vos tests</h1>
          <Button onClick={() => setShowHistory(false)}>Retour aux tests</Button>
        </div>

        {history.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Évolution des scores</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="score" stroke="#8884d8" name="Score" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {history.map((result) => (
            <Card key={result.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{result.test_type.toUpperCase()}</CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {new Date(result.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <CardDescription>{result.interpretation}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-2 font-semibold ${getSeverityColor(result.severity_level)}`}>
                    {getSeverityIcon(result.severity_level)}
                    Score: {result.score}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Recommandations:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {result.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm">{rec}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="container mx-auto p-6 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Résultats de votre test</CardTitle>
            <CardDescription>{result.test_type.toUpperCase()}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center py-6">
              <div className={`flex items-center justify-center gap-2 mb-2 ${getSeverityColor(result.severity_level)}`}>
                {getSeverityIcon(result.severity_level)}
                <span className="text-4xl font-bold">{result.score}</span>
              </div>
              <p className="text-xl font-semibold">{result.interpretation}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Recommandations personnalisées:</h3>
              <ul className="space-y-2">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-4">
              <Button onClick={() => setResult(null)} className="flex-1">
                Passer un autre test
              </Button>
              <Button onClick={() => setShowHistory(true)} variant="outline" className="flex-1">
                <BarChart3 className="h-4 w-4 mr-2" />
                Voir l'historique
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (selectedTest) {
    const question = selectedTest.questions[currentQuestion];

    return (
      <div className="container mx-auto p-6 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>{selectedTest.name}</CardTitle>
            <CardDescription>
              Question {currentQuestion + 1} sur {selectedTest.questions.length}
            </CardDescription>
            <Progress value={progress} className="mt-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="py-4">
              <h3 className="text-lg font-medium mb-6">{question.text}</h3>
              
              <RadioGroup
                value={answers[question.id]?.toString()}
                onValueChange={(value) => handleAnswer(question.id, parseInt(value))}
              >
                {selectedTest.scale.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50">
                    <RadioGroupItem value={option.value.toString()} id={`${question.id}-${option.value}`} />
                    <Label htmlFor={`${question.id}-${option.value}`} className="flex-1 cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex justify-between gap-4">
              <Button
                onClick={goToPreviousQuestion}
                disabled={currentQuestion === 0}
                variant="outline"
              >
                Précédent
              </Button>
              
              {currentQuestion < selectedTest.questions.length - 1 ? (
                <Button
                  onClick={goToNextQuestion}
                  disabled={!isQuestionAnswered}
                >
                  Suivant
                </Button>
              ) : (
                <Button
                  onClick={submitTest}
                  disabled={!allQuestionsAnswered || isSubmitting}
                >
                  {isSubmitting ? 'Envoi...' : 'Terminer le test'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tests Psychométriques Validés</h1>
          <p className="text-muted-foreground">
            Évaluez votre bien-être mental avec des tests cliniquement validés
          </p>
        </div>
        {history.length > 0 && (
          <Button onClick={() => setShowHistory(true)} variant="outline">
            <TrendingUp className="h-4 w-4 mr-2" />
            Historique ({history.length})
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {availableTests.map((test) => (
          <Card key={test.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <ClipboardList className="h-8 w-8 text-primary" />
                <span className="text-sm text-muted-foreground">
                  {test.question_count} questions
                </span>
              </div>
              <CardTitle className="mt-4">{test.name}</CardTitle>
              <CardDescription>{test.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => startTest(test.id)} className="w-full">
                Commencer le test
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PsychometricTestDashboard;
