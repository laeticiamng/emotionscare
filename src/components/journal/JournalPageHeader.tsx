
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

interface JournalPageHeaderProps {
  title: string;
  icon?: React.ReactNode;
  backLink?: string;
}

const JournalPageHeader: React.FC<JournalPageHeaderProps> = ({ 
  title, 
  icon = <BookOpen className="mr-2 h-5 w-5" />,
  backLink = '/journal'
}) => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6 flex items-center"
    >
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
    </motion.div>
  );
};

export default JournalPageHeader;
