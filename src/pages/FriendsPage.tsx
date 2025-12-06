import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserPlus, Search, MessageCircle } from 'lucide-react';

export default function FriendsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Mes Amis</h1>
          <p className="text-muted-foreground">Gérez votre réseau d'amis</p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Ajouter un ami
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Rechercher un ami..." className="pl-10" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback>U{i}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold">Utilisateur {i}</p>
                <p className="text-sm text-muted-foreground">En ligne</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              <MessageCircle className="mr-2 h-4 w-4" />
              Message
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
