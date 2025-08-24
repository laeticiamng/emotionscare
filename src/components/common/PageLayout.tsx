import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import PageHeader from '@/components/common/PageHeader';
import FeatureCard from '@/components/common/FeatureCard';
import TipsSection from '@/components/common/TipsSection';

interface PageLayoutProps {
  children: React.ReactNode;
  header?: {
    title: string;
    subtitle?: string;
    description?: string;
    icon?: React.ComponentType<{ className?: string }>;
    gradient?: string;
    badge?: string;
    stats?: Array<{
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
      color?: string;
    }>;
    actions?: Array<{
      label: string;
      onClick: () => void;
      variant?: 'default' | 'outline' | 'secondary';
      icon?: React.ComponentType<{ className?: string }>;
    }>;
  };
  tips?: {
    title?: string;
    items: Array<{
      title?: string;
      content: string;
      icon?: React.ComponentType<{ className?: string }>;
    }>;
    cta?: {
      label: string;
      onClick: () => void;
    };
  };
  className?: string;
  containerClassName?: string;
  showTips?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  header,
  tips,
  className,
  containerClassName,
  showTips = true
}) => {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.6,
        staggerChildren: shouldReduceMotion ? 0 : 0.2
      }
    }
  };

  const sectionVariants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 20
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.6
      }
    }
  };

  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-background via-background to-muted/20",
      className
    )}>
      <div className={cn(
        "container mx-auto px-4 py-8 space-y-12",
        containerClassName
      )}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {/* Header */}
          {header && (
            <motion.div variants={sectionVariants}>
              <PageHeader {...header} />
            </motion.div>
          )}

          {/* Main Content */}
          <motion.div variants={sectionVariants}>
            {children}
          </motion.div>

          {/* Tips Section */}
          {showTips && tips && (
            <motion.div variants={sectionVariants}>
              <TipsSection
                title={tips.title}
                tips={tips.items}
                cta={tips.cta}
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Export des composants individuels pour utilisation flexible
export { PageHeader, FeatureCard, TipsSection };
export default PageLayout;