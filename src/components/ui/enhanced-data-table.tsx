
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Download, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import AdvancedPagination from './advanced-pagination';
import EmptyState from './empty-state';
import LoadingSpinner from './loading-spinner';

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

interface EnhancedDataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  loading?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  exportable?: boolean;
  paginated?: boolean;
  pageSize?: number;
  onRowClick?: (row: T) => void;
  onExport?: (data: T[]) => void;
}

type SortDirection = 'asc' | 'desc' | null;

function EnhancedDataTable<T extends Record<string, any>>({
  data,
  columns,
  title,
  loading = false,
  searchable = true,
  filterable = true,
  exportable = true,
  paginated = true,
  pageSize: initialPageSize = 10,
  onRowClick,
  onExport
}: EnhancedDataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Filtered and sorted data
  const processedData = useMemo(() => {
    let result = [...data];

    // Search
    if (searchTerm) {
      result = result.filter(row =>
        columns.some(col => {
          const value = row[col.key];
          return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Filter
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter(row => {
          const rowValue = row[key]?.toString().toLowerCase();
          return rowValue?.includes(value.toLowerCase());
        });
      }
    });

    // Sort
    if (sortKey && sortDirection) {
      result.sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, sortKey, sortDirection, filters, columns]);

  // Paginated data
  const paginatedData = useMemo(() => {
    if (!paginated) return processedData;
    
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return processedData.slice(start, end);
  }, [processedData, currentPage, pageSize, paginated]);

  const totalPages = Math.ceil(processedData.length / pageSize);

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDirection(prev => {
        if (prev === 'asc') return 'desc';
        if (prev === 'desc') return null;
        return 'asc';
      });
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const handleFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleExport = () => {
    if (onExport) {
      onExport(processedData);
    }
  };

  const getSortIcon = (key: keyof T) => {
    if (sortKey !== key) return <ArrowUpDown className="h-4 w-4" />;
    if (sortDirection === 'asc') return <ArrowUp className="h-4 w-4" />;
    if (sortDirection === 'desc') return <ArrowDown className="h-4 w-4" />;
    return <ArrowUpDown className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <Card>
        {title && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent className="flex justify-center py-8">
          <LoadingSpinner text="Chargement des données..." />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {title}
            <Badge variant="secondary">{processedData.length} résultats</Badge>
          </CardTitle>
        </CardHeader>
      )}
      
      <CardContent>
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {searchable && (
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          )}
          
          {filterable && (
            <div className="flex gap-2">
              {columns.filter(col => col.filterable).map(col => (
                <Select
                  key={String(col.key)}
                  value={filters[String(col.key)] || ''}
                  onValueChange={(value) => handleFilter(String(col.key), value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder={`Filtrer ${col.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous</SelectItem>
                    {Array.from(new Set(data.map(row => row[col.key]))).map(value => (
                      <SelectItem key={String(value)} value={String(value)}>
                        {String(value)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))}
            </div>
          )}
          
          {exportable && (
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          )}
        </div>

        {/* Table */}
        {paginatedData.length === 0 ? (
          <EmptyState
            title="Aucune donnée"
            description="Aucun résultat ne correspond à vos critères de recherche."
          />
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((column) => (
                      <TableHead 
                        key={String(column.key)}
                        style={{ width: column.width }}
                        className={column.sortable ? 'cursor-pointer hover:bg-muted/50' : ''}
                        onClick={() => column.sortable && handleSort(column.key)}
                      >
                        <div className="flex items-center gap-2">
                          {column.label}
                          {column.sortable && getSortIcon(column.key)}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((row, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
                      onClick={() => onRowClick?.(row)}
                    >
                      {columns.map((column) => (
                        <TableCell key={String(column.key)}>
                          {column.render 
                            ? column.render(row[column.key], row)
                            : row[column.key]
                          }
                        </TableCell>
                      ))}
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {paginated && totalPages > 1 && (
              <AdvancedPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={processedData.length}
                itemsPerPage={pageSize}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={(newPageSize) => {
                  setPageSize(newPageSize);
                  setCurrentPage(1);
                }}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default EnhancedDataTable;
