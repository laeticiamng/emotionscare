
import { ReactNode } from 'react';

export interface SegmentOption {
  key: string;
  label: string;
  value: string;
  icon?: ReactNode;
  count?: number;
}

export interface SegmentDimension {
  key: string;
  label: string;
  options: SegmentOption[];
  defaultOption?: string;
  icon?: ReactNode;
}

export interface SegmentContextType {
  segment: {
    dimensionKey: string;
    optionKey: string;
  };
  activeDimension: SegmentDimension | null;
  activeOption: SegmentOption | null;
  dimensions: SegmentDimension[];
  setSegment: (dimensionKey: string, optionKey: string) => void;
  resetSegment: () => void;
}
