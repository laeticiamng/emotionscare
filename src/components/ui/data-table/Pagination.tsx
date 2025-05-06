
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  isLoading?: boolean;
  pageSizeOptions?: number[];
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
  pageSizeOptions = [10, 25, 50, 100],
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Update URL with current pagination state
  React.useEffect(() => {
    searchParams.set('page', currentPage.toString());
    searchParams.set('limit', pageSize.toString());
    setSearchParams(searchParams, { replace: true });
  }, [currentPage, pageSize, searchParams, setSearchParams]);

  // Generate page numbers to display (show current page, 2 pages before and after, and first/last)
  const getVisiblePageNumbers = () => {
    const delta = 2; // Number of pages to show before and after current page
    const range: (number | 'ellipsis')[] = [];
    
    // Always include first page
    range.push(1);
    
    // Calculate start and end of the visible range
    let start = Math.max(2, currentPage - delta);
    let end = Math.min(totalPages - 1, currentPage + delta);
    
    // Add ellipsis after first page if needed
    if (start > 2) {
      range.push('ellipsis');
    }
    
    // Add visible page numbers
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (end < totalPages - 1) {
      range.push('ellipsis');
    }
    
    // Add last page if there is more than one page
    if (totalPages > 1) {
      range.push(totalPages);
    }
    
    return range;
  };
  
  // Get the page size from localStorage or use default
  React.useEffect(() => {
    const savedPageSize = localStorage.getItem('emotionscare-page-size');
    if (savedPageSize && pageSizeOptions.includes(Number(savedPageSize))) {
      onPageSizeChange(Number(savedPageSize));
    }
  }, []);
  
  // Save page size to localStorage when it changes
  const handlePageSizeChange = (value: string) => {
    const newSize = Number(value);
    localStorage.setItem('emotionscare-page-size', value);
    onPageSizeChange(newSize);
    // Reset to first page when changing page size
    if (currentPage !== 1) {
      onPageChange(1);
    }
  };

  // Calculate displaying information
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems || pageSize * totalPages);
  
  // Page change handlers with keyboard support
  const goToPreviousPage = () => {
    if (currentPage > 1 && !isLoading) {
      onPageChange(currentPage - 1);
    }
  };
  
  const goToNextPage = () => {
    if (currentPage < totalPages && !isLoading) {
      onPageChange(currentPage + 1);
    }
  };

  // Keyboard event handlers
  const handlePrevKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      goToPreviousPage();
    }
  };
  
  const handleNextKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      goToNextPage();
    }
  };
  
  const handlePageKeyDown = (e: React.KeyboardEvent, page: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onPageChange(page);
    }
  };

  const visiblePages = getVisiblePageNumbers();
  
  return (
    <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4 py-4">
      {/* Page size selector */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <span>Afficher</span>
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
            disabled={isLoading}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {pageSizeOptions.map(size => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <span>éléments</span>
        </div>
        
        {totalItems !== undefined && (
          <div>
            <span className="font-medium">{startItem}-{endItem}</span> sur <span className="font-medium">{totalItems}</span>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={goToPreviousPage}
              onKeyDown={handlePrevKeyDown}
              tabIndex={0}
              aria-disabled={currentPage === 1 || isLoading}
              className={`${(currentPage === 1 || isLoading) ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
            />
          </PaginationItem>
          
          {/* Desktop pagination numbers */}
          <div className="hidden md:flex">
            {visiblePages.map((page, i) => (
              page === 'ellipsis' ? (
                <PaginationItem key={`ellipsis-${i}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={page === currentPage}
                    onClick={() => onPageChange(page)}
                    onKeyDown={(e) => handlePageKeyDown(e, page)}
                    tabIndex={0}
                    className={`${isLoading ? 'pointer-events-none' : 'cursor-pointer'}`}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            ))}
          </div>
          
          {/* Mobile: Current page indicator */}
          <div className="flex md:hidden items-center">
            <span className="text-sm font-medium">
              Page {currentPage} sur {totalPages}
            </span>
          </div>
          
          <PaginationItem>
            <PaginationNext
              onClick={goToNextPage}
              onKeyDown={handleNextKeyDown}
              tabIndex={0}
              aria-disabled={currentPage === totalPages || isLoading}
              className={`${(currentPage === totalPages || isLoading) ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationControls;
