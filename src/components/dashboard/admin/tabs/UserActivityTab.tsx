
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface UserActivityTabProps {
  userId: string;
}

const UserActivityTab: React.FC<UserActivityTabProps> = ({ userId }) => {
  const [activities, setActivities] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  
  // Simuler le chargement des données d'activité
  React.useEffect(() => {
    // Normalement, vous feriez un appel API ici
    setTimeout(() => {
      setActivities([
        { id: '1', type: 'login', timestamp: new Date().toISOString(), details: 'Connexion au système' },
        { id: '2', type: 'emotion_scan', timestamp: new Date(Date.now() - 86400000).toISOString(), details: 'Scan émotionnel: Calme' },
        { id: '3', type: 'vr_session', timestamp: new Date(Date.now() - 172800000).toISOString(), details: 'Session VR: Méditation guidée' }
      ]);
      setIsLoading(false);
    }, 1000);
  }, [userId]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activités récentes</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : activities.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Détails</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium capitalize">{activity.type.replace('_', ' ')}</TableCell>
                  <TableCell>{formatDate(activity.timestamp)}</TableCell>
                  <TableCell>{activity.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center py-10 text-muted-foreground">Aucune activité récente</p>
        )}
      </CardContent>
    </Card>
  );
};

export default UserActivityTab;
