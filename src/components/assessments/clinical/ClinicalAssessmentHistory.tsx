/**
 * ClinicalAssessmentHistory - History chart and list
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ClinicalAssessmentRecord } from '@/hooks/useClinicalAssessments';
import { CLINICAL_QUESTIONNAIRES, getCategory } from './ClinicalQuestionnaireData';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface ClinicalAssessmentHistoryProps {
  assessments: ClinicalAssessmentRecord[];
  isLoading?: boolean;
  activeType?: 'WHO5' | 'PHQ9' | 'all';
}

export const ClinicalAssessmentHistory: React.FC<ClinicalAssessmentHistoryProps> = ({
  assessments,
  isLoading = false,
  activeType = 'all',
}) => {
  const [selectedType, setSelectedType] = React.useState<'WHO5' | 'PHQ9' | 'all'>(activeType);

  const filteredAssessments = selectedType === 'all'
    ? assessments
    : assessments.filter(a => a.type === selectedType);

  const who5Data = assessments
    .filter(a => a.type === 'WHO5')
    .map(a => ({
      date: format(new Date(a.created_at), 'dd/MM', { locale: fr }),
      score: a.score * 4, // Convert to /100
      rawDate: a.created_at,
    }))
    .reverse();

  const phq9Data = assessments
    .filter(a => a.type === 'PHQ9')
    .map(a => ({
      date: format(new Date(a.created_at), 'dd/MM', { locale: fr }),
      score: a.score,
      rawDate: a.created_at,
    }))
    .reverse();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (assessments.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="text-4xl mb-3">📊</div>
          <h3 className="font-semibold text-lg mb-1">Aucune évaluation</h3>
          <p className="text-muted-foreground text-sm">
            Complétez un questionnaire pour voir votre historique
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Charts */}
      <Tabs defaultValue="WHO5" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="WHO5">WHO-5 (Bien-être)</TabsTrigger>
          <TabsTrigger value="PHQ9">PHQ-9 (Dépression)</TabsTrigger>
        </TabsList>

        <TabsContent value="WHO5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Évolution du bien-être (WHO-5)</CardTitle>
              <p className="text-xs text-muted-foreground">
                Score sur 100 - Plus haut = meilleur bien-être
              </p>
            </CardHeader>
            <CardContent>
              {who5Data.length > 0 ? (
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={who5Data}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" className="text-xs" />
                      <YAxis domain={[0, 100]} className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))'
                        }}
                      />
                      <ReferenceLine y={50} stroke="hsl(var(--destructive))" strokeDasharray="5 5" />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--primary))' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Pas encore de données WHO-5
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Ligne rouge = seuil d'alerte (50)
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="PHQ9">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Évolution des symptômes (PHQ-9)</CardTitle>
              <p className="text-xs text-muted-foreground">
                Score sur 27 - Plus bas = moins de symptômes
              </p>
            </CardHeader>
            <CardContent>
              {phq9Data.length > 0 ? (
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={phq9Data}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" className="text-xs" />
                      <YAxis domain={[0, 27]} className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))'
                        }}
                      />
                      <ReferenceLine y={10} stroke="hsl(var(--destructive))" strokeDasharray="5 5" />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="hsl(var(--chart-2))"
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--chart-2))' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Pas encore de données PHQ-9
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Ligne rouge = seuil modéré (10)
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent assessments list */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Historique récent</CardTitle>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as 'WHO5' | 'PHQ9' | 'all')}
              className="text-sm border rounded px-2 py-1 bg-background"
            >
              <option value="all">Tous</option>
              <option value="WHO5">WHO-5</option>
              <option value="PHQ9">PHQ-9</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {filteredAssessments.slice(0, 10).map((assessment, index) => {
            const questionnaire = CLINICAL_QUESTIONNAIRES[assessment.type];
            const category = questionnaire ? getCategory(questionnaire, assessment.score) : null;
            const displayScore = assessment.type === 'WHO5' 
              ? assessment.score * 4 
              : assessment.score;

            // Calculate trend if there's a previous assessment of same type
            const sameTypeAssessments = assessments.filter(a => a.type === assessment.type);
            const currentIndex = sameTypeAssessments.findIndex(a => a.id === assessment.id);
            const previousAssessment = sameTypeAssessments[currentIndex + 1];
            let trend = null;
            if (previousAssessment) {
              const prevScore = assessment.type === 'WHO5' 
                ? previousAssessment.score * 4 
                : previousAssessment.score;
              trend = displayScore - prevScore;
            }

            return (
              <motion.div
                key={assessment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="font-mono">
                    {assessment.type}
                  </Badge>
                  <div>
                    <p className="text-sm font-medium">
                      Score: {displayScore}/{assessment.type === 'WHO5' ? 100 : 27}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(assessment.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {trend !== null && (
                    <span className={cn(
                      'text-xs flex items-center gap-1',
                      assessment.type === 'WHO5'
                        ? trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-muted-foreground'
                        : trend < 0 ? 'text-green-600' : trend > 0 ? 'text-red-600' : 'text-muted-foreground'
                    )}>
                      {trend > 0 ? <TrendingUp className="h-3 w-3" /> : 
                       trend < 0 ? <TrendingDown className="h-3 w-3" /> : 
                       <Minus className="h-3 w-3" />}
                      {trend > 0 ? '+' : ''}{trend}
                    </span>
                  )}
                  {category && (
                    <Badge
                      variant="secondary"
                      className={cn(
                        'text-xs',
                        category.severity === 'minimal' && 'bg-green-100 text-green-700',
                        category.severity === 'mild' && 'bg-amber-100 text-amber-700',
                        category.severity === 'moderate' && 'bg-orange-100 text-orange-700',
                        (category.severity === 'moderately_severe' || category.severity === 'severe') && 'bg-red-100 text-red-700'
                      )}
                    >
                      {category.label}
                    </Badge>
                  )}
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClinicalAssessmentHistory;
