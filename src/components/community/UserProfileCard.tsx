import React, {} from 'react';
import {
  Users,
  Heart,
  MessageSquare,
  Award,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

interface UserStats {
  postsCount: number;
  commentsCount: number;
  reactionsCount: number;
  joinDate: string;
  badge?: string;
}

interface UserProfileCardProps {
  userName: string;
  userAvatar?: string;
  userRole?: 'member' | 'mentor' | 'expert';
  stats?: UserStats;
  onFollow?: () => void;
  isFollowed?: boolean;
}

const BadgeConfig = {
  expert: {
    label: 'Expert',
    color: 'bg-purple-100 text-purple-700',
    icon: '👨‍🏫',
  },
  mentor: {
    label: 'Mentor',
    color: 'bg-blue-100 text-blue-700',
    icon: '🤝',
  },
  contributor: {
    label: 'Contributeur',
    color: 'bg-green-100 text-green-700',
    icon: '✨',
  },
  member: {
    label: 'Membre',
    color: 'bg-emerald-100 text-emerald-700',
    icon: '👤',
  },
};

export const UserProfileCard: React.FC<UserProfileCardProps> = ({
  userName,
  userAvatar = '👤',
  userRole = 'member',
  stats = {
    postsCount: 0,
    commentsCount: 0,
    reactionsCount: 0,
    joinDate: new Date().toLocaleDateString('fr-FR'),
  },
  onFollow,
  isFollowed = false,
}) => {
  const badgeConfig = BadgeConfig[userRole] || BadgeConfig.member;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button className="font-semibold text-emerald-800 hover:text-emerald-600 underline decoration-emerald-300 cursor-pointer transition-colors">
          {userName}
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-4 border-emerald-200 bg-white/95 backdrop-blur-sm">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-xl">
              {userAvatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900">{userName}</h3>
                <Badge variant="outline" className={`text-xs ${badgeConfig.color}`}>
                  {badgeConfig.icon} {badgeConfig.label}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Membre depuis {stats.joinDate}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-emerald-50 p-2 border border-emerald-100">
              <div className="flex items-center gap-1 text-xs text-emerald-700 font-medium">
                <MessageSquare className="h-3 w-3" aria-hidden="true" />
                <span>{stats.postsCount}</span>
              </div>
              <p className="text-xs text-muted-foreground">Messages</p>
            </div>
            <div className="rounded-lg bg-sky-50 p-2 border border-sky-100">
              <div className="flex items-center gap-1 text-xs text-sky-700 font-medium">
                <Users className="h-3 w-3" aria-hidden="true" />
                <span>{stats.commentsCount}</span>
              </div>
              <p className="text-xs text-muted-foreground">Réponses</p>
            </div>
            <div className="rounded-lg bg-amber-50 p-2 border border-amber-100">
              <div className="flex items-center gap-1 text-xs text-amber-700 font-medium">
                <Heart className="h-3 w-3" aria-hidden="true" />
                <span>{stats.reactionsCount}</span>
              </div>
              <p className="text-xs text-muted-foreground">Soutiens</p>
            </div>
            <div className="rounded-lg bg-purple-50 p-2 border border-purple-100">
              <div className="flex items-center gap-1 text-xs text-purple-700 font-medium">
                <Award className="h-3 w-3" aria-hidden="true" />
                <span>+{Math.floor(stats.reactionsCount * 1.5)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Points</p>
            </div>
          </div>

          {/* Bio */}
          <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
            <p className="text-xs text-slate-600">
              {userRole === 'expert'
                ? '👨‍🏫 Un expert qui partage son savoir avec bienveillance.'
                : userRole === 'mentor'
                ? '🤝 Un mentor qui accompagne la communauté avec douceur.'
                : '✨ Un contributeur actif et engagé.'}
            </p>
          </div>

          {/* Actions */}
          {onFollow && (
            <Button
              size="sm"
              onClick={onFollow}
              variant={isFollowed ? 'outline' : 'default'}
              className={
                isFollowed
                  ? 'w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                  : 'w-full bg-emerald-600 hover:bg-emerald-700'
              }
            >
              {isFollowed ? '✓ Suivi' : '+ Suivre'}
            </Button>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
