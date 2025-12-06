// @ts-nocheck

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SocialStats {
  totalPosts: number;
  moderationRate: number;
  topHashtags: {
    tag: string;
    count: number;
  }[];
}

interface SocialCocoonCardProps {
  socialStats: SocialStats;
}

const SocialCocoonCard: React.FC<SocialCocoonCardProps> = ({
  socialStats
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Users className="h-5 w-5 mr-2 text-primary" />
          Social Cocoon
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-muted/20 rounded-lg p-4 text-center">
            <div className="text-sm text-muted-foreground">Publications</div>
            <div className="text-3xl font-bold mt-1">{socialStats.totalPosts}</div>
            <div className="text-xs text-muted-foreground mt-1">cette semaine</div>
          </div>
          
          <div className="bg-muted/20 rounded-lg p-4 text-center">
            <div className="text-sm text-muted-foreground">Taux de modération</div>
            <div className="text-3xl font-bold mt-1">{socialStats.moderationRate}%</div>
            <div className="text-xs text-muted-foreground mt-1">contenus signalés</div>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Hashtags populaires</h4>
          <div className="flex flex-wrap gap-2">
            {socialStats.topHashtags.map((tag) => (
              <div key={tag.tag} className="bg-muted/20 rounded-full px-3 py-1 text-xs">
                {tag.tag} <span className="text-muted-foreground">({tag.count})</span>
              </div>
            ))}
          </div>
        </div>
        
        <Button variant="outline" size="sm" className="w-full">
          Gérer la modération
        </Button>
      </CardContent>
    </Card>
  );
};

export default SocialCocoonCard;
