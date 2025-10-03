import { useNavigate } from 'react-router-dom';
import { Music, Play, Plus, ArrowLeft, Library } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function B2CMusicPage() {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Générer de la musique',
      description: 'Créez une composition personnalisée',
      icon: Plus,
      action: () => navigate('/app/music/generate'),
    },
    {
      title: 'Ma bibliothèque',
      description: 'Accédez à vos compositions',
      icon: Library,
      action: () => navigate('/app/music/library'),
    },
  ];

  const playlists = [
    { name: 'Relaxation', tracks: 0 },
    { name: 'Concentration', tracks: 0 },
    { name: 'Énergie', tracks: 0 },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted p-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Music className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Musique Thérapeutique</h1>
              <p className="text-muted-foreground">
                Musique personnalisée pour votre bien-être
              </p>
            </div>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card
                key={action.title}
                className="cursor-pointer transition-all hover:shadow-lg"
                onClick={action.action}
              >
                <CardHeader>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Accéder
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold">Playlists recommandées</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {playlists.map((playlist) => (
              <Card key={playlist.name}>
                <CardHeader>
                  <div className="mb-3 flex h-32 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
                    <Music className="h-12 w-12 text-primary/40" />
                  </div>
                  <CardTitle className="text-lg">{playlist.name}</CardTitle>
                  <CardDescription>
                    {playlist.tracks} morceaux
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" size="sm">
                    <Play className="mr-2 h-4 w-4" />
                    Écouter
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
