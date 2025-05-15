
import React from 'react';
import { Input } from '@/components/ui/input';

interface TimePickerInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export const TimePickerInput: React.FC<TimePickerInputProps> = ({
  id,
  value,
  onChange,
  className,
  placeholder = "00:00"
}) => {
  const [hours, minutes] = value?.split(':').map(Number) || [0, 0];
  
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value;
    
    // Validation simple du format de l'heure (peut être améliorée)
    if (/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeValue)) {
      onChange(timeValue);
    }
  };

  return (
    <Input
      id={id}
      type="time"
      value={value}
      onChange={handleTimeChange}
      className={className}
      placeholder={placeholder}
    />
  );
};
