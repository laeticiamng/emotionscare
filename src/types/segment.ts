
export interface SegmentOption {
  id: string;
  value: string;
  label: string;
  color?: string;
}

export interface SegmentDimension {
  id: string;
  name: string;
  label: string;
  options: SegmentOption[];
}

export interface SegmentContextType {
  selectedSegment: string | null;
  setSelectedSegment: (segment: string | null) => void;
  selectedDepartment: string | null;
  setSelectedDepartment: (department: string | null) => void;
  selectedTeam: string | null;
  setSelectedTeam: (team: string | null) => void;
  dimensions: SegmentDimension[];
  setDimensions: (dimensions: SegmentDimension[]) => void;
  selectedDimension: string | null;
  setSelectedDimension: (dimension: string | null) => void;
  selectedOption: string | null;
  setSelectedOption: (option: string | null) => void;
  options: SegmentOption[];
  setOptions: (options: SegmentOption[]) => void;
}
