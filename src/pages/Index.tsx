import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          EmotionsCare
        </h1>
        <p className="text-xl text-slate-200 max-w-2xl mx-auto">
          Votre plateforme de bien-être émotionnel alimentée par l'IA
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild className="bg-purple-600 hover:bg-purple-700">
            <Link to="/login">Commencer</Link>
          </Button>
          <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <Link to="/dashboard">Découvrir</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;