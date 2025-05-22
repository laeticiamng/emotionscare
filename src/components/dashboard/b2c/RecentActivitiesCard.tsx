
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Music, MessageCircle } from 'lucide-react';

interface RecentActivitiesCardProps {
  className?: string;
}

interface Activity {
  id: number;
  type: 'scan' | 'music' | 'coach';
  title: string;
  timestamp: string;
}

const RecentActivitiesCard: React.FC<RecentActivitiesCardProps> = ({ className = '' }) => {
  // Simulons quelques activités récentes
  const activities: Activity[] = [
    { id: 1, type: 'scan', title: 'Scan émotionnel matinal', timestamp: 'Il y a 2 heures' },
    { id: 2, type: 'music', title: 'Session de méditation musicale', timestamp: 'Hier' },
    { id: 3, type: 'coach', title: 'Conversation avec Emma', timestamp: 'Il y a 2 jours' }
  ];

  const renderIcon = (type: Activity['type']) => {
    switch (type) {
      case 'scan':
        return <Activity className="h-4 w-4" />;
      case 'music':
        return <Music className="h-4 w-4" />;
      case 'coach':
        return <MessageCircle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Activités récentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start">
              <div className="bg-muted p-2 rounded-full mr-3">
                {renderIcon(activity.type)}
              </div>
              <div>
                <p className="font-medium">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivitiesCard;
