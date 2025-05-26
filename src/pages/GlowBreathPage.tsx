
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useGlowBreathStore } from '@/store/useGlowBreathStore';
import { GlowLineChart } from '@/components/glow/GlowLineChart';
import { GlowKpiCard } from '@/components/glow/GlowKpiCard';
import { GlowEmptyState } from '@/components/glow/GlowEmptyState';
import { LoadingIllustration } from '@/components/ui/loading-illustration';
import { useNavigate } from 'react-router-dom';

const GlowBreathPage: React.FC = () => {
  const { weeks, loading, error, fetchWeeks } = useGlowBreathStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWeeks();
  }, [fetchWeeks]);

  const handleNewGlowSession = () => {
    // Check GPS availability
    if ('geolocation' in navigator) {
      navigate('/flow-field-walk');
    } else {
      navigate('/glow-pulse-mug');
    }
  };

  const currentWeek = weeks[0];
  const previousWeek = weeks[1];

  const calculateTrend = (current: number, previous: number | undefined) => {
    if (!previous) return undefined;
    return Math.round(current - previous);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingIllustration />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Erreur: {error}</p>
          <Button onClick={fetchWeeks}>Réessayer</Button>
        </div>
      </div>
    );
  }

  if (weeks.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100/20 to-pink-100/20 animate-pulse"></div>
        <div className="relative z-10">
          <GlowEmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-100/20 to-pink-100/20"
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Mon souffle & mon flow
          </h1>
          <p className="text-gray-600">Stats hebdo</p>
        </motion.div>

        {/* Chart */}
        <div className="mb-8">
          <GlowLineChart data={weeks} />
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <GlowKpiCard
            title="Décompression"
            value={currentWeek.glowScore}
            icon="sparkle"
            trend={calculateTrend(currentWeek.glowScore, previousWeek?.glowScore)}
            index={0}
          />
          <GlowKpiCard
            title="Breathe Sync"
            value={currentWeek.coherence}
            unit="%"
            icon="wind"
            trend={calculateTrend(currentWeek.coherence, previousWeek?.coherence)}
            index={1}
          />
          <GlowKpiCard
            title="Move"
            value={currentWeek.moveMinutes}
            unit="min"
            icon="walk"
            trend={calculateTrend(currentWeek.moveMinutes, previousWeek?.moveMinutes)}
            index={2}
          />
          <GlowKpiCard
            title="Zen Drop"
            value={currentWeek.calmIndex}
            icon="cup"
            trend={calculateTrend(currentWeek.calmIndex, previousWeek?.calmIndex)}
            index={3}
          />
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center"
        >
          <Button 
            onClick={handleNewGlowSession}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Nouvelle Pause Glow
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default GlowBreathPage;
