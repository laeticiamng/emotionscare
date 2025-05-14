
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const TeamMoodTimeline = () => {
  return (
    <Card className="h-[300px]">
      <CardContent className="p-6">
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Timeline des humeurs de l'équipe à venir</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamMoodTimeline;
