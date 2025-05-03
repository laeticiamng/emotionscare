
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cocoon-50 to-cocoon-100 p-6">
      <div className="text-center max-w-3xl animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-bold text-cocoon-800 mb-6">
          Cocoon <span className="text-primary">Wellbeing Hub</span>
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8">
          Un espace sécurisé pour prendre soin du bien-être émotionnel des professionnels de santé
        </p>
        
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-12">
          <Button 
            className="bg-primary hover:bg-primary/90 text-lg h-12 px-8" 
            onClick={() => navigate('/login')}
          >
            Commencer <ArrowRight className="ml-2" size={18} />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm">
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="text-xl font-medium mb-2">Scan émotionnel IA</h3>
            <p className="text-muted-foreground">
              Analysez votre état émotionnel grâce à l'intelligence artificielle
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm">
            <div className="text-4xl mb-4">🕶️</div>
            <h3 className="text-xl font-medium mb-2">Micro-pauses VR</h3>
            <p className="text-muted-foreground">
              Des séances immersives pour vous ressourcer en quelques minutes
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-medium mb-2">Espace communautaire</h3>
            <p className="text-muted-foreground">
              Partagez anonymement et trouvez du soutien entre pairs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
