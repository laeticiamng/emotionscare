
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCoach } from '@/hooks/useCoach';
import { Skeleton } from '@/components/ui/skeleton';

interface CoachRecommendationsProps {
  className?: string;
}

const CoachRecommendations: React.FC<CoachRecommendationsProps> = ({ className }) => {
  const navigate = useNavigate();
  const { recommendations, isProcessing } = useCoach();
  
  // Recommandations par défaut si aucune n'est disponible
  const defaultRecommendations = [
    {
      title: "Scan quotidien",
      description: "Évaluez votre état émotionnel du jour pour des recommandations personnalisées.",
      action: () => navigate('/scan'),
      actionText: "Scanner"
    },
    {
      title: "Session VR guidée",
      description: "Une session de réalité virtuelle pour vous aider à vous recentrer.",
      action: () => navigate('/vr-session'),
      actionText: "Commencer"
    },
    {
      title: "Journal émotionnel",
      description: "Exprimez vos pensées pour un meilleur équilibre mental.",
      action: () => navigate('/journal/new'),
      actionText: "Rédiger"
    }
  ];

  return (
    <Card className={`${className} h-full`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <BrainCircuit size={18} className="mr-2 text-primary" />
          Recommandations Coach IA
        </CardTitle>
        <CardDescription>
          Suggestions personnalisées pour votre bien-être
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isProcessing ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations && recommendations.length > 0 ? (
              recommendations.map((recommendation, index) => (
                <div key={index} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                  <p className="text-sm">{recommendation}</p>
                </div>
              ))
            ) : (
              defaultRecommendations.map((item, index) => (
                <div key={index} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="space-y-1 flex-1">
                      <h4 className="font-medium text-sm">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={item.action}
                      className="ml-auto"
                    >
                      {item.actionText} <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CoachRecommendations;
