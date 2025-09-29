
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CircularProgress from '@/components/ui/circular-progress';
import { InvitationStats } from '@/types/invitation';

interface InvitationStatsDisplayProps {
  stats: InvitationStats;
}

const InvitationStatsDisplay: React.FC<InvitationStatsDisplayProps> = ({ stats }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="teams">Par équipe</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard 
                title="Total" 
                value={stats.total || (stats.sent || 0)} 
                icon="📧"
              />
              <StatCard 
                title="En attente" 
                value={stats.pending} 
                icon="⏳"
                percentage={(stats.total || (stats.sent || 0)) > 0 ? (stats.pending / (stats.total || (stats.sent || 0))) * 100 : 0}
              />
              <StatCard 
                title="Acceptées" 
                value={stats.accepted} 
                icon="✅"
                percentage={(stats.total || (stats.sent || 0)) > 0 ? (stats.accepted / (stats.total || (stats.sent || 0))) * 100 : 0}
              />
              <StatCard 
                title="Expirées" 
                value={(stats.expired || 0) + (stats.rejected || 0)} 
                icon="⛔"
                percentage={(stats.total || (stats.sent || 0)) > 0 ? 
                  (((stats.expired || 0) + (stats.rejected || 0)) / (stats.total || (stats.sent || 0))) * 100 : 0}
              />
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <div className="flex-1">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Taux de conversion</h3>
                        <p className="text-2xl font-bold">{(stats.conversionRate || stats.conversion_rate || 0).toString()}%</p>
                      </div>
                      <CircularProgress 
                        value={Number(stats.conversionRate || stats.conversion_rate || 0)} 
                        size={70}
                        thickness={8}
                        color="var(--primary)"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex-1">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Temps moyen d'acceptation</h3>
                        <p className="text-2xl font-bold">{stats.averageTimeToAccept || 0} heures</p>
                      </div>
                      <div className="text-3xl">⏱️</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="teams">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stats.teams && Object.entries(stats.teams).map(([team, count]) => (
                <Card key={team}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{team}</h3>
                        <p className="text-2xl font-bold">{String(count)}</p>
                      </div>
                      <CircularProgress 
                        value={Number(count)} 
                        max={Number(stats.total || (stats.sent || 100))} 
                        size={60}
                        thickness={6}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const StatCard = ({ title, value, icon, percentage }: { 
  title: string; 
  value: number; 
  icon: string;
  percentage?: number;
}) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <div className="flex justify-between items-center">
        <span className="text-3xl">{icon}</span>
        {percentage !== undefined && (
          <span className="text-xs text-muted-foreground">{Math.round(percentage)}%</span>
        )}
      </div>
      <h3 className="mt-2 text-gray-500 text-sm">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default InvitationStatsDisplay;
