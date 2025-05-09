
import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

interface JournalPageHeaderProps {
  title: string;
  icon?: React.ReactNode;
  backLink?: string;
  children?: ReactNode;
}

const JournalPageHeader: React.FC<JournalPageHeaderProps> = ({ 
  title, 
  icon = <BookOpen className="mr-2 h-5 w-5" />,
  backLink = '/journal',
  children
}) => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <div className="flex items-center mb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(backLink)}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Retour
        </Button>
        
        <h1 className="text-2xl font-semibold inline-flex items-center">
          {icon} 
          {title}
        </h1>
      </div>
      
      {children && (
        <div className="mt-4 flex items-center">
          {children}
        </div>
      )}
    </motion.div>
  );
};

export default JournalPageHeader;
