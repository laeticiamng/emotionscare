
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { InvitationStats as InvitationStatsType } from '@/types';
import { getInvitationStats } from '@/services/invitationService';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const InvitationStats: React.FC = () => {
  const [stats, setStats] = useState<InvitationStatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const invitationStats = await getInvitationStats();
        setStats(invitationStats);
      } catch (error: any) {
        console.error("Error fetching invitation stats:", error);
        setError(error.message || "Impossible de récupérer les statistiques d'invitation");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!stats) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Aucune donnée</AlertTitle>
        <AlertDescription>Aucune statistique d'invitation disponible pour le moment.</AlertDescription>
      </Alert>
    );
  }

  const acceptRate = stats.sent > 0 ? Math.round((stats.accepted / stats.sent) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Invitations envoyées"
          value={stats.sent}
          description="Nombre total d'invitations"
        />
        <StatCard
          title="Invitations acceptées"
          value={stats.accepted}
          description={`${acceptRate}% de taux d'acceptation`}
          progress={acceptRate}
        />
        <StatCard
          title="Invitations en attente"
          value={stats.pending}
          description="En attente d'activation"
        />
      </div>

      <div className="mt-4 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          Toutes les données affichées ici sont entièrement anonymisées conformément à notre politique
          de confidentialité. Aucune information personnelle n'est accessible après l'envoi des invitations.
        </p>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  progress?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, progress }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        {progress !== undefined && (
          <Progress value={progress} className="h-1 mt-4" />
        )}
      </CardContent>
    </Card>
  );
};

export default InvitationStats;
