import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Plus } from 'lucide-react';

export default function GroupsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Mes Groupes</h1>
          <p className="text-muted-foreground">Rejoignez et créez des communautés</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Créer un groupe
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {[
          { name: 'Méditation Quotidienne', members: 234, category: 'Bien-être' },
          { name: 'Gestion du Stress', members: 567, category: 'Santé' },
          { name: 'Motivation Pro', members: 123, category: 'Carrière' },
          { name: 'Sport et Énergie', members: 890, category: 'Fitness' },
        ].map((group, i) => (
          <Card key={i} className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{group.name}</h3>
                <Badge variant="secondary">{group.category}</Badge>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {group.members} membres actifs
            </p>
            <Button variant="outline" className="w-full">
              Rejoindre le groupe
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
