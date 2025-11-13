import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Crown, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AppRole } from '@/services/userRolesService';

interface PremiumBadgeProps {
  role: AppRole | null;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const PremiumBadge: React.FC<PremiumBadgeProps> = ({ 
  role, 
  className,
  showIcon = true,
  size = 'md'
}) => {
  if (!role || role === 'user') {
    return null;
  }

  const config = {
    admin: {
      label: 'Admin',
      icon: Zap,
      className: 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-0',
    },
    moderator: {
      label: 'Modérateur',
      icon: Zap,
      className: 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0',
    },
    premium: {
      label: 'Premium',
      icon: Crown,
      className: 'bg-gradient-to-r from-yellow-400 to-orange-400 text-black border-0',
    },
  };

  const roleConfig = config[role as keyof typeof config];
  if (!roleConfig) return null;

  const Icon = roleConfig.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <Badge 
      className={cn(
        roleConfig.className,
        sizeClasses[size],
        'font-semibold shadow-lg hover:scale-105 transition-transform',
        className
      )}
    >
      {showIcon && <Icon className="h-3 w-3 mr-1" />}
      {roleConfig.label}
    </Badge>
  );
};
