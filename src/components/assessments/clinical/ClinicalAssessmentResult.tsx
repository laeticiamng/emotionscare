/**
 * ClinicalAssessmentResult - Display results with recommendations
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, AlertTriangle, XCircle, 
  RotateCcw, History, ArrowRight, Heart
} from 'lucide-react';
import { ClinicalQuestionnaire, getCategory } from './ClinicalQuestionnaireData';
import { MedicalDisclaimer } from './MedicalDisclaimer';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ClinicalAssessmentResultProps {
  questionnaire: ClinicalQuestionnaire;
  rawScore: number;
  onRetake: () => void;
  onViewHistory: () => void;
}

export const ClinicalAssessmentResult: React.FC<ClinicalAssessmentResultProps> = ({
  questionnaire,
  rawScore,
  onRetake,
  onViewHistory,
}) => {
  const { multiplier, maxScore } = questionnaire.scoring;
  const finalScore = multiplier ? rawScore * multiplier : rawScore;
  const displayMaxScore = multiplier ? maxScore * multiplier : maxScore;
  const percentage = (finalScore / displayMaxScore) * 100;
  
  const category = getCategory(questionnaire, rawScore);
  const isWHO5 = questionnaire.id === 'WHO5';

  // For WHO-5, higher is better; for PHQ-9, lower is better
  const getStatusInfo = () => {
    if (isWHO5) {
      if (finalScore >= 70) return { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' };
      if (finalScore >= 50) return { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100' };
      return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' };
    } else {
      // PHQ-9: lower is better
      if (rawScore <= 4) return { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' };
      if (rawScore <= 9) return { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100' };
      return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' };
    }
  };

  const status = getStatusInfo();
  const StatusIcon = status.icon;

  const getRecommendations = (): string[] => {
    if (isWHO5) {
      if (finalScore < 50) {
        return [
          'Votre score indique un niveau de bien-être qui nécessite une attention particulière.',
          'Nous vous recommandons vivement de consulter un professionnel de santé.',
          'En attendant, essayez nos exercices de respiration pour vous apaiser.',
        ];
      }
      if (finalScore < 70) {
        return [
          'Votre bien-être pourrait être amélioré avec quelques ajustements.',
          'Continuez à utiliser le journal émotionnel pour suivre votre évolution.',
          'Les exercices de relaxation peuvent vous aider.',
        ];
      }
      return [
        'Votre niveau de bien-être est bon ! Continuez ainsi.',
        'Maintenez vos bonnes habitudes et votre équilibre.',
      ];
    } else {
      // PHQ-9
      if (rawScore >= 15) {
        return [
          'Votre score suggère des symptômes dépressifs significatifs.',
          'Il est fortement recommandé de consulter un professionnel de santé mentale.',
          'Appelez le 3114 si vous avez besoin de parler à quelqu\'un maintenant.',
        ];
      }
      if (rawScore >= 10) {
        return [
          'Votre score indique des symptômes modérés qui méritent attention.',
          'Consultez votre médecin pour discuter de ces résultats.',
          'Nos exercices de bien-être peuvent vous aider au quotidien.',
        ];
      }
      if (rawScore >= 5) {
        return [
          'Vous présentez quelques symptômes légers.',
          'Surveillez votre état et refaites le test dans 2 semaines.',
          'Prenez soin de vous avec nos outils de bien-être.',
        ];
      }
      return [
        'Votre score est dans la normale. Continuez à prendre soin de vous.',
        'Refaites le test régulièrement pour suivre votre évolution.',
      ];
    }
  };

  const recommendations = getRecommendations();
  const showAlert = (isWHO5 && finalScore < 50) || (!isWHO5 && rawScore >= 10);

  return (
    <div className="space-y-4">
      {/* Result card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">{questionnaire.name}</CardTitle>
            <p className="text-sm text-muted-foreground">Résultats de votre évaluation</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Score display */}
            <div className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className={cn(
                  'inline-flex items-center justify-center w-24 h-24 rounded-full',
                  status.bg
                )}
              >
                <span className={cn('text-3xl font-bold', status.color)}>
                  {finalScore}
                </span>
              </motion.div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Score: {finalScore} / {displayMaxScore}
                </p>
                <Progress 
                  value={isWHO5 ? percentage : 100 - percentage} 
                  className="h-3 max-w-xs mx-auto" 
                />
              </div>

              <Badge
                variant="outline"
                className={cn(
                  'text-sm px-4 py-1',
                  category.severity === 'minimal' && 'border-green-500 text-green-700',
                  category.severity === 'mild' && 'border-amber-500 text-amber-700',
                  category.severity === 'moderate' && 'border-orange-500 text-orange-700',
                  category.severity === 'moderately_severe' && 'border-red-400 text-red-600',
                  category.severity === 'severe' && 'border-red-600 text-red-700'
                )}
              >
                <StatusIcon className="h-4 w-4 mr-1" />
                {category.label}
              </Badge>
            </div>

            {/* Recommendations */}
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                Nos recommandations
              </h4>
              <ul className="space-y-2">
                {recommendations.map((rec, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick links */}
            <div className="grid grid-cols-2 gap-3">
              <Link to="/dashboard/breathing">
                <Button variant="outline" className="w-full">
                  🌬️ Exercice de respiration
                </Button>
              </Link>
              <Link to="/dashboard/journal">
                <Button variant="outline" className="w-full">
                  📝 Journal émotionnel
                </Button>
              </Link>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={onViewHistory} className="flex-1">
                <History className="h-4 w-4 mr-2" />
                Historique
              </Button>
              <Button onClick={onRetake} className="flex-1">
                <RotateCcw className="h-4 w-4 mr-2" />
                Refaire le test
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Medical disclaimer - more prominent if score is concerning */}
      <MedicalDisclaimer 
        variant={showAlert ? 'card' : 'compact'} 
        showEmergency={showAlert} 
      />
    </div>
  );
};

export default ClinicalAssessmentResult;
