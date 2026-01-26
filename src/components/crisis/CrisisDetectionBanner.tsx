import { useEffect, useState } from 'react';
import { AlertTriangle, Phone, X, Heart, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CrisisResource {
  name: string;
  number: string;
  available: string;
  url?: string;
}

// Resources locales par défaut (toujours disponibles)
const DEFAULT_RESOURCES: CrisisResource[] = [
  { name: 'SOS Amitié', number: '09 72 39 40 50', available: '24h/24', url: 'https://www.sos-amitie.com' },
  { name: 'Numéro national de prévention du suicide', number: '3114', available: '24h/24', url: 'https://3114.fr' },
  { name: 'Fil Santé Jeunes', number: '0 800 235 236', available: '9h-23h', url: 'https://www.filsantejeunes.com' },
  { name: 'SOS Médecins', number: '3624', available: '24h/24' },
];

export default function CrisisDetectionBanner() {
  const { user } = useAuth();
  const [showBanner, setShowBanner] = useState(false);
  const [_crisisScore, setCrisisScore] = useState(0);
  const [resources, setResources] = useState<CrisisResource[]>(DEFAULT_RESOURCES);
  const [isMinimized, setIsMinimized] = useState(false);

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
          
          // Récupérer les ressources personnalisées si disponibles
          const { data: resourcesData } = await supabase.functions.invoke('crisis-detection', {
            body: { action: 'get_resources' }
          });
          if (resourcesData?.emergency?.length > 0) {
            setResources(resourcesData.emergency);
          }
        }
      } catch (err) {
        console.error('Crisis check failed:', err);
        // En cas d'erreur, on utilise les resources par défaut déjà définies
      }
    };

    checkCrisis();
    
    // Vérifier périodiquement (toutes les 30 minutes)
    const interval = setInterval(checkCrisis, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user]);

  const handleAcknowledge = async () => {
    try {
      await supabase.functions.invoke('crisis-detection', {
        body: { action: 'acknowledge' }
      });
    } catch (err) {
      // Silent fail - l'utilisateur peut toujours fermer le banner
    }
    setShowBanner(false);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  if (!showBanner) return null;

  // Version minimisée
  if (isMinimized) {
    return (
      <Button
        variant="destructive"
        size="sm"
        className="fixed bottom-4 right-20 z-50 gap-2 shadow-lg"
        onClick={() => setIsMinimized(false)}
      >
        <Heart className="h-4 w-4" />
        Aide disponible
      </Button>
    );
  }

  return (
    <Alert className="mb-4 border-destructive bg-destructive/10 relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6"
        onClick={handleMinimize}
        aria-label="Réduire"
      >
        <X className="h-4 w-4" />
      </Button>
      
      <AlertTriangle className="h-5 w-5 text-destructive" />
      <AlertTitle className="text-destructive flex items-center gap-2 pr-8">
        <Heart className="h-4 w-4" />
        Nous sommes là pour vous
      </AlertTitle>
      <AlertDescription className="mt-2">
        <p className="text-sm text-muted-foreground mb-3">
          Nous avons remarqué que vous traversez peut-être un moment difficile. 
          Vous n'êtes pas seul(e), et de l'aide est disponible 24h/24.
        </p>
        
        <div className="space-y-2 mb-4">
          {resources.map((resource, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-md bg-background hover:bg-accent transition-colors"
            >
              <a
                href={`tel:${resource.number.replace(/\s/g, '')}`}
                className="flex items-center gap-3 flex-1"
              >
                <Phone className="h-4 w-4 text-primary" />
                <div>
                  <span className="font-semibold text-lg">{resource.number}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    {resource.name}
                  </span>
                  <span className="text-xs text-muted-foreground block">
                    {resource.available}
                  </span>
                </div>
              </a>
              {resource.url && (
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-muted rounded-md"
                  aria-label={`Visiter ${resource.name}`}
                >
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="default"
            size="sm"
            asChild
          >
            <a href="tel:3114">
              <Phone className="h-3 w-3 mr-1" />
              Appeler le 3114
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAcknowledge}
          >
            J'ai vu ce message
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-3">
          💬 Ces lignes d'écoute sont gratuites, confidentielles et disponibles à tout moment.
        </p>
      </AlertDescription>
    </Alert>
  );
}
