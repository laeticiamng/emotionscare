import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Clock } from 'lucide-react';

export default function WorkshopsPage() {
  const workshops = [
    {
      title: 'Techniques de Respiration',
      duration: '2h',
      participants: 12,
      level: 'Débutant',
      available: true,
    },
    {
      title: 'Méditation Avancée',
      duration: '3h',
      participants: 8,
      level: 'Avancé',
      available: true,
    },
    {
      title: 'Gestion des Émotions',
      duration: '2h30',
      participants: 15,
      level: 'Intermédiaire',
      available: false,
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Ateliers</h1>
        <p className="text-muted-foreground">
          Participez à nos ateliers pratiques pour développer vos compétences
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workshops.map((workshop, i) => (
          <Card key={i} className="p-6 space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{workshop.title}</h3>
              <Badge variant="outline">{workshop.level}</Badge>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Durée: {workshop.duration}
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Max {workshop.participants} participants
              </div>
            </div>

            <Button 
              className="w-full" 
              disabled={!workshop.available}
            >
              {workshop.available ? 'S\'inscrire' : 'Complet'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
