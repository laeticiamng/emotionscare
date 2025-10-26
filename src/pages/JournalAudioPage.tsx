import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Play, Pause, Trash2 } from 'lucide-react';

export default function JournalAudioPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Journal Audio</h1>
        <p className="text-muted-foreground">
          Enregistrez vos pensées et émotions avec votre voix
        </p>
      </div>

      <Card className="p-8 text-center space-y-6">
        <div className="w-32 h-32 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Mic className="w-16 h-16 text-primary" />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Enregistrer une note vocale</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Appuyez sur le bouton ci-dessous pour commencer à enregistrer votre journal audio
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Button size="lg">
            <Mic className="mr-2 h-5 w-5" />
            Commencer l'enregistrement
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Enregistrements récents</h2>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon">
                <Play className="h-4 w-4" />
              </Button>
              <div>
                <p className="font-medium">Enregistrement du {new Date().toLocaleDateString()}</p>
                <p className="text-sm text-muted-foreground">2:34 min</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
