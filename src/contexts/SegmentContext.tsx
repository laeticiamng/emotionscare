
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SegmentOption, SegmentDimension, SegmentContextType } from '@/types/segment';

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
  const [selectedDimension, setSelectedDimension] = useState<SegmentDimension | null>(null);
  const [selectedOption, setSelectedOption] = useState<SegmentOption | null>(null);
  const [dimensions] = useState<SegmentDimension[]>([
    {
      id: 'Department',
      key: 'Department',
      name: 'Département',
      label: 'Département',
      options: [
        { id: 'all', key: 'all', label: 'Tous', value: 'all' },
        { id: 'marketing', key: 'marketing', label: 'Marketing', value: 'marketing' },
        { id: 'design', key: 'design', label: 'Design', value: 'design' },
        { id: 'tech', key: 'tech', label: 'Technique', value: 'tech' },
        { id: 'support', key: 'support', label: 'Support', value: 'support' },
        { id: 'hr', key: 'hr', label: 'RH', value: 'hr' },
        { id: 'finance', key: 'finance', label: 'Finance', value: 'finance' },
      ]
    },
    {
      id: 'Role',
      key: 'Role',
      name: 'Rôle',
      label: 'Rôle',
      options: [
        { id: 'all', key: 'all', label: 'Tous', value: 'all' },
        { id: 'manager', key: 'manager', label: 'Manager', value: 'manager' },
        { id: 'employee', key: 'employee', label: 'Employé', value: 'employee' },
        { id: 'intern', key: 'intern', label: 'Stagiaire', value: 'intern' },
      ]
    },
    {
      id: 'Location',
      key: 'Location',
      name: 'Localisation',
      label: 'Localisation',
      options: [
        { id: 'all', key: 'all', label: 'Tous', value: 'all' },
        { id: 'paris', key: 'paris', label: 'Paris', value: 'paris' },
        { id: 'lyon', key: 'lyon', label: 'Lyon', value: 'lyon' },
        { id: 'marseille', key: 'marseille', label: 'Marseille', value: 'marseille' },
        { id: 'remote', key: 'remote', label: 'Télétravail', value: 'remote' },
      ]
    }
  ]);
  const [activeDimension, setActiveDimension] = useState<string>('Department');
  const [activeOption, setActiveOption] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <SegmentContext.Provider value={{ 
      dimensions,
      selectedDimension,
      selectedOption,
      setSelectedDimension,
      setSelectedOption,
      // Additional props
      segments, 
      selectedSegment, 
      setSelectedSegment,
      segment,
      setSegment,
      isLoading,
      activeDimension,
      activeOption
    }}>
      {children}
    </SegmentContext.Provider>
  );
};
