
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InvitationStats } from '@/types';
import { UserPlus, Clock, CheckCircle, XCircle } from 'lucide-react';

interface StatsCardsProps {
  stats: InvitationStats;
}

export const InvitationStatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total invitations</CardTitle>
          <UserPlus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">
            {stats.total > 0 ? `Dont ${stats.sent || 0} envoyées` : 'Aucune invitation'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">En attente</CardTitle>
          <Clock className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pending}</div>
          <p className="text-xs text-muted-foreground">
            {stats.pending > 0
              ? `${Math.round((stats.pending / stats.total) * 100)}% du total`
              : 'Aucune en attente'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Acceptées</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.accepted}</div>
          <p className="text-xs text-muted-foreground">
            {stats.accepted > 0
              ? `${Math.round((stats.accepted / stats.total) * 100)}% du total`
              : 'Aucune acceptée'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Expirées</CardTitle>
          <XCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.expired}</div>
          <p className="text-xs text-muted-foreground">
            {stats.expired > 0
              ? `${Math.round((stats.expired / stats.total) * 100)}% du total`
              : 'Aucune expirée'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

// Add default export
export default InvitationStatsCards;
