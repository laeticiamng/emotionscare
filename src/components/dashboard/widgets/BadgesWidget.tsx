
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { Badge } from "@/types/gamification";
import { BadgesWidgetProps } from "@/types/widgets";
import { cn } from "@/lib/utils";

const BadgesWidget: React.FC<BadgesWidgetProps> = ({
  badges,
  title = "Badges",
  showSeeAll = true,
  onSeeAll,
}) => {
  // Sort badges: first completed and unlocked, then completed but locked, then incomplete
  const sortedBadges = [...badges].sort((a, b) => {
    if ((a.completed && a.unlockedAt) && !(b.completed && b.unlockedAt)) return -1;
    if (!(a.completed && a.unlockedAt) && (b.completed && b.unlockedAt)) return 1;
    if ((a.completed && !a.unlockedAt) && !b.completed) return -1;
    if (!a.completed && (b.completed && !b.unlockedAt)) return 1;
    return 0;
  });

  // Calculate badges progress
  const completedBadges = badges.filter(badge => badge.completed || badge.unlockedAt).length;
  const totalBadges = badges.length;
  const progress = Math.round((completedBadges / totalBadges) * 100);
  
  // Display only the first 3 badges
  const displayBadges = sortedBadges.slice(0, 3);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          {showSeeAll && (
            <Button variant="ghost" size="sm" onClick={onSeeAll}>
              Voir tout
            </Button>
          )}
        </div>
        <CardDescription>
          {completedBadges} sur {totalBadges} badges débloqués
        </CardDescription>
        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-2 mt-2">
          <div
            className="bg-primary h-2 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-3">
        {displayBadges.map((badge) => (
          <div
            key={badge.id}
            className={cn(
              "flex flex-col items-center text-center p-2 rounded-lg",
              badge.completed || badge.unlockedAt
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            <div className="relative mb-1">
              <div
                className={cn(
                  "h-12 w-12 rounded-full flex items-center justify-center",
                  badge.completed || badge.unlockedAt
                    ? "bg-primary/20"
                    : "bg-muted"
                )}
              >
                <ShieldCheck
                  className={cn(
                    "h-6 w-6",
                    badge.completed || badge.unlockedAt
                      ? "text-primary"
                      : "text-muted-foreground/60"
                  )}
                />
              </div>
              {(badge.completed || badge.unlockedAt) && (
                <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
                  ✓
                </div>
              )}
            </div>
            <div className="text-xs font-medium mt-1 line-clamp-1">{badge.name}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default BadgesWidget;
