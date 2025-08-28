import React from 'react';
import { GlowGauge } from '@/components/dashboard/GlowGauge';
import { WeeklyBars } from '@/components/dashboard/WeeklyBars';
import { motion } from 'framer-motion';

const GlowDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Dashboard Glow
          </h1>
          <p className="text-muted-foreground">Jauge du bien-être et progression hebdo</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GlowGauge />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <WeeklyBars />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GlowDashboardPage;