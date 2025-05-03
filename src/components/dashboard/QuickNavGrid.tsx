
import React from 'react';
import { Eye, BookOpen, Users, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";

const QuickNavGrid: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-2 gap-6">
      <Card 
        className="apple-card cursor-pointer"
        onClick={() => navigate('/scan')}
      >
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gray-50 mr-4">
              <Eye className="h-6 w-6 text-wellness-violet" />
            </div>
            <div>
              <h3 className="font-medium text-lg mb-1">Scan émotionnel</h3>
              <p className="text-sm text-muted-foreground">Analysez votre état</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card 
        className="apple-card cursor-pointer"
        onClick={() => navigate('/journal')}
      >
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gray-50 mr-4">
              <BookOpen className="h-6 w-6 text-wellness-violet" />
            </div>
            <div>
              <h3 className="font-medium text-lg mb-1">Journal</h3>
              <p className="text-sm text-muted-foreground">Exprimez vos pensées</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card 
        className="apple-card cursor-pointer"
        onClick={() => navigate('/community')}
      >
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gray-50 mr-4">
              <Users className="h-6 w-6 text-wellness-violet" />
            </div>
            <div>
              <h3 className="font-medium text-lg mb-1">Communauté</h3>
              <p className="text-sm text-muted-foreground">Échangez anonymement</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card 
        className="apple-card cursor-pointer"
        onClick={() => navigate('/gamification')}
      >
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gray-50 mr-4">
              <Star className="h-6 w-6 text-wellness-violet" />
            </div>
            <div>
              <h3 className="font-medium text-lg mb-1">Gamification</h3>
              <p className="text-sm text-muted-foreground">Relevez des défis</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickNavGrid;
