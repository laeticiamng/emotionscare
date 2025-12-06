
export interface SegmentOption {
  id: string;
  label: string;
  value: string;
  key?: string; // For backward compatibility
}

export interface SegmentDimension {
  id: string;
  name: string;
  options: SegmentOption[];
  key?: string; // For backward compatibility
  label?: string; // For backward compatibility
}

export interface SegmentContextType {
  dimensions: SegmentDimension[];
  selectedDimension: SegmentDimension | null;
  selectedOption: SegmentOption | null;
  setSelectedDimension: (dimension: SegmentDimension) => void;
  setSelectedOption: (option: SegmentOption) => void;
  
  // Additional properties needed by components
  segments?: string[];
  selectedSegment?: string | null;
  setSelectedSegment?: (segment: string | null) => void;
  segment?: string;
  setSegment?: (segment: string | null) => void;
  isLoading?: boolean;
  activeDimension?: string;
  activeOption?: string;
}
