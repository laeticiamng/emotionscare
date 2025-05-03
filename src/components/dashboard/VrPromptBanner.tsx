
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
    <Card className="mb-8 overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-wellness-blue to-[#5AAFF2] text-white p-6 rounded-xl">
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
              className="bg-white text-wellness-blue hover:bg-wellness-blue hover:text-white border-2 border-white rounded-full transition-colors duration-150"
            >
              Lancer VR <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VrPromptBanner;
