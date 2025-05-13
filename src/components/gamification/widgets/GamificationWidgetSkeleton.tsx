
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Award } from 'lucide-react';

const GamificationWidgetSkeleton: React.FC = () => {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Award className="mr-2 h-5 w-5 text-amber-500" />
          Gamification
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-40 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GamificationWidgetSkeleton;
