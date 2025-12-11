import React, { useEffect, useState } from 'react';
import { AlertTriangle, Phone, X, Heart } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CrisisResource {
  name: string;
  number: string;
  available: string;
}

export default function CrisisDetectionBanner() {
  const { user } = useAuth();
  const [showBanner, setShowBanner] = useState(false);
  const [crisisScore, setCrisisScore] = useState(0);
  const [resources, setResources] = useState<CrisisResource[]>([]);

  useEffect(() => {
    if (!user) return;

    const checkCrisis = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('crisis-detection', {
          body: { action: 'analyze' }
        });

        if (!error && data?.needsIntervention) {
          setCrisisScore(data.crisisScore);
          setShowBanner(true);
          
          // Récupérer les ressources
          const { data: resourcesData } = await supabase.functions.invoke('crisis-detection', {
            body: { action: 'get_resources' }
          });
          if (resourcesData?.emergency) {
            setResources(resourcesData.emergency);
          }
        }
      } catch (err) {
        console.error('Crisis check failed:', err);
      }
    };

    checkCrisis();
  }, [user]);

  const handleAcknowledge = async () => {
    await supabase.functions.invoke('crisis-detection', {
      body: { action: 'acknowledge' }
    });
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <Alert className="mb-4 border-destructive bg-destructive/10">
      <AlertTriangle className="h-5 w-5 text-destructive" />
      <AlertTitle className="text-destructive flex items-center gap-2">
        <Heart className="h-4 w-4" />
        Nous sommes là pour vous
      </AlertTitle>
      <AlertDescription className="mt-2">
        <p className="text-sm text-muted-foreground mb-3">
          Nous avons remarqué que vous traversez peut-être un moment difficile. 
          Vous n'êtes pas seul(e), et de l'aide est disponible.
        </p>
        
        <div className="space-y-2 mb-4">
          {resources.map((resource, idx) => (
            <a
              key={idx}
              href={`tel:${resource.number.replace(/\s/g, '')}`}
              className="flex items-center gap-2 p-2 rounded-md bg-background hover:bg-accent transition-colors"
            >
              <Phone className="h-4 w-4 text-primary" />
              <div>
                <span className="font-semibold">{resource.number}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  {resource.name} ({resource.available})
                </span>
              </div>
            </a>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAcknowledge}
            className="text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            J'ai vu ce message
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
