
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MessageSquare } from 'lucide-react';
import CountUp from 'react-countup';

interface SocialCocoonCardProps {
  socialStats: {
    totalPosts: number;
    moderationRate: number; // Updated from blockedPercentage
    topHashtags: Array<{ tag: string; count: number }>;
  };
}

const SocialCocoonCard: React.FC<SocialCocoonCardProps> = ({ 
  socialStats = {
    totalPosts: 126, 
    moderationRate: 5, 
    topHashtags: [
      { tag: "#bienetre", count: 28 },
      { tag: "#teamspirit", count: 21 },
      { tag: "#détente", count: 18 },
      { tag: "#santé", count: 14 }
    ]
  } 
}) => {
  return (
    <Card className="glass-card overflow-hidden hover:shadow-md hover:scale-[1.02] transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="text-[#1B365D]" />
          Social Cocoon anonymisé
        </CardTitle>
        <CardDescription>
          Activité et tendances
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-6">
              <div className="text-3xl font-semibold">
                <CountUp 
                  end={socialStats.totalPosts} 
                  duration={2} 
                  enableScrollSpy 
                  scrollSpyOnce
                />
              </div>
              <p className="text-sm text-muted-foreground">Messages publiés</p>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Taux de modération</span>
                <span className="text-sm font-semibold">{socialStats.moderationRate}%</span>
              </div>
              <Progress value={socialStats.moderationRate} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">Posts bloqués par l'IA</p>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-3">Hashtags populaires</h4>
            <div className="flex flex-wrap gap-2">
              {socialStats.topHashtags.map((tag, index) => (
                <div 
                  key={index}
                  className="px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    fontSize: `${Math.max(0.75, 0.75 + (tag.count / 10) * 0.25)}rem`,
                    backgroundColor: `rgba(${255 - index * 20}, ${111 + index * 10}, ${97 + index * 15}, ${0.1 + index * 0.05})`,
                    color: `rgb(${70 + index * 10}, ${90 + index * 5}, ${110 - index * 5})`,
                  }}
                >
                  {tag.tag} <span className="opacity-60">({tag.count})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialCocoonCard;
