
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InvitationForm from '@/components/invitations/InvitationForm';
import { InvitationStatsCards } from './InvitationStats';
import InvitationModal from './InvitationModal';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { fetchInvitationStats } from '@/services/invitationService';
import { InvitationStats } from '@/types';

const InvitationsTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [stats, setStats] = useState<InvitationStats>({
    total: 0,
    pending: 0,
    accepted: 0,
    expired: 0,
    sent: 0,
    rejected: 0,
    teams: {},
    recent_invites: [],
    completed: 0,
    conversionRate: 0,
    averageTimeToAccept: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData = await fetchInvitationStats();
        setStats({
          ...statsData,
          teams: statsData.teams || {},
          recent_invites: statsData.recent_invites || [],
          rejected: statsData.rejected || 0 // Ensure rejected field is always present
        });
      } catch (error) {
        console.error('Error fetching invitation stats:', error);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Invitations</h2>
          <p className="text-muted-foreground mt-2">
            Gérez les invitations des collaborateurs pour rejoindre EmotionsCare.
          </p>
        </div>
        <Button onClick={() => setShowInviteModal(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Inviter un collaborateur
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="new">Nouvelle invitation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques des invitations</CardTitle>
              <CardDescription>
                Vue d'ensemble anonymisée des invitations envoyées aux collaborateurs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InvitationStatsCards stats={stats} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inviter un collaborateur</CardTitle>
              <CardDescription>
                Envoyez une invitation par email à un nouveau collaborateur pour rejoindre la plateforme.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InvitationForm onInvitationSent={() => setActiveTab('overview')} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <InvitationModal
        open={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onInvitationSent={() => {
          setShowInviteModal(false);
          setActiveTab('overview');
        }}
      />
    </div>
  );
};

export default InvitationsTab;
