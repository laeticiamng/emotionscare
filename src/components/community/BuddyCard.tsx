import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle } from 'lucide-react';

export interface BuddyCardProps {
  buddy: {
    id: string;
    name: string;
    department?: string;
    interests?: string[];
    compatibility?: number;
    avatar?: string;
  };
}

const BuddyCard: React.FC<BuddyCardProps> = ({ buddy }) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center text-center pt-6">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage src={buddy.avatar} alt={buddy.name} />
          <AvatarFallback>{buddy.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <h3 className="text-lg font-semibold">{buddy.name}</h3>
        {buddy.department && (
          <p className="text-sm text-muted-foreground">{buddy.department}</p>
        )}
        {buddy.interests && buddy.interests.length > 0 && (
          <div className="mt-2 flex flex-wrap justify-center gap-1">
            {buddy.interests.map((interest, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full"
              >
                {interest}
              </span>
            ))}
          </div>
        )}
        {buddy.compatibility && (
          <div className="mt-3">
            <span className="text-sm font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full">
              {buddy.compatibility}% compatible
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-center">
        <Button>
          <MessageCircle className="mr-2 h-4 w-4" />
          Contacter
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BuddyCard;
