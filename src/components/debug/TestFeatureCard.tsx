// @ts-nocheck
import React from 'react';
import FeatureCard from '@/components/common/FeatureCard';
import { Target, Zap } from 'lucide-react';
import { logger } from '@/lib/logger';

const TestFeatureCard: React.FC = () => {
  logger.debug('Testing FeatureCard with different icon types', undefined, 'UI');

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Test FeatureCard</h1>
      
      {/* Test with JSX element */}
      <FeatureCard
        title="Test JSX Icon"
        description="Icon as JSX element"
        icon={<Target className="h-8 w-8" />}
        gradient="from-blue-500 to-cyan-500"
      />
      
      {/* Test with component reference */}
      <FeatureCard
        title="Test Component Reference"
        description="Icon as component reference"
        icon={<Zap className="w-5 h-5" />}
        gradient="from-red-500 to-orange-500"
      />
      
      {/* Test with string */}
      <FeatureCard
        title="Test String Icon"
        description="Icon as string/emoji"
        icon="⭐"
        gradient="from-green-500 to-emerald-500"
      />
    </div>
  );
};

export default TestFeatureCard;