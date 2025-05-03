
import React, { useState, useEffect } from 'react';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface VrPromptBannerProps {
  userName: string;
}

const VrPromptBanner: React.FC<VrPromptBannerProps> = ({ userName }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [aiMessage, setAiMessage] = useState<string>('Des études montrent que 5 minutes de VR peuvent réduire le stress de 20%');
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchAiMessage = async () => {
    try {
      setIsLoading(true);
      
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('generate-vr-benefit', {
        body: { userName },
      });
      
      if (error) {
        throw error;
      }
      
      if (data && data.message) {
        setAiMessage(data.message);
      }
    } catch (error) {
      console.error('Error fetching AI message:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer un message personnalisé. Veuillez réessayer plus tard.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    // Don't automatically fetch on first render to avoid hitting API limits
    // User can click refresh button to get a new message
  }, []);
  
  return (
    <Card className="mb-8 overflow-hidden apple-card">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-wellness-blue to-[#5AAFF2] text-white p-6 rounded-xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2">
                Bonjour {userName}, pense à ta micro-pause VR !
              </h3>
              <p className="opacity-90 flex items-center">
                {isLoading ? (
                  <span className="flex items-center">
                    <RefreshCw size={16} className="animate-spin mr-2" /> 
                    Génération d'un conseil personnalisé...
                  </span>
                ) : (
                  <>
                    {aiMessage}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="ml-2 text-white hover:bg-white/20" 
                      onClick={fetchAiMessage}
                      disabled={isLoading}
                    >
                      <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                    </Button>
                  </>
                )}
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
