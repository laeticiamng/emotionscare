
import React from 'react';
import { User } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User as UserIcon } from 'lucide-react';

interface UserAvatarProps {
  user: Partial<User> | null;  // Changed from User to Partial<User>
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16'
  };
  
  const getInitials = (name: string): string => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      {user?.avatar ? (
        <img 
          src={user.avatar} 
          alt={user.name || "Avatar utilisateur"} 
          className="object-cover w-full h-full"
        />
      ) : (
        <AvatarFallback className="bg-primary/10">
          {user && user.name ? getInitials(user.name) : <UserIcon className="h-4 w-4" />}
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
