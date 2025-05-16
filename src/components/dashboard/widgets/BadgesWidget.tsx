
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/types';
import { Award } from 'lucide-react';

export interface BadgesWidgetProps {
  badges: Badge[];
  loading?: boolean;
  title?: string;
  showSeeAll?: boolean;
  onSeeAll?: () => void;
}

const BadgesWidget: React.FC<BadgesWidgetProps> = ({ 
  badges = [], 
  loading = false,
  title = "Vos badges",
  showSeeAll = false,
  onSeeAll
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 justify-center">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 w-16 rounded-full bg-muted animate-pulse"></div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const getBadgeImageUrl = (badge: Badge): string | undefined => {
    return badge.imageUrl || badge.image_url || badge.image || badge.icon_url;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{title}</CardTitle>
          {showSeeAll && (
            <button 
              onClick={onSeeAll} 
              className="text-sm text-primary hover:underline"
            >
              Voir tout
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {badges.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Award className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p>Aucun badge obtenu pour le moment</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3 justify-center">
            {badges.slice(0, 6).map((badge) => (
              <div key={badge.id} className="flex flex-col items-center gap-1">
                <div className="h-16 w-16 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center">
                  {getBadgeImageUrl(badge) ? (
                    <img 
                      src={getBadgeImageUrl(badge)}
                      alt={badge.name}
                      className="h-10 w-10 object-contain"
                    />
                  ) : (
                    <Award className="h-8 w-8 text-primary/80" />
                  )}
                </div>
                <span className="text-xs text-center max-w-[80px] truncate" title={badge.name}>
                  {badge.name}
                </span>
              </div>
            ))}
            {badges.length > 6 && (
              <div className="h-16 w-16 rounded-full border border-dashed border-muted-foreground flex items-center justify-center">
                <span className="font-medium text-sm">+{badges.length - 6}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BadgesWidget;
