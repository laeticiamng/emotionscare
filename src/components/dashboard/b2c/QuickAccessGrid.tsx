
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, Music, Calendar, MessageCircle, FileText, LineChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface QuickAccessGridProps {
  className?: string;
}

const QuickAccessGrid: React.FC<QuickAccessGridProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  
  const quickAccess = [
    { title: 'Scan', icon: Activity, path: '/scan', color: 'bg-blue-500' },
    { title: 'Musique', icon: Music, path: '/music', color: 'bg-purple-500' },
    { title: 'Sessions', icon: Calendar, path: '/sessions', color: 'bg-green-500' },
    { title: 'Coach', icon: MessageCircle, path: '/coach', color: 'bg-indigo-500' },
    { title: 'Journal', icon: FileText, path: '/journal', color: 'bg-amber-500' },
    { title: 'Statistiques', icon: LineChart, path: '/analytics', color: 'bg-red-500' }
  ];
  
  const handleNavigate = (path: string) => {
    if (path === '/scan' || path === '/music' || path === '/coach') {
      navigate(path);
    } else {
      toast(`La fonctionnalité "${path}" sera bientôt disponible`);
    }
  };

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <h3 className="font-medium text-lg mb-4">Accès rapide</h3>
        <div className="grid grid-cols-3 gap-4">
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
      </CardContent>
    </Card>
  );
};

export default QuickAccessGrid;
