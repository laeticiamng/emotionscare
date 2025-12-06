// @ts-nocheck
import React from 'react';
import LoadingAnimation from '@/components/ui/loading-animation';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type LoadingStateVariant = 'page' | 'section' | 'inline';

interface LoadingStateProps {
  text?: string;
  variant?: LoadingStateVariant;
  skeletonCount?: number;
  showSkeleton?: boolean;
  className?: string;
}

const variantConfig: Record<LoadingStateVariant, { container: string; skeletonHeight: string; animationSize: 'sm' | 'md' | 'lg' }> = {
  page: {
    container: 'min-h-[320px] w-full flex flex-col items-center justify-center gap-6',
    skeletonHeight: 'h-6',
    animationSize: 'lg',
  },
  section: {
    container: 'w-full flex flex-col items-center justify-center gap-4 py-8',
    skeletonHeight: 'h-4',
    animationSize: 'md',
  },
  inline: {
    container: 'flex items-center gap-3 text-sm',
    skeletonHeight: 'h-3',
    animationSize: 'sm',
  },
};

const LoadingState: React.FC<LoadingStateProps> = ({
  text = 'Chargement en cours...',
  variant = 'section',
  skeletonCount = 3,
  showSkeleton = variant !== 'inline',
  className,
}) => {
  const config = variantConfig[variant];

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(config.container, className)}
    >
      <LoadingAnimation text={text} size={config.animationSize} variant={variant === 'inline' ? 'minimal' : 'default'} />
      {showSkeleton && (
        <div
          className={cn(
            'w-full space-y-3',
            variant === 'page' ? 'max-w-3xl' : undefined,
          )}
        >
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <Skeleton key={index} className={cn(config.skeletonHeight, 'w-full rounded-md')} />
          ))}
        </div>
      )}
    </div>
  );
};

export { LoadingState };
