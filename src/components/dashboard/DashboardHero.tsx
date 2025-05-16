
import React from 'react';
import { User } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { compareRoles } from '@/utils/roleUtils';
import { motion } from 'framer-motion';

export interface DashboardHeroProps {
  user?: User | null;
  points?: number;
  level?: number;
}

const DashboardHero: React.FC<DashboardHeroProps> = ({
  user,
  points = 0,
  level = 1
}) => {
  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8"
    >
      <div className="flex items-center">
        <Avatar className="h-16 w-16 mr-4 border-2 border-primary">
          <AvatarImage src={user.avatar_url} alt={user.name} />
          <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            {user.name}
            <Badge className="ml-2" variant="outline">{user.role}</Badge>
          </h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>
      
      <div className="mt-4 sm:mt-0 flex items-center bg-card p-2 px-4 rounded-lg border">
        <div className="mr-6">
          <p className="text-sm text-muted-foreground">Points</p>
          <p className="text-xl font-bold">{points.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Niveau</p>
          <p className="text-xl font-bold">{level}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardHero;
