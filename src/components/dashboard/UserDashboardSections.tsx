/**
 * UserDashboardSections - Sessions VR recommandées avec données réelles
 */
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Play, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface VRSession {
  id: string;
  name: string;
  description: string;
  duration: number;
  category: string;
  difficulty: string;
  thumbnailUrl?: string;
}

async function fetchRecommendedSessions(_userId: string): Promise<VRSession[]> {
  // Récupérer les sessions VR depuis la base de données
  const { data, error } = await supabase
    .from('vr_session_templates')
    .select('id, name, description, duration, category, difficulty, thumbnail_url')
    .eq('is_active', true)
    .order('popularity_score', { ascending: false })
    .limit(4);

  if (error) {
    console.error('Error fetching VR sessions:', error);
    // Retourner des données par défaut si erreur
    return getDefaultSessions();
  }

  if (!data || data.length === 0) {
    return getDefaultSessions();
  }

  return data.map(session => ({
    id: session.id,
    name: session.name || 'Session VR',
    description: session.description || 'Une expérience immersive pour votre bien-être',
    duration: session.duration || 15,
    category: session.category || 'relaxation',
    difficulty: session.difficulty || 'beginner',
    thumbnailUrl: session.thumbnail_url || undefined
  }));
}

function getDefaultSessions(): VRSession[] {
  return [
    {
      id: 'default-1',
      name: 'Méditation matinale',
      description: 'Commencez votre journée avec une méditation guidée pour un esprit clair',
      duration: 15,
      category: 'méditation',
      difficulty: 'débutant'
    },
    {
      id: 'default-2',
      name: 'Relaxation profonde',
      description: 'Une session immersive pour libérer le stress et retrouver l\'équilibre',
      duration: 25,
      category: 'relaxation',
      difficulty: 'intermédiaire'
    },
    {
      id: 'default-3',
      name: 'Forêt apaisante',
      description: 'Immergez-vous dans une forêt virtuelle pour apaiser votre esprit',
      duration: 20,
      category: 'nature',
      difficulty: 'débutant'
    },
    {
      id: 'default-4',
      name: 'Plage au coucher de soleil',
      description: 'Détendez-vous sur une plage virtuelle au son des vagues',
      duration: 30,
      category: 'nature',
      difficulty: 'débutant'
    }
  ];
}

const categoryColors: Record<string, string> = {
  'méditation': 'bg-violet-500/10 text-violet-600',
  'relaxation': 'bg-sky-500/10 text-sky-600',
  'nature': 'bg-emerald-500/10 text-emerald-600',
  'default': 'bg-primary/10 text-primary'
};

const UserDashboardSections: React.FC = () => {
  const { user } = useAuth();

  const { data: sessions, isLoading } = useQuery({
    queryKey: ['vr-recommended-sessions', user?.id],
    queryFn: () => fetchRecommendedSessions(user?.id || ''),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
              Sessions VR recommandées
            </CardTitle>
            <CardDescription>
              Expériences immersives pour votre bien-être
            </CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/app/vr" className="text-xs">
              Voir tout
              <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="list" aria-label="Sessions VR recommandées">
            {sessions?.map(session => {
              const colorClass = categoryColors[session.category] || categoryColors.default;
              
              return (
                <Link
                  key={session.id}
                  to={`/app/vr/session/${session.id}`}
                  className="group block"
                  role="listitem"
                >
                  <div className="border rounded-lg p-4 transition-all hover:shadow-md hover:border-primary/50">
                    <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 mb-3 rounded-lg flex items-center justify-center relative overflow-hidden">
                      {session.thumbnailUrl ? (
                        <img 
                          src={session.thumbnailUrl} 
                          alt={session.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="text-muted-foreground">
                          <Sparkles className="h-8 w-8" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-primary text-primary-foreground rounded-full p-3">
                            <Play className="h-5 w-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                      {session.name}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {session.description}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="outline" className={`text-xs ${colorClass}`}>
                        {session.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {session.duration} min
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserDashboardSections;
