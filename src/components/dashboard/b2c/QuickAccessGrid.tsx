import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export interface QuickModule {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

interface QuickAccessGridProps {
  modules: QuickModule[];
}

const QuickAccessGrid: React.FC<QuickAccessGridProps> = ({ modules }) => {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {modules.map((module, i) => (
        <motion.div
          key={module.title}
          className="cursor-pointer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate(module.href)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * i }}
        >
          <div className="flex flex-col items-center p-4 rounded-xl bg-white/80 dark:bg-gray-800/50 border hover:shadow-lg transition-all">
            <div className={`p-3 rounded-full ${module.color} mb-3`}>
              {module.icon}
            </div>
            <h3 className="font-medium">{module.title}</h3>
            <p className="text-xs text-muted-foreground mt-1 text-center">
              {module.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickAccessGrid;
