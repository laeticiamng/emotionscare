import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from '@/types/types';

interface TeamTabContentProps {
  users?: Partial<User>[];
  onUserClick?: (userId: string) => void;
}

const TeamTabContent: React.FC<TeamTabContentProps> = ({ users, onUserClick }) => {
  // Inside the component, modify the users mapping
  const safeUsers = users ? users.map(user => ({
    id: user.id || '',
    name: user.name || '',
    email: user.email || '',
    avatar_url: user.avatar_url || '',
    role: user.role,
    emotional_score: user.emotional_score || 0,
  })) as User[] : [];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Membres de l'équipe</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="divide-y divide-border">
            {safeUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center space-x-4 p-4 hover:bg-secondary cursor-pointer"
                onClick={() => onUserClick && onUserClick(user.id)}
              >
                <Avatar>
                  <AvatarImage src={user.avatar_url} />
                  <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="ml-auto font-bold text-primary">{user.emotional_score}</div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TeamTabContent;
