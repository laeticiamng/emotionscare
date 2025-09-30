import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function NyveeTestPage() {
  const navigate = useNavigate();
  
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950">
      <Card className="max-w-md w-full p-8 space-y-6 text-center shadow-xl">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Test Navigation Nyvée
          </h1>
          <p className="text-muted-foreground">
            Cette page de test te permet d'accéder au module Nyvée
          </p>
        </div>
        
        <div className="space-y-4">
          <Button 
            size="lg"
            onClick={() => navigate('/app/nyvee')}
            className="w-full text-lg py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            🌿 Aller vers Nyvée
          </Button>
          
          <Button 
            size="lg"
            variant="outline"
            onClick={() => window.location.href = '/app/nyvee'}
            className="w-full text-lg py-6"
          >
            🔄 Navigation directe (reload)
          </Button>
        </div>
        
        <div className="pt-4 text-sm text-muted-foreground">
          <p>Routes disponibles :</p>
          <ul className="mt-2 space-y-1 font-mono text-xs">
            <li>✓ /test-nyvee (page actuelle)</li>
            <li>✓ /app/nyvee (module Nyvée)</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
