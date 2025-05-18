
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SegmentContextType {
  segments: string[];
  selectedSegment: string | null;
  setSelectedSegment: (segment: string | null) => void;
  
  // Additional properties needed by components
  segment?: string;
  setSegment?: (segment: string) => void;
  dimensions?: string[];
  isLoading?: boolean;
  activeDimension?: string;
  activeOption?: string;
}

const SegmentContext = createContext<SegmentContextType | undefined>(undefined);

export const useSegment = () => {
  const context = useContext(SegmentContext);
  if (context === undefined) {
    throw new Error('useSegment must be used within a SegmentProvider');
  }
  return context;
};

interface SegmentProviderProps {
  children: ReactNode;
}

export const SegmentProvider: React.FC<SegmentProviderProps> = ({ children }) => {
  const [segments] = useState<string[]>(['Marketing', 'Design', 'Technique', 'Support', 'RH', 'Finance']);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [segment, setSegment] = useState<string>('all');
  const [dimensions] = useState<string[]>(['Department', 'Role', 'Location']);
  const [activeDimension, setActiveDimension] = useState<string>('Department');
  const [activeOption, setActiveOption] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <SegmentContext.Provider value={{ 
      segments, 
      selectedSegment, 
      setSelectedSegment,
      segment,
      setSegment,
      dimensions,
      isLoading,
      activeDimension,
      activeOption
    }}>
      {children}
    </SegmentContext.Provider>
  );
};
