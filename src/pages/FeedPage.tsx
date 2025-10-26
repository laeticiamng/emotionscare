import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

export default function FeedPage() {
  return (
    <div className="container max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Fil d'actualité</h1>
        <p className="text-muted-foreground">Découvrez ce que votre communauté partage</p>
      </div>

      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback>U{i}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">Utilisateur {i}</p>
              <p className="text-sm text-muted-foreground">Il y a 2 heures</p>
            </div>
          </div>
          
          <p className="text-sm">
            Excellente session de méditation aujourd'hui ! Je me sens beaucoup plus calme et centré. 🧘‍♂️✨
          </p>

          <div className="flex gap-4 pt-2">
            <Button variant="ghost" size="sm">
              <Heart className="mr-2 h-4 w-4" />
              12
            </Button>
            <Button variant="ghost" size="sm">
              <MessageCircle className="mr-2 h-4 w-4" />
              3
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Partager
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
