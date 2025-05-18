
import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';

const GuestMenu: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: 5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Link to="/login">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center"
            >
              <LogIn className="mr-1 h-4 w-4" />
              Connexion
            </Button>
          </Link>
        </motion.div>
      </AnimatePresence>
      
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <Link to="/register">
            <Button 
              variant="default"
              size="sm"
              className="flex items-center"
            >
              <UserPlus className="mr-1 h-4 w-4" />
              Inscription
            </Button>
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default GuestMenu;
