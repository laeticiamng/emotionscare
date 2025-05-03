
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

interface VrPromptBannerProps {
  userName: string;
}

const VrPromptBanner: React.FC<VrPromptBannerProps> = ({ userName }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="bg-[#4A90E2] text-white transition-all duration-300 hover:shadow-lg mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold mb-2">
              Bonjour {userName}, pense à ta micro-pause VR !
            </h3>
            <p className="opacity-90">
              Des études montrent que 5 minutes de VR peuvent réduire le stress de 20%
            </p>
          </div>
          <Button 
            onClick={() => navigate('/vr')}
            className="bg-white text-[#4A90E2] hover:bg-white/90"
          >
            Lancer VR <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VrPromptBanner;
