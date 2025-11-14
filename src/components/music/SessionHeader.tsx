// @ts-nocheck
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Music } from '@/components/music/icons';
import { LazyMotionWrapper, m } from '@/utils/lazy-motion';

interface SessionHeaderProps {
  cover?: string | null;
  tags: string[];
  preset: string;
}

export const SessionHeader: React.FC<SessionHeaderProps> = ({
  cover,
  tags,
  preset
}) => {
  return (
    <LazyMotionWrapper>
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/10">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              {cover ? (
                <img
                  src={cover}
                  alt="Pochette musicale"
                  className="w-20 h-20 rounded-lg object-cover shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Music className="w-8 h-8 text-primary" />
                </div>
              )}
            </div>
            
            <div className="flex-1 space-y-2">
              <h2 className="text-2xl font-bold capitalize text-foreground">
                {preset}
              </h2>
              <p className="text-muted-foreground">
                Session musicale adaptative
              </p>
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </m.div>
    </LazyMotionWrapper>
  );
};