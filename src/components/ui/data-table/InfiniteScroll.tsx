
import React, { useEffect, useRef } from 'react';

interface InfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  threshold?: number;
  children: React.ReactNode;
  loadingElement?: React.ReactNode;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  onLoadMore,
  hasMore,
  loading,
  threshold = 0.8,
  children,
  loadingElement,
}) => {
  const observerRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    const currentObserver = observerRef.current;
    
    if (!currentObserver || !hasMore || loading) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        // When the sentinel comes into view, load more content if we can
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      {
        // Start loading when the element is partially visible
        threshold,
        // Use viewport as the root
        root: null,
        rootMargin: '100px',
      }
    );
    
    observer.observe(currentObserver);
    
    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [hasMore, loading, onLoadMore, threshold]);
  
  return (
    <div className="relative">
      {children}
      
      {/* This is the sentinel element that gets observed */}
      <div ref={observerRef} className="h-10" />
      
      {/* Loading indicator shown at the bottom when loading */}
      {loading && hasMore && (
        <div className="py-4 flex justify-center">
          {loadingElement || (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-t-primary border-r-primary border-b-primary/30 border-l-primary/30 rounded-full animate-spin"></div>
              <span>Chargement...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InfiniteScroll;
