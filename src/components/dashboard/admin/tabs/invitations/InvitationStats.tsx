
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InvitationStats } from '@/types/invitation';

interface InvitationStatsCardProps {
  stats: InvitationStats;
}

const InvitationStatsCard: React.FC<InvitationStatsCardProps> = ({ stats }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl">Invitations</CardTitle>
        <CardDescription>Aperçu anonymisé des invitations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatItem label="Envoyées" value={stats.sent} className="bg-primary/10" />
          <StatItem label="Acceptées" value={stats.accepted} className="bg-green-500/10" />
          <StatItem label="En attente" value={stats.pending} className="bg-yellow-500/10" />
          <StatItem label="Expirées" value={stats.expired} className="bg-gray-200" />
        </div>
      </CardContent>
    </Card>
  );
};

interface StatItemProps {
  label: string;
  value: number;
  className?: string;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-4 rounded-md ${className}`}>
      <span className="text-3xl font-semibold">{value}</span>
      <span className="text-sm text-muted-foreground mt-1">{label}</span>
    </div>
  );
};

export default InvitationStatsCard;
