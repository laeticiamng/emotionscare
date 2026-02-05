/**
 * ClinicalAssessmentsPage - Main page for WHO-5 and PHQ-9 assessments
 * /dashboard/assessments
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, ClipboardList, Brain, Heart, History, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  WHO5_QUESTIONNAIRE, 
  PHQ9_QUESTIONNAIRE,
  ClinicalQuestionnaire,
  getCategory 
} from '@/components/assessments/clinical/ClinicalQuestionnaireData';
import { ClinicalQuestionnaireForm } from '@/components/assessments/clinical/ClinicalQuestionnaireForm';
import { ClinicalAssessmentResult } from '@/components/assessments/clinical/ClinicalAssessmentResult';
import { ClinicalAssessmentHistory } from '@/components/assessments/clinical/ClinicalAssessmentHistory';
import { MedicalDisclaimer } from '@/components/assessments/clinical/MedicalDisclaimer';
import { useClinicalAssessments } from '@/hooks/useClinicalAssessments';
import { usePageSEO } from '@/hooks/usePageSEO';

type ViewState = 'select' | 'questionnaire' | 'result' | 'history';

const ClinicalAssessmentsPage: React.FC = () => {
  usePageSEO({
    title: 'Évaluations Cliniques - EmotionsCare',
    description: 'Questionnaires cliniques validés WHO-5 et PHQ-9 pour évaluer votre bien-être.',
    keywords: 'WHO-5, PHQ-9, évaluation bien-être, dépistage dépression',
  });

  const [view, setView] = useState<ViewState>('select');
  const [activeQuestionnaire, setActiveQuestionnaire] = useState<ClinicalQuestionnaire | null>(null);
  const [lastResult, setLastResult] = useState<{ questionnaire: ClinicalQuestionnaire; score: number } | null>(null);

  const {
    assessments,
    isLoading,
    createAssessment,
    isCreating,
    stats,
  } = useClinicalAssessments();

  const handleStartQuestionnaire = (type: 'WHO5' | 'PHQ9') => {
    const questionnaire = type === 'WHO5' ? WHO5_QUESTIONNAIRE : PHQ9_QUESTIONNAIRE;
    setActiveQuestionnaire(questionnaire);
    setView('questionnaire');
  };

  const handleSubmitAnswers = async (answers: Record<string, number>) => {
    if (!activeQuestionnaire) return;

    const rawScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
    const category = getCategory(activeQuestionnaire, rawScore);

    await createAssessment({
      type: activeQuestionnaire.id,
      answers,
      score: rawScore,
      maxScore: activeQuestionnaire.scoring.maxScore,
      category: category.label,
    });

    setLastResult({ questionnaire: activeQuestionnaire, score: rawScore });
    setView('result');
  };

  const handleRetake = () => {
    setView('questionnaire');
  };

  const handleViewHistory = () => {
    setView('history');
  };

  const handleBackToSelect = () => {
    setActiveQuestionnaire(null);
    setLastResult(null);
    setView('select');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <header className="mb-6">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au tableau de bord
            </Button>
          </Link>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <ClipboardList className="h-6 w-6 text-primary" />
                Évaluations Cliniques
              </h1>
              <p className="text-muted-foreground mt-1">
                Questionnaires validés scientifiquement
              </p>
            </div>

            {view !== 'select' && (
              <Button variant="outline" size="sm" onClick={handleBackToSelect}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Retour aux tests
              </Button>
            )}
          </div>
        </header>

        {/* Content */}
        <AnimatePresence mode="wait">
          {view === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Medical disclaimer first */}
              <MedicalDisclaimer variant="card" showEmergency={true} />

              {/* Questionnaire selection */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* WHO-5 Card */}
                <Card className="hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <Heart className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">WHO-5</CardTitle>
                        <CardDescription>Indice de Bien-Être OMS</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• 5 questions simples</li>
                      <li>• Score de bien-être sur 100</li>
                      <li>• Durée : ~2 minutes</li>
                    </ul>
                    {stats.lastWHO5 && (
                      <p className="text-xs text-muted-foreground">
                        Dernier score : <strong>{stats.lastWHO5.score * 4}/100</strong>
                      </p>
                    )}
                    <Button 
                      className="w-full" 
                      onClick={() => handleStartQuestionnaire('WHO5')}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Commencer le WHO-5
                    </Button>
                  </CardContent>
                </Card>

                {/* PHQ-9 Card */}
                <Card className="hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Brain className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">PHQ-9</CardTitle>
                        <CardDescription>Questionnaire Santé du Patient</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• 9 questions sur les symptômes dépressifs</li>
                      <li>• Score de 0 à 27</li>
                      <li>• Durée : ~3 minutes</li>
                    </ul>
                    {stats.lastPHQ9 && (
                      <p className="text-xs text-muted-foreground">
                        Dernier score : <strong>{stats.lastPHQ9.score}/27</strong>
                      </p>
                    )}
                    <Button 
                      className="w-full" 
                      onClick={() => handleStartQuestionnaire('PHQ9')}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Commencer le PHQ-9
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* History button */}
              {assessments.length > 0 && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setView('history')}
                >
                  <History className="h-4 w-4 mr-2" />
                  Voir mon historique ({assessments.length} évaluation{assessments.length > 1 ? 's' : ''})
                </Button>
              )}
            </motion.div>
          )}

          {view === 'questionnaire' && activeQuestionnaire && (
            <motion.div
              key="questionnaire"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ClinicalQuestionnaireForm
                questionnaire={activeQuestionnaire}
                onSubmit={handleSubmitAnswers}
                onCancel={handleBackToSelect}
                isSubmitting={isCreating}
              />
            </motion.div>
          )}

          {view === 'result' && lastResult && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ClinicalAssessmentResult
                questionnaire={lastResult.questionnaire}
                rawScore={lastResult.score}
                onRetake={handleRetake}
                onViewHistory={handleViewHistory}
              />
            </motion.div>
          )}

          {view === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <ClinicalAssessmentHistory
                assessments={assessments}
                isLoading={isLoading}
              />
              
              <MedicalDisclaimer variant="compact" showEmergency={true} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ClinicalAssessmentsPage;
