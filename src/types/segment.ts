
export interface SegmentOption {
  value: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
  color?: string;
  dimensionKey?: string;
  optionKey?: string;
}

export interface SegmentDimension {
  key: string;
  label: string;
  options: SegmentOption[];
  defaultOption?: string;
  icon?: React.ReactNode;
}

export interface SegmentContextType {
  dimensions: SegmentDimension[];
  selectedDimension: string;
  selectedOption: string;
  setSelectedDimension: (dimension: string) => void;
  setSelectedOption: (option: string) => void;
  resetSegmentation: () => void;
  addDimension: (dimension: SegmentDimension) => void;
  removeDimension: (key: string) => void;
}
