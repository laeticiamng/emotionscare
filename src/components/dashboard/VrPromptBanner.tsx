
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, PlayCircle, BrainCircuit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VrPromptBannerProps {
  userName: string;
}

const VrPromptBanner: React.FC<VrPromptBannerProps> = ({ userName }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="mb-8 overflow-hidden rounded-3xl border-0 relative p-0">
      <div className="absolute inset-0 bg-gradient-to-r from-cocoon-600/90 to-cocoon-400/80 backdrop-blur-sm -z-10" />
      {/* Using a pattern background instead of an image that might not exist */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-purple-800/20 opacity-15 -z-20" />
      
      <div className="p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-white">
          <h3 className="text-2xl md:text-3xl font-light mb-3">
            <span className="font-bold">Micro-pause VR</span> quotidienne
          </h3>
          <p className="text-white/80 max-w-md mb-3">
            Une session de réalité virtuelle de 5 minutes peut réduire votre stress de 27% et améliorer votre concentration pour les 3 prochaines heures.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
              <BrainCircuit className="h-4 w-4" />
              <span>Améliore la concentration</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
              <Calendar className="h-4 w-4" />
              <span>5 minutes par jour</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={() => navigate('/vr-sessions')}
            variant="default" 
            size="lg"
            className="bg-white text-cocoon-800 hover:bg-white/90 hover:text-cocoon-900 transition-all duration-200 shadow-md"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Planifier
          </Button>
          
          <Button 
            onClick={() => navigate('/vr-sessions')}
            variant="outline" 
            size="lg"
            className="bg-transparent border-white text-white hover:bg-white/20 hover:text-white transition-all duration-200"
          >
            <PlayCircle className="mr-2 h-4 w-4" />
            Commencer maintenant
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default VrPromptBanner;
