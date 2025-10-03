import React from 'react';
import { TableHead } from "@/components/ui/table";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

export type SortDirection = "asc" | "desc" | null;

interface SortableTableHeadProps extends React.HTMLAttributes<HTMLTableCellElement> {
  isSorted?: SortDirection;
  onSort?: () => void;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}

/**
 * A sortable table header cell component with visual indicators for sort direction
 */
const SortableTableHead: React.FC<SortableTableHeadProps> = ({
  isSorted = null,
  onSort,
  className = "",
  children,
  ariaLabel,
  ...props
}) => {
  const getSortIcon = () => {
    if (isSorted === 'asc') return <ChevronUp className="h-4 w-4 ml-1" />;
    if (isSorted === 'desc') return <ChevronDown className="h-4 w-4 ml-1" />;
    return <ChevronsUpDown className="h-4 w-4 ml-1 opacity-50" />;
  };

  const getAriaLabel = () => {
    if (!ariaLabel) return undefined;
    
    if (isSorted === 'asc') return `${ariaLabel}, tri ascendant`;
    if (isSorted === 'desc') return `${ariaLabel}, tri descendant`;
    return `Trier par ${ariaLabel}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onSort && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onSort();
    }
  };

  return (
    <TableHead
      className={`${onSort ? 'cursor-pointer select-none' : ''} ${className}`}
      onClick={onSort}
      onKeyDown={handleKeyDown}
      tabIndex={onSort ? 0 : undefined}
      role={onSort ? "button" : undefined}
      aria-label={getAriaLabel()}
      aria-sort={
        isSorted === 'asc' ? 'ascending' :
        isSorted === 'desc' ? 'descending' : 
        'none'
      }
      {...props}
    >
      <div className="flex items-center">
        {children}
        {onSort && getSortIcon()}
      </div>
    </TableHead>
  );
};

export default SortableTableHead;
