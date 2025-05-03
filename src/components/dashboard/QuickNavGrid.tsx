
import React from 'react';
import { Eye, BookOpen, Users, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const QuickNavGrid: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button 
        variant="outline" 
        onClick={() => navigate('/scan')}
        className="h-auto py-6 text-left flex flex-col items-start justify-center hover:bg-secondary/80"
      >
        <div className="flex items-center w-full">
          <Eye className="h-5 w-5 mr-3 text-primary" />
          <div>
            <span className="font-medium mb-1 block">Scan émotionnel</span>
            <span className="text-xs text-muted-foreground">Analysez votre état</span>
          </div>
        </div>
      </Button>

      <Button 
        variant="outline" 
        onClick={() => navigate('/journal')}
        className="h-auto py-6 text-left flex flex-col items-start justify-center hover:bg-secondary/80"
      >
        <div className="flex items-center w-full">
          <BookOpen className="h-5 w-5 mr-3 text-primary" />
          <div>
            <span className="font-medium mb-1 block">Journal</span>
            <span className="text-xs text-muted-foreground">Exprimez vos pensées</span>
          </div>
        </div>
      </Button>

      <Button 
        variant="outline" 
        onClick={() => navigate('/community')}
        className="h-auto py-6 text-left flex flex-col items-start justify-center hover:bg-secondary/80"
      >
        <div className="flex items-center w-full">
          <Users className="h-5 w-5 mr-3 text-primary" />
          <div>
            <span className="font-medium mb-1 block">Communauté</span>
            <span className="text-xs text-muted-foreground">Échangez anonymement</span>
          </div>
        </div>
      </Button>

      <Button 
        variant="outline" 
        onClick={() => navigate('/gamification')}
        className="h-auto py-6 text-left flex flex-col items-start justify-center hover:bg-secondary/80"
      >
        <div className="flex items-center w-full">
          <Star className="h-5 w-5 mr-3 text-primary" />
          <div>
            <span className="font-medium mb-1 block">Gamification</span>
            <span className="text-xs text-muted-foreground">Relevez des défis</span>
          </div>
        </div>
      </Button>
    </div>
  );
};

export default QuickNavGrid;
