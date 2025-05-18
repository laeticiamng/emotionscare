
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
  segments: string[];
  selectedSegment: string | null;
  setSelectedSegment: (segment: string | null) => void;
  
  // Additional properties needed by components
  segment?: string;
  setSegment?: (segment: string | null) => void;
  dimensions?: SegmentDimension[];
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
  const [dimensions] = useState<SegmentDimension[]>([
    {
      key: 'Department',
      label: 'Département',
      options: [
        { key: 'all', label: 'Tous' },
        { key: 'marketing', label: 'Marketing' },
        { key: 'design', label: 'Design' },
        { key: 'tech', label: 'Technique' },
        { key: 'support', label: 'Support' },
        { key: 'hr', label: 'RH' },
        { key: 'finance', label: 'Finance' },
      ]
    },
    {
      key: 'Role',
      label: 'Rôle',
      options: [
        { key: 'all', label: 'Tous' },
        { key: 'manager', label: 'Manager' },
        { key: 'employee', label: 'Employé' },
        { key: 'intern', label: 'Stagiaire' },
      ]
    },
    {
      key: 'Location',
      label: 'Localisation',
      options: [
        { key: 'all', label: 'Tous' },
        { key: 'paris', label: 'Paris' },
        { key: 'lyon', label: 'Lyon' },
        { key: 'marseille', label: 'Marseille' },
        { key: 'remote', label: 'Télétravail' },
      ]
    }
  ]);
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
