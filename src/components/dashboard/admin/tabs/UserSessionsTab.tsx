
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface UserSessionsTabProps {
  userId: string;
}

const UserSessionsTab: React.FC<UserSessionsTabProps> = ({ userId }) => {
  const [sessions, setSessions] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  
  // Simuler le chargement des sessions VR/bien-être
  React.useEffect(() => {
    // Dans une application réelle, vous feriez un appel API ici
    setTimeout(() => {
      setSessions([
        { id: '1', type: 'vr', title: 'Méditation Guidée', date: new Date(Date.now() - 345600000).toISOString(), duration: 10, completed: true },
        { id: '2', type: 'music', title: 'Playlist Relaxante', date: new Date(Date.now() - 518400000).toISOString(), duration: 15, completed: false }
      ]);
      setIsLoading(false);
    }, 1000);
  }, [userId]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sessions de bien-être</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : sessions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium capitalize">{session.type}</TableCell>
                  <TableCell>{session.title}</TableCell>
                  <TableCell>{formatDate(session.date)}</TableCell>
                  <TableCell>{session.duration} min</TableCell>
                  <TableCell>
                    <Badge variant={session.completed ? 'default' : 'outline'}>
                      {session.completed ? 'Complétée' : 'Non terminée'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center py-10 text-muted-foreground">Aucune session enregistrée</p>
        )}
      </CardContent>
    </Card>
  );
};

export default UserSessionsTab;
