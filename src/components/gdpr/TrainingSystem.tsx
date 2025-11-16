import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, PlayCircle, CheckCircle, Award, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { logger } from '@/lib/logger';

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  content: string;
  video_url: string | null;
  duration_minutes: number;
  order_number: number;
}

interface Quiz {
  id: string;
  module_id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

interface UserCertification {
  id: string;
  user_id: string;
  module_id: string;
  completed_at: string;
  score: number;
  certificate_url: string | null;
}

export const TrainingSystem = () => {
  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [certifications, setCertifications] = useState<UserCertification[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadModules();
    loadCertifications();
  }, []);

  const loadModules = async () => {
    const { data, error } = await supabase
      .from('training_modules')
      .select('*')
      .order('order_number', { ascending: true });

    if (error) {
      logger.error('Error loading modules:', error, 'COMPONENT');
      return;
    }

    setModules(data || []);
  };

  const loadCertifications = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('user_certifications')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      logger.error('Error loading certifications:', error, 'COMPONENT');
      return;
    }

    setCertifications(data || []);
  };

  const startModule = async (module: TrainingModule) => {
    setSelectedModule(module);
    setShowResults(false);
    setAnswers({});
    setCurrentQuizIndex(0);

    const { data, error } = await supabase
      .from('training_quizzes')
      .select('*')
      .eq('module_id', module.id)
      .order('created_at', { ascending: true });

    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      return;
    }

    setQuizzes(data || []);
  };

  const submitQuiz = async () => {
    if (!selectedModule) return;

    const score = quizzes.reduce((acc, quiz, idx) => {
      return acc + (answers[quiz.id] === quiz.correct_answer ? 1 : 0);
    }, 0);

    const percentage = (score / quizzes.length) * 100;
    const passed = percentage >= 80;

    if (passed) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_certifications')
        .insert({
          user_id: user.id,
          module_id: selectedModule.id,
          score: percentage,
        });

      if (error) {
        toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
        return;
      }

      toast({
        title: 'Félicitations!',
        description: `Vous avez obtenu ${percentage.toFixed(0)}% et validé le module.`,
      });

      loadCertifications();
    } else {
      toast({
        title: 'Score insuffisant',
        description: `Vous avez obtenu ${percentage.toFixed(0)}%. Minimum requis: 80%`,
        variant: 'destructive',
      });
    }

    setShowResults(true);
  };

  const isModuleCertified = (moduleId: string) => {
    return certifications.some(cert => cert.module_id === moduleId);
  };

  const getModuleProgress = () => {
    const completed = certifications.length;
    const total = modules.length;
    return total > 0 ? (completed / total) * 100 : 0;
  };

  if (selectedModule && quizzes.length > 0) {
    const currentQuiz = quizzes[currentQuizIndex];

    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => setSelectedModule(null)}>
          ← Retour aux modules
        </Button>

        <Card className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">{selectedModule.title}</h2>
          
          {!showResults ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Question {currentQuizIndex + 1} sur {quizzes.length}
                </span>
                <Progress value={((currentQuizIndex + 1) / quizzes.length) * 100} className="w-48" />
              </div>

              <div className="p-4 bg-accent/5 rounded-lg">
                <h3 className="text-lg font-semibold text-foreground mb-4">{currentQuiz.question}</h3>
                
                <RadioGroup
                  value={answers[currentQuiz.id]?.toString()}
                  onValueChange={(value) => setAnswers({ ...answers, [currentQuiz.id]: parseInt(value) })}
                >
                  {currentQuiz.options.map((option, idx) => (
                    <div key={idx} className="flex items-center space-x-2 p-3 hover:bg-accent/10 rounded">
                      <RadioGroupItem value={idx.toString()} id={`option-${idx}`} />
                      <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuizIndex(Math.max(0, currentQuizIndex - 1))}
                  disabled={currentQuizIndex === 0}
                >
                  Précédent
                </Button>

                {currentQuizIndex === quizzes.length - 1 ? (
                  <Button onClick={submitQuiz}>Soumettre le quiz</Button>
                ) : (
                  <Button onClick={() => setCurrentQuizIndex(currentQuizIndex + 1)}>
                    Suivant
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Résultats</h3>
              {quizzes.map((quiz, idx) => {
                const isCorrect = answers[quiz.id] === quiz.correct_answer;
                return (
                  <Card key={quiz.id} className="p-4">
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-xs text-destructive">✕</span>
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-foreground mb-2">{quiz.question}</p>
                        <p className="text-sm text-muted-foreground">{quiz.explanation}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GraduationCap className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Formation RGPD</h2>
        </div>
        <div className="text-sm text-muted-foreground">
          Progression: {certifications.length}/{modules.length} modules
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progression globale</span>
            <span className="font-semibold text-foreground">{getModuleProgress().toFixed(0)}%</span>
          </div>
          <Progress value={getModuleProgress()} className="h-3" />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((module) => {
          const isCertified = isModuleCertified(module.id);
          
          return (
            <Card key={module.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      {isCertified ? (
                        <Award className="w-6 h-6 text-primary" />
                      ) : (
                        <FileText className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{module.title}</h3>
                      <p className="text-sm text-muted-foreground">{module.duration_minutes} min</p>
                    </div>
                  </div>
                  {isCertified && (
                    <Badge className="bg-primary/10 text-primary">Certifié</Badge>
                  )}
                </div>

                <p className="text-sm text-muted-foreground">{module.description}</p>

                {module.video_url && (
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <PlayCircle className="w-4 h-4" />
                    <span>Vidéo disponible</span>
                  </div>
                )}

                <Button 
                  onClick={() => startModule(module)} 
                  className="w-full"
                  variant={isCertified ? "outline" : "default"}
                >
                  {isCertified ? 'Refaire le quiz' : 'Commencer le module'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {modules.length === 0 && (
        <Card className="p-8 text-center">
          <GraduationCap className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">Aucun module de formation disponible</p>
        </Card>
      )}
    </div>
  );
};
