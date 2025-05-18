import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRetentionStats } from '@/hooks/useRetentionStats';
import { retentionService, ReengagementCampaign } from '@/services/retentionService';
import { useAuth } from '@/contexts/AuthContext';

const RetentionDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { stats, loading } = useRetentionStats();
  const [campaigns, setCampaigns] = useState<ReengagementCampaign[]>([]);

  useEffect(() => {
    if (user?.role === 'b2b_admin' || user?.role === 'admin') {
      retentionService.fetchCampaigns().then(data => setCampaigns(data));
    }
  }, [user?.role]);

  if (loading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Tableau de fidélité</h1>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Votre progression</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>Jours actifs : {stats.daysActive}</p>
              <p>Série actuelle : {stats.streak} jours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1">
                {stats.badges.map(b => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Récompenses</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1">
                {stats.rewards.map(r => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rituels à relancer</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1">
                {stats.rituals.map(r => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {(user?.role === 'b2b_admin' || user?.role === 'admin') && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Campagnes de réengagement</h2>
          {campaigns.length === 0 ? (
            <p className="text-muted-foreground">Aucune campagne pour le moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campaigns.map(c => (
                <Card key={c.id} className="animate-fade-in">
                  <CardHeader>
                    <CardTitle>{c.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm">
                    <p>Cible : {c.target}</p>
                    <p>Statut : {c.status}</p>
                    <p>Envoyées : {c.sent}</p>
                    <p>Ouvertures : {c.opened}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RetentionDashboardPage;
