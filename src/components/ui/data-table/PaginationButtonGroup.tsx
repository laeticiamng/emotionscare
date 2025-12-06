import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationButtonGroupProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  showEllipsis?: boolean;
  maxVisiblePages?: number;
}

const PaginationButtonGroup: React.FC<PaginationButtonGroupProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  variant = 'outline',
  size = 'default',
  showEllipsis = true,
  maxVisiblePages = 5,
}) => {
  // Generate the array of page numbers to display
  const getPageNumbers = () => {
    if (totalPages <= maxVisiblePages) {
      // If there are less pages than the maximum to show, display all pages
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Calculate how many pages to show before and after current page
    const sidePages = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, currentPage - sidePages);
    let endPage = Math.min(totalPages, currentPage + sidePages);
    
    // Adjust if we're at the beginning or end
    if (currentPage <= sidePages) {
      // Near the start, show more pages after
      endPage = Math.min(totalPages, maxVisiblePages);
    } else if (currentPage > totalPages - sidePages) {
      // Near the end, show more pages before
      startPage = Math.max(1, totalPages - maxVisiblePages + 1);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };
  
  const pageNumbers = getPageNumbers();
  const showStartEllipsis = showEllipsis && pageNumbers[0] > 1;
  const showEndEllipsis = showEllipsis && pageNumbers[pageNumbers.length - 1] < totalPages;
  
  return (
    <div className="flex items-center gap-1">
      {/* Previous page button */}
      <Button
        variant={variant}
        size={size}
        disabled={currentPage === 1 || isLoading}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Page précédente"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {/* First page (if not included in pageNumbers) */}
      {showStartEllipsis && (
        <>
          <Button
            variant={currentPage === 1 ? 'default' : variant}
            size={size}
            onClick={() => onPageChange(1)}
            disabled={isLoading}
            aria-label="Première page"
            className={currentPage === 1 ? 'bg-primary text-primary-foreground' : ''}
          >
            1
          </Button>
          <span className="flex items-center justify-center w-8">
            <MoreHorizontal className="h-5 w-5" />
          </span>
        </>
      )}
      
      {/* Page number buttons */}
      {pageNumbers.map(page => (
        <Button
          key={page}
          variant={currentPage === page ? 'default' : variant}
          size={size}
          onClick={() => onPageChange(page)}
          disabled={isLoading}
          aria-label={`Page ${page}`}
          aria-current={currentPage === page ? 'page' : undefined}
          className={currentPage === page ? 'bg-primary text-primary-foreground' : ''}
        >
          {page}
        </Button>
      ))}
      
      {/* Last page (if not included in pageNumbers) */}
      {showEndEllipsis && (
        <>
          <span className="flex items-center justify-center w-8">
            <MoreHorizontal className="h-5 w-5" />
          </span>
          <Button
            variant={currentPage === totalPages ? 'default' : variant}
            size={size}
            onClick={() => onPageChange(totalPages)}
            disabled={isLoading}
            aria-label="Dernière page"
            className={currentPage === totalPages ? 'bg-primary text-primary-foreground' : ''}
          >
            {totalPages}
          </Button>
        </>
      )}
      
      {/* Next page button */}
      <Button
        variant={variant}
        size={size}
        disabled={currentPage === totalPages || isLoading}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Page suivante"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default PaginationButtonGroup;
