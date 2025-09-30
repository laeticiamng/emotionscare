import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function NyveeTestPage() {
  const navigate = useNavigate();
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-4xl font-bold">Test Navigation Nyvée</h1>
        <p className="text-muted-foreground">Clique sur le bouton pour accéder à Nyvée</p>
        <Button 
          size="lg"
          onClick={() => navigate('/app/nyvee')}
          className="text-lg px-8 py-6"
        >
          Aller vers Nyvée 🌿
        </Button>
      </div>
    </div>
  );
}
