import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Share2, Mail, Link, Copy } from 'lucide-react';

export default function ShareDataPage() {
  return (
    <div className="container max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Partage de Données</h1>
        <p className="text-muted-foreground">
          Partagez vos progrès avec votre coach ou thérapeute
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Share2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Partager mes données</h3>
            <p className="text-sm text-muted-foreground">
              Générez un lien de partage sécurisé
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Email du destinataire</Label>
            <Input type="email" placeholder="coach@example.com" />
          </div>

          <div className="space-y-2">
            <Label>Durée de validité</Label>
            <Input type="number" defaultValue="7" />
            <p className="text-xs text-muted-foreground">Jours</p>
          </div>
        </div>

        <div className="space-y-3">
          <Button className="w-full">
            <Mail className="mr-2 h-4 w-4" />
            Envoyer par email
          </Button>
          
          <Button variant="outline" className="w-full">
            <Link className="mr-2 h-4 w-4" />
            Générer un lien
          </Button>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h3 className="font-semibold">Liens actifs</h3>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="text-sm">
                <p className="font-medium">Partage Coach #{i}</p>
                <p className="text-muted-foreground">Expire dans 5 jours</p>
              </div>
              <Button variant="ghost" size="icon" aria-label="Copier le lien de partage">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
