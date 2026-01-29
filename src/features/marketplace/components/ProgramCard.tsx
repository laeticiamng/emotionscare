/**
 * ProgramCard - Carte de programme compacte
 */

import React from 'react';
import { Star, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Program } from '../types';

interface ProgramCardProps {
  program: Program;
  onClick?: () => void;
  compact?: boolean;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program, onClick, compact = false }) => {
  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(cents / 100);
  };

  if (compact) {
    return (
      <Card 
        className="flex items-center gap-4 p-3 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={onClick}
      >
        <img 
          src={program.cover_image_url || '/placeholder.svg'} 
          alt={program.title}
          className="w-16 h-12 rounded object-cover"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium truncate">{program.title}</h4>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
            <span>{program.rating.toFixed(1)}</span>
            <span>•</span>
            <span>{program.duration_minutes} min</span>
          </div>
        </div>
        <span className="font-semibold text-primary shrink-0">
          {formatPrice(program.price_cents)}
        </span>
      </Card>
    );
  }

  return (
    <Card 
      className="h-full cursor-pointer hover:shadow-lg transition-shadow overflow-hidden group"
      onClick={onClick}
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={program.cover_image_url || '/placeholder.svg'} 
          alt={program.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {program.is_featured && (
          <Badge className="absolute top-2 left-2 bg-primary">
            Recommandé
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <h3 className="font-semibold line-clamp-2">{program.title}</h3>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span>{program.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{program.duration_minutes} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{program.total_purchases}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          {program.creator?.display_name}
        </span>
        <span className="font-bold text-primary">
          {formatPrice(program.price_cents)}
        </span>
      </CardFooter>
    </Card>
  );
};

export default ProgramCard;
