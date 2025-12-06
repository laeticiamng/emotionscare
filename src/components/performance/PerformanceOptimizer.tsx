// @ts-nocheck
import React, { useEffect, useCallback, useRef } from 'react';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
  enableLazyImages?: boolean;
  enablePreloading?: boolean;
}

export const useVirtualizedList = <T extends any>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = React.useState(0);
  
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length - 1
  );
  
  const visibleItems = items.slice(startIndex, endIndex + 1);
  
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);
  
  return {
    visibleItems,
    startIndex,
    endIndex,
    handleScroll,
    totalHeight: items.length * itemHeight,
    offsetY: startIndex * itemHeight
  };
};

export const useLazyImage = (src: string, placeholder?: string) => {
  const [imageSrc, setImageSrc] = React.useState(placeholder || '');
  const [isLoaded, setIsLoaded] = React.useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    if (!src) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = new Image();
            img.onload = () => {
              setImageSrc(src);
              setIsLoaded(true);
              observer.disconnect();
            };
            img.src = src;
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const currentImg = imgRef.current;
    if (currentImg) {
      observer.observe(currentImg);
    }
    
    return () => {
      if (currentImg) {
        observer.unobserve(currentImg);
      }
    };
  }, [src]);
  
  return { imageSrc, isLoaded, imgRef };
};

export const OptimizedImage: React.FC<{
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  priority?: boolean;
}> = ({ src, alt, placeholder, className, priority = false }) => {
  const { imageSrc, isLoaded, imgRef } = useLazyImage(src, placeholder);
  
  useEffect(() => {
    if (priority && src) {
      const img = new Image();
      img.src = src;
    }
  }, [src, priority]);
  
  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-70'} ${className}`}
      loading={priority ? 'eager' : 'lazy'}
    />
  );
};

export const VirtualizedList: React.FC<{
  items: any[];
  itemHeight: number;
  height: number;
  renderItem: (item: any, index: number) => React.ReactNode;
  className?: string;
}> = ({ items, itemHeight, height, renderItem, className }) => {
  const { visibleItems, startIndex, totalHeight, offsetY, handleScroll } = useVirtualizedList(items, itemHeight, height);
  
  return (
    <div className={`relative overflow-auto ${className}`} style={{ height }} onScroll={handleScroll}>
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)`, position: 'absolute', top: 0, left: 0, right: 0 }}>
          {visibleItems.map((item, index) => renderItem(item, startIndex + index))}
        </div>
      </div>
    </div>
  );
};

export const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({
  children,
  enableLazyImages = true,
  enablePreloading = true
}) => {
  useEffect(() => {
    if (enableLazyImages) {
      const images = document.querySelectorAll('img:not([loading])');
      images.forEach((img) => {
        img.setAttribute('loading', 'lazy');
      });
    }
  }, [enableLazyImages, children]);
  
  return <>{children}</>;
};

export default PerformanceOptimizer;