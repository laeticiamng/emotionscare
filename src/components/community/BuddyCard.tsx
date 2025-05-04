
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';

interface BuddyCardProps {
  alias: string;
  role?: string;
  joinDate?: string;
  description?: string;
  isMatched?: boolean;
}

const BuddyCard: React.FC<BuddyCardProps> = ({ 
  alias, 
  role, 
  joinDate,
  description,
  isMatched = false
}) => {
  // Get first letter of alias for avatar fallback
  const firstLetter = alias.charAt(0).toUpperCase();

  return (
    <Card className={`transition-all duration-300 ${isMatched ? 'border-primary shadow-md' : ''}`}>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12 border-2 border-primary/20">
          <AvatarFallback className="bg-primary/10 text-primary">
            {firstLetter}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex flex-col">
          <h3 className="font-medium">{alias}</h3>
          {role && (
            <Badge variant="outline" className="mt-1 bg-secondary/20">
              {role}
            </Badge>
          )}
        </div>
      </CardHeader>

      {description && (
        <CardContent>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      )}

      <CardFooter className="text-xs text-muted-foreground flex justify-between">
        {joinDate && <span>Membre depuis {joinDate}</span>}
        {isMatched && <Badge variant="secondary">Connecté</Badge>}
      </CardFooter>
    </Card>
  );
};

export default BuddyCard;
