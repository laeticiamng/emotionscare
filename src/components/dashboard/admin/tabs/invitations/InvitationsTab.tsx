// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InvitationForm from '@/components/invitations/InvitationForm';
import InvitationStatsDisplay from './InvitationStats';
import { InvitationStats, InvitationData } from '@/types/invitation';
import InvitationModal from './InvitationModal';
import InvitationList from '@/components/invitations/InvitationList';

const InvitationsTab = () => {
  const [invitationStats, setInvitationStats] = useState<InvitationStats>({
    total: 0,
    pending: 0,
    accepted: 0,
    expired: 0,
    rejected: 0,
    sent: 0,
    conversion_rate: 0,
    conversionRate: 0,
    recent_invites: [],
    last_sent: []
  });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const handleInvitationSent = () => {
    // Refresh data after an invitation is sent
    fetchInvitationStats();
    setModalOpen(false);
  };

  const fetchInvitationStats = async () => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock data
    const mockInvites: InvitationData[] = [
      {
        id: 'inv1',
        email: 'johndoe@example.com',
        name: 'John Doe',
        status: 'accepted',
        sent_at: '2023-10-15T14:30:00Z',
        accepted_at: '2023-10-16T09:12:00Z',
        role: 'user',
        sent_by: 'admin',
        created_at: '2023-10-15T14:30:00Z',
        expires_at: '2023-10-22T14:30:00Z',
      },
      {
        id: 'inv2',
        email: 'janedoe@example.com',
        name: 'Jane Doe',
        status: 'pending',
        sent_at: '2023-10-16T11:20:00Z',
        role: 'user',
        sent_by: 'admin',
        created_at: '2023-10-16T11:20:00Z',
        expires_at: '2023-10-23T11:20:00Z'
      },
      {
        id: 'inv3',
        email: 'robert@example.com',
        name: 'Robert Smith',
        status: 'expired',
        sent_at: '2023-09-29T08:45:00Z',
        role: 'manager',
        sent_by: 'admin',
        created_at: '2023-09-29T08:45:00Z',
        expires_at: '2023-10-06T08:45:00Z'
      }
    ];
    
    setInvitationStats({
      total: 120,
      pending: 45,
      accepted: 62,
      expired: 8,
      rejected: 5,
      sent: 120,
      conversion_rate: 51.7,
      conversionRate: 51.7,
      averageTimeToAccept: 32, // hours
      teams: {
        'Marketing': 28,
        'Engineering': 35,
        'Sales': 22,
        'HR': 15,
        'Management': 20
      },
      recent_invites: mockInvites
    });
    
    setLoading(false);
  };

  useEffect(() => {
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
            <InvitationForm onInvitationSent={handleInvitationSent} />
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
              <TabsTrigger value="all">Toutes ({invitationStats.total || 0})</TabsTrigger>
              <TabsTrigger value="pending">En attente ({invitationStats.pending})</TabsTrigger>
              <TabsTrigger value="accepted">Acceptées ({invitationStats.accepted})</TabsTrigger>
              <TabsTrigger value="expired">Expirées ({(invitationStats.expired || 0) + (invitationStats.rejected || 0)})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <InvitationList 
                invitations={invitationStats.recent_invites || []} 
                isLoading={loading} 
              />
            </TabsContent>
            
            <TabsContent value="pending">
              <InvitationList 
                invitations={(invitationStats.recent_invites || []).filter(inv => inv.status === 'pending')}
                isLoading={loading} 
              />
            </TabsContent>
            
            <TabsContent value="accepted">
              <InvitationList 
                invitations={(invitationStats.recent_invites || []).filter(inv => inv.status === 'accepted')}
                isLoading={loading} 
              />
            </TabsContent>
            
            <TabsContent value="expired">
              <InvitationList 
                invitations={(invitationStats.recent_invites || []).filter(inv => 
                  inv.status === 'expired'
                )}
                isLoading={loading} 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <InvitationModal 
        open={modalOpen}
        onOpenChange={setModalOpen}
        onInvitationSent={handleInvitationSent}
      />
    </div>
  );
};

export default InvitationsTab;
