
import React, { createContext, useState, useContext, useEffect } from 'react';

export interface SegmentOption {
  key: string;
  label: string;
}

export interface SegmentDimension {
  key: string;
  label: string;
  options: SegmentOption[];
}

export interface SegmentState {
  dimensionKey: string | null;
  optionKey: string | null;
}

interface SegmentContextValue {
  segment: SegmentState;
  setSegment: (segment: SegmentState) => void;
  dimensions: SegmentDimension[];
  isLoading: boolean;
  activeDimension: SegmentDimension | null;
  activeOption: SegmentOption | null;
  activeSegment: string | null; // Added this property for backward compatibility
}

const SegmentContext = createContext<SegmentContextValue | undefined>(undefined);

// Local storage key for persisting segment selection
const STORAGE_KEY = 'emotionscare.dashboard.segment';

export const SegmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Mock dimensions data that would typically come from an API
  const [dimensions, setDimensions] = useState<SegmentDimension[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initial state
  const [segment, setSegmentState] = useState<SegmentState>({
    dimensionKey: null,
    optionKey: null
  });

  // Load dimensions from API (mock for now)
  useEffect(() => {
    const fetchDimensions = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be an API call
        // const response = await fetch('/api/dashboard/segments');
        // const data = await response.json();
        
        // Mock data from requirements
        const data: SegmentDimension[] = [
          { 
            key: "role",
            label: "Rôle",
            options: [
              { key: "hr", label: "RH" },
              { key: "manager", label: "Manager" },
              { key: "employee", label: "Collaborateur" }
            ]
          },
          { 
            key: "program",
            label: "Programme",
            options: [
              { key: "coaching", label: "Coaching individuel" },
              { key: "workshop", label: "Atelier collectif" },
              { key: "microlearning", label: "Micro-learning" }
            ]
          },
          {
            key: "engagement",
            label: "Engagement",
            options: [
              { key: "high", label: "Très engagés" },
              { key: "medium", label: "Moyennement engagés" },
              { key: "low", label: "Peu engagés" }
            ]
          },
          {
            key: "wellbeingScore",
            label: "Score bien-être",
            options: [
              { key: "low", label: "Faible" },
              { key: "medium", label: "Moyen" },
              { key: "high", label: "Élevé" }
            ]
          },
          {
            key: "team",
            label: "Équipe/Site",
            options: [
              { key: "paris", label: "Paris" },
              { key: "lille", label: "Lille" },
              { key: "lyon", label: "Lyon" }
            ]
          }
        ];
        
        setDimensions(data);
        
        // Load saved segment from localStorage
        const savedSegment = localStorage.getItem(STORAGE_KEY);
        if (savedSegment) {
          try {
            const parsedSegment = JSON.parse(savedSegment);
            setSegmentState(parsedSegment);
          } catch (error) {
            console.error('Failed to parse saved segment:', error);
          }
        }
      } catch (error) {
        console.error('Failed to fetch segments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDimensions();
  }, []);

  // Persist segment selection to localStorage
  useEffect(() => {
    if (segment.dimensionKey && segment.optionKey) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(segment));
    }
  }, [segment]);

  // Set segment with persistence
  const setSegment = (newSegment: SegmentState) => {
    setSegmentState(newSegment);
  };

  // Find active dimension and option based on current selection
  const activeDimension = dimensions.find(d => d.key === segment.dimensionKey) || null;
  const activeOption = activeDimension?.options.find(o => o.key === segment.optionKey) || null;
  
  // Compute active segment string (for backward compatibility)
  const activeSegment = segment.dimensionKey && segment.optionKey 
    ? `${segment.dimensionKey}:${segment.optionKey}`
    : null;

  return (
    <SegmentContext.Provider value={{ 
      segment, 
      setSegment, 
      dimensions,
      isLoading,
      activeDimension,
      activeOption,
      activeSegment
    }}>
      {children}
    </SegmentContext.Provider>
  );
};

export const useSegment = (): SegmentContextValue => {
  const context = useContext(SegmentContext);
  if (context === undefined) {
    throw new Error('useSegment must be used within a SegmentProvider');
  }
  return context;
};
