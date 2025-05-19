
export interface SegmentOption {
  id: string;
  label: string;
  value: string;
  dimensionKey?: string;
  optionKey?: string;
}

export interface SegmentDimension {
  id: string;
  key?: string;
  label: string;
  options: SegmentOption[];
}

export interface SegmentContextType {
  dimensions: SegmentDimension[];
  selectedDimension: string;
  selectedOption: string;
  setSelectedDimension: (dimension: string) => void;
  setSelectedOption: (option: string) => void;
  resetSegmentation: () => void;
  addDimension: (dimension: SegmentDimension) => void;
  removeDimension: (dimensionId: string) => void;
}
