
import { ReactNode } from "react";

export interface SegmentOption {
  key: string;
  label: string;
  value?: any;
  dimensionKey?: string;
  optionKey?: string;
}

export interface SegmentDimension {
  key: string;
  label: string;
  options: SegmentOption[];
}

export interface SegmentContextType {
  segment?: string | null;
  setSegment?: (segment: string | null) => void;
  dimensions?: SegmentDimension[];
  isLoading?: boolean;
  activeDimension?: string | null;
  activeOption?: string | null;
}

export interface SegmentProviderProps {
  children: ReactNode;
}
