// @ts-nocheck

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, Music, Calendar, MessageCircle, FileText, LineChart, Grid3X3, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface QuickAccessGridProps {
  className?: string;
}

const QuickAccessGrid: React.FC<QuickAccessGridProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  
  const quickAccess = [
    { title: 'Scan', icon: Activity, path: '/app/scan', color: 'bg-blue-500' },
    { title: 'Musique', icon: Music, path: '/app/music', color: 'bg-purple-500' },
    { title: 'VR', icon: Calendar, path: '/app/vr', color: 'bg-green-500' },
    { title: 'Coach', icon: MessageCircle, path: '/app/coach', color: 'bg-indigo-500' },
    { title: 'Journal', icon: FileText, path: '/app/journal', color: 'bg-amber-500' },
    { title: 'Activité', icon: LineChart, path: '/app/activity', color: 'bg-red-500' }
  ];
  
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <h3 className="font-medium text-lg mb-4">Accès rapide</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {quickAccess.map((item, index) => (
            <div 
              key={index}
              className="flex flex-col items-center justify-center p-4 bg-muted rounded-md cursor-pointer hover:bg-accent transition-colors"
              onClick={() => handleNavigate(item.path)}
            >
              <div className={`${item.color} p-2 rounded-full mb-2 text-white`}>
                <item.icon className="h-5 w-5" />
              </div>
              <span className="text-sm">{item.title}</span>
            </div>
          ))}
        </div>
        
        {/* Bouton d'accès à toute la navigation */}
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2" 
          onClick={() => navigate('/navigation')}
        >
          <Grid3X3 className="h-4 w-4" />
          Voir toutes les fonctionnalités
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickAccessGrid;
