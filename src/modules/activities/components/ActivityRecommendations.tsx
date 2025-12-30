/**
 * Composant de recommandations d'activités personnalisées
 */

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Clock, 
  RefreshCw,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { ActivitySessionService } from '../services/activitySessionService';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Activity } from '../types';

interface Recommendation {
  id: string;
  activity_id: string;
  reason: string;
  score: number;
  activities: Activity;
}

interface ActivityRecommendationsProps {
  onSelectActivity: (activity: Activity) => void;
}

export function ActivityRecommendations({ onSelectActivity }: ActivityRecommendationsProps) {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadRecommendations = async () => {
    if (!user) return;
    
    try {
      const data = await ActivitySessionService.getRecommendations(user.id);
      setRecommendations(data as Recommendation[]);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshRecommendations = async () => {
    if (!user) return;
    
    setRefreshing(true);
    try {
      await ActivitySessionService.generateRecommendations(user.id);
      await loadRecommendations();
      toast.success('Recommandations mises à jour');
    } catch (error) {
      console.error('Error refreshing recommendations:', error);
      toast.error('Erreur lors du rafraîchissement');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, [user]);

  const handleSelect = async (rec: Recommendation) => {
    // Mark as clicked
    if (user) {
      await supabase
        .from('activity_recommendations')
        .update({ clicked: true })
        .eq('id', rec.id);
    }
    
    onSelectActivity(rec.activities);
  };

  const categoryColors: Record<string, string> = {
    relaxation: 'from-blue-500/20 to-cyan-500/20',
    physical: 'from-green-500/20 to-emerald-500/20',
    creative: 'from-purple-500/20 to-pink-500/20',
    social: 'from-pink-500/20 to-rose-500/20',
    mindfulness: 'from-indigo-500/20 to-violet-500/20',
    nature: 'from-emerald-500/20 to-teal-500/20'
  };

  const categoryLabels: Record<string, string> = {
    relaxation: 'Relaxation',
    physical: 'Physique',
    creative: 'Créative',
    social: 'Sociale',
    mindfulness: 'Pleine conscience',
    nature: 'Nature'
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Pour vous
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Recommandations pour vous
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={refreshRecommendations}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              Complétez quelques activités pour recevoir des recommandations personnalisées
            </p>
            <Button variant="outline" onClick={refreshRecommendations}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Générer des recommandations
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {recommendations.map(rec => {
              const activity = rec.activities;
              if (!activity) return null;
              
              const IconComponent = activity.icon ? (Icons as any)[activity.icon] : Icons.Activity;
              
              return (
                <div
                  key={rec.id}
                  className={`relative rounded-lg border p-4 cursor-pointer hover:shadow-md transition-all bg-gradient-to-r ${categoryColors[activity.category] || 'from-muted to-muted'}`}
                  onClick={() => handleSelect(rec)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-background/80 flex items-center justify-center">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm">{activity.title}</h4>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                      
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {activity.description}
                      </p>
                      
                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant="outline" className="text-[10px]">
                          {categoryLabels[activity.category]}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {activity.duration_minutes} min
                        </span>
                        {activity.benefits?.length > 0 && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {activity.benefits[0]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="text-[10px] bg-background/80">
                      {Math.round(rec.score * 100)}% match
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
