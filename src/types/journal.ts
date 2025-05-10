
// Types for journal-related components
export * from './index';

export interface JournalFilter {
  dateRange?: [Date | null, Date | null];
  emotions?: string[];
  tags?: string[];
  searchText?: string;
}
