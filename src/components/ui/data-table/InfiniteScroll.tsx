import React, { useEffect, useRef, useState } from 'react';

interface InfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  threshold?: number;
  children: React.ReactNode;
  className?: string;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  onLoadMore,
  hasMore,
  loading,
  threshold = 0.8,
  children,
  className,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [sentryVisible, setSentryVisible] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const sentryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create intersection observer to detect when sentry is visible
    observer.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setSentryVisible(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold, // Load when threshold % of the element is visible
      }
    );

    // Observe the sentry element
    if (sentryRef.current) {
      observer.current.observe(sentryRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [threshold]);

  // Trigger load more when sentry becomes visible
  useEffect(() => {
    if (sentryVisible && hasMore && !loading) {
      onLoadMore();
    }
  }, [sentryVisible, hasMore, loading, onLoadMore]);

  return (
    <div ref={scrollContainerRef} className={className}>
      {children}
      
      {/* Invisible sentry element at the bottom */}
      <div 
        ref={sentryRef}
        aria-hidden="true"
        style={{ height: '10px', width: '100%' }}
        data-testid="infinite-scroll-sentry"
      />
    </div>
  );
};

export default InfiniteScroll;
