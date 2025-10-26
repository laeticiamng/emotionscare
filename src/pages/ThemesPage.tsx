import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export default function ThemesPage() {
  const themes = [
    { name: 'Clair', preview: 'bg-white', active: true },
    { name: 'Sombre', preview: 'bg-gray-900', active: false },
    { name: 'Océan', preview: 'bg-blue-500', active: false },
    { name: 'Forêt', preview: 'bg-green-600', active: false },
    { name: 'Sunset', preview: 'bg-orange-500', active: false },
    { name: 'Lavande', preview: 'bg-purple-500', active: false },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Thèmes</h1>
        <p className="text-muted-foreground">
          Personnalisez l'apparence de votre application
        </p>
      </div>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
        {themes.map((theme, i) => (
          <Card key={i} className="p-6 space-y-4 cursor-pointer hover:shadow-lg transition-shadow">
            <div className={`h-32 rounded-lg ${theme.preview} relative`}>
              {theme.active && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">{theme.name}</h3>
              <Button 
                variant={theme.active ? "default" : "outline"} 
                size="sm" 
                className="w-full"
              >
                {theme.active ? 'Actif' : 'Appliquer'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
