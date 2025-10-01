// @ts-nocheck

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Star, Award } from 'lucide-react';
import { useExtensions } from '@/contexts/ExtensionsContext';

const TopExtensions: React.FC = () => {
  const { available } = useExtensions();
  
  // Simulate a top 5 list based on a rating or usage count
  // In a real app, this would come from the API
  const topExtensions = [...available]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 5);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Award className="h-5 w-5 text-yellow-500" />
        <h3 className="text-lg font-semibold">Extensions les plus populaires</h3>
      </div>
      
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {topExtensions.map((extension, index) => (
          <motion.div
            key={extension.id}
            variants={{
              hidden: { opacity: 0, x: -20 },
              show: { opacity: 1, x: 0 }
            }}
          >
            <Card className="mb-2 hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center 
                      ${index === 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        index === 1 ? 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400' :
                        index === 2 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-muted text-muted-foreground'
                      }
                    `}>
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium">{extension.name}</h4>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm ml-1">{extension.rating || 5}</span>
                        {extension.usageCount && (
                          <span className="text-xs text-muted-foreground ml-2">
                            {extension.usageCount.toLocaleString()} utilisateurs
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    {extension.isNew && (
                      <Badge variant="default" className="animate-pulse text-xs">Nouveau</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default TopExtensions;
