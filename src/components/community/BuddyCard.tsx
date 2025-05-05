
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle } from 'lucide-react';
import type { User } from '@/types';

export interface BuddyCardProps {
  buddy: User | any; // Make the buddy prop accept any to be compatible with both formats
}

const BuddyCard: React.FC<BuddyCardProps> = ({ buddy }) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center text-center">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage src={buddy.avatar} alt={buddy.name} />
          <AvatarFallback>{buddy.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <h3 className="text-lg font-semibold">{buddy.name}</h3>
        <p className="text-sm text-muted-foreground">Utilisateur</p>
      </CardContent>
      <CardFooter className="justify-center">
        <Button variant="outline">
          <MessageCircle className="mr-2 h-4 w-4" />
          Contacter
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BuddyCard;
