import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

export interface RecentActivity {
  type: string;
  title: string;
  date: string;
  mood: string;
  icon: React.ReactNode;
}

interface RecentActivitiesCardProps {
  activities: RecentActivity[];
}

const RecentActivitiesCard: React.FC<RecentActivitiesCardProps> = ({ activities }) => (
  <Card className="overflow-hidden bg-gradient-to-br from-gray-50/80 to-blue-50/80 dark:from-gray-900/10 dark:to-blue-900/20 border-gray-100 dark:border-gray-800/50">
    <CardHeader>
      <CardTitle>Activités récentes</CardTitle>
      <CardDescription>Vos dernières interactions</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <div className={`p-2 rounded-full ${
              activity.type === 'journal' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300' :
              activity.type === 'music' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300' :
              'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300'
            }`}>
              {activity.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{activity.title}</p>
              <p className="text-xs text-muted-foreground">{activity.date}</p>
            </div>
            <div className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800">
              {activity.mood}
            </div>
          </div>
        ))}
        <Button variant="ghost" size="sm" className="w-full mt-2 text-muted-foreground">
          Voir tout l'historique
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default RecentActivitiesCard;
