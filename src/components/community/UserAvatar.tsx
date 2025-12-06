// @ts-nocheck

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from '@/types';

interface UserAvatarProps {
  user: { id: string; name?: string; avatar?: string };
  size?: "sm" | "md" | "lg";
  isAnonymous?: boolean;
}

const getAvatarSize = (size: "sm" | "md" | "lg") => {
  switch (size) {
    case "sm": return "h-8 w-8";
    case "lg": return "h-12 w-12";
    default: return "h-10 w-10";
  }
};

const getInitials = (name: string) => {
  if (!name) return "??";
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = "md", isAnonymous = false }) => {
  const sizeClass = getAvatarSize(size);
  const initials = isAnonymous ? "AN" : getInitials(user.name || "User");
  const avatarUrl = isAnonymous ? undefined : user.avatar;
  
  // Generate a consistent color based on user ID or name
  const colorIndex = isAnonymous ? 
    0 : 
    user.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 6;
    
  const bgColors = [
    "bg-green-100 text-green-800",
    "bg-blue-100 text-blue-800",
    "bg-purple-100 text-purple-800",
    "bg-amber-100 text-amber-800",
    "bg-pink-100 text-pink-800",
    "bg-cyan-100 text-cyan-800",
  ];
  
  return (
    <Avatar className={sizeClass}>
      {avatarUrl && <AvatarImage src={avatarUrl} alt={user.name || "User"} />}
      <AvatarFallback className={bgColors[colorIndex]}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
