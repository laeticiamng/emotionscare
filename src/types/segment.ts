
export interface SegmentOption {
  id: string;
  label: string;
  value: string;
  count?: number;
  color?: string;
}

export interface SegmentDimension {
  id: string;
  label: string;
  type: 'category' | 'range' | 'date' | 'boolean';
  options: SegmentOption[];
}

export interface SegmentContextType {
  dimensions: SegmentDimension[];
  selectedSegment?: string;
  setSelectedSegment?: (segment: string) => void;
  selectedDimension?: string;
  selectedOption?: string;
  setSelectedDimension: (dimension: string) => void;
  setSelectedOption: (option: string) => void;
  clearSegment?: () => void;
}
