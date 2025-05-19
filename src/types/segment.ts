
export interface SegmentOption {
  id: string;
  label: string;
  value: string;
}

export interface SegmentDimension {
  id: string;
  name: string;
  options: SegmentOption[];
}

export interface SegmentContextType {
  dimensions: SegmentDimension[];
  selectedDimension: SegmentDimension | null;
  selectedOption: SegmentOption | null;
  setSelectedDimension: (dimension: SegmentDimension) => void;
  setSelectedOption: (option: SegmentOption) => void;
}
