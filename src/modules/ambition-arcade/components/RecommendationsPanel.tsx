/**
 * Panneau de recommandations Ambition Arcade
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb, ArrowRight, Sparkles, TrendingUp, RotateCcw } from 'lucide-react';
import { useAmbitionRecommendations, type RunRecommendation } from '../hooks/useAmbitionExtras';
import { useCreateGoal } from '../hooks';

const TYPE_ICONS: Record<string, React.ReactNode> = {
  continue: <RotateCcw className="w-4 h-4" />,
  similar: <Sparkles className="w-4 h-4" />,
  popular: <TrendingUp className="w-4 h-4" />,
  new: <Lightbulb className="w-4 h-4" />,
};

const TYPE_LABELS: Record<string, string> = {
  continue: 'Continuer',
  similar: 'Similaire',
  popular: 'Populaire',
  new: 'Nouveau',
};

interface RecommendationCardProps {
  recommendation: RunRecommendation;
  onSelect: (rec: RunRecommendation) => void;
  index: number;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation, onSelect, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    <Card className="hover:shadow-md transition-all cursor-pointer group" onClick={() => onSelect(recommendation)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            {TYPE_ICONS[recommendation.type]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-sm truncate">{recommendation.title}</h4>
              <Badge variant="secondary" className="text-xs shrink-0">
                {TYPE_LABELS[recommendation.type]}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{recommendation.description}</p>
            <div className="flex flex-wrap gap-1">
              {recommendation.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

interface RecommendationsPanelProps {
  onSelectRecommendation?: (title: string, tags: string[]) => void;
}

export const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({ onSelectRecommendation }) => {
  const { data: recommendations, isLoading } = useAmbitionRecommendations();
  const createGoal = useCreateGoal();

  const handleSelect = async (rec: RunRecommendation) => {
    if (rec.type === 'continue' && rec.basedOn) {
      // Navigate or show the existing run
      onSelectRecommendation?.(rec.title.replace('Continuer: ', ''), rec.tags);
    } else {
      // Create new goal from recommendation
      await createGoal.mutateAsync({
        objective: rec.title,
        tags: rec.tags
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-20" />)}
        </CardContent>
      </Card>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <Card className="border-dashed border-info/30 bg-gradient-to-br from-info/5 to-transparent">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="w-5 h-5 text-info" />
          Suggestions
        </CardTitle>
        <CardDescription>Basées sur votre activité</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.slice(0, 5).map((rec, index) => (
          <RecommendationCard 
            key={rec.id} 
            recommendation={rec} 
            onSelect={handleSelect}
            index={index}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default RecommendationsPanel;
