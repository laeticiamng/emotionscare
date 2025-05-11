
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InvitationList from '@/components/invitations/InvitationList';
import InvitationForm from '@/components/invitations/InvitationForm';
import InvitationStatsDisplay from './InvitationStats';
import { InvitationStats, InvitationData } from '@/types';

const InvitationsTab = () => {
  const [invitationStats, setInvitationStats] = useState<InvitationStats>({
    total: 0,
    pending: 0,
    accepted: 0,
    expired: 0,
    rejected: 0,
    sent: 0,
    completed: 0,
    conversionRate: 0,
    averageTimeToAccept: 0,
    teams: {},
    recent_invites: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const fetchInvitationStats = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data
      setInvitationStats({
        total: 120,
        pending: 45,
        accepted: 62,
        expired: 8,
        rejected: 5,
        sent: 120,
        completed: 67,
        conversionRate: 51.7,
        averageTimeToAccept: 32, // hours
        teams: {
          'Marketing': 28,
          'Engineering': 35,
          'Sales': 22,
          'HR': 15,
          'Management': 20
        },
        recent_invites: [
          {
            id: 'inv1',
            email: 'johndoe@example.com',
            status: 'accepted',
            created_at: '2023-10-15T14:30:00Z',
            expires_at: '2023-10-22T14:30:00Z',
            accepted_at: '2023-10-16T09:12:00Z',
            role: 'user'
          },
          {
            id: 'inv2',
            email: 'janedoe@example.com',
            status: 'pending',
            created_at: '2023-10-16T11:20:00Z',
            expires_at: '2023-10-23T11:20:00Z',
            role: 'user'
          },
          {
            id: 'inv3',
            email: 'robert@example.com',
            status: 'expired',
            created_at: '2023-09-29T08:45:00Z',
            expires_at: '2023-10-06T08:45:00Z',
            role: 'manager'
          }
        ] as InvitationData[]
      });
      
      setLoading(false);
    };
    
    fetchInvitationStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <InvitationStatsDisplay stats={invitationStats} />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Nouvelle invitation</CardTitle>
          </CardHeader>
          <CardContent>
            <InvitationForm />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Gérer les invitations</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="all">Toutes ({invitationStats.total})</TabsTrigger>
              <TabsTrigger value="pending">En attente ({invitationStats.pending})</TabsTrigger>
              <TabsTrigger value="accepted">Acceptées ({invitationStats.accepted})</TabsTrigger>
              <TabsTrigger value="expired">Expirées ({invitationStats.expired + invitationStats.rejected})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <InvitationList invitations={invitationStats.recent_invites} isLoading={loading} />
            </TabsContent>
            
            <TabsContent value="pending">
              <InvitationList 
                invitations={invitationStats.recent_invites.filter(inv => inv.status === 'pending')}
                isLoading={loading} 
              />
            </TabsContent>
            
            <TabsContent value="accepted">
              <InvitationList 
                invitations={invitationStats.recent_invites.filter(inv => inv.status === 'accepted')}
                isLoading={loading} 
              />
            </TabsContent>
            
            <TabsContent value="expired">
              <InvitationList 
                invitations={invitationStats.recent_invites.filter(inv => 
                  inv.status === 'expired' || inv.status === 'rejected'
                )}
                isLoading={loading} 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvitationsTab;
