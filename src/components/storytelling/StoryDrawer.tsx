
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface StoryDrawerProps {
  open: boolean;
  onClose: () => void;
  onCTAClick?: (route: string) => void;
}

const StoryDrawer: React.FC<StoryDrawerProps> = ({
  open,
  onClose,
  onCTAClick
}) => {
  if (!open) return null;
  
  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-background shadow-lg z-50 border-l">
      <Card className="h-full border-0 rounded-none flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-semibold">Histoire</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardContent className="flex-1 overflow-y-auto p-4">
          <div>
            <h4 className="text-lg font-medium mb-2">Titre de l'histoire</h4>
            <p className="text-muted-foreground">
              Contenu de l'histoire à afficher ici. Cette section peut être
              enrichie avec des images, des citations ou d'autres éléments
              interactifs pour renforcer l'engagement de l'utilisateur.
            </p>
          </div>
        </CardContent>
        <CardFooter className="border-t p-4">
          <Button className="w-full" onClick={() => onCTAClick && onCTAClick('/story')}>
            Continuer l'aventure
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default StoryDrawer;
