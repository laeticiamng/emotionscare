
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Share2, MessageCircle, ThumbsUp } from 'lucide-react';

interface SocialMetricsCardProps {
  title?: string;
}

const SocialMetricsCard: React.FC<SocialMetricsCardProps> = ({ title = "Métriques Sociales" }) => {
  const metrics = [
    { name: "Utilisateurs actifs", value: "1,245", icon: <Users className="h-5 w-5 text-primary" /> },
    { name: "Partages", value: "832", icon: <Share2 className="h-5 w-5 text-indigo-500" /> },
    { name: "Commentaires", value: "2,948", icon: <MessageCircle className="h-5 w-5 text-emerald-500" /> },
    { name: "Réactions", value: "6,429", icon: <ThumbsUp className="h-5 w-5 text-amber-500" /> },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-center p-3 rounded-lg bg-muted/50">
              <div className="mr-3">{metric.icon}</div>
              <div>
                <p className="text-sm text-muted-foreground">{metric.name}</p>
                <p className="text-xl font-semibold">{metric.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialMetricsCard;
