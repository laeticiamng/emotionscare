import React, { memo } from 'react';
import { Heart, Lock, Users, CalendarPlus, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useSocialRooms } from '@/features/social-cocon/hooks/useSocialRooms';
import { useSocialBreakPlanner } from '@/features/social-cocon/hooks/useSocialBreakPlanner';
import { useNavigate } from 'react-router-dom';

export interface SocialCocoonWidgetProps {
  collapsed: boolean;
  onToggle: () => void;
  userId?: string;
}

const SocialCocoonWidget: React.FC<SocialCocoonWidgetProps> = memo(({ collapsed, onToggle, userId }) => {
  const navigate = useNavigate();
  const { rooms, isLoading: roomsLoading } = useSocialRooms({ enabled: !collapsed });
  const { upcomingBreaks, isLoading: breaksLoading } = useSocialBreakPlanner({ enabled: !collapsed });

  const isLoading = roomsLoading || breaksLoading;
  const activeRooms = rooms.filter((room) => room.members.length > 0);
  const nextBreak = upcomingBreaks[0];

  const handleNavigate = () => {
    navigate('/app/social-cocon');
  };

  if (collapsed) {
    return (
      <Card className="border-rose-100 bg-rose-50/50">
        <CardHeader className="p-4">
          <button
            type="button"
            onClick={onToggle}
            className="flex w-full items-center justify-between text-left"
            aria-expanded={false}
            aria-label="Développer le widget Social Cocon"
          >
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-500" aria-hidden="true" />
              <CardTitle className="text-base">Social Cocon</CardTitle>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </button>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-rose-100 bg-rose-50/50">
      <CardHeader className="pb-2">
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full items-center justify-between text-left"
          aria-expanded={true}
          aria-label="Réduire le widget Social Cocon"
        >
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500" aria-hidden="true" />
            <CardTitle className="text-base">Social Cocon</CardTitle>
          </div>
          <ChevronUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        </button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-3" aria-live="polite" aria-busy="true">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <>
            {/* Rooms actives */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-rose-800">
                  <Users className="mr-1 inline-block h-4 w-4" aria-hidden="true" />
                  Espaces actifs
                </p>
                <Badge variant="outline" className="text-xs">
                  {activeRooms.length}
                </Badge>
              </div>
              {activeRooms.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  Aucun espace actif. Créez une room pour démarrer.
                </p>
              ) : (
                <ul className="space-y-1" aria-label="Liste des rooms actives">
                  {activeRooms.slice(0, 2).map((room) => (
                    <li
                      key={room.id}
                      className={cn(
                        'flex items-center justify-between rounded-lg border border-rose-200 bg-white/80 px-3 py-2 text-xs',
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Lock className="h-3.5 w-3.5 text-rose-400" aria-hidden="true" />
                        <span className="font-medium text-rose-900">{room.name}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {room.members.length} membre{room.members.length > 1 ? 's' : ''}
                      </span>
                    </li>
                  ))}
                  {activeRooms.length > 2 && (
                    <li className="text-xs text-muted-foreground text-center py-1">
                      +{activeRooms.length - 2} autre{activeRooms.length - 2 > 1 ? 's' : ''}
                    </li>
                  )}
                </ul>
              )}
            </div>

            {/* Prochaine pause */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-rose-800">
                <CalendarPlus className="mr-1 inline-block h-4 w-4" aria-hidden="true" />
                Prochaine pause
              </p>
              {nextBreak ? (
                <div className="rounded-lg border border-rose-200 bg-white/80 px-3 py-2 text-xs">
                  <p className="font-medium text-rose-900">
                    {new Date(nextBreak.startsAt).toLocaleString('fr-FR', {
                      weekday: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p className="text-muted-foreground">
                    {nextBreak.durationMinutes} min · {nextBreak.deliveryChannel === 'email' ? 'Email' : 'In-app'}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Aucune pause planifiée. Prenez un moment.
                </p>
              )}
            </div>

            {/* Action rapide */}
            <Button
              variant="outline"
              size="sm"
              className="w-full border-rose-200 text-rose-700 hover:bg-rose-100"
              onClick={handleNavigate}
            >
              Ouvrir Social Cocon
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
});

SocialCocoonWidget.displayName = 'SocialCocoonWidget';

export default SocialCocoonWidget;
