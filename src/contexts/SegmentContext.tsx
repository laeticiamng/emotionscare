
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SegmentOption {
  key: string;
  label: string;
}

interface SegmentDimension {
  key: string;
  label: string;
  options: SegmentOption[];
}

interface SegmentContextType {
  segment: string | null;
  setSegment: (segment: string | null) => void;
  activeDimension: SegmentDimension | null;
  setActiveDimension: (dimension: SegmentDimension | null) => void;
  activeOption: SegmentOption | null;
  setActiveOption: (option: SegmentOption | null) => void;
}

const SegmentContext = createContext<SegmentContextType>({
  segment: null,
  setSegment: () => {},
  activeDimension: null,
  setActiveDimension: () => {},
  activeOption: null,
  setActiveOption: () => {}
});

interface SegmentProviderProps {
  children: ReactNode;
}

export const SegmentProvider: React.FC<SegmentProviderProps> = ({ children }) => {
  const [segment, setSegment] = useState<string | null>(null);
  const [activeDimension, setActiveDimension] = useState<SegmentDimension | null>(null);
  const [activeOption, setActiveOption] = useState<SegmentOption | null>(null);

  return (
    <SegmentContext.Provider
      value={{
        segment,
        setSegment,
        activeDimension,
        setActiveDimension,
        activeOption,
        setActiveOption
      }}
    >
      {children}
    </SegmentContext.Provider>
  );
};

export const useSegment = () => useContext(SegmentContext);
