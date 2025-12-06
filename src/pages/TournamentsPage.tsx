import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Calendar, Users, Medal, Swords, Clock, TrendingUp, Target, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { tournamentService, Tournament } from '@/services/tournament-service';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const TournamentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedStatus, setSelectedStatus] = useState<'upcoming' | 'registration' | 'in_progress' | 'all'>('all');

  const { data: tournaments, isLoading, refetch } = useQuery({
    queryKey: ['tournaments', selectedStatus],
    queryFn: () => tournamentService.getTournaments(selectedStatus === 'all' ? undefined : selectedStatus),
  });

  const handleRegister = async (tournamentId: string) => {
    try {
      const success = await tournamentService.registerForTournament(tournamentId);
      if (success) {
        toast({
          title: 'Inscription réussie !',
          description: 'Vous êtes maintenant inscrit au tournoi.',
        });
        refetch();
      } else {
        toast({
          title: 'Erreur',
          description: 'Impossible de s\'inscrire au tournoi.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'inscription.',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: Tournament['status']) => {
    const statusConfig = {
      upcoming: { label: 'À venir', variant: 'secondary' as const },
      registration: { label: 'Inscriptions ouvertes', variant: 'default' as const },
      in_progress: { label: 'En cours', variant: 'default' as const },
      completed: { label: 'Terminé', variant: 'secondary' as const },
      cancelled: { label: 'Annulé', variant: 'destructive' as const },
    };
    return statusConfig[status];
  };

  const getTypeBadge = (type: Tournament['tournament_type']) => {
    const typeConfig = {
      weekly_xp: { label: 'XP Hebdo', icon: TrendingUp },
      monthly_challenge: { label: 'Défi Mensuel', icon: Target },
      special_event: { label: 'Événement Spécial', icon: Sparkles },
    };
    return typeConfig[type] || { label: type, icon: Trophy };
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Trophy className="w-10 h-10 text-primary" />
              Tournois
            </h1>
            <p className="text-muted-foreground mt-2">
              Participez aux tournois et remportez des récompenses exclusives
            </p>
          </div>
        </div>

        {/* Filters */}
        <Tabs value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as 'upcoming' | 'registration' | 'in_progress' | 'all')}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="upcoming">À venir</TabsTrigger>
            <TabsTrigger value="registration">Inscriptions</TabsTrigger>
            <TabsTrigger value="in_progress">En cours</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedStatus} className="mt-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={`skeleton-${i}`} className="p-6">
                    <Skeleton className="h-40 w-full mb-4" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tournaments?.map((tournament) => {
                  const statusBadge = getStatusBadge(tournament.status);
                  const canRegister = tournament.status === 'registration' && 
                    tournament.current_participants < tournament.max_participants;

                  return (
                    <motion.div
                      key={tournament.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card className="p-6 h-full flex flex-col">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <Badge variant={statusBadge.variant}>
                            {statusBadge.label}
                          </Badge>
                          <Trophy className="w-6 h-6 text-primary" />
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold mb-2">{tournament.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-2">
                          {tournament.description}
                        </p>

                        {/* Info */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>
                              {format(new Date(tournament.start_date), 'dd MMM yyyy', { locale: fr })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span>
                              {tournament.current_participants}/{tournament.max_participants} participants
                            </span>
                          </div>
                          {tournament.status === 'registration' && (
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span>
                                Fin des inscriptions: {format(new Date(tournament.registration_end), 'dd MMM', { locale: fr })}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Prizes */}
                        {tournament.prize_pool && tournament.prize_pool.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm font-semibold mb-2">Récompenses :</p>
                            <div className="flex flex-wrap gap-2">
                              {tournament.prize_pool.slice(0, 3).map((prize, idx) => (
                                <Badge key={`${tournament.id}-prize-${idx}-${prize.xp || prize.label}`} variant="outline" className="gap-1">
                                  <Medal className="w-3 h-3" />
                                  {prize.label || `${prize.xp} XP`}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action Button */}
                        {canRegister ? (
                          <Button
                            onClick={() => handleRegister(tournament.id)}
                            className="w-full gap-2"
                          >
                            <Swords className="w-4 h-4" />
                            S'inscrire
                          </Button>
                        ) : (
                          <Button
                            onClick={() => navigate(`/app/tournaments/${tournament.id}`)}
                            variant="outline"
                            className="w-full"
                          >
                            Voir les détails
                          </Button>
                        )}
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {tournaments?.length === 0 && !isLoading && (
              <Card className="p-12 text-center">
                <Trophy className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Aucun tournoi trouvé</h3>
                <p className="text-muted-foreground">
                  Revenez plus tard pour découvrir de nouveaux tournois !
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default TournamentsPage;
