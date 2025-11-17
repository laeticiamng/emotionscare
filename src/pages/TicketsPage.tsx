import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MessageSquare, Clock, CheckCircle } from 'lucide-react';

export default function TicketsPage() {
  const navigate = useNavigate();
  const [tickets] = useState([
    { id: 1, subject: 'Problème de connexion', status: 'open', date: '2025-10-25', replies: 2 },
    { id: 2, subject: 'Question sur l\'abonnement', status: 'answered', date: '2025-10-20', replies: 5 },
    { id: 3, subject: 'Bug scan émotionnel', status: 'closed', date: '2025-10-15', replies: 3 },
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="default">Ouvert</Badge>;
      case 'answered':
        return <Badge variant="secondary">Répondu</Badge>;
      case 'closed':
        return <Badge variant="outline">Fermé</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'answered':
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case 'closed':
        return <CheckCircle className="h-5 w-5 text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6" data-testid="page-root">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mes Tickets</h1>
            <p className="text-muted-foreground">Suivez vos demandes de support</p>
          </div>
          <Button onClick={() => navigate('/app/support')}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Ticket
          </Button>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ouverts</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tickets.filter(t => t.status === 'open').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Répondus</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tickets.filter(t => t.status === 'answered').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fermés</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tickets.filter(t => t.status === 'closed').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tous les Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 cursor-pointer"
                  onClick={() => navigate(`/app/tickets/${ticket.id}`)}
                >
                  <div className="flex items-center gap-4">
                    {getStatusIcon(ticket.status)}
                    <div>
                      <p className="font-medium">#{ticket.id} - {ticket.subject}</p>
                      <p className="text-sm text-muted-foreground">
                        Créé le {ticket.date} • {ticket.replies} réponses
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(ticket.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
